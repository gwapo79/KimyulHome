'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'bg-[#8a765e] text-white font-medium' : 'hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors';
    };

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="bg-white rounded-2xl border border-[#e9e9eb] p-4">
                            <div className="space-y-2">
                                <Link href="/dashboard" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard')}`}>
                                    <i className="fas fa-house mr-3"></i>
                                    대시보드
                                </Link>
                                <Link href="/dashboard/my_cases" className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${isActive('/dashboard/my_cases')}`}>
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
                        {children}
                    </div>
                </div>
            </main>

        </>
    );
}
