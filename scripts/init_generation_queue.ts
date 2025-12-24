
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const QUEUE_FILE = 'generation_queue.json';

// Helper to generate a prompt based on case details
function generateSuccessPrompt(c: any, index: number): string {
    const category = c.category || 'General';
    const title = c.title || 'Legal Case';

    // vary the setting based on index to ensure visual distinctness
    const settings = [
        'lawyer office desk with piles of paper',
        'blurry view of a korean court hallway',
        'close up of a stamp on a legal document',
        'meeting room with glass walls',
        'bookshelf filled with law books',
        'modern extensive office window view of seoul',
        'hand holding a pen signing a paper',
        'detail of a judges gavel on a desk',
        'waiting area in a law firm',
        'stack of files on a wooden table'
    ];
    const setting = settings[index % settings.length];

    return `Professional candid photo of ${title} related scene, featuring ${setting}. Context: ${category}. Korean style, realistic, 3:2 aspect ratio. No text.`;
}

// Helper to generate a prompt for reviews
function generateReviewPrompt(r: any, index: number): string {
    const gender = index % 2 === 0 ? 'female' : 'male';
    const age = 20 + (index % 5) * 10; // 20, 30, 40, 50, 60

    const locations = [
        'sitting in a cozy cafe',
        'walking in a park',
        'standing on a city street',
        'sitting in a home living room',
        'leaning against a wall',
        'sitting on a bench',
        'browsing in a bookstore',
        'hiking in the mountains',
        'waiting at a bus stop',
        'working on a laptop in a shared workspace'
    ];
    const loc = locations[index % locations.length];

    return `Candid shot on iPhone of a Korean ${gender} in their ${age}s, ${loc}. Natural lighting, authentic amateur photography style. 1:1 aspect ratio. NO selfie, NO phone visible in hand.`;
}

async function main() {
    console.log("--- Initializing Generation Queue ---");

    const successCases = await prisma.successCase.findMany();
    const reviews = await prisma.review.findMany(); // Assuming limit 100 or all

    const queue: any[] = [];

    // Process Success Cases
    successCases.forEach((c, i) => {
        queue.push({
            id: c.id,
            type: 'SUCCESS_CASE',
            category: c.category,
            currentImage: c.imageUrl,
            targetPrompt: generateSuccessPrompt(c, i),
            status: 'PENDING',
            targetPath: `/assets/images/unique/success_${c.id}.png`
        });
    });

    // Process Reviews
    reviews.forEach((r, i) => {
        queue.push({
            id: r.id,
            type: 'REVIEW',
            author: r.author,
            currentImage: r.authorImageUrl,
            targetPrompt: generateReviewPrompt(r, i),
            status: 'PENDING',
            targetPath: `/assets/images/unique/review_${r.id}.png`
        });
    });

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    console.log(`Generated queue with ${queue.length} items.`);
    console.log(`Saved to ${QUEUE_FILE}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
