
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // 1. Revenue (BillingHistory where status = 'PAID')
        const billingSum = await prisma.billingHistory.aggregate({
            _sum: { amount: true },
            where: { status: 'PAID' }
        });
        const revenue = billingSum._sum.amount || 0;

        // 2. Consultations (Count all for now, or filtered by this month)
        const consultationCount = await prisma.consultation.count();

        // 3. Active Cases (Case where status != 'CLOSED')
        // We assume 'CLOSED', 'COMPLETED' are final stats.
        const activeCasesCount = await prisma.case.count({
            where: {
                NOT: {
                    status: { in: ['CLOSED', 'COMPLETED', '종결'] }
                }
            }
        });

        // 4. Win Rate (SuccessCase count / Total Closed Cases * 100 ?)
        // Approximating: SuccessCase count vs Total Cases might not be accurate.
        // Let's rely on manually entered KPI or derived.
        // Simple Logic: Count 'Case' with status 'WON' or '승소'.
        const wonCases = await prisma.case.count({
            where: { status: { in: ['WON', '승소', '일부승소'] } }
        });
        const totalClosed = await prisma.case.count({
            where: { status: { in: ['CLOSED', 'COMPLETED', '종결', 'WON', '승소', '패소'] } }
        });

        let winRate = 0;
        if (totalClosed > 0) {
            winRate = Math.round((wonCases / totalClosed) * 100);
        }

        // 5. Monthly Trend (Mocking or aggregating real data if timestamps exist)
        // Aggregating Consultations by Month for the last 6 months
        // Using raw query or JavaScript grouping (DB agnostic way for simplicity here)

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const monthlyConsultations = await prisma.consultation.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: { gte: sixMonthsAgo }
            },
        });

        // Grouping in JS because Prisma groupBy date truncation is tricky without database-specific syntax usually
        const trendData: any = {};
        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            months.unshift(key);
            trendData[key] = { month: key, revenue: 0, consultations: 0 };
        }

        // Fill Consultation Counts
        // Re-fetching all for last 6 months to map easily
        const recentConsultations = await prisma.consultation.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        });

        recentConsultations.forEach(c => {
            const key = `${c.createdAt.getFullYear()}-${c.createdAt.getMonth() + 1}`;
            if (trendData[key]) trendData[key].consultations++;
        });

        // Fill Revenue
        const recentBilling = await prisma.billingHistory.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: 'PAID'
            },
            select: { createdAt: true, amount: true }
        });

        recentBilling.forEach(b => {
            const key = `${b.createdAt.getFullYear()}-${b.createdAt.getMonth() + 1}`;
            if (trendData[key]) trendData[key].revenue += b.amount;
        });

        // Format for Recharts
        const chartData = months.map(m => trendData[m]);

        return NextResponse.json({
            kpi: {
                revenue: { value: revenue, label: "총 매출", delta: 12.5, prefix: "₩" }, // Delta is mocked for now
                consultations: { value: consultationCount, label: "총 상담 건수", delta: 8.2 },
                activeCases: { value: activeCasesCount, label: "진행 중인 사건", delta: -2.4 },
                winRate: { value: winRate, label: "승소율", delta: 5.1 }
            },
            monthlyTrends: chartData
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
