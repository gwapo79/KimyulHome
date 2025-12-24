
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- 1. USER ID CHECK ---');
    const user = await prisma.user.findUnique({
        where: { email: 'test_user@example.com' }
    });

    if (!user) {
        console.error("User not found!");
        return;
    }
    console.log(`Target User ID: ${user.id}`);

    console.log('--- 2. DB TABLE CHECK ---');
    // Simple query to verify table access
    try {
        await prisma.$queryRaw`SELECT count(*) FROM "BillingHistory"`;
        console.log("BillingHistory table exists and is accessible.");
    } catch (e) {
        console.error("Table access failed:", e);
    }

    console.log('--- 3. SQL INJECTION (Data Insert) ---');
    // Clean old data to strictly match user request
    await prisma.$executeRaw`DELETE FROM "BillingHistory" WHERE "userId" = ${user.id}`;

    // Insert 1: 110,000 KRW
    await prisma.$executeRaw`
        INSERT INTO "BillingHistory" ("id", "userId", "itemName", "amount", "status", "paymentMethod", "paidAt", "createdAt")
        VALUES 
        (${crypto.randomUUID()}, ${user.id}, '1차 법률 상담료', 110000, 'PAID', '카드', '2025-12-01T00:00:00Z', NOW());
    `;

    // Insert 2: 3,300,000 KRW
    await prisma.$executeRaw`
        INSERT INTO "BillingHistory" ("id", "userId", "itemName", "amount", "status", "paymentMethod", "paidAt", "createdAt")
        VALUES 
        (${crypto.randomUUID()}, ${user.id}, '소송 착수금', 3300000, 'UNPAID', '무통장', NULL, NOW());
    `;

    console.log("SQL Insert executed.");

    const count = await prisma.billingHistory.count({ where: { userId: user.id } });
    console.log(`Total Records for User: ${count}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
