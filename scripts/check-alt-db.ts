
import { PrismaClient } from '@prisma/client';

const prismaPath = "file:c:/Users/bizgg/Downloads/Homepage/prisma/dev.db";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: prismaPath
        }
    }
});

async function main() {
    console.log(`--- Checking Alternative DB (${prismaPath}) ---`);
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users:`);
    users.forEach((u) => {
        console.log(`- Email: ${u.email}, Provider: ${u.provider}`);
    });
    console.log('-------------------------------');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
