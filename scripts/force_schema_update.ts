
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Attempting to add new values to Role enum via SQL...');

    try {
        // Add 'CEO'
        await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'CEO'`);
        console.log("Added CEO.");

        // Add 'DEV'
        await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'DEV'`);
        console.log("Added DEV.");

        console.log("Enum update successful.");
    } catch (e) {
        console.error("Enum update failed:", e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
