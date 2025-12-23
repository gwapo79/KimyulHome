
"use client";

import Link from "next/link";
import { useState } from "react";

export default function ChatPage() {
    const [activeThread, setActiveThread] = useState(0);

    const threads = [
        {
            id: 0,
            name: "김변호사",
            avatar: "/assets/images/profiles/profile_03.png",
            status: "online",
            statusText: "온라인",
            time: "방금 전",
            caseId: "전세금 반환 사건 (#2025-0312-001)",
            lastMsg: "서류 보완 관련하여 추가 안내드립니다.",
            unread: true,
        },
        {
            id: 1,
            name: "박변호사",
            avatar: "/assets/images/profiles/profile_06.png",
            status: "offline",
            statusText: "1시간 전 접속",
            time: "1시간 전",
            caseId: "개인회생 사건 (#2025-0301-002)",
            lastMsg: "심리 일정이 확정되었습니다.",
            unread: false,
        },
        {
            id: 2,
            name: "이변호사",
            avatar: "/assets/images/profiles/profile_05.png",
            status: "offline",
            statusText: "어제 접속",
            time: "어제",
            caseId: "채무조정 사건 (#2025-0220-003)",
            lastMsg: "서류 검토 완료되었습니다.",
            unread: false,
        },
    ];

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
                    <li><span aria-current="page" className="text-[#535861]">상담 채팅</span></li>
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
                            <Link href="/dashboard/chat" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
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
                    <div className="bg-white rounded-2xl border border-[#e9e9eb] h-[800px] flex">
                        <section id="threads" role="region" aria-label="대화 리스트" className="w-80 border-r border-[#e9e9eb] flex flex-col hidden lg:flex">
                            <div className="p-6 border-b border-[#e9e9eb]">
                                <h1 className="text-xl font-semibold text-[#181d27] mb-2">상담 채팅</h1>
                                <p className="text-[#535861] text-sm">이전 대화와 최근 파일을 확인하세요</p>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 space-y-2">
                                    {threads.map((thread) => (
                                        <button key={thread.id} onClick={() => setActiveThread(thread.id)} className={`w-full text-left p-4 rounded-lg transition-colors ${activeThread === thread.id ? 'bg-[#f8f3ed] border border-[#e5ceb4]' : 'hover:bg-neutral-50'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <img src={thread.avatar} alt={thread.name} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <div className="font-medium text-[#181d27] text-sm">{thread.name}</div>
                                                        <div className={`text-xs ${thread.status === 'online' ? 'text-[#74634e]' : 'text-[#717680]'}`}>{thread.statusText}</div>
                                                    </div>
                                                </div>
                                                <div className={`text-xs ${thread.status === 'online' ? 'text-[#74634e]' : 'text-[#717680]'}`}>{thread.time}</div>
                                            </div>
                                            <div className="text-sm text-[#535861] mb-2">{thread.caseId}</div>
                                            <div className="text-sm text-[#535861] truncate">{thread.lastMsg}</div>
                                            <div className="flex items-center justify-between mt-2">
                                                {thread.unread ? (
                                                    <>
                                                        <span className="text-xs bg-[#8a765e] text-white px-2 py-1 rounded-full">신규 메시지</span>
                                                        <div className="w-2 h-2 bg-[#8a765e] rounded-full"></div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-[#717680]">읽음</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                        <div className="flex-1 flex flex-col">
                            <div className="p-6 border-b border-[#e9e9eb] flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={threads[activeThread].avatar} alt={threads[activeThread].name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="font-medium text-[#181d27]">{threads[activeThread].name}</div>
                                        <div className="text-sm text-[#74634e]">온라인 • 전세금 반환 사건</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><i className="fas fa-phone"></i></button>
                                    <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><i className="fas fa-video"></i></button>
                                    <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><i className="fas fa-ellipsis-vertical"></i></button>
                                </div>
                            </div>
                            <div id="chat-messages" className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-center"><span className="px-3 py-1 bg-neutral-100 text-[#717680] text-xs rounded-full">2025년 4월 13일</span></div>
                                <div className="flex items-start space-x-3">
                                    <img src={threads[activeThread].avatar} alt={threads[activeThread].name} className="w-8 h-8 rounded-full" />
                                    <div className="flex-1 max-w-lg">
                                        <div className="bg-white border border-[#e9e9eb] rounded-2xl rounded-tl-md p-4">
                                            <p className="text-[#181d27]">안녕하세요 김○○님, 전세금 반환 사건 관련하여 연락드립니다.</p>
                                            <p className="text-[#181d27] mt-2">서류 검토 결과 추가로 필요한 서류가 있어 안내드립니다:</p>
                                            <ul className="mt-2 space-y-1 text-[#181d27]">
                                                <li>• 임대차계약서 사본</li>
                                                <li>• 보증금 입금 확인서</li>
                                                <li>• 전입신고 확인서</li>
                                            </ul>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1 text-xs text-[#717680]"><span>{threads[activeThread].name}</span><span>•</span><span>오후 2:30</span></div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 justify-end">
                                    <div className="flex-1 max-w-lg text-right">
                                        <div className="bg-[#8a765e] rounded-2xl rounded-tr-md p-4 inline-block text-left">
                                            <p className="text-white">네, 확인했습니다. 임대차계약서와 보증금 입금 확인서는 준비되어 있는데, 전입신고 확인서는 어떻게 발급받을 수 있나요?</p>
                                        </div>
                                        <div className="flex items-center justify-end space-x-2 mt-1 text-xs text-[#717680]">
                                            <span>오후 2:35</span><i className="fas fa-check-double text-[#8a765e]"></i>
                                        </div>
                                    </div>
                                    <img src="/assets/images/profiles/profile_01.png" alt="나" className="w-8 h-8 rounded-full" />
                                </div>
                                {/* Simplified chat history for brevity in initial migration. Can add more bubbles if needed or dynamically load. */}
                            </div>
                            <section className="border-t border-[#e9e9eb] p-6">
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex items-end space-x-3">
                                        <button type="button" className="p-3 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><i className="fas fa-paperclip"></i></button>
                                        <div className="flex-1 relative">
                                            <textarea rows={1} placeholder="상담 내용을 입력하세요" className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] placeholder-[#717680]"></textarea>
                                        </div>
                                        <button type="submit" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium"><i className="fas fa-paper-plane"></i></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {["서류 진행 상황 문의", "일정 조율 요청", "추가 상담 예약"].map(tag => (
                                            <button key={tag} type="button" className="px-3 py-1.5 bg-neutral-100 text-[#535861] rounded-full text-sm hover:bg-neutral-200 transition-colors">{tag}</button>
                                        ))}
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
