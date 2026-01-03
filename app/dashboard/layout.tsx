'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path
            ? 'bg-[#8a765e] text-white font-medium shadow-sm'
            : 'hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors';
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-0 pb-8 lg:py-8">
            {/* Mobile Mypage Header (Sticky) */}
            {/* Fixed/Sticky: z-50 to overlap everything. bg-white/90 + blur-md for glass effect. */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-4 sm:px-6 -mx-4 sm:-mx-6 mb-6 flex lg:hidden items-center justify-between transition-all">
                <h2 className="text-xl font-bold text-[#181d27]">마이페이지</h2>
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-sm text-[#535861] hover:text-[#181d27] font-medium">홈으로</Link>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-[#535861] hover:text-[#74634e] bg-white border border-[#e9e9eb] rounded-lg shadow-sm"
                    >
                        <i className="fas fa-bars"></i>
                        <span className="ml-2 text-sm font-medium">메뉴</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative">

                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                        onClick={closeSidebar}
                    ></div>
                )}

                {/* Sidebar (Desktop: Static, Mobile: Fixed Drawer) */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:shadow-none lg:bg-transparent lg:z-auto
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <nav className="h-full lg:h-auto bg-white lg:rounded-2xl lg:border lg:border-[#e9e9eb] p-4 overflow-y-auto lg:overflow-visible">
                        {/* Mobile Header in Drawer */}
                        <div className="lg:hidden flex items-center justify-between mb-6 px-4">
                            <span className="font-bold text-lg">마이페이지 메뉴</span>
                            <button onClick={closeSidebar} className="text-[#535861]">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {/* MOBILE: Icon Grid Layout (< 768px) */}
                        <div className="lg:hidden grid grid-cols-2 gap-3 px-2">
                            <Link href="/dashboard" onClick={closeSidebar} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <i className="fas fa-house text-3xl mb-3 text-[#8a765e]"></i>
                                <span className="text-sm font-bold">마이페이지</span>
                            </Link>
                            <Link href="/dashboard/my_cases" onClick={closeSidebar} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/my_cases').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <i className="fas fa-briefcase text-3xl mb-3 text-[#8a765e]"></i>
                                <span className="text-sm font-bold">내 사건</span>
                            </Link>
                            <Link href="/dashboard/documents" onClick={closeSidebar} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/documents').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <i className="fas fa-file-lines text-3xl mb-3 text-[#8a765e]"></i>
                                <span className="text-sm font-bold">문서 관리</span>
                            </Link>
                            <Link href="/dashboard/calendar" onClick={closeSidebar} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/calendar').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <i className="fas fa-calendar text-3xl mb-3 text-[#8a765e]"></i>
                                <span className="text-sm font-bold">일정 관리</span>
                            </Link>
                            <Link href="/dashboard/chat" onClick={closeSidebar} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/chat').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <div className="relative">
                                    <i className="fas fa-comments text-3xl mb-3 text-[#8a765e]"></i>
                                    <span className="absolute -top-1 -right-2 bg-[#8a765e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">2</span>
                                </div>
                                <span className="text-sm font-bold">상담 채팅</span>
                            </Link>
                            <Link href="/dashboard/notifications" onClick={closeSidebar} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/notifications').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <div className="relative">
                                    <i className="fas fa-bell text-3xl mb-3 text-[#8a765e]"></i>
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">3</span>
                                </div>
                                <span className="text-sm font-bold">알림</span>
                            </Link>
                            <Link href="/dashboard/billing" onClick={closeSidebar} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/billing').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <i className="fas fa-credit-card text-3xl mb-3 text-[#8a765e]"></i>
                                <span className="text-sm font-bold">결제 관리</span>
                            </Link>
                            <Link href="/dashboard/profile" onClick={closeSidebar} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-sm ${isActive('/dashboard/profile').includes('bg-[#8a765e]') ? 'border-[#8a765e] bg-[#fdfcfb] text-[#8a765e]' : 'border-[#e9e9eb] bg-white text-[#535861]'}`}>
                                <i className="fas fa-user text-3xl mb-3 text-[#8a765e]"></i>
                                <span className="text-sm font-bold">프로필</span>
                            </Link>
                        </div>

                        {/* DESKTOP: Original Text List Layout (>= 768px) */}
                        <div className="hidden lg:block space-y-2">
                            <Link href="/dashboard" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard')}`}>
                                <i className="fas fa-house mr-3 w-5 text-center"></i>
                                마이페이지
                            </Link>
                            <Link href="/dashboard/my_cases" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/my_cases')}`}>
                                <i className="fas fa-briefcase mr-3 w-5 text-center"></i>
                                내 사건
                            </Link>
                            <Link href="/dashboard/documents" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/documents')}`}>
                                <i className="fas fa-file-lines mr-3 w-5 text-center"></i>
                                문서 관리
                            </Link>
                            <Link href="/dashboard/calendar" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/calendar')}`}>
                                <i className="fas fa-calendar mr-3 w-5 text-center"></i>
                                일정 관리
                            </Link>
                            <Link href="/dashboard/chat" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/chat')}`}>
                                <i className="fas fa-comments mr-3 w-5 text-center"></i>
                                상담 채팅
                                <span className="ml-auto bg-[#8a765e] text-white text-xs rounded-full px-2 py-1">2</span>
                            </Link>
                            <Link href="/dashboard/notifications" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/notifications')}`}>
                                <i className="fas fa-bell mr-3 w-5 text-center"></i>
                                알림
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                            </Link>
                            <Link href="/dashboard/billing" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/billing')}`}>
                                <i className="fas fa-credit-card mr-3 w-5 text-center"></i>
                                결제 관리
                            </Link>
                            <div className="border-t border-[#e9e9eb] my-4"></div>
                            <Link href="/dashboard/profile" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/profile')}`}>
                                <i className="fas fa-user mr-3 w-5 text-center"></i>
                                프로필 설정
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 w-full min-w-0">
                    {children}
                </div>
            </div>
        </main>
    );
}

