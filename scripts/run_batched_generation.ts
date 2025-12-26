
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { promisify } from 'util';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const QUEUE_FILE = path.join(process.cwd(), 'generation_queue.json');
const BATCH_SIZE = 10;
const DELAY_MS = 60 * 1000; // 1 Minute

const prisma = new PrismaClient();
const sleep = promisify(setTimeout);

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

function extractTitleFromPrompt(oldPrompt: string): string {
    // Expected format: "Professional candid photo of [Title] related scene..."
    const match = oldPrompt.match(/Professional candid photo of (.*?) related scene/);
    if (match && match[1]) {
        return match[1].trim();
    }
    return oldPrompt.split(' related scene')[0]; // Fallback
}

async function main() {
    if (!API_KEY) {
        console.error("ERROR: OPENAI_API_KEY is not set.");
        process.exit(1);
    }

    console.log("--- Starting Batch Image Generation (Size: 10) ---");

    if (!fs.existsSync(QUEUE_FILE)) {
        console.error("Queue file not found.");
        return;
    }

    const queueData = fs.readFileSync(QUEUE_FILE, 'utf-8');
    let queue = JSON.parse(queueData);

    const pendingItems = queue.filter((item: any) => item.status === 'PENDING').slice(0, BATCH_SIZE);

    if (pendingItems.length === 0) {
        console.log("No pending items found.");
        return;
    }

    console.log(`Processing ${pendingItems.length} items...`);
    const processedItems: any[] = [];

    for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];

        // Construct New Prompt
        // "Amateur photo of [Title]. Low contrast, natural lighting, shot on iPhone, still life. Korean style. No text."
        // We assume Context is implicitly in the title or we can extract it too if needed.
        // The original prompt has "Context: [Cat]".
        let context = "";
        const ctxMatch = item.targetPrompt.match(/Context: (.*?)\./);
        if (ctxMatch) context = ctxMatch[1];

        const title = extractTitleFromPrompt(item.targetPrompt);

        const finalPrompt = `Amateur photo of ${title}. Context: ${context}. Low contrast, natural lighting, shot on iPhone, still life. Korean style. No text.`;

        console.log(`\n[${i + 1}/${pendingItems.length}] Generating Case: ${item.id}`);
        console.log(`Prompt: ${finalPrompt}`);

        try {
            // Generate
            const imageUrl = await generateImageOpenAI(finalPrompt);

            // Save
            const absolutePath = path.join(process.cwd(), 'public', item.targetPath);
            const dir = path.dirname(absolutePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            await downloadImage(imageUrl, absolutePath);
            console.log(`Saved to ${item.targetPath}`);

            // Mark as PROCESSED in this run
            processedItems.push(item);

            // Update Queue (Disk) to mark as 'GENERATED_UNSYNCED' or just 'COMPLETED'?
            // To be safe, let's mark as COMPLETED in JSON so we don't retry, 
            // but we only Sync to DB at the end.
            const qIdx = queue.findIndex((q: any) => q.id === item.id);
            if (qIdx !== -1) {
                queue[qIdx].status = 'COMPLETED'; // Marking as completed in file tracking
                // Optionally add a flag "dbSynced": false if we really want to be robust
            }
            fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));

            // Wait 60s if not last
            if (i < pendingItems.length - 1) {
                console.log(`Waiting ${DELAY_MS / 1000}s...`);
                await sleep(DELAY_MS);
            }

        } catch (error: any) {
            console.error(`Failed to generate ${item.id}:`, error.message);
            // Continue to next?
        }
    }

    // Batch Update DB
    if (processedItems.length > 0) {
        console.log(`\nBatch of ${processedItems.length} complete. Syncing to Database...`);
        for (const item of processedItems) {
            try {
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
                } else if (item.type === 'BLOG_POST') {
                    await prisma.blogPost.update({
                        where: { id: item.id },
                        data: { thumbnailUrl: item.targetPath }
                    });
                }
                process.stdout.write('.');
            } catch (e: any) {
                console.error(`\nDB Sync error for ${item.id}: ${e.message}`);
            }
        }
        console.log("\nDatabase sync complete.");
    }

    console.log("Batch Process Completed.");
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
