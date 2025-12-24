
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_ID = 'b6c8de28-ff60-45da-807b-c4efc7d544d5';

async function main() {
    console.log(`Inspecting Violation Case ID: ${TARGET_ID}...`);
    const c = await prisma.successCase.findUnique({ where: { id: TARGET_ID } });
    if (c) {
        console.log("Category:", c.category);
        console.log("Title:", c.title);
        console.log("Summary:", c.summary);
        console.log("Background:", c.background);
        console.log("Strategy:", c.strategy);
        console.log("Outcomes:", c.outcomes);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
