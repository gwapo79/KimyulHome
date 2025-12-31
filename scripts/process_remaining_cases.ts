
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

console.log('Current directory:', __dirname);
console.log('Env path resolved to:', envPath);
console.log('GOOGLE_API_KEY loaded:', process.env.GOOGLE_API_KEY ? 'YES' : 'NO');

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Configuration
const IMAGE_DIR = path.resolve(__dirname, '../public/images/success_cases');
const RATE_LIMIT_DELAY_MS = 35000; // 35 seconds to be safe

// Helper to wait
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateObjectPrompt(title: string, summary: string): Promise<string> {
    // Try primary model, fallback to others
    let modelInput = 'gemini-1.5-flash-001';
    let model = genAI.getGenerativeModel({ model: modelInput });

    // NEW PROTOCOL: SEMANTIC OBJECT MAPPING
    const basePrompt = `
    You are a creative director for a high-end law firm.
    Task: Analyze the following legal case title and summary, and generate a SINGLE, LITERAL, PHYSICAL OBJECT that represents the core situation emotionally.
    
    CRITICAL RULES (Strictly Follow):
    1. **NO DOCUMENTS**: Absolutely NO papers, contracts, forms, charts, awards, or certificates.
    2. **NO TEXT**: The image must contain NO text, letters, or numbers.
    3. **NO CLICHES**: NO gavels, NO scales of justice, NO handshakes.
    4. **NO MINIATURES**: NO 3D renders, NO isometric views, NO plastic toys. Must be "Eye-level Real Photo".
    5. **NO PEOPLE**: No human faces. Hands or silhouettes are okay if subtle, but prefer objects.
    
    LOGIC (Semantic Object Mapping):
    - "Dog bite" -> Focus on the object: A torn piece of denim or a broken leash on the ground.
    - "Noise dispute" -> Earplugs on a bedside table or a ceiling view from a bed.
    - "Divorce" -> A teddy bear left on a sofa or a single ring on a table.
    - "Drunk driving" -> A set of car keys on a bar counter (not the car itself necessarily).
    - "Medical malpractice" -> A surgical instrument tray or an empty hospital bed (detail).
    
    OUTPUT FORMAT:
    Return ONLY the prompt string.
    End the prompt with: ", Cinematic lighting, Shot on 35mm lens, f/1.8, Depth of field, Photorealistic, Hyper-detailed texture, Emotional atmosphere"

    Case Title: ${title}
    Case Summary: ${summary}
  `;

    try {
        const result = await model.generateContent(basePrompt);
        const response = await result.response;
        return response.text().trim();
    } catch (e: any) {
        console.warn(`Primary model ${modelInput} failed (${e.message}), trying fallback to gemini-pro...`);
        try {
            const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await fallbackModel.generateContent(basePrompt);
            const response = await result.response;
            return response.text().trim();
        } catch (e2: any) {
            console.warn(`All text models failed. Using Title fallback.`);
            // Fallback: Use the title directly but try to guide it to be an object
            return `${title}, literal physical object, still life photography, cinematic lighting, photorealistic, no text`;
        }
    }
}

async function generateImage(prompt: string, filename: string): Promise<string | null> {
    console.log(`Generating image for prompt: "${prompt}"...`);

    try {
        // Using Imagen 4.0 Fast as verified
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${process.env.GOOGLE_API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [
                    {
                        prompt: prompt + ", no text, no watermark, no signature, no alphabet, no paper, no documents",
                    },
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "4:3"
                },
            }),
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("RESOURCE_EXHAUSTED");
            }
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        if (!data.predictions || !data.predictions[0] || !data.predictions[0].bytesBase64Encoded) {
            throw new Error("Invalid response format: No image data found");
        }

        const base64Image = data.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Image, 'base64');
        const fullPath = path.join(IMAGE_DIR, filename);

        fs.writeFileSync(fullPath, buffer);
        console.log(`Saved image to ${fullPath}`);
        return `/images/success_cases/${filename}`;

    } catch (error: any) {
        console.error("Image gen error:", error.message);
        if (error.message.includes("RESOURCE_EXHAUSTED")) {
            return "RATE_LIMIT";
        }
        return null;
    }
}

async function main() {
    // 1. Fetch all cases
    const allCases = await prisma.successCase.findMany({
        orderBy: { createdAt: 'desc' },
    });

    // 2. Identify remaining cases (Skip the first 12 we already did)
    // Page 2 starts from index 12.
    const remainingCases = allCases.slice(12);

    console.log(`Found ${allCases.length} total cases.`);
    console.log(`Skipping first 12 (Page 1). Processing ${remainingCases.length} remaining cases (Page 2+).`);

    let successCount = 0;

    for (const successCase of remainingCases) {
        const { id, title, summary } = successCase;

        // FORCE REGENERATE: Do NOT skip if file exists. 
        // We are restarting the process for Page 2+.
        const filename = `case_${id}.png`;

        console.log(`\nProcessing Case [${id}]: ${title}`);

        // 1. Generate Prompt
        let prompt = "";
        try {
            prompt = await generateObjectPrompt(title, summary || "");
            console.log(`> Generated Prompt: ${prompt}`);
        } catch (e: any) {
            console.error(`> standard Text Gen Error: ${e.message}`);
            await wait(5000); // Wait a bit on error
            continue;
        }

        // 2. Generate Image
        const imageUrl = await generateImage(prompt, filename);

        if (imageUrl === "RATE_LIMIT") {
            console.log("!!! RATE LIMIT HIT !!! Waiting 10 minutes before retrying this case...");
            await wait(600 * 1000); // Wait 10 mins

            const retryUrl = await generateImage(prompt, filename);
            if (retryUrl === "RATE_LIMIT" || !retryUrl) {
                console.error("Failed after retry. Stopping script to preserve quota/state.");
                break;
            }
        } else if (!imageUrl) {
            console.error("Failed to generate image (non-rate-limit). Skipping.");
            continue;
        }

        // 3. Update DB
        if (imageUrl && imageUrl !== "RATE_LIMIT") {
            await prisma.successCase.update({
                where: { id },
                data: {
                    imageUrl: imageUrl,
                    thumbnailUrl: imageUrl,
                },
            });
            console.log(`> DB Updated.`);
            successCount++;

            // 4. Rate Wait
            console.log(`Waiting ${RATE_LIMIT_DELAY_MS / 1000}s ...`);
            await wait(RATE_LIMIT_DELAY_MS);
        }
    }

    console.log(`\nBatch completed. Successfully processed ${successCount} new cases.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
