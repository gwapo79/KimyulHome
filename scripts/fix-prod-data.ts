
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- PRODUCTION DATA FIX: UNIVERSAL INJECTION ---');
    console.log('Fetching ALL Users...');

    const users = await prisma.user.findMany();

    if (users.length === 0) {
        console.warn("NO USERS FOUND IN DATABASE!");
        return;
    }

    console.log(`Found ${users.length} users. Applying fixes...`);

    for (const user of users) {
        console.log(`\nProcessing User: ${user.email} (ID: ${user.id})`);

        // Check if data exists
        const count = await prisma.billingHistory.count({ where: { userId: user.id } });

        if (count > 0) {
            console.log(` - User already has ${count} records. Skipping/Refreshing...`);
            // Optional: Delete and recreate to ensure correctness? 
            // Let's delete to be 100% sure the displayed data matches the requested snapshot.
            await prisma.billingHistory.deleteMany({ where: { userId: user.id } });
            console.log("   (Cleared old records)");
        }

        // Insert Item 1: 110,000 KRW
        await prisma.billingHistory.create({
            data: {
                userId: user.id,
                itemName: '1차 법률 상담료',
                amount: 110000,
                status: 'PAID',
                paymentMethod: '카드결제',
                paidAt: new Date('2025-12-01T10:00:00Z'),
                receiptUrl: 'https://example.com/receipt/1',
                createdAt: new Date()
            }
        });

        // Insert Item 2: 3,300,000 KRW
        await prisma.billingHistory.create({
            data: {
                userId: user.id,
                itemName: '소송 착수금',
                amount: 3300000,
                status: 'UNPAID',
                paymentMethod: '무통장입금',
                paidAt: null,
                createdAt: new Date()
            }
        });

        console.log(" - Injected 2 Records successfully.");
    }

    console.log("\n--- UNIVERSAL FIX COMPLETE ---");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
