
"use client";

import { Badge } from "@/components/ui/badge"; // Assuming we might utilize shadcn later, but hardcoding styles for now to be safe/fast
import { cn } from "@/lib/utils";
import { BillingHistoryItem } from "@/app/actions/billing";
import { Download, FileText } from 'lucide-react';

interface BillingHistoryListProps {
    items: BillingHistoryItem[];
}

export default function BillingHistoryList({ items }: BillingHistoryListProps) {
    if (items.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-12 text-center text-[#717680]">
                결제 내역이 없습니다.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-[#e9e9eb] overflow-hidden">
            <div className="p-6 border-b border-[#e9e9eb]">
                <h2 className="text-lg font-bold text-[#181d27]">결제 내역</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-[#e9e9eb]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#535861] uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#535861] uppercase tracking-wider">내역</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#535861] uppercase tracking-wider">결제일 / 요청일</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#535861] uppercase tracking-wider">금액</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#535861] uppercase tracking-wider">영수증</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9e9eb]">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-2 py-1 text-xs font-semibold rounded-full",
                                        item.status === 'PAID' ? "bg-green-100 text-green-700" :
                                            item.status === 'UNPAID' ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {item.status === 'PAID' ? '결제완료' :
                                            item.status === 'UNPAID' ? '미납' : '결제대기'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-[#181d27]">{item.itemName}</div>
                                    <div className="text-xs text-[#717680] mt-0.5">{item.paymentMethod}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#535861]">
                                    {item.paidAt
                                        ? new Date(item.paidAt).toLocaleDateString()
                                        : new Date(item.createdAt).toLocaleDateString()
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#181d27] text-right">
                                    {item.amount.toLocaleString()}원
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    {item.status === 'PAID' ? (
                                        <button className="inline-flex items-center text-[#8a765e] hover:text-[#74634e] transition-colors">
                                            <Download className="w-4 h-4 mr-1" />
                                            영수증
                                        </button>
                                    ) : (
                                        <button className="inline-flex items-center text-[#535861] hover:text-[#181d27] transition-colors">
                                            <FileText className="w-4 h-4 mr-1" />
                                            청구서
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
