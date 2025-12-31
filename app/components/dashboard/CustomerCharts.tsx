"use client";

import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Clock, MousePointer, Search, Smartphone } from 'lucide-react';

interface MarketingData {
    metrics: any;
    freshness: any;
    attribution: any;
    analytics: {
        sources: { name: string; value: number; fill: string }[];
        funnel: { stage: string; value: number; fill: string }[];
        topContent: { rank: number; title: string; time: string; category: string }[];
        keywords: { keyword: string; count: number }[];
    };
}

// 1. Acquisition Source (Pie Chart)
export function SourceChart({ data }: { data: MarketingData }) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-emerald-600" /> 유입 경로 (Acquisition)
                </CardTitle>
                <CardDescription className="text-xs">방문자가 어디를 통해 들어왔는가?</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.analytics.sources}
                            dataKey="value"
                            nameKey="name"
                            cx="50%" cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                        >
                            {data.analytics.sources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(val: number) => `${val}%`}
                            contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 text-xs space-y-1">
                    {data.analytics.sources.map((source, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: source.fill }}></span>
                                {source.name}
                            </span>
                            <span className="font-bold">{source.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// 2. User Behavior Funnel (Horizontal Bar)
export function FunnelChart({ data }: { data: MarketingData }) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" /> 행동 흐름 (Funnel)
                </CardTitle>
                <CardDescription className="text-xs">방문 후 최종 액션까지의 전환율</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex flex-col justify-center space-y-4">
                {data.analytics.funnel.map((stage, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600">
                            <span className="font-medium">{stage.stage}</span>
                            <span className="font-bold">{stage.value.toLocaleString()}명</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${(stage.value / data.analytics.funnel[0].value) * 100}%`,
                                    backgroundColor: stage.fill
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// 3. Top Content (List)
export function TopContentList({ data }: { data: MarketingData }) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" /> 인기 콘텐츠 (Engagement)
                </CardTitle>
                <CardDescription className="text-xs">체류시간이 가장 긴 글 Top 5</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {data.analytics.topContent.map((content) => (
                    <div key={content.rank} className="flex justify-between items-center text-xs border-b border-slate-50 pb-1.5 last:border-0">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 rounded-full border-slate-300 text-slate-500">
                                {content.rank}
                            </Badge>
                            <span className="truncate max-w-[180px] font-medium text-slate-700" title={content.title}>
                                {content.title}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 whitespace-nowrap">
                            <Clock className="w-3 h-3" /> {content.time}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// 4. Keyword Analysis (Bar Chart)
export function KeywordChart({ data }: { data: MarketingData }) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-600" /> 상담 요청 키워드 (Needs)
                </CardTitle>
                <CardDescription className="text-xs">고객들의 주요 고민 토픽</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.analytics.keywords} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="keyword"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={60}
                            tick={{ fontSize: 11, fill: '#475569' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#64748B', fontSize: 11 }} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
