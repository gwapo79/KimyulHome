
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching recent 10 reviews...");
    const reviews = await prisma.review.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${reviews.length} reviews.`);
    reviews.forEach(r => {
        console.log(`ID: ${r.id}, Author: '${r.author}', Content: ${r.content.substring(0, 20)}...`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
