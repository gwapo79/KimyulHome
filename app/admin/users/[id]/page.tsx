
'use client';

import { useState, useEffect, use } from 'react';
import {
    User, Mail, Phone, Calendar, Clock, MapPin, Monitor,
    MessageSquare, Briefcase, FileText, Activity, AlertCircle,
    MoreHorizontal, ArrowRight, Shield, Zap, RefreshCw, Stethoscope, Database
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';
import { diagnoseUserAction, seedUserDataAction } from '@/app/actions/admin';

// Simple Toast Helper (since no library is installed)
const toast = {
    info: (msg: string) => alert(`[INFO] ${msg}`),
    success: (msg: string) => alert(`[SUCCESS] ${msg}`),
    error: (msg: string) => alert(`[ERROR] ${msg}`)
};

interface DashboardData {
    profile: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        status: string;
        joinedAt: string;
        provider: string;
        role: string;
    };
    stats: {
        totalCases: number;
        totalConsultations: number;
        activeCases: number;
    };
    recentActivity: {
        lastLogin: string;
        lastIp: string;
        device: string;
    };
    recentCases: Array<{
        id: string;
        title: string;
        status: string;
        updatedAt: string;
    }>;
}

interface TimelineItem {
    id: string;
    type: 'CASE' | 'CHAT' | 'CONSULTATION' | 'ACTIVITY';
    title: string;
    description: string;
    createdAt: string;
    metadata: any;
}

export default function UserDashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [data, setData] = useState<DashboardData | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [filter, setFilter] = useState<'ALL' | 'CORE' | 'COMM' | 'SYS'>('ALL');

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    const fetchDashboard = async () => {
        // Don't set global loading on refresh, only initial
        setError(null);
        try {
            const res = await fetch(`/api/admin/users/${id}/dashboard`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else if (res.status === 404) {
                setError('User Not Found');
            } else {
                setError('Failed to load user data');
            }
        } catch (error) {
            console.error("Dashboard Load Error:", error);
            setError('Network error');
        }
    };

    const fetchTimeline = async (pageNum: number, reset = false) => {
        setTimelineLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id}/timeline?page=${pageNum}&limit=10`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                if (reset) {
                    setTimeline(json.data);
                } else {
                    setTimeline(prev => [...prev, ...json.data]);
                }
                setHasMore(json.meta.hasMore);
                setPage(pageNum);
            }
        } catch (error) {
            console.error("Timeline Load Error:", error);
        } finally {
            setTimelineLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchDashboard();
            await fetchTimeline(1, true);
            setLoading(false);
        };
        init();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const channel = supabase
            .channel(`crm-user-${id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ChatMessage' }, () => fetchTimeline(1, true))
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Case' }, () => fetchTimeline(1, true))
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [id]);

    const handleLoadMore = () => {
        if (!timelineLoading && hasMore) {
            fetchTimeline(page + 1);
        }
    };

    // --- Quick Actions ---

    const handleRefresh = async () => {
        setIsRefreshing(true);
        router.refresh(); // Refresh Server Components
        await fetchDashboard(); // Refetch Client Data
        await fetchTimeline(1, true);
        setTimeout(() => setIsRefreshing(false), 800); // Min spin time
    };

    const handleStartChat = () => {
        router.push(`/admin/chat?targetUserId=${id}`);
    };

    const handleDiagnosis = async () => {
        const res = await diagnoseUserAction(id);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    const handleSeedData = async () => {
        if (!confirm('경고: 테스트 데이터를 대량으로 생성합니다. 진행하시겠습니까?')) return;

        const res = await seedUserDataAction(id);
        if (res.success) {
            toast.success('테스트 데이터가 생성되었습니다.');
            handleRefresh();
        } else {
            toast.error(res.message);
        }
    };

    // Filter Logic
    const filteredTimeline = timeline.filter(item => {
        if (filter === 'ALL') return true;
        if (filter === 'CORE') return item.type === 'CASE' || item.type === 'CONSULTATION';
        if (filter === 'COMM') return item.type === 'CHAT';
        if (filter === 'SYS') return item.type === 'ACTIVITY';
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
                <div className="flex gap-2 mb-2"><Activity className="animate-spin w-5 h-5 text-[#8a765e]" /> 정보 불러오는 중...</div>
            </div>
        );
    }

    if (error === 'User Not Found') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
                <AlertCircle className="w-10 h-10 mb-3 text-red-300" />
                <h3 className="text-lg font-bold text-slate-700">회원을 찾을 수 없습니다.</h3>
                <Link href="/admin/users" className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">목록으로 돌아가기</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 -m-6">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* --- Left Column: Profile --- */}
                <div className="lg:col-span-3 space-y-6 sticky top-6">
                    {/* User Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <User className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{data?.profile?.name || '정보 없는 사용자'}</h2>
                            <span className="text-xs text-slate-500 mt-1 uppercase tracking-wide border px-2 py-0.5 rounded-full">
                                {data?.profile?.role || '게스트'}
                            </span>

                            <div className="mt-6 w-full space-y-3 text-left">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate" title={data?.profile?.email}>{data?.profile?.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{data?.profile?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>Joined {data?.profile?.joinedAt ? new Date(data.profile.joinedAt).toLocaleDateString() : '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Shield className="w-4 h-4 text-slate-400" />
                                    <span className={data?.profile?.status === 'ACTIVE' ? 'text-green-600 font-medium' : 'text-red-500'}>
                                        {data?.profile?.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Activity Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-slate-800">{data?.stats?.totalCases ?? 0}</div>
                                <div className="text-xs text-slate-500 mt-1">Total Cases</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-slate-800">{data?.stats?.totalConsultations ?? 0}</div>
                                <div className="text-xs text-slate-500 mt-1">Consultations</div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Connection Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Monitor className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500">Device / OS</p>
                                    <p className="text-sm text-slate-800 font-medium">{data?.recentActivity?.device || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500">Last IP Address</p>
                                    <p className="text-sm text-slate-800 font-medium">{data?.recentActivity?.lastIp || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500">Last Login</p>
                                    <p className="text-sm text-slate-800 font-medium">{data?.recentActivity?.lastLogin ? new Date(data.recentActivity.lastLogin).toLocaleString() : '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Center Column: Timeline --- */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Unified Timeline</h2>
                        <button onClick={handleRefresh} className="text-sm text-[#8a765e] hover:underline flex items-center gap-1">
                            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setFilter('CORE')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'CORE' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            <span className="text-xs">⭐</span> 핵심 활동
                        </button>
                        <button
                            onClick={() => setFilter('COMM')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'COMM' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            <span className="text-xs">💬</span> 커뮤니케이션
                        </button>
                        <button
                            onClick={() => setFilter('SYS')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filter === 'SYS' ? 'bg-slate-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            <span className="text-xs">⚙️</span> 시스템/접속
                        </button>
                    </div>

                    <div className="space-y-4">
                        {filteredTimeline.map((item) => {
                            const date = new Date(item.createdAt);
                            let Icon = Activity;
                            let bgColor = 'bg-slate-100';
                            let iconColor = 'text-slate-500';
                            let borderColor = 'border-slate-200';

                            if (item.type === 'CASE') {
                                Icon = Shield;
                                bgColor = 'bg-violet-100';
                                iconColor = 'text-violet-600';
                                borderColor = 'border-violet-200';
                            } else if (item.type === 'CONSULTATION') {
                                Icon = Briefcase;
                                bgColor = 'bg-violet-100';
                                iconColor = 'text-violet-600';
                                borderColor = 'border-violet-200';
                            } else if (item.type === 'CHAT') {
                                Icon = MessageSquare;
                                bgColor = 'bg-green-100';
                                iconColor = 'text-green-600';
                                borderColor = 'border-green-200';
                            } else if (item.type === 'ACTIVITY') {
                                // Sub-types for Activity
                                if (item.title?.includes('LOGIN') || item.title?.includes('LOGOUT')) {
                                    Icon = Zap; // Or Lock
                                    bgColor = 'bg-slate-100';
                                    iconColor = 'text-slate-500';
                                } else if (item.title?.includes('VIEW_PAGE')) {
                                    Icon = Monitor;
                                    bgColor = 'bg-slate-50';
                                    iconColor = 'text-slate-400';
                                } else {
                                    Icon = Activity;
                                    bgColor = 'bg-blue-50';
                                    iconColor = 'text-blue-500';
                                }
                            }

                            return (
                                <div key={item.id} className={`bg-white p-5 rounded-xl border ${borderColor} shadow-sm relative pl-16 transition-all hover:shadow-md`}>
                                    <div className={`absolute left-4 top-5 w-8 h-8 ${bgColor} rounded-full flex items-center justify-center ${iconColor}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            {item.title}
                                            {(item.type === 'CASE' || item.type === 'CONSULTATION') && (
                                                <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[10px] rounded font-bold uppercase tracking-wide">CORE</span>
                                            )}
                                        </h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed text-pretty">
                                        {item.description}
                                    </p>
                                    {/* Quick Metadata Chips */}
                                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                                        <div className="mt-3 flex gap-2">
                                            {Object.entries(item.metadata).map(([k, v]) => (
                                                <span key={k} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 uppercase">
                                                    {k}: {String(v)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {!timelineLoading && filteredTimeline.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-6 h-6 text-slate-300" />
                                </div>
                                <h3 className="text-sm font-medium text-slate-600 mb-1">해당되는 활동 내역이 없습니다.</h3>
                                <p className="text-xs text-slate-400">필터 조건을 변경해보세요.</p>
                            </div>
                        )}

                        {!timelineLoading && hasMore && filter === 'ALL' && (
                            <button onClick={handleLoadMore} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                                Load More History
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Right Column: Quick Actions --- */}
                <div className="lg:col-span-3 space-y-6 sticky top-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleStartChat}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#8a765e] text-white hover:bg-[#74634e] transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium">Start Chat</span>
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium">새로고침</span>
                            </button>

                            <button
                                onClick={handleDiagnosis}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                            >
                                <Stethoscope className="w-4 h-4" />
                                <span className="text-sm font-medium">시스템 진단</span>
                            </button>

                            <button
                                onClick={handleSeedData}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                            >
                                <Database className="w-4 h-4" />
                                <span className="text-sm font-medium">[Dev] 테스트 데이터 생성</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Add these icons to imports if missing: RefreshCw, Stethoscope, Database
