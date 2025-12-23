
"use client";

import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
    // Simple state for Toggles. In a real app, this would be fetched from backend.
    const [settings, setSettings] = useState({
        caseStatus: true,
        docRequest: true,
        deadline: true,
        newMessage: true,
        mention: false,
        replyRequest: true,
        schedule: true,
        scheduleChange: true,
        preAlert: false,
        security: true,
        serviceUpdate: false,
        marketing: false,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const turnOffAll = () => {
        const newSettings = Object.keys(settings).reduce((acc, key) => {
            acc[key as keyof typeof settings] = false;
            return acc;
        }, {} as typeof settings);
        setSettings(newSettings);
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
                    <li><span aria-current="page" className="text-[#535861]">알림 설정</span></li>
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
                            <Link href="/dashboard/notifications" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
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
                    <div className="bg-white rounded-2xl border border-[#e9e9eb] p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold text-[#181d27] mb-2">알림 설정</h1>
                            <p className="text-[#535861]">받고 싶은 알림을 선택하여 중요한 업데이트를 놓치지 마세요.</p>
                        </div>
                        <section id="toggles" role="region" aria-label="알림 토글">
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-6">
                                    {/* Case Related */}
                                    <div className="pb-6 border-b border-[#e9e9eb]">
                                        <h2 className="text-lg font-medium text-[#181d27] mb-4">사건 관련 알림</h2>
                                        <div className="space-y-4">
                                            <ToggleItem label="사건 상태 변경" desc="사건의 진행 상황이 변경될 때 알림을 받습니다." checked={settings.caseStatus} onChange={() => toggle('caseStatus')} />
                                            <ToggleItem label="서류 요청" desc="추가 서류가 필요할 때 알림을 받습니다." checked={settings.docRequest} onChange={() => toggle('docRequest')} />
                                            <ToggleItem label="마감일 임박" desc="서류 제출이나 법원 출석 등의 마감일이 다가올 때 알림을 받습니다." checked={settings.deadline} onChange={() => toggle('deadline')} />
                                        </div>
                                    </div>
                                    {/* Consultation Related */}
                                    <div className="pb-6 border-b border-[#e9e9eb]">
                                        <h2 className="text-lg font-medium text-[#181d27] mb-4">상담 관련 알림</h2>
                                        <div className="space-y-4">
                                            <ToggleItem label="새 메시지" desc="변호사로부터 새로운 메시지가 도착했을 때 알림을 받습니다." checked={settings.newMessage} onChange={() => toggle('newMessage')} />
                                            <ToggleItem label="멘션 알림" desc="채팅에서 나를 언급했을 때 알림을 받습니다." checked={settings.mention} onChange={() => toggle('mention')} />
                                            <ToggleItem label="답변 요청" desc="변호사가 답변을 요청했을 때 알림을 받습니다." checked={settings.replyRequest} onChange={() => toggle('replyRequest')} />
                                        </div>
                                    </div>
                                    {/* Schedule Related */}
                                    <div className="pb-6 border-b border-[#e9e9eb]">
                                        <h2 className="text-lg font-medium text-[#181d27] mb-4">일정 관련 알림</h2>
                                        <div className="space-y-4">
                                            <ToggleItem label="일정 알림" desc="예정된 법원 출석이나 상담 일정을 알려드립니다." checked={settings.schedule} onChange={() => toggle('schedule')} />
                                            <ToggleItem label="일정 변경" desc="기존 일정이 변경되거나 취소될 때 알림을 받습니다." checked={settings.scheduleChange} onChange={() => toggle('scheduleChange')} />
                                            <ToggleItem label="사전 알림" desc="일정 30분 전에 미리 알림을 받습니다." checked={settings.preAlert} onChange={() => toggle('preAlert')} />
                                        </div>
                                    </div>
                                    {/* System Related */}
                                    <div className="pb-6 border-b border-[#e9e9eb]">
                                        <h2 className="text-lg font-medium text-[#181d27] mb-4">시스템 알림</h2>
                                        <div className="space-y-4">
                                            <ToggleItem label="보안 알림" desc="로그인 정보 변경이나 의심스러운 활동을 감지했을 때 알림을 받습니다." checked={settings.security} onChange={() => toggle('security')} />
                                            <ToggleItem label="서비스 업데이트" desc="새로운 기능이나 서비스 변경 사항을 알려드립니다." checked={settings.serviceUpdate} onChange={() => toggle('serviceUpdate')} />
                                            <ToggleItem label="마케팅 정보" desc="법률 서비스 관련 유용한 정보나 이벤트 소식을 받습니다." checked={settings.marketing} onChange={() => toggle('marketing')} />
                                        </div>
                                    </div>
                                    {/* Notification Methods (visual only for now) */}
                                    <div>
                                        <h2 className="text-lg font-medium text-[#181d27] mb-4">알림 방식</h2>
                                        <div className="space-y-4">
                                            <div className="bg-neutral-50 p-4 rounded-lg">
                                                <h3 className="font-medium text-[#181d27] mb-3">이메일 알림</h3>
                                                <div className="space-y-3">
                                                    <label className="flex items-center"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#8a765e] focus:ring-[#8a765e] h-4 w-4" /><span className="ml-3 text-sm text-[#535861]">즉시 알림</span></label>
                                                    <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-[#8a765e] focus:ring-[#8a765e] h-4 w-4" /><span className="ml-3 text-sm text-[#535861]">일일 요약</span></label>
                                                    <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-[#8a765e] focus:ring-[#8a765e] h-4 w-4" /><span className="ml-3 text-sm text-[#535861]">주간 요약</span></label>
                                                </div>
                                            </div>
                                            <div className="bg-neutral-50 p-4 rounded-lg">
                                                <h3 className="font-medium text-[#181d27] mb-3">SMS 알림</h3>
                                                <div className="space-y-3">
                                                    <label className="flex items-center"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#8a765e] focus:ring-[#8a765e] h-4 w-4" /><span className="ml-3 text-sm text-[#535861]">긴급 알림만</span></label>
                                                    <label className="flex items-center"><input type="checkbox" className="rounded border-gray-300 text-[#8a765e] focus:ring-[#8a765e] h-4 w-4" /><span className="ml-3 text-sm text-[#535861]">모든 알림</span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-[#e9e9eb]">
                                    <button type="button" onClick={turnOffAll} className="px-4 py-2 text-[#535861] hover:text-[#74634e] transition-colors">모두 끄기</button>
                                    <div className="flex items-center space-x-3">
                                        <button type="button" className="px-6 py-3 border border-[#d5d6d9] text-[#535861] rounded-lg hover:bg-neutral-50 transition-colors">취소</button>
                                        <button type="submit" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium">설정 저장</button>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

function ToggleItem({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <label className="text-[#181d27] font-medium">{label}</label>
                <p className="text-sm text-[#535861] mt-1">{desc}</p>
            </div>
            <div className="ml-4">
                <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:ring-offset-2 ${checked ? 'bg-[#8a765e]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
            </div>
        </div>
    )
}
