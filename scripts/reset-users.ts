
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Delete all cases first to avoid foreign key constraints (if any restrictions exist, though usually Cascade)
        await prisma.case.deleteMany({});
        console.log('All cases deleted.');

        // Delete all users
        await prisma.user.deleteMany({});
        console.log('All users deleted.');

        // Check if other auth related tables exist (none seen in schema other than User)

    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
