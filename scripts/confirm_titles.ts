
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const ids = JSON.parse(fs.readFileSync('scripts/page1_ids.json', 'utf8'));

    console.log("--- CONFIRMED PAGE 1 LIST ---");
    for (let i = 0; i < ids.length; i++) {
        const c = await prisma.successCase.findUnique({
            where: { id: ids[i] },
            select: { title: true, category: true }
        });
        console.log(`[${i + 1}] ${c?.category}: ${c?.title} (ID: ${ids[i]})`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
