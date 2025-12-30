
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cases = await prisma.successCase.findMany();
    console.log(JSON.stringify(cases, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
