
"use client";

import { useState, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';
import { BarChart3, PieChart, Users, DollarSign, Download, ChevronDown, ChevronUp, TrendingUp, TrendingDown, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import StatsChart from '@/app/components/admin/StatsChart';

export default function StatisticsPage() {
    // 1. Data State
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'REVENUE' | 'MARKETING' | 'PERFORMANCE'>('REVENUE');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    // 2. Fetch Data
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Reuse Dashboard API for consistency
                const res = await fetch('/api/admin/dashboard/main', { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    setStatsData(json);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    // 3. Helper Functions
    const toggleDrillDown = (id: string) => {
        if (expandedItem === id) setExpandedItem(null);
        else setExpandedItem(id);
    };

    const handleDownload = () => {
        if (!statsData) return;
        try {
            const wb = utils.book_new();

            // Simple dump of current view data
            let data: any[] = [];
            if (activeTab === 'REVENUE') data = statsData.finance.chart;
            else if (activeTab === 'MARKETING') data = statsData.marketing.analytics.sources;
            else if (activeTab === 'PERFORMANCE') data = statsData.ops.workload;

            utils.book_append_sheet(wb, utils.json_to_sheet(data), "Report");
            const dateStr = new Date().toISOString().slice(0, 10);
            writeFile(wb, `SeochoJiyul_Report_${activeTab}_${dateStr}.xlsx`);
        } catch (error) {
            console.error(error);
            alert("Download failed");
        }
    };

    // 4. Loading State (Early Return)
    if (loading || !statsData) {
        return <div className="p-12 text-center text-slate-500">통계 데이터 분석 중... (Real-Time DB)</div>;
    }

    // 5. Derived Data (Charts)
    const revenueChartData = statsData.finance.chart.map((d: any) => ({
        name: d.date,
        revenue: d.revenue,
        prevMonth: 0,
        prevYear: 0
    }));

    const revenueSeries = [
        { key: 'revenue', name: '일별 매출 (Daily)', color: '#8a765e' }
    ];

    const marketingChartData = statsData.marketing.analytics.sources.map((d: any) => ({
        name: d.name,
        value: d.value,
        prevValue: 0
    }));

    const marketingSeries = [
        { key: 'value', name: '유입 수', color: '#3b82f6' }
    ];

    const performanceChartData = statsData.ops.workload.map((d: any) => ({
        name: d.name,
        revenue: d.score * 10000,
        prevRevenue: 0
    }));

    const performanceSeries = [
        { key: 'revenue', name: '성과 점수 (Score)', color: '#10b981' }
    ];

    // 6. Derived Data (Lists for Drilldown - Fallback to arrays if API logic incomplete)
    // Note: The API returns aggregated data, so deep drilldown details are mocked/empty for now
    // to prevent crashes until a drilldown API is built.
    const revenueList = [...revenueChartData].reverse();
    const marketingList = statsData.marketing.analytics.sources;
    const performanceList = statsData.ops.workload;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">경영 통계 & 리포트</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        전월/전년/금월 3중 비교 분석 및 상세 지표
                    </p>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-[#181d27] text-white rounded-lg text-sm font-bold shadow hover:bg-[#2a3241] transition-all"
                >
                    <Download className="w-4 h-4" /> 통합 리포트 다운로드 (xlsx)
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                {['REVENUE', 'MARKETING', 'PERFORMANCE'].map((tab: any) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setExpandedItem(null); }}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === tab
                            ? 'bg-white text-[#8a765e] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab === 'REVENUE' && '매출 분석'}
                        {tab === 'MARKETING' && '마케팅 성과'}
                        {tab === 'PERFORMANCE' && '팀별 성과'}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Chart Section (Top/Left) */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#8a765e]" />
                        {activeTab === 'REVENUE' ? '월별 매출 비교 (Recent 30 Days)' :
                            activeTab === 'MARKETING' ? '채널별 유입 비중' : '변호사별 성과 점수'}
                    </h3>

                    <div className="w-full h-[350px]">
                        {activeTab === 'REVENUE' && (
                            <StatsChart type="BAR" data={revenueChartData} series={revenueSeries} />
                        )}
                        {activeTab === 'MARKETING' && (
                            <StatsChart type="BAR" data={marketingChartData} series={marketingSeries} />
                        )}
                        {activeTab === 'PERFORMANCE' && (
                            <StatsChart type="BAR" data={performanceChartData} series={performanceSeries} />
                        )}
                    </div>
                </div>

                {/* Detailed List / Drill Down Section */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">
                        상세 데이터 (Drill-down)
                    </h3>

                    <div className="space-y-2">
                        {/* REVENUE LIST */}
                        {activeTab === 'REVENUE' && revenueList.map((data: any) => {
                            const isOpen = expandedItem === data.name;
                            return (
                                <div key={data.name} className="border border-slate-100 rounded-lg overflow-hidden transition-all hover:border-[#8a765e]">
                                    <div onClick={() => toggleDrillDown(data.name)} className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                                                <span className="text-xs font-bold text-slate-400">DATE</span>
                                                <span className="text-sm font-extrabold text-slate-800">{data.name}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">₩{data.revenue.toLocaleString()}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* MARKETING LIST */}
                        {activeTab === 'MARKETING' && marketingList.map((data: any) => {
                            return (
                                <div key={data.name} className="border border-slate-100 rounded-lg overflow-hidden p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }}></div>
                                            <span className="font-bold">{data.name}</span>
                                        </div>
                                        <span>{data.value} Visits</span>
                                    </div>
                                </div>
                            )
                        })}

                        {/* PERFORMANCE LIST */}
                        {activeTab === 'PERFORMANCE' && performanceList.map((data: any) => {
                            return (
                                <div key={data.name} className="border border-slate-100 rounded-lg overflow-hidden p-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">{data.name}</span>
                                        <span>Score: {data.score}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
