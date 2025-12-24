
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cases = await prisma.successCase.findMany({
        where: {
            OR: [
                { title: { contains: '깡통전세' } },
                { title: { contains: '공인중개사' } },
                { summary: { contains: '깡통전세' } }
            ]
        }
    });

    console.log(`Found ${cases.length} potential cases.`);
    cases.forEach(c => {
        console.log(`[${c.category}] ${c.title} (ID: ${c.id})`);
        console.log(`Summary: ${c.summary}`);
        console.log(`Result: ${c.result}`);
        console.log('---');
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
