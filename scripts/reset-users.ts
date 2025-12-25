
const { PrismaClient: PrismaClientReset } = require('@prisma/client');
const prismaReset = new PrismaClientReset();

async function main() {
    try {
        // Delete all cases first to avoid foreign key constraints (if any restrictions exist, though usually Cascade)
        await prismaReset.case.deleteMany({});
        console.log('All cases deleted.');

        // Delete all users
        await prismaReset.user.deleteMany({});
        console.log('All users deleted.');

        // Check if other auth related tables exist (none seen in schema other than User)

    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        await prismaReset.$disconnect();
    }
}

main();
