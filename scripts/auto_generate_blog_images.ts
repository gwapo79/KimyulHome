
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { promisify } from 'util';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();
const QUEUE_FILE = path.join(process.cwd(), 'blog_image_queue.json');
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: OPENAI_API_KEY is not set in .env file.");
    process.exit(1);
}

// 4 Minutes in ms (User requested 4 minutes)
const DELAY_MS = 4 * 60 * 1000;
const WAIT_ON_ERROR_MS = 60 * 1000; // 1 min wait on error

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

function generateImageOpenAI(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url"
        });

        const options = {
            hostname: 'api.openai.com',
            path: '/v1/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`OpenAI API Error: ${res.statusCode} - ${body}`));
                } else {
                    try {
                        const response = JSON.parse(body);
                        resolve(response.data[0].url);
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

function getPromptForTitle(title: string): string {
    // User Instructions: 
    // - Trendy, Modern, Anti-Old. 
    // - High correlation with title keywords.
    // - No Human First (Still life/Scenery).
    // - Natural tone, clean layout, not too high contrast.

    return `Create a photo-realistic, highly detailed, modern and trendy image representing the concept of: "${title}". 
    
    Guidelines:
    1. STYLE: Contemporary professional photography, natural lighting, soft shadows, clean and minimal layout. Avoid "old-fashioned" or "retro" looks. Aesthetically pleasing and balanced.
    2. SUBJECT: Prioritize inanimate objects, modern office spaces, architectural details, or symbolic documents over people. Focus on the "atmosphere" of the legal/real-estate topic.
    3. HUMANS: If human elements are absolutely necessary for the concept, use modern Korean professionals (e.g., partial view of hands, silhouette, back view) in trendy business attire. Do not show generic "stock photo faces".
    4. CONTENTS: strictly correlate with the keywords in the title (e.g., if "Real Estate", show modern interiors or buildings; if "Contract", show a sleek desk with documents).
    5. NEGATIVE: No text, no words, no scales of justice, no wooden gavels, no cartoonish 3D render art, no chaotic clutter.
    
    Aspect Ratio: Square or Landscape.`;
}

async function main() {
    console.log("--- Starting Auto Image Generation (Queue Mode) ---");

    if (!fs.existsSync(QUEUE_FILE)) {
        console.error("Queue file not found.");
        return;
    }

    const queueData = fs.readFileSync(QUEUE_FILE, 'utf-8');
    let queue = JSON.parse(queueData);

    // Target Start Title
    const targetStartTitlePart = "계약명의신탁"; // Key part of "[판례] 계약명의신탁: 명의수탁자가 부동산을 처분했을 때 횡령죄?"

    const startIndex = queue.findIndex((p: any) => p.title.includes(targetStartTitlePart));

    if (startIndex === -1) {
        console.error(`Start post containing '${targetStartTitlePart}' not found in queue.`);
        return;
    }

    console.log(`Found start post at index ${startIndex}: ${queue[startIndex].title}`);

    for (let i = startIndex; i < queue.length; i++) {
        const item = queue[i];

        // Skip if already completed (double check)
        if (item.status === 'COMPLETED') {
            console.log(`Skipping index ${i} (${item.title}) - Already COMPLETED`);
            continue;
        }

        console.log(`\n[${i + 1}/${queue.length}] Processing: ${item.title}`);

        try {
            // 1. Generate Prompt
            const prompt = getPromptForTitle(item.title);
            console.log(`Prompt: ${prompt.substring(0, 100)}...`);

            // 2. Generate Image
            const imageUrl = await generateImageOpenAI(prompt);
            console.log("Image generated.");

            // 3. Save to file
            // Use existing path logic or create new one.
            // Using /assets/images/unique/blog_[id].png to allow next.js optimization
            const targetPath = `/assets/images/unique/blog_${item.id.split('-')[0]}.png`;
            const absolutePath = path.join(process.cwd(), 'public', targetPath);
            const dir = path.dirname(absolutePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            await downloadImage(imageUrl, absolutePath);
            console.log(`Saved to ${targetPath}`);

            // 4. Update DB
            await prisma.blogPost.update({
                where: { id: item.id },
                data: { thumbnailUrl: targetPath }
            });
            console.log(`DB Updated.`);

            // 5. Update Queue File Status
            queue[i].status = 'COMPLETED';
            queue[i].imagePath = targetPath;
            queue[i].generatedAt = new Date().toISOString();
            fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
            console.log("Queue JSON updated.");

            // 6. Wait 4 minutes
            if (i < queue.length - 1) {
                console.log(`Waiting ${DELAY_MS / 1000} seconds (4 minutes) as requested...`);
                await new Promise(r => setTimeout(r, DELAY_MS));
            }

        } catch (error: any) {
            console.error(`Failed to process ${item.title}:`, error.message);
            console.log(`Waiting ${WAIT_ON_ERROR_MS / 1000} seconds before retry/next...`);
            await new Promise(r => setTimeout(r, WAIT_ON_ERROR_MS));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
