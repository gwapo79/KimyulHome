
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding billing history for ALL users...');

    const users = await prisma.user.findMany();

    if (users.length === 0) {
        console.error("No users found.");
        return;
    }

    for (const user of users) {
        console.log(`Processing user: ${user.email} (${user.id})`);

        // Clear existing to prevent duplicates
        await prisma.billingHistory.deleteMany({
            where: { userId: user.id }
        });

        // 1. Paid Item
        await prisma.billingHistory.create({
            data: {
                userId: user.id,
                itemName: '1차 법률 상담료',
                amount: 110000,
                status: 'PAID',
                paymentMethod: '카드결제',
                paidAt: new Date('2025-12-01T10:00:00Z'),
                receiptUrl: 'https://example.com/receipt/1'
            }
        });

        // 2. Unpaid Item
        await prisma.billingHistory.create({
            data: {
                userId: user.id,
                itemName: '소송 착수금 (전세금 반환 소송)',
                amount: 3300000,
                status: 'UNPAID',
                paymentMethod: '무통장입금',
                paidAt: null
            }
        });

        // 3. Pending Item
        await prisma.billingHistory.create({
            data: {
                userId: user.id,
                itemName: '개인회생 신청 대행 비용',
                amount: 1500000,
                status: 'PENDING',
                paymentMethod: '청구서 발송',
                paidAt: null
            }
        });
    }

    console.log(`Successfully seeded billing records for ${users.length} users.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
