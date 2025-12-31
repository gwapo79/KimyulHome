
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const totalCount = await prisma.successCase.count();
    const completedCount = 12; // We know we did 12
    const remainingCount = totalCount - completedCount;

    console.log(`Total Cases: ${totalCount}`);
    console.log(`Completed: ${completedCount}`);
    console.log(`Remaining: ${remainingCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
