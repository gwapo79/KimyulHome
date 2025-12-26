
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const QUEUE_FILE = path.join(process.cwd(), 'blog_image_queue.json');

// IDs of images we ALREADY generated successfully
const COMPLETED_IDS = [
    '847b734e-bc28-4c87-aa9a-b3a8a78aa6e0', // Insurance
    '4833fae3-a1a4-4a4d-b374-dac03fb7395d', // Professional Rehab
    'a8b55f5b-9de2-468d-abfe-76e2babf1ede', // Unfair Dismissal
    'dde1327d-bff0-4964-b097-09c95d0ef7d6'  // Crypto Divorce
];

async function main() {
    // 1. Fetch ALL blog posts
    const allPosts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true }
    });

    console.log(`Fetched ${allPosts.length} posts.`);

    // 2. Build Queue Items
    const queue = allPosts.map(post => {
        const isCompleted = COMPLETED_IDS.includes(post.id);
        return {
            id: post.id,
            title: post.title,
            status: isCompleted ? 'COMPLETED' : 'PENDING',
            imagePath: isCompleted ? `/assets/images/unique/blog_${post.id.split('-')[0]}.png` : null,
            generatedAt: isCompleted ? new Date().toISOString() : null
        };
    });

    // 3. Save to JSON
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    console.log(`Initialized queue at: ${QUEUE_FILE}`);
    console.log(`Total: ${queue.length}, Completed: ${COMPLETED_IDS.length}, Pending: ${queue.length - COMPLETED_IDS.length}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
