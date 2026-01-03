
"use server";

import { prisma } from '@/lib/prisma';

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

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
        const payload = await verifyToken(token);
        return ((payload?.sub || payload?.id || payload?.userId) as string) || null;
    } catch (e) {
        return null;
    }
}

export async function getBillingHistory(userId?: string): Promise<BillingSummaryData | null> {
    const currentUserId = await getUserId();
    if (!currentUserId) return null;

    try {
        const history = await prisma.billingHistory.findMany({
            where: { userId: currentUserId },
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
