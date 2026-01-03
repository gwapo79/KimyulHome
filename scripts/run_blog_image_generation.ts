
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();
const QUEUE_FILE = path.join(process.cwd(), 'blog_image_queue.json');
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("ERROR: GOOGLE_API_KEY is not set.");
    process.exit(1);
}

// Initialize Gemini for Prompt Engineering
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper: Download Image
async function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

// Helper: Generate Prompt using Gemini
async function generatePromptWithGemini(title: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const systemInstruction = `
You are an expert Visual Prompt Engineer for blog thumbnails.
Your task is to convert a Blog Title into a highly detailed, intuitive visual description for an image generation model (like Imagen 3).

Constraints:
1. **Intuitive Visualization**: Do not just show a gavel or law book. Visualize the situational context of the title.
   - Example: "Stalking Prevention" -> A dark room, a silhouette looking at a glowing smartphone screen with too many notification bubbles, tense atmosphere.
2. **Modern & Korean**: Use modern interiors, latest smartphones, and Korean visuals (people, streets). No retro/old-fashioned items.
3. **NO TEXT**: The image must NOT contain any text, letters, or words.
4. **Photorealistic**: The style should be high-quality photography, cinematic lighting.

Input Title: "${title}"

Output ONLY the English prompt string. No explanations.
        `;

        const result = await model.generateContent(systemInstruction);
        const response = await result.response;
        let prompt = response.text().trim();
        // Fallback cleanup
        prompt = prompt.replace(/^Prompt:\s*/i, '').replace(/[\"\n]/g, ' ');
        return prompt + ", photorealistic, cinematic lighting, 8k resolution, best quality, no text, no alphabet, no watermark, korean style";
    } catch (error) {
        console.error("Gemini Prompt Generation Failed:", error);
        throw error;
    }
}

// Helper: Generate Image using Imagen 3 REST API
async function generateImageImagen(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Construct valid JSON body for :predict
        const postData = JSON.stringify({
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                aspectRatio: "1:1",
                sampleCount: 1,
                personGeneration: "allow_adult",
                safetySetting: "block_low_and_above"
            }
        });

        // Imagen 3 endpoint
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`Imagen API Error: ${res.statusCode} - ${body}`));
                }
                try {
                    const response = JSON.parse(body);
                    if (response.predictions && response.predictions.length > 0) {
                        // Prediction is usually base64 encoded string or object with bytesBase64Encoded
                        const prediction = response.predictions[0];
                        const base64Data = prediction.bytesBase64Encoded || prediction;
                        resolve(base64Data);
                    } else {
                        reject(new Error("No predictions in response: " + body));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log("--- Starting Google AI Studio Blog Image Generation ---");
    console.log("--- Engine: Gemini 1.5 Flash (Prompt) + Imagen 3 (Image) ---");

    const START_INDEX = 38; // As requested
    console.log(`Target Start Index: ${START_INDEX}`);

    if (!fs.existsSync(QUEUE_FILE)) {
        console.error("Queue file not found.");
        return;
    }

    const queueData = fs.readFileSync(QUEUE_FILE, 'utf-8');
    const queue = JSON.parse(queueData);

    // Total items is just queue length. We process by index.
    const totalItems = queue.length;

    for (let i = 0; i < totalItems; i++) {
        // 1. Skip logic
        if (i < START_INDEX) {
            // console.log(`Skipping Index ${i}...`); 
            continue;
        }

        const item = queue[i];

        // 2. Check overlap
        if (item.status === 'COMPLETED') {
            console.log(`[Index ${i}] Already COMPLETED. Skipping.`);
            continue;
        }

        console.log(`\n==================================================`);
        console.log(`Processing [Index ${i}] ID: ${item.id}`);
        console.log(`Title: ${item.title}`);
        console.log(`==================================================`);

        try {
            // Step 1: Generate Prompt
            process.stdout.write("1. Generating Prompt with Gemini... ");
            const visualPrompt = await generatePromptWithGemini(item.title);
            console.log("Done.");
            console.log(`   -> Prompt: "${visualPrompt.substring(0, 100)}..."`);

            // Step 2: Generate Image
            process.stdout.write("2. Generating Image with Imagen 3... ");
            const imageBase64 = await generateImageImagen(visualPrompt);
            console.log("Done.");

            // Step 3: Save Image
            process.stdout.write("3. Saving Image... ");
            // Generate a filename: blog_<short_uuid>.png
            const shortId = item.id.split('-')[0];
            const fileName = `blog_${shortId}.png`;
            const relativePath = `/assets/images/unique/${fileName}`;
            const absolutePath = path.join(process.cwd(), 'public', relativePath);

            const dir = path.dirname(absolutePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(absolutePath, Buffer.from(imageBase64, 'base64'));
            console.log(`Saved to ${relativePath}`);

            // Step 4: Update Database
            process.stdout.write("4. Updating Database... ");
            await prisma.blogPost.update({
                where: { id: item.id },
                data: { thumbnailUrl: relativePath }
            });
            console.log("Done.");

            // Step 5: Update Queue File
            queue[i].status = 'COMPLETED';
            queue[i].imagePath = relativePath;
            queue[i].generatedAt = new Date().toISOString();
            // We write entire queue back to keep sync
            fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
            console.log("5. Queue File Updated.");

            // Step 6: Sleep
            console.log("6. Sleeping 40s (Safety Delay)...");
            await new Promise(r => setTimeout(r, 40000));

        } catch (error: any) {
            console.error(`\n!!! Error processing Index ${i}:`, error.message);
            console.log("Waiting 40s before skipping to next...");
            await new Promise(r => setTimeout(r, 40000));
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
