"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
    CheckCircle2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp, ShieldCheck
} from "lucide-react";

interface SystemLog {
    id: string;
    time: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
    message: string;
    raw: string;
    user: string;
}

export default function SystemZone({ logs }: { logs: SystemLog[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getIcon = (level: string) => {
        switch (level) {
            case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-white" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-white" />;
            case 'CRITICAL': return <XCircle className="w-5 h-5 text-white" />;
            default: return <Info className="w-5 h-5 text-white" />;
        }
    };

    const getBgColor = (level: string) => {
        switch (level) {
            case 'SUCCESS': return 'bg-emerald-500';
            case 'WARNING': return 'bg-amber-500';
            case 'CRITICAL': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <ShieldCheck className="w-5 h-5 text-slate-900" />
                    시스템 보안 타임라인 (Security Audit Log)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-8">
                            {/* Icon Marker */}
                            <div className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${getBgColor(log.level)} ring-4 ring-white`}>
                                {getIcon(log.level)}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-sm font-bold text-slate-500">{log.time}</span>
                                    {log.level === 'CRITICAL' && <Badge variant="destructive" className="h-5 text-[10px]">긴급 차단</Badge>}
                                    {log.level === 'WARNING' && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 h-5 text-[10px] border-amber-200">주의</Badge>}
                                </div>

                                <h4 className="text-slate-900 font-bold text-base">
                                    {log.message}
                                </h4>

                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-slate-500 font-normal text-xs bg-slate-50">
                                        User: {log.user}
                                    </Badge>
                                    <button
                                        onClick={() => toggleExpand(log.id)}
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium transition-colors"
                                    >
                                        {expandedId === log.id ? "상세 정보 접기" : "상세 로그 보기"}
                                        {expandedId === log.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                </div>

                                {/* Accordion: Raw Data */}
                                {expandedId === log.id && (
                                    <div className="mt-3 p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center gap-2 mb-1 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                            Raw System Log
                                        </div>
                                        {log.raw}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
