"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/app/components/ui/button";
import { Siren, Briefcase, AlertTriangle } from "lucide-react";

interface OpsData {
    risks: {
        schedule: { id: string; title: string; case: string; date: string }[];
        unassigned: { id: string; title: string; status: string; createdAt: string }[];
    };
    workload: { id: string; name: string; position: string; count: number; score: number }[];
}

export function RiskScanner({ data }: { data: OpsData }) {
    return (
        <div className="space-y-4 h-full">
            <Card className="border-red-200 bg-red-50/20 shadow-sm h-full">
                <CardHeader className="pb-2 border-b border-red-100/50">
                    <CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2">
                        <Siren className="h-4 w-4 animate-pulse" />
                        미배정 사건 (Unassigned)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3">
                    {data.risks.unassigned.length === 0 && <p className="text-xs text-slate-500">Empty.</p>}
                    {data.risks.unassigned.map((u) => (
                        <div key={u.id} className="bg-white p-2 rounded border border-red-100 flex justify-between items-center shadow-sm">
                            <div className="overflow-hidden">
                                <div className="text-xs font-bold text-slate-800 truncate">{u.title}</div>
                                <div className="text-[10px] text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</div>
                            </div>
                            <Button size="sm" variant="destructive" className="h-6 text-[10px] px-2 ml-2">배정</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export function WorkloadHeatmap({ data }: { data: OpsData }) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    업무 부하량 (Load)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.workload.map((w) => (
                    <div key={w.id}>
                        <div className="flex justify-between items-end mb-1">
                            <div>
                                <span className="font-bold text-xs text-slate-800 mr-2">{w.name}</span>
                                <span className="text-[10px] text-slate-400">{w.position}</span>
                            </div>
                            <span className={`text-xs font-bold ${w.score > 90 ? 'text-red-500' : 'text-slate-600'}`}>{w.score}%</span>
                        </div>
                        <Progress
                            value={w.score}
                            className="h-1.5"
                            indicatorClassName={
                                w.score > 90 ? 'bg-red-500' :
                                    w.score > 70 ? 'bg-orange-500' : 'bg-emerald-500'
                            }
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function OpsZone({ data }: { data: OpsData }) {
    return (
        <div className="space-y-4">
            <RiskScanner data={data} />
            <WorkloadHeatmap data={data} />
        </div>
    );
}
