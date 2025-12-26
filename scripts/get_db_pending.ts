
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    // Find items that don't have 'unique' in imageUrl
    // We assume 'unique' paths are the verified ones we generated.

    const cases = await prisma.successCase.findMany({
        where: {
            NOT: {
                imageUrl: { contains: 'unique' }
            }
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    console.log(JSON.stringify(cases, null, 2));

    fs.writeFileSync('next_db_batch.json', JSON.stringify(cases, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
