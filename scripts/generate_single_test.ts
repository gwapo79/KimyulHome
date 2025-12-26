
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

// Load environment variables
const resultLocal = dotenv.config({ path: '.env.local' });
const resultEnv = dotenv.config();

console.log("Locals Parsed:", resultLocal.parsed ? Object.keys(resultLocal.parsed) : "none");
console.log("Env Parsed:", resultEnv.parsed ? Object.keys(resultEnv.parsed) : "none");
console.log("process.env.OPENAI_API_KEY exists?", !!process.env.OPENAI_API_KEY);

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: OPENAI_API_KEY is not set.");
    process.exit(1);
}

const TEMPLATE_PROMPT = "Amateur photo, low contrast, natural lighting, shot on iPhone, still life. Korean style. No text.";

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

async function main() {
    console.log("--- Generating Single Test Image ---");

    const QUEUE_FILE = path.join(process.cwd(), 'generation_queue.json');
    const queueData = fs.readFileSync(QUEUE_FILE, 'utf-8');
    const queue = JSON.parse(queueData);

    // Find first pending item
    const item = queue.find((i: any) => i.status === 'PENDING');

    if (!item) {
        console.log("No pending items.");
        return;
    }

    console.log(`Selected Case: ${item.id} (${item.type})`);

    // Construct new prompt
    // Original prompt example: "Professional candid photo of [Scene] ... Context: [Ctx]. Korean style..."
    // We want to replace "Professional candid photo" with "Amateur photo" and generally shift the tone.
    // A simple replacement might be enough, but appending the style modifiers is safer.

    let basePrompt = item.targetPrompt;
    // Remove "Professional candid photo of " if present
    basePrompt = basePrompt.replace(/^Professional candid photo of /, "");

    // construct final
    const finalPrompt = `Amateur photo of ${basePrompt}. Low contrast, natural lighting, shot on iPhone, still life. Korean style. No text.`;

    console.log(`Original Prompt: ${item.targetPrompt}`);
    console.log(`Final Prompt:    ${finalPrompt}`);

    try {
        const imageUrl = await generateImageOpenAI(finalPrompt);
        console.log("Image generated.");

        const absolutePath = path.join(process.cwd(), 'public', item.targetPath);
        const dir = path.dirname(absolutePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        await downloadImage(imageUrl, absolutePath);
        console.log(`Saved to ${item.targetPath}`);

        // We do NOT update DB or Queue here, waiting for user approval.
        console.log("DONE. Please review the image.");

    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

main();
