"use client";

import { useEffect, useState } from 'react';
import { LayoutDashboard, DollarSign, Briefcase, MessageSquare, AlertTriangle, Activity, Server, ShieldCheck } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
// Import separated components
import { FinanceCharts, ARAgingTable } from "@/app/components/dashboard/FinanceZone";
import { RiskScanner, WorkloadHeatmap } from "@/app/components/dashboard/OpsZone";
import { SourceChart, FunnelChart, TopContentList, KeywordChart } from "@/app/components/dashboard/CustomerCharts";
import SystemZone from "@/app/components/dashboard/SystemZone";

interface DashboardData {
    finance: {
        revenue: { today: number; yesterday: number; thisMonth: number; lastMonth: number; nextMonthPipeline: number };
        chart: { date: string; revenue: number; prevRevenue: number }[];
        arAging: { id: string; client: string; lawyer: string; amount: number; daysOverdue: number; status: string; date: string }[];
        profit: { revenue: number; expenses: number; net: number; bepRate: string };
    };
    marketing: {
        metrics: { visits: number; consults: number; conversion: string };
        freshness: { hours: number; lastTitle: string };
        attribution: { title: string; conversion: number }[];
        analytics: {
            sources: { name: string; value: number; fill: string }[];
            funnel: { stage: string; value: number; fill: string }[];
            topContent: { rank: number; title: string; time: string; category: string }[];
            keywords: { keyword: string; count: number }[];
        };
    };
    ops: {
        risks: {
            schedule: { id: string; title: string; case: string; date: string }[];
            unassigned: { id: string; title: string; status: string; createdAt: string }[];
        };
        workload: { id: string; name: string; position: string; count: number; score: number }[];
    };
    live: {
        consultStats: Record<string, number>;
        systemLogs: {
            id: string;
            time: string;
            level: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
            message: string;
            raw: string;
            user: string;
        }[];
        systemProgress: number;
    };
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard/main');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <Skeleton className="h-10 w-full mb-6" />
            <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" />
            </div>
            <div className="grid grid-cols-3 gap-4 h-64">
                <Skeleton className="col-span-2 h-full" /><Skeleton className="h-full" />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-screen font-sans max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-indigo-700" />
                        Law-OS <span className="text-slate-400 font-light">Control Tower</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">통합 관리 대시보드 (One-Page View)</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <Activity className="w-3 h-3 mr-1" />
                        운영 정상
                    </span>
                    <span className="text-xs text-slate-400 font-mono">업데이트: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Zone 1: Summary Cards (핵심 지표) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">이번 달 매출</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">₩{data?.finance?.revenue?.thisMonth?.toLocaleString() ?? '0'}</h3>
                            </div>
                            <div className="bg-emerald-100 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
                        </div>
                    </CardHeader>
                </Card>
                <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">일일 방문자</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{data?.marketing?.metrics?.visits?.toLocaleString() ?? '0'}</h3>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg"><Server className="w-5 h-5 text-blue-600" /></div>
                        </div>
                    </CardHeader>
                </Card>
                <Card className="border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">진행 사건</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{data?.ops?.workload?.reduce((a, b) => a + b.count, 0) ?? 0}건</h3>
                            </div>
                            <div className="bg-indigo-100 p-2 rounded-lg"><Briefcase className="w-5 h-5 text-indigo-600" /></div>
                        </div>
                    </CardHeader>
                </Card>
                <Card className={`border-l-4 shadow-sm hover:shadow-md transition-all ${(data?.ops?.risks?.unassigned?.length ?? 0) > 0 ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}>
                    <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-wider ${(data?.ops?.risks?.unassigned?.length ?? 0) > 0 ? 'text-red-900' : 'text-slate-500'}`}>긴급 리스크</p>
                                <h3 className={`text-2xl font-bold mt-1 ${(data?.ops?.risks?.unassigned?.length ?? 0) > 0 ? 'text-red-700' : 'text-slate-900'}`}>{data?.ops?.risks?.unassigned?.length ?? 0}건</h3>
                            </div>
                            <div className={`${(data?.ops?.risks?.unassigned?.length ?? 0) > 0 ? 'bg-white' : 'bg-slate-100'} p-2 rounded-lg`}>
                                <AlertTriangle className={`w-5 h-5 ${(data?.ops?.risks?.unassigned?.length ?? 0) > 0 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Zone 2: Financial & Operational (경영 지표) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Financial Charts (2 cols) */}
                <div className="lg:col-span-2">
                    {data?.finance && <FinanceCharts data={data.finance} />}
                </div>
                {/* Right: Workload Heatmap (1 col) */}
                <div className="lg:col-span-1 h-full">
                    {data?.ops && <WorkloadHeatmap data={data.ops} />}
                </div>
            </div>

            {/* Zone 3: Marketing & Visitor Analysis (마케팅 인사이트) - 2x2 Grid */}
            <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-600" />
                    마케팅 인사이트 & 방문자 분석 (Customer Intelligence)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. 유입 경로 */}
                    {data?.marketing && <SourceChart data={data.marketing} />}
                    {/* 2. 행동 흐름 */}
                    {data?.marketing && <FunnelChart data={data.marketing} />}
                    {/* 3. 인기 콘텐츠 */}
                    {data?.marketing && <TopContentList data={data.marketing} />}
                    {/* 4. 상담 키워드 */}
                    {data?.marketing && <KeywordChart data={data.marketing} />}
                </div>
            </div>

            {/* Zone 4: System Timeline (보안) */}
            <div className="w-full">
                {data?.live?.systemLogs && <SystemZone logs={data.live.systemLogs} />}
            </div>

            {/* Zone 5: Management Tables (리스트) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: AR Aging (2 cols) */}
                <div className="lg:col-span-2">
                    {data?.finance && <ARAgingTable data={data.finance} />}
                </div>
                {/* Right: Risk/Unassigned List (1 col) */}
                <div className="lg:col-span-1">
                    {data?.ops && <RiskScanner data={data.ops} />}
                </div>
            </div>
        </div>
    );
}
