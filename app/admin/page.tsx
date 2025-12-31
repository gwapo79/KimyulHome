"use client";

import { MOCK_STATS } from '@/data/mock_stats';
import {
    TrendingUp, TrendingDown, Users, Scale, DollarSign,
    ArrowRight, Calendar, Bell, ChevronRight, Activity, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [userRole, setUserRole] = useState<string>("LOADING");

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserRole(data.role || "USER");
                } else {
                    setUserRole("USER");
                }
            } catch (e) {
                setUserRole("USER");
            }
        };
        fetchRole();
    }, []);

    const { kpi, monthlyTrends, recentActivity } = MOCK_STATS;
    const maxRevenue = Math.max(...monthlyTrends.map(m => m.revenue));

    if (userRole === "LOADING") {
        return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
    }

    const isCEO = userRole === 'CEO';

    // --- WORKER DASHBOARD (Lawyer/Staff) ---
    if (!isCEO && userRole !== 'DEV') {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">나의 업무 대시보드</h2>
                        <p className="text-slate-500 text-sm mt-1">안녕하세요, {userRole}님. 오늘 처리해야 할 업무입니다.</p>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{new Date().toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Task Card 1: Consultations */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" /> 미답변 상담
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-amber-50 rounded border border-amber-100">
                                <p className="text-sm font-semibold text-slate-800">이지은님의 이혼 상담 문의</p>
                                <p className="text-xs text-slate-500 mt-1">20분 전 접수됨</p>
                                <Link href="/admin/consultations" className="text-xs text-blue-600 mt-2 block hover:underline">답변하기 &rarr;</Link>
                            </div>
                            <div className="p-3 bg-amber-50 rounded border border-amber-100">
                                <p className="text-sm font-semibold text-slate-800">김철수님의 부동산 등기 문의</p>
                                <p className="text-xs text-slate-500 mt-1">1시간 전 접수됨</p>
                                <Link href="/admin/consultations" className="text-xs text-blue-600 mt-2 block hover:underline">답변하기 &rarr;</Link>
                            </div>
                        </div>
                    </div>

                    {/* Task Card 2: Assigned Cases */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-blue-500" /> 내 사건 (진행중)
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-slate-50 last:border-0">
                                <span className="text-sm text-slate-700">2024가합1023 (채무부존재)</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">변론기일</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-slate-50 last:border-0">
                                <span className="text-sm text-slate-700">2023나2394 (손해배상)</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">서면제출</span>
                            </div>
                        </div>
                        <Link href="/admin/cases" className="text-center block w-full mt-4 py-2 bg-slate-50 text-slate-600 text-sm rounded hover:bg-slate-100 transition-colors">
                            전체 사건 보기
                        </Link>
                    </div>

                    {/* Task Card 3: Notice */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-slate-400" /> 법인 공지사항
                        </h3>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                            <li>이번 주 금요일 전체 회식 안내</li>
                            <li>서초동 법원 하계 휴정기 일정 공유</li>
                            <li>새로운 성공사례 작성 가이드라인 배포</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // --- CEO DASHBOARD ---
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">경영 대시보드 (CEO)</h2>
                    <p className="text-slate-500 text-sm mt-1">오늘의 주요 경영 지표와 현황 리포트</p>
                </div>
                <p className="text-xs text-slate-400 font-mono">Role: CEO</p>
            </div>

            {/* Section 1: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-[#fffbf0] rounded-lg">
                            <DollarSign className="w-5 h-5 text-[#8a765e]" />
                        </div>
                        <span className={`flex items-center text-xs font-bold ${kpi.revenue.delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {kpi.revenue.delta >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(kpi.revenue.delta)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{kpi.revenue.label}</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                            {kpi.revenue.prefix}{kpi.revenue.value.toLocaleString()}
                        </h3>
                    </div>
                </div>

                {/* Consultations */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className={`flex items-center text-xs font-bold ${kpi.consultations.delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {kpi.consultations.delta >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(kpi.consultations.delta)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{kpi.consultations.label}</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                            {kpi.consultations.value}건
                        </h3>
                    </div>
                </div>

                {/* Active Cases */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Scale className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className={`flex items-center text-xs font-bold ${kpi.activeCases.delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {kpi.activeCases.delta >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(kpi.activeCases.delta)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{kpi.activeCases.label}</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                            {kpi.activeCases.value}건
                        </h3>
                    </div>
                </div>

                {/* Win Rate */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Activity className="w-5 h-5 text-green-600" />
                        </div>
                        <span className={`flex items-center text-xs font-bold ${kpi.winRate.delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {kpi.winRate.delta >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(kpi.winRate.delta)}%pp
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{kpi.winRate.label}</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                            {kpi.winRate.value}%
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section 2: Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">최근 6개월 매출 및 상담 추이</h3>
                        <Link href="/admin/stats" className="text-xs text-[#8a765e] font-bold hover:underline">
                            상세 리포트 보기 →
                        </Link>
                    </div>

                    {/* CSS Bar Chart Container */}
                    <div className="h-64 flex items-end justify-between gap-4 pt-10 pb-2 px-2">
                        {monthlyTrends.map((data, index) => {
                            const heightPercent = Math.max(10, (data.revenue / maxRevenue) * 100);
                            return (
                                <div key={index} className="flex flex-col items-center gap-2 group w-full">
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-12 bg-slate-800 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                                        매출: {data.revenue.toLocaleString()}원 / 상담: {data.consultations}건
                                    </div>

                                    {/* The Bar */}
                                    <div
                                        className="w-full max-w-[40px] bg-slate-100 rounded-t-lg relative group-hover:bg-slate-200 transition-colors"
                                        style={{ height: '100%' }}
                                    >
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-[#8a765e] rounded-t-lg transition-all duration-500 ease-out group-hover:bg-[#75644e]"
                                            style={{ height: `${heightPercent}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">{data.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 3: Recent Activity & Quick Actions */}
                <div className="space-y-6">
                    {/* Activity Feed */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-slate-500" /> 긴급 브리핑 / 활동
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.map((log) => (
                                <div key={log.id} className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-[#8a765e] flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-800 font-medium leading-tight">
                                            {log.user}님이 <span className="text-[#8a765e]">{log.action}</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{log.target}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#181d27] p-6 rounded-xl text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-4">빠른 실행 (Quick Actions)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/admin/cases/new" className="bg-[#2a3241] hover:bg-[#3a4458] p-3 rounded-lg text-center transition-colors">
                                <Scale className="w-6 h-6 mx-auto mb-2 text-[#d4af37]" />
                                <span className="text-xs font-medium">사건 등록</span>
                            </Link>
                            <Link href="/admin/consultations" className="bg-[#2a3241] hover:bg-[#3a4458] p-3 rounded-lg text-center transition-colors">
                                <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                <span className="text-xs font-medium">상담 관리</span>
                            </Link>
                            <Link href="/admin/chat" className="bg-[#2a3241] hover:bg-[#3a4458] p-3 rounded-lg text-center transition-colors">
                                <Activity className="w-6 h-6 mx-auto mb-2 text-green-400" />
                                <span className="text-xs font-medium">채팅 상담</span>
                            </Link>
                            <Link href="/admin/stats" className="bg-[#2a3241] hover:bg-[#3a4458] p-3 rounded-lg text-center transition-colors">
                                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                                <span className="text-xs font-medium">통계 분석</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
