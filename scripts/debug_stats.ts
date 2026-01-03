
import { prisma } from '@/lib/prisma';

// Simulating the aggregation logic from the route
async function check() {
    console.log("Checking BillingHistory...");
    const count = await prisma.billingHistory.count({ where: { status: 'PAID' } });
    console.log(`Total BillingHistory count: ${count}`);

    const raw = await prisma.billingHistory.findMany({ where: { status: 'PAID' }, take: 5, orderBy: { createdAt: 'desc' } });
    console.log("Recent Billing Examples:", raw);

    const userActivity = await prisma.userActivity.count();
    console.log(`Total UserActivity: ${userActivity}`);

    const sources = await prisma.userActivity.groupBy({
        by: ['details'],
        where: {
            type: 'VISIT_SOURCE',
            details: { not: null }
        },
        _count: { details: true },
        orderBy: { _count: { details: 'desc' } },
        take: 5
    });
    console.log("Sources:", sources);
}

check();
