
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;

// Config
const MODEL = "imagen-3.0-generate-001"; // or compatible
const DELAY_MS = 30000; // 30s cool-down between requests

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(prompt: string, filename: string) {
    if (!API_KEY) throw new Error("API_KEY not found in env");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    // Construct request body for Imagen 
    // Note: The specific endpoint schema might vary. Using standard `generateContent` for multi-modal if predict fails, but `predict` is standard for Imagen on Vertex/Studio.
    // Actually, for AI Studio, the endpoint is likely: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict`

    const body = {
        instances: [
            { prompt: prompt }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "4:3"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            if (response.status === 429) {
                console.warn(`[429] Quota exhausted. Waiting...`);
                return "QUOTA_EXHAUSTED";
            }
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        const b64 = data.predictions?.[0]?.bytesBase64Encoded;

        if (!b64) throw new Error("No image data in response");

        const buffer = Buffer.from(b64, 'base64');
        const filePath = path.join(process.cwd(), 'public/images/success-cases', filename);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved: ${filename}`);
        return filePath;
    } catch (e) {
        console.error("Generation failed:", e);
        return null;
    }
}

async function main() {
    console.log("Starting Sequential Image Generation...");

    // Read cases
    const data = JSON.parse(fs.readFileSync('success_cases.json', 'utf-8'));

    let processed = 0;

    for (const item of data) {
        console.log(`Processing Case ${item.id}: ${item.title}`);

        // Define Prompt based on category/title (simplified logic for robustness)
        const prompt = `Hyper-realistic photo for a Korean law firm success case. 
        Context: ${item.title}. Category: ${item.category}. 
        Style: Professional, trustworthy, modern office or legal abstract, 8k resolution, cinematic lighting. 
        No text.`;

        const filename = `sc_${item.id}.png`;
        const publicPath = `/images/success-cases/${filename}`;

        // Attempt Gen
        const result = await generateImage(prompt, filename);

        if (result === "QUOTA_EXHAUSTED") {
            console.log("Stopping sequence due to Quota Limit. Resume later.");
            break;
        }

        if (result) {
            // Update DB
            await prisma.successCase.update({
                where: { id: item.id },
                data: { imageUrl: publicPath }
            });
            console.log(`Database updated for ${item.id}`);
            processed++;
        }

        // Cool-down
        console.log(`Waiting ${DELAY_MS}ms...`);
        await sleep(DELAY_MS);
    }

    console.log(`Finished sequence. Processed: ${processed} cases.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
