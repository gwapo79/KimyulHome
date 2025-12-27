
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();
const DUMP_FILE = path.join(process.cwd(), 'all_blog_posts_dump.txt');
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: OPENAI_API_KEY is not set in .env file.");
    process.exit(1);
}

// 3 Minutes in ms
const DELAY_MS = 3 * 60 * 1000;

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
    const baseStyle = "A high-quality, bright, modern lifestyle magazine photography only showing scenery or still life.";
    const negative = "No people, no text, no legal symbols (scales, gavels, suits), no darkness.";
    
    let specificScene = "";

    if (title.includes("층간소음")) { // Floor Noise
        specificScene = "A stylish apartment living room ceiling with modern lighting, clean interior, soft natural light. Looking up at the ceiling.";
    } else if (title.includes("월세 미납")) { // Unpaid Rent
        specificScene = "A letter envelope lying on the wooden floor in front of a modern door, clean empty, bright daylight.";
    } else if (title.includes("부동산")) {
        specificScene = "A modern, bright empty apartment interior, sunlit living room with large windows.";
    } else if (title.includes("개인회생") || title.includes("빚") || title.includes("채무")) {
        specificScene = "A clean, organized desk with a calculator and a notebook, bright morning sunlight, coffee cup nearby.";
    } else if (title.includes("이혼")) {
        specificScene = "Two empty chairs at a table, soft lighting, calm atmosphere, minimalist.";
    } else {
        specificScene = `A metaphorical representation of ${title}, abstract, minimal, bright, clean composition.`;
    }

    return `${baseStyle} ${specificScene} ${negative}, 4k resolution, highly detailed.`;
}

async function main() {
    console.log("--- Starting Auto Image Generation (Anti-Generic Mode) ---");

    if (!fs.existsSync(DUMP_FILE)) {
        console.error("Dump file not found.");
        return;
    }

    const dumpContent = fs.readFileSync(DUMP_FILE, 'utf-8');
    const lines = dumpContent.split('\n').filter(line => line.trim() !== '');
    
    // Parse dump file to get ID and Title order
    const posts = lines.map(line => {
        const match = line.match(/^\[(.*?)\] (.*?) \(Img: (.*?)\)$/);
        if (match) {
            return { id: match[1], title: match[2], path: match[3] };
        }
        return null;
    }).filter(p => p !== null) as { id: string, title: string, path: string }[];

    // Find start index
    const startIndex = posts.findIndex(p => p.title.includes("층간소음"));
    
    if (startIndex === -1) {
        console.error("Start post '층간소음' not found.");
        return;
    }

    console.log(`Found start post at index ${startIndex}: ${posts[startIndex].title}`);

    for (let i = startIndex; i < posts.length; i++) {
        const post = posts[i];
        console.log(`\n[${i + 1}/${posts.length}] Processing: ${post.title}`);
        
        try {
            // 1. Check if post exists in DB (sanity check)
            const dbPost = await prisma.blogPost.findUnique({ where: { id: post.id } });
            if (!dbPost) {
                console.warn(`Post ${post.id} not found in DB. Skipping.`);
                continue;
            }

            // 2. Generate Prompt & Image
            const prompt = getPromptForTitle(post.title);
            console.log(`Prompt: ${prompt}`);

            const imageUrl = await generateImageOpenAI(prompt);
            console.log("Image generated.");

            // 3. Save to file
            // Use the path from the dump or generate one. The dump path might have a timestamp already? 
            // The dump has "Img: /images/cases/..." or "/assets/images/unique/...".
            // Let's standardise to /assets/images/blog/[id].png for new ones to be clean, OR respect valid paths.
            // The user instruction said "26th...". 
            // Let's just overwrite correct path: public/assets/images/blog/[id]_[timestamp].png
            
            const timestamp = Date.now();
            const targetPath = `/assets/images/blog/${post.id}_${timestamp}.png`;
            const absolutePath = path.join(process.cwd(), 'public', targetPath);
            const dir = path.dirname(absolutePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            await downloadImage(imageUrl, absolutePath);
            console.log(`Saved to ${targetPath}`);

            // 4. Update DB
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { thumbnailUrl: targetPath }
            });
            console.log(`DB Updated for ${post.title}`);

            // 5. Wait 3 minutes (if not the last one)
            if (i < posts.length - 1) {
                console.log(`Waiting ${DELAY_MS / 1000} seconds...`);
                await new Promise(r => setTimeout(r, DELAY_MS));
            }

        } catch (error: any) {
            console.error(`Failed to process ${post.title}:`, error.message);
            console.log(`Waiting ${DELAY_MS / 1000} seconds before next...`);
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
