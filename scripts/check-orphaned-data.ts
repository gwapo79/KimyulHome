
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CHECKING ORPHANED / RECENT DATA ---');

    // Check for any success cases created recently
    const recentCases = await prisma.successCase.findMany({
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${recentCases.length} total Success Cases.`);
    recentCases.forEach(c => {
        console.log(`- [${c.createdAt.toISOString()}] ${c.title} (ID: ${c.id})`);
    });

    // Check generic 'Case' table just in case they were stored there
    const genericCases = await prisma.case.findMany({
        where: {
            title: { contains: '성공' } // Searching for 'Success' in title
        }
    });
    console.log(`Found ${genericCases.length} generic cases with 'Success' in title.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
