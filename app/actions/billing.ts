
"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BillingHistoryItem {
    id: string;
    itemName: string;
    amount: number;
    status: string;
    paymentMethod: string;
    paidAt: Date | null;
    receiptUrl: string | null;
    createdAt: Date;
}

export interface BillingSummaryData {
    totalPaid: number;
    totalUnpaid: number;
    history: BillingHistoryItem[];
}

export async function getBillingHistory(userId: string): Promise<BillingSummaryData | null> {
    try {
        const history = await prisma.billingHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        let totalPaid = 0;
        let totalUnpaid = 0;

        history.forEach(item => {
            if (item.status === 'PAID') {
                totalPaid += item.amount;
            } else if (item.status === 'UNPAID' || item.status === 'PENDING') {
                totalUnpaid += item.amount;
            }
        });

        return {
            totalPaid,
            totalUnpaid,
            history: history as BillingHistoryItem[],
        };
    } catch (error) {
        console.error("Failed to fetch billing history:", error);
        return null;
    }
}
