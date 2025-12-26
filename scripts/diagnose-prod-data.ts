
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DIAGNOSTIC START ---');

    // 1. List All Users
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: {
                    cases: true,
                    documents: true,
                    events: true, // CalendarEvents
                    billingHistory: true, // Payment/Billing
                    notifications: true,
                }
            }
        }
    });

    console.log(`Total Users Found: ${users.length}`);
    if (users.length === 0) {
        console.log("CRITICAL: No users found in the database.");
    }

    for (const u of users) {
        console.log(`\nUser: ${u.name} (${u.email})`);
        console.log(` - ID: ${u.id}`);
        console.log(` - Cases: ${u._count.cases}`);
        console.log(` - Documents: ${u._count.documents}`);
        console.log(` - Events: ${u._count.events}`);
        console.log(` - Billing: ${u._count.billingHistory}`);
        console.log(` - Notifications: ${u._count.notifications}`);

        // Check for "Test User" specifically mentioned by user
        if (u.email === 'test_user@example.com' || u.email === 'test@lawfirm.com') {
            console.log(` *** TARGET USER FOUND: ${u.email} ***`);
        }
    }

    console.log('\n--- TABLE COUNTS ---');
    const caseCount = await prisma.case.count();
    const docCount = await prisma.document.count();
    const eventCount = await prisma.calendarEvent.count();
    const billingCount = await prisma.billingHistory.count();
    const consultationCount = await prisma.consultation.count();

    console.log(`Total Cases: ${caseCount}`);
    console.log(`Total Documents: ${docCount}`);
    console.log(`Total CalendarEvents: ${eventCount}`);
    console.log(`Total BillingHistory: ${billingCount}`);
    console.log(`Total Consultations: ${consultationCount}`);

    console.log('--- DIAGNOSTIC END ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
