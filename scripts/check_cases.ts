
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cases = await prisma.successCase.findMany({
        select: {
            id: true,
            category: true,
            title: true
        },
        orderBy: {
            category: 'asc'
        }
    });

    console.log("Found " + cases.length + " cases:");
    cases.forEach(c => {
        console.log(`[${c.category}] (ID: ${c.id}) - ${c.title}`);
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
