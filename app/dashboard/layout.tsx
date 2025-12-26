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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#181d27]">대시보드</h2>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-[#535861] hover:text-[#74634e] bg-white border border-[#e9e9eb] rounded-lg shadow-sm"
                >
                    <i className="fas fa-bars"></i>
                    <span className="ml-2 text-sm font-medium">메뉴</span>
                </button>
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
                            <span className="font-bold text-lg">메뉴</span>
                            <button onClick={closeSidebar} className="text-[#535861]">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <Link href="/dashboard" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard')}`}>
                                <i className="fas fa-house mr-3 w-5 text-center"></i>
                                대시보드
                            </Link>
                            <Link href="/dashboard/my_cases" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/my_cases')}`}>
                                <i className="fas fa-briefcase mr-3 w-5 text-center"></i>
                                내 사건
                            </Link>
                            <Link href="/dashboard/documents" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/documents')}`}>
                                <i className="fas fa-file-lines mr-3 w-5 text-center"></i>
                                문서 관리
                            </Link>
                            <Link href="/dashboard/calendar" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/calendar')}`}>
                                <i className="fas fa-calendar mr-3 w-5 text-center"></i>
                                일정 관리
                            </Link>
                            <Link href="/dashboard/chat" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/chat')}`}>
                                <i className="fas fa-comments mr-3 w-5 text-center"></i>
                                상담 채팅
                                <span className="ml-auto bg-[#8a765e] text-white text-xs rounded-full px-2 py-1">2</span>
                            </Link>
                            <Link href="/dashboard/notifications" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/notifications')}`}>
                                <i className="fas fa-bell mr-3 w-5 text-center"></i>
                                알림
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                            </Link>
                            <Link href="/dashboard/billing" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/billing')}`}>
                                <i className="fas fa-credit-card mr-3 w-5 text-center"></i>
                                결제 관리
                            </Link>
                            <div className="border-t border-[#e9e9eb] my-4"></div>
                            <Link href="/dashboard/profile" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/profile')}`}>
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

