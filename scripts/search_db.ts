
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const term = process.argv[2];
    console.log(`Searching for: ${term}`);

    const results = await prisma.successCase.findMany({
        where: {
            title: { contains: term }
        }
    });

    console.log(`Found ${results.length} items.`);
    results.forEach(r => console.log(`${r.id}: ${r.title}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
