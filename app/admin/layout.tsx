
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scale, Users, FileText, Settings, LogOut, MessageSquare, Phone, BarChart3, Clock, Lock } from 'lucide-react';
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
    const [userRole, setUserRole] = useState<string>("LOADING"); // CEO, LAWYER, STAFF, DEV, USER

    useEffect(() => {
        // Load Role
        const fetchRole = async () => {
            // Fetch from our API
            try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data?.user?.role) {
                        setUserRole(data.user.role);
                    } else {
                        setUserRole("USER");
                    }
                } else {
                    // Fallback or redirect
                    setUserRole("USER");
                }
            } catch (e) {
                setUserRole("USER");
            }
        };

        // Load recent users
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

        fetchRole();
        loadRecent();

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

    // Menu Visibility Logic
    const canSeeManagement = ['SUPER_ADMIN', 'CEO'].includes(userRole);

    const canSeeDev = ['SUPER_ADMIN', 'DEV'].includes(userRole);
    const canSeeSettings = ['SUPER_ADMIN', 'CEO', 'DEV'].includes(userRole);

    // Core workers (Lawyer/Staff/CEO/Dev can all see cases/content)
    const isWorker = ['SUPER_ADMIN', 'CEO', 'LAWYER', 'STAFF', 'DEV'].includes(userRole);

    const getLinkClass = (href: string) => {
        const isActive = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href);

        return isActive
            ? "flex items-center gap-3 px-4 py-3 rounded-lg text-amber-200 bg-amber-900/20 transition-all font-medium"
            : "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all";
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#181d27] text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                        <Scale className="w-6 h-6" /> 서초지율 Admin
                    </h1>
                    <div className='mt-2 text-xs text-slate-500 font-mono border border-slate-700 rounded px-2 py-1 inline-block'>
                        Role: {userRole}
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#8a765e] hover:text-white transition-all">
                        <Home className="w-5 h-5" /> 대시보드
                    </Link>



                    {isWorker && (
                        <Link href="/admin/cases" className={getLinkClass("/admin/cases")}>
                            <Scale className="w-5 h-5" /> 사건 관리
                        </Link>
                    )}



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
                    <Link href="/admin/consultations" className={getLinkClass("/admin/consultations")}>
                        <Phone className="w-5 h-5" /> 상담 신청 관리
                    </Link>
                    <Link href="/admin/chat" className={getLinkClass("/admin/chat")}>
                        <MessageSquare className="w-5 h-5" /> 채팅 상담
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        콘텐츠 관리
                    </div>
                    <Link href="/admin/blog" className={getLinkClass("/admin/blog")}>
                        <FileText className="w-5 h-5" /> 블로그 관리
                    </Link>
                    <Link href="/admin/success" className={getLinkClass("/admin/success")}>
                        <Scale className="w-5 h-5" /> 성공사례 관리
                    </Link>
                    <Link href="/admin/reviews" className={getLinkClass("/admin/reviews")}>
                        <MessageSquare className="w-5 h-5" /> 후기 관리
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        시스템
                    </div>
                    {canSeeSettings && (
                        <>
                            <Link href="/admin/users" className={getLinkClass("/admin/users")}>
                                <Users className="w-5 h-5" /> 일반 회원 (Clients)
                            </Link>
                            <Link href="/admin/team" className={getLinkClass("/admin/team")}>
                                <Users className="w-5 h-5" /> 구성원 관리 (Team)
                            </Link>
                            <Link href="/admin/settings" className={getLinkClass("/admin/settings")}>
                                <Settings className="w-5 h-5" /> 설정
                            </Link>
                        </>
                    )}

                    {canSeeDev && (
                        <Link href="/admin/dev" className={getLinkClass("/admin/dev")}>
                            <Lock className="w-5 h-5" /> 시스템 로그 (DEV)
                        </Link>
                    )}

                    {/* Management Section - Ceo Reports Group */}
                    {canSeeManagement && (
                        <>
                            <div className="my-2 mx-4 border-t border-slate-700"></div>
                            <div className="pt-2 pb-2 px-4 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                                CEO 전용 리포트
                            </div>
                            <Link href="/admin/management" className={getLinkClass("/admin/management")}>
                                <BarChart3 className="w-5 h-5" /> 경영 지표 (CEO)
                            </Link>
                            <Link href="/admin/stats" className={getLinkClass("/admin/stats")}>
                                <BarChart3 className="w-5 h-5" /> 통계 및 리포트
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-700 space-y-2">
                    <Link href="/admin/dev-login" className="flex items-center gap-3 px-4 py-2 text-sm text-amber-500 hover:text-amber-400 transition-colors">
                        <Users className="w-4 h-4" /> 사용자 전환 (Test)
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <Home className="w-4 h-4" /> 사이트로 돌아가기
                    </Link>
                    <button
                        onClick={async () => {
                            try {
                                await fetch('/api/auth/logout', { method: 'POST' });
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            } catch (error) {
                                console.error('Logout failed:', error);
                                window.location.href = '/login';
                            }
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" /> 로그아웃
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {userRole === 'CEO' ? '최고 관리자 모드 (CEO)' : '실무자 모드'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#8a765e] flex items-center justify-center text-white text-sm font-bold">
                            {userRole.substring(0, 1)}
                        </div>
                        <span className="text-sm text-slate-600">{userRole}</span>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

