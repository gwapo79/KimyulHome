
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration from SUPER_ADMIN to CEO...');

    // Update SUPER_ADMIN to CEO
    // Note: Since CEO is now in the Enum (added via db push), we can use it.
    // We need to cast it or use updateMany. 
    // However, Prisma client types might not be regenerated yet locally, so we might need to ignore TS errors or generate client.

    try {
        const result = await prisma.user.updateMany({
            where: {
                role: 'SUPER_ADMIN' as any // Type cast if client not regenerated
            },
            data: {
                role: 'CEO' as any
            }
        });
        console.log(`Migrated ${result.count} users from SUPER_ADMIN to CEO.`);

    } catch (e) {
        console.error("Migration failed:", e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
