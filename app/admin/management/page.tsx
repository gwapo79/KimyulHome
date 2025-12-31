"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { DollarSign, Users, Scale, Activity, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface KPI {
    revenue: { value: number, label: string, delta: number, prefix?: string };
    consultations: { value: number, label: string, delta: number };
    activeCases: { value: number, label: string, delta: number };
    winRate: { value: number, label: string, delta: number };
}

interface TrendData {
    month: string;
    revenue: number;
    consultations: number;
}

export default function ManagementPage() {
    const [loading, setLoading] = useState(true);
    const [kpi, setKpi] = useState<KPI | null>(null);
    const [trends, setTrends] = useState<TrendData[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/management/stats');
            if (res.ok) {
                const data = await res.json();
                setKpi(data.kpi);
                setTrends(data.monthlyTrends);
            }
        } catch (e) {
            console.error("Failed to load management stats", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Optional: Real-time polling every 30s
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <RoleGuard allowedRoles={['CEO']} redirectPath="/admin">
            <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">경영 지표 관리 (CEO Only)</h1>
                        <p className="text-slate-500 text-sm mt-1">실시간 로펌 운영 현황 및 KPI 분석</p>
                    </div>
                    <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        데이터 갱신
                    </button>
                </div>

                {loading && !kpi ? (
                    <div className="h-64 flex items-center justify-center text-slate-400">
                        데이터를 불러오는 중입니다...
                    </div>
                ) : kpi ? (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KpiCard
                                icon={<DollarSign className="w-5 h-5 text-[#8a765e]" />}
                                bg="bg-[#fffbf0]"
                                label={kpi.revenue.label}
                                value={`${kpi.revenue.prefix || ''}${kpi.revenue.value.toLocaleString()}`}
                                delta={kpi.revenue.delta}
                            />
                            <KpiCard
                                icon={<Users className="w-5 h-5 text-blue-600" />}
                                bg="bg-blue-50"
                                label={kpi.consultations.label}
                                value={`${kpi.consultations.value}건`}
                                delta={kpi.consultations.delta}
                            />
                            <KpiCard
                                icon={<Scale className="w-5 h-5 text-purple-600" />}
                                bg="bg-purple-50"
                                label={kpi.activeCases.label}
                                value={`${kpi.activeCases.value}건`}
                                delta={kpi.activeCases.delta}
                            />
                            <KpiCard
                                icon={<Activity className="w-5 h-5 text-green-600" />}
                                bg="bg-green-50"
                                label={kpi.winRate.label}
                                value={`${kpi.winRate.value}%`}
                                delta={kpi.winRate.delta}
                                suffix="pp"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">월별 매출 추이</h3>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={trends}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                            <YAxis tickFormatter={(value) => `₩${value / 10000}만`} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
                                            <Bar dataKey="revenue" fill="#8a765e" radius={[4, 4, 0, 0]} name="매출" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Consultations Chart */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">신규 상담 유입 현황</h3>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trends}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="consultations" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="상담 건수" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-2">
                            <div className="mt-0.5">⚠️</div>
                            <div>
                                <strong>데이터 연동 안내:</strong><br />
                                위 지표는 현재 BillingHistory(결제), Consultation(상담), Case(사건) 테이블의 실시간 데이터를 집계하여 표시합니다.<br />
                                데이터가 부족할 경우 0으로 표시될 수 있습니다.
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-red-500">데이터 로드 실패</div>
                )}
            </div>
        </RoleGuard>
    );
}

function KpiCard({ icon, bg, label, value, delta, suffix = '%' }: any) {
    const isPositive = delta >= 0;
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${bg}`}>
                    {icon}
                </div>
                <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(delta)}{suffix}
                </span>
            </div>
            <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
            </div>
        </div>
    );
}
