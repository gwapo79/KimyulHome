
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    // Match the default sort of the page: createdAt desc
    const cases = await prisma.successCase.findMany({
        take: 12,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, category: true }
    });

    console.log(`Fetched ${cases.length} cases for Page 1.`);

    const ids = cases.map(c => c.id);
    fs.writeFileSync('scripts/page1_ids.json', JSON.stringify(ids, null, 2));

    cases.forEach((c, i) => {
        console.log(`[${i + 1}] ${c.category}: ${c.title} (${c.id})`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
