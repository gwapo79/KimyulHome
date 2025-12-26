import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    console.log('Checking User table columns...');
    try {
        const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User' OR table_name = 'user';
    `;
        console.log('Columns found:', result);
    } catch (e) {
        console.error('Error querying information_schema:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
