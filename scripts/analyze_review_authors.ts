
import { prisma } from '@/lib/prisma';

async function main() {
    const reviews = await prisma.review.findMany({
        select: { id: true, author: true, createdAt: true }
    });

    console.log("--- Review Authors ---");
    reviews.forEach(r => {
        console.log(`[${r.id}] Author: '${r.author}' | Created: ${r.createdAt}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
