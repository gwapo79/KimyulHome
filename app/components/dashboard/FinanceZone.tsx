"use client";

import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Siren } from 'lucide-react';

interface FinanceData {
    revenue: { today: number; yesterday: number; lastMonth: number; nextMonthPipeline: number };
    chart: { date: string; revenue: number; prevRevenue: number }[];
    arAging: { id: string; client: string; lawyer: string; amount: number; daysOverdue: number; status: string; date: string }[];
    profit: { revenue: number; expenses: number; net: number; bepRate: string };
}

export function FinanceCharts({ data }: { data: FinanceData }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* 1-1. Time-Series Revenue Analysis */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base text-slate-800">일별 매출 추이 (Trend)</CardTitle>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center text-emerald-600 font-bold">● 금주</span>
                            <span className="flex items-center text-slate-400">-- 전주</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data.chart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                            <YAxis tickFormatter={(val) => `${(val / 10000).toLocaleString()}만`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(val: number) => `₩${val.toLocaleString()}`}
                            />
                            <Bar dataKey="revenue" barSize={16} fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="prevRevenue" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 1-3. BEP & Profit Gauge */}
            <Card className="flex flex-col shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-800">손익분기점 (BEP)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center flex-1 gap-2">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                            <circle
                                cx="64" cy="64" r="56"
                                stroke={Number(data.profit.bepRate) >= 100 ? "#10B981" : "#F59E0B"}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={351}
                                strokeDashoffset={351 - (351 * Math.min(Number(data.profit.bepRate), 100)) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold font-mono text-slate-800">{data.profit.bepRate}%</span>
                        </div>
                    </div>
                    <div className="w-full space-y-1 mt-2 px-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Net Profit</span>
                            <span className={`font-mono font-bold ${data.profit.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {data.profit.net >= 0 ? '+' : ''}₩{(data.profit.net / 10000).toLocaleString()}만
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function ARAgingTable({ data }: { data: FinanceData }) {
    return (
        <Card className="border-red-100 shadow-sm bg-white">
            <CardHeader className="bg-red-50/30 pb-3 border-b border-red-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                        <CardTitle className="text-sm font-bold text-red-800">장기 미수금 현황 (AR Aging)</CardTitle>
                    </div>
                    <Badge variant="destructive" className="h-5 text-[10px]">
                        [위험] {data.arAging.filter(a => a.status === 'CRITICAL').length}건
                    </Badge>
                </div>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
                        <tr>
                            <th className="px-4 py-2">고객명</th>
                            <th className="px-4 py-2">담당자</th>
                            <th className="px-4 py-2 text-right">미수금</th>
                            <th className="px-4 py-2 text-center">연체일</th>
                            <th className="px-4 py-2 text-center">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.arAging.slice(0, 5).map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-2 font-medium text-slate-800 text-xs">
                                    {item.client}
                                </td>
                                <td className="px-4 py-2 text-xs">{item.lawyer}</td>
                                <td className="px-4 py-2 text-right font-mono text-xs">₩{item.amount.toLocaleString()}</td>
                                <td className="px-4 py-2 text-center text-xs">
                                    <span className={item.daysOverdue > 90 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                                        +{item.daysOverdue}일
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {item.status === 'CRITICAL' ? (
                                        <Badge variant="destructive" className="h-4 text-[9px] px-1">위험</Badge>
                                    ) : (
                                        <Badge variant="outline" className="h-4 text-[9px] px-1">정상</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default function FinanceZone({ data }: { data: FinanceData }) {
    return (
        <div className="space-y-4">
            <FinanceCharts data={data} />
            <ARAgingTable data={data} />
        </div>
    );
}
