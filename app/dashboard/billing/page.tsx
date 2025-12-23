
"use client";

import Link from "next/link";
import { useState } from "react";

export default function BillingPage() {
    const [invoices, setInvoices] = useState([
        {
            id: "INV-2025-001",
            title: "전세금 반환 사건 착수금",
            amount: 1000000,
            date: "2025.04.20",
            dday: "D-3",
            status: "unpaid", // unpaid, paid, overdue
            statusText: "미납",
        },
        {
            id: "INV-2025-002",
            title: "개인회생 신청 수수료",
            amount: 250000,
            date: "2025.04.25",
            dday: "D+2",
            status: "overdue",
            statusText: "연체",
        },
        {
            id: "INV-2025-003",
            title: "채무조정 상담료",
            amount: 150000,
            date: "2025.03.15",
            dday: "",
            status: "paid",
            statusText: "완료",
        },
        {
            id: "INV-2025-004",
            title: "부동산 분쟁 성공보수",
            amount: 3000000,
            date: "2025.02.28",
            dday: "",
            status: "paid",
            statusText: "완료",
        },
    ]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/dashboard">
                            <span className="text-[#8a765e] hover:text-[#74634e] cursor-pointer">마이페이지</span>
                        </Link>
                    </li>
                    <li><i className="fas fa-chevron-right text-[#d5d6d9] text-xs"></i></li>
                    <li><span aria-current="page" className="text-[#535861]">결제 관리</span></li>
                </ol>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white rounded-2xl border border-[#e9e9eb] p-4">
                        <div className="space-y-2">
                            <Link href="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-house mr-3"></i>
                                대시보드
                            </Link>
                            <Link href="/dashboard/my_cases" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-briefcase mr-3"></i>
                                내 사건
                            </Link>
                            <Link href="/dashboard/documents" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-file-lines mr-3"></i>
                                문서 관리
                            </Link>
                            <Link href="/dashboard/calendar" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-calendar mr-3"></i>
                                일정 관리
                            </Link>
                            <Link href="/dashboard/chat" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-comments mr-3"></i>
                                상담 채팅
                                <span className="ml-auto bg-[#8a765e] text-white text-xs rounded-full px-2 py-1">2</span>
                            </Link>
                            <Link href="/dashboard/notifications" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-bell mr-3"></i>
                                알림
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                            </Link>
                            <Link href="/dashboard/billing" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
                                <i className="fas fa-credit-card mr-3"></i>
                                결제 관리
                            </Link>
                            <div className="border-t border-[#e9e9eb] my-4"></div>
                            <Link href="/dashboard/profile" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-user mr-3"></i>
                                프로필 설정
                            </Link>
                            <Link href="/dashboard/security" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-shield-halved mr-3"></i>
                                보안 설정
                            </Link>
                        </div>
                    </nav>
                </aside>

                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-2">청구 내역</h1>
                                <p className="text-[#535861] text-lg">청구 내역을 투명하게 확인하세요</p>
                            </div>
                            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#8a765e]">₩1,250,000</div>
                                    <div className="text-sm text-[#535861]">총 미납 금액</div>
                                </div>
                                <div className="w-px h-12 bg-[#e9e9eb] hidden lg:block"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">₩3,750,000</div>
                                    <div className="text-sm text-[#535861]">결제 완료 금액</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl">
                            <div className="text-center">
                                <div className="text-lg font-semibold text-[#181d27]">2</div>
                                <div className="text-sm text-[#535861]">미납 건수</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-[#181d27]">5</div>
                                <div className="text-sm text-[#535861]">완료 건수</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-[#181d27]">3</div>
                                <div className="text-sm text-[#535861]">분납 중</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-[#181d27]">1</div>
                                <div className="text-sm text-[#535861]">연체</div>
                            </div>
                        </div>
                    </div>

                    <section id="invoices" role="region" aria-label="청구서 목록" className="mb-8">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27] mb-4 sm:mb-0">청구서 목록</h2>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <select className="px-3 py-2 border border-[#d5d6d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]">
                                        <option>전체 상태</option>
                                        <option>미납</option>
                                        <option>완료</option>
                                        <option>연체</option>
                                    </select>
                                    <select className="px-3 py-2 border border-[#d5d6d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]">
                                        <option>최근 6개월</option>
                                        <option>최근 1년</option>
                                        <option>전체</option>
                                    </select>
                                </div>
                            </div>
                            <div className="block overflow-x-auto">
                                <table role="table" aria-label="청구서 내역 테이블" className="w-full text-left">
                                    <caption className="sr-only">청구서 내역을 건명, 금액, 기한, 상태 순으로 표시합니다</caption>
                                    <thead>
                                        <tr className="border-b border-[#e9e9eb]">
                                            <th className="py-4 px-4 font-medium text-[#414651]">건명</th>
                                            <th className="py-4 px-4 font-medium text-[#414651]">금액</th>
                                            <th className="py-4 px-4 font-medium text-[#414651]">기한</th>
                                            <th className="py-4 px-4 font-medium text-[#414651]">상태</th>
                                            <th className="py-4 px-4 font-medium text-[#414651] text-right">액션</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="border-b border-[#e9e9eb] hover:bg-neutral-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-[#181d27]">{inv.title}</div>
                                                    <div className="text-sm text-[#535861]">청구서 #{inv.id}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-[#181d27]">₩{inv.amount.toLocaleString()}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-[#181d27]">{inv.date}</div>
                                                    {inv.dday && (
                                                        <div className={`text-sm ${inv.status === 'overdue' ? 'text-orange-600' : 'text-red-600'}`}>{inv.dday}</div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'unpaid' ? 'bg-red-100 text-red-700' : inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {inv.statusText}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        {inv.status !== 'paid' && (
                                                            <button className={`px-4 py-2 ${inv.status === 'overdue' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#8a765e] hover:bg-[#74634e]'} text-white rounded-lg transition-colors text-sm font-medium`}>
                                                                {inv.status === 'overdue' ? '긴급 결제' : '지금 결제'}
                                                            </button>
                                                        )}
                                                        <button aria-label={`${inv.status === 'paid' ? '영수증' : '청구서'} 다운로드`} className={`px-${inv.status === 'paid' ? '4' : '3'} py-2 border border-[#d5d6d9] text-[#535861] rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium`}>
                                                            {inv.status === 'paid' ? '영수증 다운로드' : <i className="fas fa-download"></i>}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section id="plans" role="region" aria-label="분납 일정" className="mb-8">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27]">분납 일정</h2>
                                <button className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                    전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                </button>
                            </div>
                            <div className="border border-[#e9e9eb] rounded-xl p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                    <div>
                                        <h3 className="font-semibold text-[#181d27] mb-2">전세금 반환 사건 - 성공보수 분납</h3>
                                        <div className="flex items-center space-x-4 text-sm text-[#535861]">
                                            <span>총 금액: ₩5,000,000</span><span>•</span><span>6회 분납</span><span>•</span><span>잔여: 4회</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 lg:mt-0 text-right">
                                        <div className="text-lg font-semibold text-[#181d27]">₩1,666,667</div>
                                        <div className="text-sm text-[#535861]">회당 납부 금액</div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-[#535861]">진행률</span>
                                        <span className="text-sm font-medium text-[#181d27]">33% (2/6회 완료)</span>
                                    </div>
                                    <div className="w-full bg-[#e9e9eb] rounded-full h-2">
                                        <div className="bg-[#8a765e] h-2 rounded-full" style={{ width: '33%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
