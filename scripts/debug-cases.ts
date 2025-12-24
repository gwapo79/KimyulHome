
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma Case Model...');
    try {
        const email = 'bizgguya@gmail.com';
        const user = await prisma.user.findUnique({ where: { email } });
        console.log('User found:', user?.id);

        if (user) {
            const cases = await prisma.case.findMany({
                where: { userId: user.id }
            });
            console.log('Cases found:', cases);
        }
    } catch (e) {
        console.error('Prisma Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
