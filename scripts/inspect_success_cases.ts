
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Success Cases...");
    const counts = await prisma.successCase.count();
    console.log(`Total Count: ${counts}`);

    const firstFew = await prisma.successCase.findMany({
        take: 5,
        select: { id: true, title: true }
    });

    console.log("First 5 IDs:");
    firstFew.forEach(c => console.log(`${c.id}: ${c.title}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
