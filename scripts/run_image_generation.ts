
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { exec } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const QUEUE_FILE = path.join(process.cwd(), 'generation_queue.json');
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: OPENAI_API_KEY is not set in .env file.");
    console.error("Please add your OpenAI API key to run this script automatically.");
    process.exit(1);
}

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
            fs.unlink(filepath, () => { }); // Delete the file async. (But we don't check result)
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
    console.log("--- Starting Auto Image Generation ---");

    if (!fs.existsSync(QUEUE_FILE)) {
        console.error("Queue file not found.");
        return;
    }

    const queueData = fs.readFileSync(QUEUE_FILE, 'utf-8');
    const queue = JSON.parse(queueData);

    // Process a batch of 5 pending items
    const pendingItems = queue.filter((item: any) => item.status === 'PENDING').slice(0, 5);

    if (pendingItems.length === 0) {
        console.log("No pending items found.");
        return;
    }

    console.log(`Processing ${pendingItems.length} items...`);

    for (const item of pendingItems) {
        console.log(`Generating image for ID: ${item.id} (${item.type})`);
        console.log(`Prompt: ${item.targetPrompt.substring(0, 50)}...`);

        try {
            // 1. Generate
            const imageUrl = await generateImageOpenAI(item.targetPrompt);
            console.log("Image generated.");

            // 2. Download/Save
            const absolutePath = path.join(process.cwd(), 'public', item.targetPath);
            const dir = path.dirname(absolutePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            await downloadImage(imageUrl, absolutePath);
            console.log(`Saved to ${item.targetPath}`);

            // 3. Update DB and Queue directly here to be self-contained
            if (item.type === 'SUCCESS_CASE') {
                await prisma.successCase.update({
                    where: { id: item.id },
                    data: { imageUrl: item.targetPath }
                });
            } else if (item.type === 'REVIEW') {
                await prisma.review.update({
                    where: { id: item.id },
                    data: { authorImageUrl: item.targetPath }
                });
            }

            // Update queue in memory and file
            item.status = 'COMPLETED';
            const itemIndex = queue.findIndex((q: any) => q.id === item.id);
            if (itemIndex !== -1) {
                queue[itemIndex].status = 'COMPLETED';
                // Write immediately to save state
                fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
            }

            console.log("Database and Queue updated.");

            // Wait 2 seconds to be nice to rate limits
            await new Promise(r => setTimeout(r, 2000));

        } catch (error: any) {
            console.error(`Failed to process item ${item.id}:`, error.message);
            // Continue to next item
        }
    }

    console.log("Batch processing complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
