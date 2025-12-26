
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cases = await prisma.successCase.findMany({
        take: 10,
        select: { id: true, title: true, category: true }
    });

    console.log("DB Content Sample:");
    console.log(JSON.stringify(cases, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
