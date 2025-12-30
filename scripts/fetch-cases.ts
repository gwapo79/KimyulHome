
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const cases = await prisma.successCase.findMany();
    // Sort by id or createdAt to ensure deterministic order
    cases.sort((a, b) => a.id.localeCompare(b.id));
    fs.writeFileSync('success_cases.json', JSON.stringify(cases, null, 2));
    console.log(`Saved ${cases.length} cases to success_cases.json`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
