
"use client";

// import { Badge } from "@/components/ui/badge"; // Removed unused import causing build error
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
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
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
                                        <button
                                            onClick={() => item.receiptUrl ? window.open(item.receiptUrl, '_blank') : alert('영수증을 준비중입니다.')}
                                            className="inline-flex items-center text-[#8a765e] hover:text-[#74634e] transition-colors"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            영수증
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => alert('상세 청구서 보기 기능은 준비중입니다.')}
                                            className="inline-flex items-center text-[#535861] hover:text-[#181d27] transition-colors"
                                        >
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

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 p-4 bg-neutral-50">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm p-5 border border-[#e9e9eb] relative">
                        {/* Top: Status Badge */}
                        <div className="flex justify-between items-start mb-3">
                            <span className={cn(
                                "px-2.5 py-1 text-xs font-bold rounded-lg",
                                item.status === 'PAID' ? "bg-green-100 text-green-700" :
                                    item.status === 'UNPAID' ? "bg-red-100 text-red-700" :
                                        "bg-yellow-100 text-yellow-700"
                            )}>
                                {item.status === 'PAID' ? '결제완료' :
                                    item.status === 'UNPAID' ? '미납' : '결제대기'}
                            </span>
                            <span className="text-lg font-bold text-[#181d27]">{item.amount.toLocaleString()}원</span>
                        </div>

                        {/* Middle: Service Name */}
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-[#181d27] break-keep leading-tight mb-1">
                                {item.itemName}
                            </h3>
                        </div>

                        {/* Bottom: Meta Info */}
                        <div className="flex items-center justify-between text-sm text-[#717680] border-t border-[#f3f4f6] pt-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-neutral-100 p-1.5 rounded-md">
                                    <FileText className="w-3.5 h-3.5 text-[#535861]" />
                                </span>
                                <span>{item.paymentMethod}</span>
                            </div>
                            <span className="text-xs">
                                {item.paidAt
                                    ? new Date(item.paidAt).toLocaleDateString()
                                    : new Date(item.createdAt).toLocaleDateString()
                                }
                            </span>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4">
                            {item.status === 'PAID' ? (
                                <button
                                    onClick={() => item.receiptUrl ? window.open(item.receiptUrl, '_blank') : alert('영수증을 준비중입니다.')}
                                    className="w-full flex justify-center items-center py-2.5 rounded-lg border border-[#e5ceb4] text-[#8a765e] font-medium bg-[#f8f3ed] hover:bg-[#efe4d6] transition-colors text-sm"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    영수증 다운로드
                                </button>
                            ) : (
                                <button
                                    onClick={() => alert('상세 청구서 보기 기능은 준비중입니다.')}
                                    className="w-full flex justify-center items-center py-2.5 rounded-lg border border-neutral-200 text-[#535861] font-medium bg-white hover:bg-neutral-50 transition-colors text-sm shadow-sm"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    청구서 확인
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
