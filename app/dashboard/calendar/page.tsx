
"use client";

import Link from "next/link";
import { useState } from "react";

export default function CalendarPage() {
    const [activeTab, setActiveTab] = useState("month");
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const events = [
        { day: 5, title: "상담 10:00", type: "consultation", label: "상담", color: "green" },
        { day: 12, title: "법원 14:00", type: "court", label: "법원", color: "blue" },
        { day: 15, title: "고객상담 09:00", type: "consultation", label: "상담", color: "green" },
        { day: 15, title: "팀미팅 16:00", type: "other", label: "기타", color: "orange" },
        { day: 18, title: "개인회생 인가 심리", type: "court", label: "법원", color: "blue" },
        { day: 25, title: "전화상담 11:00", type: "consultation", label: "상담", color: "green" },
    ];

    const upcomingEvents = [
        { title: "고객 상담", date: "3월 5일 (수)", desc: "김OO님 - 전세금 반환 상담", time: "10:00 - 11:00", loc: "상담실 A", type: "consultation", color: "green" },
        { title: "법원 출석", date: "3월 12일 (수)", desc: "전세금 반환 사건 - 변론기일", time: "14:00", loc: "서울중앙지법 402호", type: "court", color: "blue" },
        { title: "고객 상담", date: "3월 15일 (토)", desc: "이OO님 - 개인회생 신청 상담", time: "09:00 - 10:00", loc: "화상 상담", type: "consultation", color: "green" },
        { title: "개인회생 인가 심리", date: "3월 18일 (화)", desc: "박OO님 개인회생 사건", time: "11:00", loc: "서울회생법원 3층", type: "court", color: "blue" },
    ];

    const handleOpenModal = (event = null) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

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
                    <li><span aria-current="page" className="text-[#535861]">일정 관리</span></li>
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
                            <Link href="/dashboard/calendar" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
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
                    <section id="views" role="region" aria-label="보기 전환">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-2">나의 일정</h1>
                                    <p className="text-[#535861] text-lg">법원 일정과 상담 일정을 함께 관리하세요</p>
                                </div>
                                <div className="flex items-center gap-4 mt-4 lg:mt-0">
                                    <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium">
                                        <i className="fas fa-plus mr-2"></i> 새 일정 추가
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div role="tablist" aria-label="캘린더 보기 전환" className="flex items-center space-x-1 bg-neutral-50 rounded-lg p-1">
                                    <button role="tab" aria-selected={activeTab === 'month'} onClick={() => setActiveTab('month')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'month' ? 'bg-[#8a765e] text-white' : 'text-[#535861] hover:bg-white hover:text-[#181d27]'}`}>
                                        <i className="fas fa-calendar-days mr-2"></i> 월
                                    </button>
                                    <button role="tab" aria-selected={activeTab === 'week'} onClick={() => setActiveTab('week')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'week' ? 'bg-[#8a765e] text-white' : 'text-[#535861] hover:bg-white hover:text-[#181d27]'}`}>
                                        <i className="fas fa-calendar-week mr-2"></i> 주
                                    </button>
                                    <button role="tab" aria-selected={activeTab === 'day'} onClick={() => setActiveTab('day')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'day' ? 'bg-[#8a765e] text-white' : 'text-[#535861] hover:bg-white hover:text-[#181d27]'}`}>
                                        <i className="fas fa-calendar-day mr-2"></i> 일
                                    </button>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div><span className="text-[#535861]">법원 일정</span></div>
                                        <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span className="text-[#535861]">상담 일정</span></div>
                                        <div className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div><span className="text-[#535861]">기타 일정</span></div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><i className="fas fa-chevron-left"></i></button>
                                        <div className="text-lg font-semibold text-[#181d27] min-w-[140px] text-center">2025년 3월</div>
                                        <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><i className="fas fa-chevron-right"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div id="calendar-view" role="grid" aria-label="캘린더" className="calendar-container">
                                <div className="grid grid-cols-7 gap-px bg-[#e9e9eb] rounded-lg overflow-hidden">
                                    {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                                        <div key={d} role="columnheader" className="bg-neutral-50 p-3 text-center text-sm font-medium text-[#535861]">{d}</div>
                                    ))}

                                    {/* Previous month days */}
                                    {[24, 25, 26, 27, 28].map(d => (
                                        <div key={`prev-${d}`} role="gridcell" className="bg-white p-2 h-24 text-[#717680]"><div className="text-sm">{d}</div></div>
                                    ))}

                                    {/* Current month days */}
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                        <div key={`curr-${day}`} role="gridcell" className="bg-white p-2 h-24">
                                            <div className="text-sm font-medium text-[#181d27]">{day}</div>
                                            <div className="mt-1 space-y-1">
                                                {events.filter(e => e.day === day).map((e, idx) => (
                                                    <div key={idx} className={`text-xs ${e.color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200' : e.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'} px-1 py-0.5 rounded truncate cursor-pointer transition-colors`} onClick={() => handleOpenModal(e)}>
                                                        {e.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Next month days */}
                                    {[1, 2, 3, 4, 5, 6].map(d => (
                                        <div key={`next-${d}`} role="gridcell" className="bg-white p-2 h-24 text-[#717680]"><div className="text-sm">{d}</div></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="upcoming-events" role="region" aria-label="다가오는 일정">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <h2 className="text-xl font-semibold text-[#181d27] mb-6">다가오는 일정</h2>
                            <div className="space-y-4">
                                {upcomingEvents.map((evt, i) => (
                                    <div key={i} className="flex items-center p-4 border border-[#e9e9eb] rounded-lg hover:border-[#8a765e] transition-all duration-200 cursor-pointer">
                                        <div className={`w-3 h-3 ${evt.color === 'green' ? 'bg-green-500' : 'bg-blue-500'} rounded-full mr-4 flex-shrink-0`}></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-[#181d27]">{evt.title}</h3>
                                                <span className="text-sm text-[#535861]">{evt.date}</span>
                                            </div>
                                            <div className="text-sm text-[#535861] mb-2">{evt.desc}</div>
                                            <div className="flex items-center text-xs text-[#717680]">
                                                <i className="fas fa-clock mr-1"></i><span>{evt.time}</span>
                                                {evt.loc.includes('화상') ? <i className="fas fa-video ml-4 mr-1"></i> : <i className="fas fa-location-dot ml-4 mr-1"></i>}
                                                <span>{evt.loc}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <span className={`px-2 py-1 ${evt.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} rounded-full text-xs font-medium`}>{evt.type === 'consultation' ? '상담' : '법원'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-[#e9e9eb] text-center">
                                <button className="px-6 py-2 text-[#8a765e] hover:text-[#74634e] border border-[#8a765e] rounded-lg hover:bg-[#8a765e] hover:text-white transition-colors">
                                    모든 일정 보기
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {showModal && (
                <div id="event-modal" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#e9e9eb]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-[#181d27]">{selectedEvent ? '일정 상세' : '새 일정 추가'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-[#535861] hover:text-[#181d27] hover:bg-neutral-50 rounded-lg transition-colors">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <form className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#414651] mb-2">제목 <span className="text-[#8a765e]">*</span></label>
                                <input type="text" placeholder="일정 제목을 입력하세요" className="w-full px-4 py-3 bg-white border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" defaultValue={selectedEvent ? selectedEvent.title : ''} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#414651] mb-2">날짜 <span className="text-[#8a765e]">*</span></label>
                                    <input type="date" className="w-full px-4 py-3 bg-white border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#414651] mb-2">시간 <span className="text-[#8a765e]">*</span></label>
                                    <input type="time" className="w-full px-4 py-3 bg-white border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#414651] mb-2">일정 유형</label>
                                <select className="w-full px-4 py-3 bg-white border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] appearance-none" defaultValue={selectedEvent ? selectedEvent.type : 'consultation'}>
                                    <option value="consultation">상담</option>
                                    <option value="court">법원</option>
                                    <option value="meeting">회의</option>
                                    <option value="other">기타</option>
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                {selectedEvent && (
                                    <button type="button" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                        <i className="fas fa-trash mr-2"></i> 삭제
                                    </button>
                                )}
                                <button type="button" onClick={handleCloseModal} className="flex-1 px-6 py-3 bg-white border border-[#d5d6d9] text-[#535861] rounded-lg hover:bg-neutral-50 transition-colors font-medium">취소</button>
                                <button type="button" className="flex-1 px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium">
                                    <i className="fas fa-save mr-2"></i> 저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
