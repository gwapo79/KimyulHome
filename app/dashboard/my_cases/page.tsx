
"use client";

import Link from "next/link";
import { useState } from "react";

export default function MyCasesPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const cases = [
        {
            id: 1,
            title: "전세금 반환",
            subtitle: "보증금 5,000만원 회수",
            status: "supplement",
            statusLabel: "서류 보완 요청",
            urgency: "urgent",
            date: "2025-04-15",
            dDay: "D-2",
            lawyer: "김변호사",
            team: "부동산팀",
            avatar: "/assets/images/profiles/profile_03.png",
            update: "2시간 전",
            updateMsg: "서류 요청 메시지",
        },
        {
            id: 2,
            title: "개인회생",
            subtitle: "채무 총액 1억 2천만원",
            status: "progress",
            statusLabel: "심리 예정",
            urgency: "normal",
            date: "2025-04-18",
            dDay: "법원 출석",
            lawyer: "박변호사",
            team: "회생팀",
            avatar: "/assets/images/profiles/profile_06.png",
            update: "1일 전",
            updateMsg: "심리 일정 확정",
        },
        {
            id: 3,
            title: "채무 조정",
            subtitle: "금리 인하 협상",
            status: "progress",
            statusLabel: "협상 진행",
            urgency: "normal",
            date: "2025-04-25",
            dDay: "은행 미팅",
            lawyer: "이변호사",
            team: "금융팀",
            avatar: "/assets/images/profiles/profile_05.png",
            update: "3일 전",
            updateMsg: "협상 진행 보고",
        },
        {
            id: 4,
            title: "임대차 분쟁",
            subtitle: "보증금 회수 완료",
            status: "completed",
            statusLabel: "종결",
            urgency: "normal",
            date: "2025-03-20",
            dDay: "완료됨",
            lawyer: "최변호사",
            team: "부동산팀",
            avatar: "/assets/images/profiles/profile_07_v2.png",
            update: "1주 전",
            updateMsg: "사건 종결 보고",
        },
        {
            id: 5,
            title: "경매 취소",
            subtitle: "권리분석 및 이의신청",
            status: "supplement",
            statusLabel: "추가 서류 필요",
            urgency: "normal",
            date: "2025-04-30",
            dDay: "서류 제출",
            lawyer: "정변호사",
            team: "부동산팀",
            avatar: "/assets/images/profiles/profile_09_v2.png",
            update: "5일 전",
            updateMsg: "서류 보완 요청",
        },
    ];

    const filteredCases = activeFilter === "all" ? cases : cases.filter(c => c.status === activeFilter || (activeFilter === "urgent" && c.urgency === "urgent"));

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white rounded-2xl border border-[#e9e9eb] p-4">
                        <div className="space-y-2">
                            <Link href="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-house mr-3"></i>
                                대시보드
                            </Link>
                            <Link href="/dashboard/my_cases" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
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
                            <Link href="/dashboard/billing" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
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
                    <section id="filters" role="region" aria-label="사건 필터 및 검색">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-2">내 사건</h1>
                                    <p className="text-[#535861]">가장 긴급한 사건부터 확인하세요</p>
                                </div>
                                <div className="mt-4 lg:mt-0 text-sm text-[#535861]">
                                    총 <span className="font-medium text-[#181d27]">{filteredCases.length}건</span>의 사건
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="case-search" className="sr-only">사건 검색</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-magnifying-glass text-[#717680]"></i>
                                    </div>
                                    <input
                                        type="text"
                                        id="case-search"
                                        placeholder="사건명, 담당자, 내용으로 검색..."
                                        className="w-full pl-10 pr-4 py-3 border border-[#d5d6d9] rounded-lg focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] placeholder-[#717680]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <button onClick={() => setActiveFilter("all")} className={`filter-chip px-4 py-2 rounded-full border ${activeFilter === "all" ? "bg-[#8a765e] text-white border-[#8a765e]" : "bg-white text-[#535861] border-[#d5d6d9] hover:bg-neutral-50"}`}>
                                    <i className="fas fa-list mr-2"></i>전체
                                </button>
                                <button onClick={() => setActiveFilter("progress")} className={`filter-chip px-4 py-2 rounded-full border ${activeFilter === "progress" ? "bg-[#8a765e] text-white border-[#8a765e]" : "bg-white text-[#535861] border-[#d5d6d9] hover:bg-neutral-50"}`}>
                                    <i className="fas fa-clock mr-2"></i>진행중
                                </button>
                                <button onClick={() => setActiveFilter("supplement")} className={`filter-chip px-4 py-2 rounded-full border ${activeFilter === "supplement" ? "bg-[#8a765e] text-white border-[#8a765e]" : "bg-white text-[#535861] border-[#d5d6d9] hover:bg-neutral-50"}`}>
                                    <i className="fas fa-triangle-exclamation mr-2"></i>보완 요청
                                </button>
                                <button onClick={() => setActiveFilter("completed")} className={`filter-chip px-4 py-2 rounded-full border ${activeFilter === "completed" ? "bg-[#8a765e] text-white border-[#8a765e]" : "bg-white text-[#535861] border-[#d5d6d9] hover:bg-neutral-50"}`}>
                                    <i className="fas fa-circle-check mr-2"></i>종결
                                </button>
                                <button onClick={() => setActiveFilter("urgent")} className={`filter-chip px-4 py-2 rounded-full border ${activeFilter === "urgent" ? "bg-[#8a765e] text-white border-[#8a765e]" : "bg-white text-[#535861] border-[#d5d6d9] hover:bg-neutral-50"}`}>
                                    <i className="fas fa-fire mr-2"></i>긴급
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button id="apply-filters" className="px-4 py-2 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium">
                                    <i className="fas fa-filter mr-2"></i>필터 적용
                                </button>
                                <button id="reset-filters" className="px-4 py-2 bg-white border border-[#d5d6d9] text-[#535861] rounded-lg hover:bg-neutral-50 transition-colors font-medium" onClick={() => setActiveFilter("all")}>
                                    <i className="fas fa-arrow-rotate-left mr-2"></i>초기화
                                </button>
                            </div>
                        </div>
                    </section>

                    <section id="table" role="region" aria-label="사건 목록">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] overflow-hidden">
                            <div className="hidden lg:block overflow-x-auto">
                                <table role="table" aria-label="사건 목록 테이블" className="w-full">
                                    <thead className="bg-neutral-50 border-b border-[#e9e9eb]">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">사건명</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">상태</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">마감일</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">담당자</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">최근 업데이트</th>
                                            <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-[#535861]">액션</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e9e9eb]">
                                        {filteredCases.map((c) => (
                                            <tr key={c.id} className="hover:bg-neutral-50 cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {c.urgency === "urgent" ? (
                                                            <div aria-label="긴급" className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                                        ) : c.status === "progress" ? (
                                                            <div aria-label="진행중" className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                        ) : c.status === "completed" ? (
                                                            <div aria-label="종결" className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                                                        ) : (
                                                            <div aria-label="보완 요청" className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-[#181d27]">{c.title}</div>
                                                            <div className="text-sm text-[#535861]">{c.subtitle}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${c.status === 'completed' ? 'bg-gray-100 text-gray-700' : c.status === 'progress' ? 'bg-blue-100 text-blue-700' : c.status === 'supplement' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                        {c.statusLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[#181d27]">{c.date}</div>
                                                    <div className={`text-xs font-medium ${c.urgency === 'urgent' ? 'text-red-600' : 'text-[#535861]'}`}>{c.dDay}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <img src={c.avatar} alt={c.lawyer} className="w-8 h-8 rounded-full mr-3" />
                                                        <div>
                                                            <div className="text-sm font-medium text-[#181d27]">{c.lawyer}</div>
                                                            <div className="text-xs text-[#535861]">{c.team}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[#181d27]">{c.update}</div>
                                                    <div className="text-xs text-[#535861]">{c.updateMsg}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button className="text-[#8a765e] hover:text-[#74634e] font-medium">
                                                        <i className="fas fa-arrow-right"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="lg:hidden space-y-4 p-4">
                                {filteredCases.map((c) => (
                                    <div key={c.id} className="bg-white border border-[#e9e9eb] rounded-lg p-4 hover:border-[#8a765e] transition-colors cursor-pointer">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-3 ${c.urgency === 'urgent' ? 'bg-red-500' : c.status === 'completed' ? 'bg-gray-400' : c.status === 'progress' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                                <div>
                                                    <h3 className="font-medium text-[#181d27]">{c.title}</h3>
                                                    <p className="text-sm text-[#535861]">{c.subtitle}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'completed' ? 'bg-gray-100 text-gray-700' : c.status === 'progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {c.statusLabel}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                            <div>
                                                <div className="text-[#535861]">마감일</div>
                                                <div className="font-medium text-[#181d27]">{c.date}</div>
                                                <div className={`text-xs font-medium ${c.urgency === 'urgent' ? 'text-red-600' : 'text-[#535861]'}`}>{c.dDay}</div>
                                            </div>
                                            <div>
                                                <div className="text-[#535861]">담당자</div>
                                                <div className="font-medium text-[#181d27]">{c.lawyer}</div>
                                                <div className="text-xs text-[#535861]">{c.team}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-[#e9e9eb]">
                                            <div className="text-xs text-[#535861]">{c.update} 업데이트</div>
                                            <button className="text-[#8a765e] hover:text-[#74634e] font-medium text-sm">
                                                상세보기 <i className="fas fa-arrow-right ml-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-4 border-t border-[#e9e9eb] flex items-center justify-between">
                                <div className="text-sm text-[#535861]">
                                    총 {filteredCases.length}건 중 1-{Math.min(5, filteredCases.length)}건 표시
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button disabled className="px-3 py-2 border border-[#d5d6d9] rounded-lg text-[#535861] hover:bg-neutral-50 disabled:opacity-50">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button className="px-3 py-2 bg-[#8a765e] text-white rounded-lg">1</button>
                                    <button className="px-3 py-2 border border-[#d5d6d9] rounded-lg text-[#535861] hover:bg-neutral-50">2</button>
                                    <button className="px-3 py-2 border border-[#d5d6d9] rounded-lg text-[#535861] hover:bg-neutral-50">
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
