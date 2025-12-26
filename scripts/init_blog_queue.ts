
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const QUEUE_FILE = path.join(process.cwd(), 'generation_queue.json');

// Helper to generate natural prompts based on category/title
function generateNaturalPrompt(title: string, category: string): string {
    const base = "Amateur photo using iPhone, natural lighting, daily life atmosphere. ";
    const style = "Low contrast, soft colors, realistic, no text. ";

    let subject = "";
    if (category === 'real-estate' || title.includes('부동산') || title.includes('아파트')) {
        subject = "A quiet street view of a Korean apartment complex or a moving box in an empty room.";
    } else if (category === 'debt' || title.includes('채무') || title.includes('회생')) {
        subject = "A calculator and a notebook on a wooden desk, messy but cozy.";
    } else if (category === 'criminal' || title.includes('형사') || title.includes('경찰')) {
        subject = "A view of a blurred street at night or a police station sign in distance (blurry).";
    } else if (category === 'family' || title.includes('이혼') || title.includes('가사')) {
        subject = "A cup of coffee on a table by the window, solitary mood.";
    } else if (category === 'corporate' || title.includes('기업')) {
        subject = "A stack of papers and a laptop in a casual workspace.";
    } else {
        subject = "A peaceful office desk corner with a plant.";
    }

    return `${base}${subject} ${style}`;
}

async function initBlogQueue() {
    console.log("Initializing Blog Post Queue...");

    // Fetch all blog posts that don't have a 'unique' image yet (or just all for this project)
    // We assume 'unique' images are in /assets/images/unique/
    // But for this project, we want to generate for 100 posts.

    const posts = await prisma.blogPost.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${posts.length} blog posts.`);

    let queue = [];
    if (fs.existsSync(QUEUE_FILE)) {
        queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
    }

    let addedCount = 0;
    for (const post of posts) {
        // Check if already in queue
        if (queue.find((q: any) => q.id === post.id)) continue;

        const prompt = generateNaturalPrompt(post.title, post.category);
        const timestamp = Date.now(); // For Vercel cache busting

        queue.push({
            id: post.id,
            type: 'BLOG_POST',
            category: post.category,
            currentImage: post.thumbnailUrl,
            targetPrompt: prompt,
            status: 'PENDING',
            targetPath: `/assets/images/unique/blog_${post.id}_${timestamp}.png`
        });
        addedCount++;
    }

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    console.log(`Added ${addedCount} blog posts to queue.`);
}

initBlogQueue()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
