
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const retries = 5;
    const backoff = [5000, 10000, 30000, 30000, 30000]; // 5s, 10s, 30s...

    console.log('🚑 Starting Database Wake-up Sequence...');

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`⏰ Attempt ${i + 1}/${retries}: Connecting to database...`);
            await prisma.$connect();
            console.log('✅ Database Connection Successful! The DB is awake.');

            // Quick query to ensure responsiveness
            const count = await prisma.user.count();
            console.log(`📊 Current User Count: ${count}`);

            process.exit(0);
        } catch (error) {
            console.error(`❌ Connection failed: ${(error as Error).message}`);
            if (i < retries - 1) {
                const waitTime = backoff[i] || 30000;
                console.log(`⏳ Waiting ${waitTime / 1000}s before next attempt...`);
                await wait(waitTime);
            } else {
                console.error('💀 All retry attempts exhausted. Database is unreachable.');
                process.exit(1);
            }
        }
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
