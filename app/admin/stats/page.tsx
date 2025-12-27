"use client";

import { useState } from 'react';
import { MOCK_STATS } from '@/data/mock_stats';
import { BarChart3, PieChart, Users, DollarSign, Download } from 'lucide-react';

export default function StatisticsPage() {
    const [activeTab, setActiveTab] = useState<'REVENUE' | 'MARKETING' | 'PERFORMANCE'>('REVENUE');
    const { monthlyTrends, marketing, lawyerPerformance } = MOCK_STATS;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">통계 및 리포트</h2>
                    <p className="text-slate-500 text-sm mt-1">매출, 마케팅, 성과 지표 상세 분석</p>
                </div>
                <button
                    onClick={() => alert("리포트 다운로드(Mock) 시작...")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium shadow-sm"
                >
                    <Download className="w-4 h-4" /> 리포트 다운로드
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('REVENUE')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'REVENUE' ? 'border-[#8a765e] text-[#8a765e]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <DollarSign className="w-4 h-4" /> 매출 분석
                </button>
                <button
                    onClick={() => setActiveTab('MARKETING')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'MARKETING' ? 'border-[#8a765e] text-[#8a765e]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <PieChart className="w-4 h-4" /> 마케팅 성과
                </button>
                <button
                    onClick={() => setActiveTab('PERFORMANCE')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PERFORMANCE' ? 'border-[#8a765e] text-[#8a765e]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Users className="w-4 h-4" /> 팀/업무 성과
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">

                {/* REVENUE TAB */}
                {activeTab === 'REVENUE' && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">월별 매출 현황표</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold text-slate-600">월 (Month)</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-right">총 매출 (Revenue)</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-right">상담 건수</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-right">수임 건수</th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 text-right">건당 평균 단가</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[...monthlyTrends].reverse().map((data) => (
                                            <tr key={data.month} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800">{data.month}</td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-700">₩{data.revenue.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right">{data.consultations}건</td>
                                                <td className="px-4 py-3 text-right">{data.cases}건</td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-500">
                                                    ₩{Math.round(data.revenue / data.cases).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* MARKETING TAB */}
                {activeTab === 'MARKETING' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-6">유입 경로 분석 (Inflow Channels)</h3>
                            <div className="space-y-4">
                                {marketing.map((channel, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-slate-700">{channel.channel}</span>
                                            <span className="text-slate-500">{channel.percentage}% ({channel.count}명)</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#8a765e] rounded-full"
                                                style={{ width: `${channel.percentage}%`, opacity: 1 - (index * 0.15) }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">마케팅 인사이트</h3>
                            <ul className="space-y-3 text-sm text-slate-700 list-disc pl-4">
                                <li>
                                    <strong>네이버 블로그</strong> 유입이 전체의 45%를 차지하며 가장 높은 전환율을 보입니다.
                                </li>
                                <li>
                                    <strong>지인 추천</strong> 유입 고객의 수임 전환율이 60%로 가장 높습니다.
                                </li>
                                <li>
                                    <strong>유튜브</strong> 채널 유입이 지난달 대비 5% 상승했습니다. 콘텐츠 강화를 제안합니다.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* PERFORMANCE TAB */}
                {activeTab === 'PERFORMANCE' && (
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-6">변호사별 성과 지표</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {lawyerPerformance.map((lawyer, index) => (
                                <div key={index} className="flex items-center p-4 border border-slate-200 rounded-xl bg-white hover:border-[#8a765e] transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 mr-4">
                                        {lawyer.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">{lawyer.name}</h4>
                                        <p className="text-xs text-slate-500">수임 {lawyer.cases}건 • 평점 {lawyer.rating}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">매출 기여도</p>
                                        <p className="text-lg font-mono text-[#8a765e] font-extrabold">₩{lawyer.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
