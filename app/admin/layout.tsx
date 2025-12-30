
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scale, Users, FileText, Settings, LogOut, MessageSquare, Phone, BarChart3, Clock } from 'lucide-react';
import GlobalSearch from '@/components/admin/GlobalSearch';
import { useEffect, useState } from 'react';

interface RecentUser {
    id: string;
    name: string;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

    useEffect(() => {
        // Function to load recent users
        const loadRecent = () => {
            try {
                const stored = localStorage.getItem('crm_recent_users');
                if (stored) {
                    setRecentUsers(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to parse recent users", e);
            }
        };

        loadRecent();

        // Listen for custom event or storage event to auto-update
        // Note: storage event only works across tabs. For same-tab, we can dispatch a custom event.
        const handleCustomUpdate = () => loadRecent();
        window.addEventListener('crm-recent-update', handleCustomUpdate);

        return () => {
            window.removeEventListener('crm-recent-update', handleCustomUpdate);
        };
    }, []);

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#181d27] text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                        <Scale className="w-6 h-6" /> 서초지율 Admin
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Home className="w-5 h-5" /> 대시보드
                    </Link>
                    <Link href="/admin/cases" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Scale className="w-5 h-5" /> 사건 관리
                    </Link>
                    <Link href="/admin/stats" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <BarChart3 className="w-5 h-5" /> 통계 및 리포트
                    </Link>

                    {/* Recent Customers Sidebar */}
                    {recentUsers.length > 0 && (
                        <>
                            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-3 h-3" /> 최근 본 고객
                            </div>
                            <div className="space-y-1 px-4">
                                {recentUsers.slice(0, 5).map(user => (
                                    <Link
                                        key={user.id}
                                        href={`/admin/users/${user.id}`}
                                        className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors truncate"
                                    >
                                        {user.name}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        고객 소통 (CRM)
                    </div>
                    <Link href="/admin/consultations" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Phone className="w-5 h-5" /> 상담 신청 관리
                    </Link>
                    <Link href="/admin/chat" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <MessageSquare className="w-5 h-5" /> 채팅 상담
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        콘텐츠 관리
                    </div>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <FileText className="w-5 h-5" /> 블로그 관리
                    </Link>
                    <Link href="/admin/success" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Scale className="w-5 h-5" /> 성공사례 관리
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <MessageSquare className="w-5 h-5" /> 후기 관리
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        시스템
                    </div>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Users className="w-5 h-5" /> 일반 회원 (Clients)
                    </Link>
                    <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Users className="w-5 h-5" /> 구성원 관리 (Team)
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Settings className="w-5 h-5" /> 설정
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" /> 사이트로 돌아가기
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">관리자 모드</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#8a765e] flex items-center justify-center text-white text-sm font-bold">
                            A
                        </div>
                        <span className="text-sm text-slate-600">Super Admin</span>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
