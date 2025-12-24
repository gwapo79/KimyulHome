
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Review model...');
    try {
        const count = await prisma.review.count();
        console.log(`Successfully connected. Review count: ${count}`);

        if (count > 0) {
            const firstReview = await prisma.review.findFirst();
            console.log('First review sample:', firstReview);
        }
    } catch (error) {
        console.error('Error verifying review model:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
