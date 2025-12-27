
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("--- Verifying User Data ---");
    const users = await prisma.user.findMany({
        take: 5,
        select: { id: true, email: true, name: true, role: true }
    });
    console.log(JSON.stringify(users, null, 2));

    console.log("\n--- Verifying Case Data ---");
    const cases = await prisma.case.findMany({
        take: 5,
        select: { id: true, title: true, caseNumber: true, status: true }
    });
    console.log(JSON.stringify(cases, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
