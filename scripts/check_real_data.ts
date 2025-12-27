
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("--- Checking for REAL Blog Posts (Keywords: 층간소음, 성범죄, 월세, 파산) ---");
    const realPosts = await prisma.blogPost.findMany({
        where: {
            OR: [
                { title: { contains: '층간소음' } },
                { title: { contains: '성범죄' } },
                { title: { contains: '월세' } },
                { title: { contains: '파산' } },
                { title: { contains: '명도' } }
            ]
        },
        take: 5,
        select: { id: true, title: true, createdAt: true }
    });

    if (realPosts.length > 0) {
        console.log(`FOUND ${realPosts.length} matches (showing max 5):`);
        console.log(JSON.stringify(realPosts, null, 2));
    } else {
        console.log("NO matches found for real keywords.");
    }

    console.log("\n--- Checking for Dummy Blog Posts (Sample) ---");
    const dummyPosts = await prisma.blogPost.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { title: true }
    });
    console.log(JSON.stringify(dummyPosts, null, 2));

    console.log("\n--- Checking Success Cases & Reviews ---");
    const totalCases = await prisma.successCase.count();
    const firstCase = await prisma.successCase.findFirst({ select: { title: true } });
    console.log(`Total Success Cases: ${totalCases}`);
    console.log(`Sample Case: ${firstCase?.title || 'None'}`);

    const totalReviews = await prisma.review.count();
    const firstReview = await prisma.review.findFirst({ select: { content: true, author: true } });
    console.log(`Total Reviews: ${totalReviews}`);
    console.log(`Sample Review: ${firstReview?.author} - ${firstReview?.content.substring(0, 20)}...`);

}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
