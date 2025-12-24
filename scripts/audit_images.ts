
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting Image Uniqueness Audit ---");

    // 1. Audit Success Cases
    const cases = await prisma.successCase.findMany({
        select: { id: true, title: true, imageUrl: true }
    });

    const successImageCounts: Record<string, number> = {};
    const successDuplicates: string[] = [];

    cases.forEach(c => {
        const url = c.imageUrl || 'MISSING';
        if (successImageCounts[url]) {
            successImageCounts[url]++;
            if (successImageCounts[url] === 2) successDuplicates.push(url);
        } else {
            successImageCounts[url] = 1;
        }
    });

    console.log(`\n[Success Cases] Total: ${cases.length}`);
    console.log(`Unique Images used: ${Object.keys(successImageCounts).length}`);
    console.log(`Duplicate Images: ${successDuplicates.length} (used multiple times)`);

    // 2. Audit Reviews
    const reviews = await prisma.review.findMany({
        select: { id: true, author: true, authorImageUrl: true }
    });

    const reviewImageCounts: Record<string, number> = {};
    const reviewDuplicates: string[] = [];

    reviews.forEach(r => {
        const url = r.authorImageUrl || 'MISSING';
        if (reviewImageCounts[url]) {
            reviewImageCounts[url]++;
            if (reviewImageCounts[url] === 2) reviewDuplicates.push(url);
        } else {
            reviewImageCounts[url] = 1;
        }
    });

    console.log(`\n[Reviews] Total: ${reviews.length}`);
    console.log(`Unique Profile Images used: ${Object.keys(reviewImageCounts).length}`);
    console.log(`Duplicate Profiles: ${reviewDuplicates.length} (used multiple times)`);

    if (successDuplicates.length > 0 || reviewDuplicates.length > 0) {
        console.log("\n[FAIL] Duplicates found. Uniqueness constraint violated.");
        process.exit(1);
    } else {
        console.log("\n[PASS] All images are unique.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
