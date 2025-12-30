
'use client';

import { useState, useEffect, use } from 'react';
import {
    User, Mail, Phone, Calendar, Clock, MapPin, Monitor,
    MessageSquare, Briefcase, FileText, Activity, AlertCircle,
    MoreHorizontal, ArrowRight, Shield, Zap
} from 'lucide-react';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';


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
    const { id } = use(params); // Next.js 15+ way to unwrap params

    const [data, setData] = useState<DashboardData | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [error, setError] = useState<string | null>(null);

    // Initial Fetch (Update)
    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true); // Ensure loading is reset if id changes
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
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
        fetchTimeline(1, true);
    }, [id]);

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
        if (!id) return;


        // console.log("🔌 Connecting to Realtime Channel for User:", id);

        const channel = supabase
            .channel(`crm-user-${id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ChatMessage' },
                (payload: any) => {
                    // console.log("🔔 Realtime Update:", payload);
                    fetchTimeline(1, true);
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Case' },
                () => {
                    fetchTimeline(1, true);
                    // Refresh Dashboard stats too
                    // Note: Dashboard refresh is less critical for realtime but could be added if extracted
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // console.log('✅ Realtime Subscribed');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const handleLoadMore = () => {
        if (!timelineLoading && hasMore) {
            fetchTimeline(page + 1);
        }
    };

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
                <p className="text-sm">삭제되었거나 존재하지 않는 회원입니다.</p>
                <Link href="/admin/users" className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">목록으로 돌아가기</Link>
            </div>
        );
    }

    // Non-blocking loading/error states are handled within the UI or via overlays
    // if (loading) return ... (We can keep loading but user requested defensive rendering. Let's keep loading for now but ensure it finishes)
    // Removed: if (!data) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 -m-6">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* --- Left Column: Profile (Fixed-ish) --- */}
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

                {/* --- Center Column: Timeline (Scrollable) --- */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Unified Timeline</h2>
                        <button onClick={() => fetchTimeline(1, true)} className="text-sm text-[#8a765e] hover:underline">Refresh</button>
                    </div>

                    <div className="space-y-4">
                        {timeline.map((item) => {
                            const date = new Date(item.createdAt);
                            let Icon = Activity;
                            let bgColor = 'bg-slate-100';
                            let iconColor = 'text-slate-500';

                            if (item.type === 'CASE') {
                                Icon = Briefcase;
                                bgColor = 'bg-blue-100';
                                iconColor = 'text-blue-600';
                            } else if (item.type === 'CONSULTATION') {
                                Icon = FileText;
                                bgColor = 'bg-purple-100';
                                iconColor = 'text-purple-600';
                            } else if (item.type === 'CHAT') {
                                Icon = MessageSquare;
                                bgColor = 'bg-yellow-100';
                                iconColor = 'text-yellow-600';
                            }

                            return (
                                <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative pl-16">
                                    <div className={`absolute left-4 top-5 w-8 h-8 ${bgColor} rounded-full flex items-center justify-center ${iconColor}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
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

                        {timelineLoading && (
                            <div className="p-4 text-center text-slate-400 text-sm">Loading more history...</div>
                        )}

                        {!timelineLoading && hasMore && (
                            <button
                                onClick={handleLoadMore}
                                className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Load More History
                            </button>
                        )}

                        {!hasMore && timeline.length > 0 && (
                            <div className="p-4 text-center text-slate-400 text-xs">End of History</div>
                        )}
                        {!hasMore && timeline.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-6 h-6 text-slate-300" />
                                </div>
                                <h3 className="text-sm font-medium text-slate-600 mb-1">아직 활동 내역이 없습니다.</h3>
                                <p className="text-xs text-slate-400">첫 상담을 시작하거나 메모를 남겨보세요!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Right Column: Quick Actions & Recent Cases --- */}
                <div className="lg:col-span-3 space-y-6 sticky top-6">
                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#8a765e] text-white hover:bg-[#74634e] transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium">Start Chat</span>
                            </button>
                            <button onClick={() => fetchTimeline(1, true)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
                                <Activity className="w-4 h-4" />
                                <span className="text-sm font-medium">새로고침</span>
                            </button>

                            {/* System Diagnostics */}
                            <button
                                onClick={async () => {
                                    const btn = document.getElementById('btn-sys-diag') as HTMLButtonElement;
                                    if (btn) btn.innerText = '진단 중...';
                                    try {
                                        const res = await fetch('/api/admin/system/diagnose', { credentials: 'include' });
                                        const json = await res.json();
                                        alert(`[System Health]\n\nDB Connection: ${json.checks?.database?.status} (${json.checks?.database?.latency}ms)\nSupabase Key: ${json.checks?.env?.supabaseKey ? 'OK' : 'MISSING'}\nSupabase URL: ${json.checks?.env?.supabaseUrl ? 'OK' : 'MISSING'}\nJWT Secret: ${json.checks?.env?.jwtSecret ? 'OK' : 'MISSING'}`);
                                    } catch (e) {
                                        alert('Diagnosis Failed: ' + e);
                                    } finally {
                                        if (btn) btn.innerText = '시스템 진단';
                                    }
                                }}
                                id="btn-sys-diag"
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                            >
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">시스템 진단</span>
                            </button>

                            {/* Debug/Demo Action */}
                            <button
                                onClick={async () => {
                                    if (!confirm('가짜 상담, 사건 데이터를 생성하시겠습니까?')) return;

                                    const MAX_RETRIES = 3;
                                    let attempt = 0;
                                    let success = false;

                                    while (attempt < MAX_RETRIES && !success) {
                                        attempt++;
                                        try {
                                            const res = await fetch(`/api/admin/users/${id}/seed`, { method: 'POST', credentials: 'include' });
                                            if (res.ok) {
                                                success = true;
                                                alert(`데이터 생성 완료! (시도: ${attempt})`);
                                                fetchTimeline(1, true);
                                                window.location.reload();
                                            } else {
                                                if (attempt === MAX_RETRIES) alert('생성 실패 (Server Error)');
                                            }
                                        } catch (e) {
                                            console.warn(`Attempt ${attempt} failed:`, e);
                                            if (attempt === MAX_RETRIES) alert('에러 발생: 연결 상태를 확인해주세요.');
                                            await new Promise(r => setTimeout(r, 1000)); // Wait 1s
                                        }
                                    }
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                            >
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">[Dev] 테스트 데이터 생성</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Cases Mini List */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Cases</h3>
                            <Link href="#" className="text-xs text-[#8a765e] hover:underline">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {data?.recentCases && data.recentCases.length > 0 ? data.recentCases.map(c => (
                                <div key={c.id} className="group cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-medium text-slate-800 group-hover:text-[#8a765e] transition-colors line-clamp-2">{c.title}</h4>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-slate-500">{new Date(c.updatedAt).toLocaleDateString()}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                            {c.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-sm text-slate-400 italic text-center py-4">등록된 사건이 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
