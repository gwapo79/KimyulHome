"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
export const dynamic = "force-dynamic";
import { getBillingHistory, BillingSummaryData } from '@/app/actions/billing';
import BillingSummary from '@/app/components/billing/BillingSummary';
import BillingHistoryList from '@/app/components/billing/BillingHistoryList';
import { Loader2 } from 'lucide-react';

export default function BillingPage() {
    // Initialize with empty structure to prevent "Log in required" error loop if fetch fails initially
    const [data, setData] = useState<BillingSummaryData>({
        totalPaid: 0,
        totalUnpaid: 0,
        history: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // Server action now uses cookie, no need to pass userId from localStorage
                const historyData = await getBillingHistory();
                if (historyData) {
                    setData(historyData);
                }
            } catch (e) {
                console.error("Failed to load billing", e);
            }
            setLoading(false);
        };
        init();
    }, []);

    // LOADING STATE REMOVED: Always render component layout, even if data is loading in background.
    // if (loading) { return ... } -> Removed to prevent stuck loading screen.

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/dashboard">
                            <span className="text-[#8a765e] hover:text-[#74634e] cursor-pointer">마이페이지</span>
                        </Link>
                    </li>
                    <li className="text-[#d5d6d9]">
                        <i className="fas fa-chevron-right text-xs"></i>
                    </li>
                    <li><span aria-current="page" className="text-[#535861]">결제 관리</span></li>
                </ol>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#181d27] mb-2">결제 관리</h1>
                <p className="text-[#535861]">사건 진행에 따른 비용 및 결제 내역을 확인하세요.</p>
            </div>

            <BillingSummary totalPaid={data.totalPaid} totalUnpaid={data.totalUnpaid} />
            <BillingHistoryList items={data.history} />
        </main>
    );
}
