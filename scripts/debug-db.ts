
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG: USERS ---');
    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`User: ${u.email} (ID: ${u.id})`));

    console.log('\n--- DEBUG: BILLING HISTORY ---');
    const history = await prisma.billingHistory.findMany({
        include: { user: true }
    });

    if (history.length === 0) {
        console.log("NO BILLING RECORDS FOUND.");
    } else {
        history.forEach(h => {
            console.log(`Record: ${h.itemName} | Amount: ${h.amount} | Status: ${h.status} | UserId: ${h.userId} (${h.user?.email})`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
