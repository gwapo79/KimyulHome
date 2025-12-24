
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- STEP 1: FINDING USER ID ---');
    const user = await prisma.user.findFirst({
        where: { email: 'test_user@example.com' }
    });

    if (!user) {
        console.error("CRITICAL: test_user@example.com NOT FOUND.");
        return;
    }

    console.log(`FOUND USER: ${user.email}`);
    console.log(`UUID: ${user.id}`);

    console.log('\n--- STEP 2: CHECKING TABLE & INSERTING DATA (RAW SQL) ---');

    // Deleting old data for this user to be clean
    await prisma.$executeRaw`DELETE FROM "BillingHistory" WHERE "userId" = ${user.id}`;

    // Inserting Data 1
    const id1 = crypto.randomUUID();
    const result1 = await prisma.$executeRaw`
        INSERT INTO "BillingHistory" ("id", "userId", "itemName", "amount", "status", "paymentMethod", "paidAt", "createdAt", "receiptUrl")
        VALUES (${id1}, ${user.id}, '1차 법률 상담료', 110000, 'PAID', '카드', '2025-12-01T00:00:00Z', NOW(), 'https://example.com/receipt/1')
    `;
    console.log("Insert 1 Result:", result1);

    // Inserting Data 2
    const id2 = crypto.randomUUID();
    const result2 = await prisma.$executeRaw`
        INSERT INTO "BillingHistory" ("id", "userId", "itemName", "amount", "status", "paymentMethod", "paidAt", "createdAt", "receiptUrl")
        VALUES (${id2}, ${user.id}, '소송 착수금', 3300000, 'UNPAID', '무통장', NULL, NOW(), NULL)
    `;
    console.log("Insert 2 Result:", result2);

    console.log('\n--- STEP 3: VERIFYING DATA IN DB ---');
    const records = await prisma.billingHistory.findMany({ where: { userId: user.id } });
    console.log(`Found ${records.length} records for user.`);
    records.forEach(r => console.log(` - ${r.itemName}: ${r.status}`));
}

main()
    .catch(e => {
        console.error("ERROR:", e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
