'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    // Note: In a real app we would use a context or session provider.
    // Here we read from localStorage for consistency with the simple auth flow implemented.
    const [userName, setUserName] = useState("김○○");

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setUserName(u.name || "고객");
        }
    }, []);

    return (
        <>
            <section id="welcome" role="region" aria-label="환영 메시지" className="mb-8">
                <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-2">안녕하세요, {userName}님</h1>
                            <p className="text-[#535861] text-lg">오늘 처리할 일부터 시작해 보세요</p>
                        </div>
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#8a765e]">2</div>
                                <div className="text-sm text-[#535861]">진행 중 사건</div>
                            </div>
                            <div className="w-px h-12 bg-[#e9e9eb]"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#8a765e]">3</div>
                                <div className="text-sm text-[#535861]">다가오는 일정</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-neutral-50 rounded-xl">
                            <div className="text-xl font-bold text-[#8a765e]">2</div>
                            <div className="text-sm text-[#535861]">진행 중 사건</div>
                        </div>
                        <div className="text-center p-4 bg-neutral-50 rounded-xl">
                            <div className="text-xl font-bold text-[#8a765e]">3</div>
                            <div className="text-sm text-[#535861]">다가오는 일정</div>
                        </div>
                    </div>
                    <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
                </div>
            </section>

            <section id="widgets" role="region" aria-label="주요 정보 위젯" className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <section id="cases" role="region" aria-label="최근 사건">
                            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-[#181d27]">최근 사건</h2>
                                    <Link href="/dashboard/my_cases" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                        전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-[#e9e9eb] rounded-lg hover:border-[#8a765e] transition-colors cursor-pointer">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                            <div>
                                                <div className="font-medium text-[#181d27]">전세금 반환</div>
                                                <div className="text-sm text-[#535861]">보증금 5,000만원 회수</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">서류 보완 요청</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-[#e9e9eb] rounded-lg hover:border-[#8a765e] transition-colors cursor-pointer">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                            <div>
                                                <div className="font-medium text-[#181d27]">개인회생</div>
                                                <div className="text-sm text-[#535861]">서울회생법원 2024개회...</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">개시결정</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="schedule" role="region" aria-label="다가오는 일정">
                            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-[#181d27]">다가오는 일정</h2>
                                    <Link href="/dashboard/calendar" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                        전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 border-l-4 border-[#8a765e] bg-neutral-50 rounded-r-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-[#181d27]">서류 제출 마감</div>
                                            <div className="text-sm text-[#535861]">전세금 반환 사건</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-[#181d27]">4월 15일</div>
                                            <div className="text-xs text-red-600">D-2</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-[#181d27]">법원 출석</div>
                                            <div className="text-sm text-[#535861]">개인회생 인가심리</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-[#181d27]">4월 18일</div>
                                            <div className="text-xs text-[#535861]">오전 10:00</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-[#181d27]">상담 예약</div>
                                            <div className="text-sm text-[#535861]">진행 상황 점검</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-[#181d27]">4월 20일</div>
                                            <div className="text-xs text-[#535861]">오후 2:00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27]">최근 메시지</h2>
                                <Link href="/dashboard/chat" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                    전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                                    <img src="/assets/images/profiles/profile_03.png" alt="김변호사" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-[#181d27]">김변호사</span>
                                            <span className="text-xs text-[#717680]">2분 전</span>
                                        </div>
                                        <p className="text-sm text-[#535861] truncate">서류 보완 관련하여 추가 안내드립니다.</p>
                                    </div>
                                    <div className="w-2 h-2 bg-[#8a765e] rounded-full"></div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                                    <img src="/assets/images/profiles/profile_06.png" alt="박변호사" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-[#181d27]">박변호사</span>
                                            <span className="text-xs text-[#717680]">1시간 전</span>
                                        </div>
                                        <p className="text-sm text-[#535861] truncate">심리 일정이 확정되었습니다.</p>
                                    </div>
                                    <div className="w-2 h-2 bg-[#8a765e] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27]">최근 알림</h2>
                                <Link href="/dashboard/notifications" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                    전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex-1">
                                        <div className="font-medium text-[#181d27]">서류 제출 안내</div>
                                        <div className="text-sm text-[#535861]">전세금 반환 소송 관련 증거자료를 제출해주세요.</div>
                                    </div>
                                    <span className="text-xs text-orange-600 font-medium">긴급</span>
                                </div>
                                <div className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                                    <div className="flex-1">
                                        <div className="font-medium text-[#181d27]">상담 예약 확정</div>
                                        <div className="text-sm text-[#535861]">4월 20일 오후 2시 방문 상담이 예약되었습니다.</div>
                                    </div>
                                    <span className="text-xs text-[#717680]">1일 전</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
