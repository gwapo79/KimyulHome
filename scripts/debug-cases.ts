
const { PrismaClient: PrismaClientClass } = require('@prisma/client');
const debugPrisma = new PrismaClientClass();

async function main() {
    console.log('Testing Prisma Case Model...');
    try {
        const email = 'bizgguya@gmail.com';
        // @ts-ignore
        const user = await debugPrisma.user.findUnique({ where: { email } });
        console.log('User found:', user?.id);

        if (user) {
            // @ts-ignore
            const cases = await debugPrisma.case.findMany({
                where: { userId: user.id }
            });
            console.log('Cases found:', cases);
        }
    } catch (e) {
        console.error('Prisma Error:', e);
    } finally {
        await debugPrisma.$disconnect();
    }
}

main();

export { };
