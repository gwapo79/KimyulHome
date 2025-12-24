
"use client";

import { CreditCard, AlertCircle } from 'lucide-react';

interface BillingSummaryProps {
    totalPaid: number;
    totalUnpaid: number;
}

export default function BillingSummary({ totalPaid, totalUnpaid }: BillingSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Paid */}
            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 flex flex-col justify-between">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-[#535861]">총 결제 금액</h3>
                </div>
                <div>
                    <div className="text-3xl font-bold text-[#181d27]">
                        {totalPaid.toLocaleString()}원
                    </div>
                    <p className="text-sm text-[#717680] mt-1">최근 1년간의 결제 합계입니다.</p>
                </div>
            </div>

            {/* Outstanding */}
            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 flex flex-col justify-between">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-[#535861]">미납 금액</h3>
                </div>
                <div>
                    <div className="text-3xl font-bold text-[#d32f2f]">
                        {totalUnpaid.toLocaleString()}원
                    </div>
                    <p className="text-sm text-[#717680] mt-1">기한 내 납부가 필요합니다.</p>
                </div>
            </div>
        </div>
    );
}
