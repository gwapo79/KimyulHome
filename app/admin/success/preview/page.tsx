'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Mock helpers for preview
const formatClientName = (name: string) => name;
const getTeamMemberByName = (name: string) => ({
    name: name || '김서윤',
    imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.png'
});

export default function SuccessCasePreviewPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('admin_preview_data');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Parse List Strings if needed, though form usually keeps them as strings/arrays
                if (typeof parsed.kpiInfo === 'string') parsed.kpiInfo = JSON.parse(parsed.kpiInfo);

                // Fallback for missing fields in preview
                parsed.kpiInfo = parsed.kpiInfo || [];

                setData(parsed);
            } catch (e) {
                console.error('Failed to parse preview data', e);
            }
        }
    }, []);

    if (!data) return <div className="p-20 text-center text-slate-500">Loading Preview...</div>;

    // Use KPI Grid from data or fallback
    const kpiGrid = Array.isArray(data.kpiInfo) ? data.kpiInfo : [];

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Preview Banner */}
            <div className="bg-orange-600 text-white text-center py-2 px-4 shadow-md sticky top-0 z-50 font-bold">
                PREVIEW MODE - 실제 화면과 다를 수 있습니다.
            </div>

            <main className="pt-10">
                <section id="breadcrumb" className="bg-neutral-50 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav aria-label="브레드크럼 네비게이션" className="flex items-center space-x-2 text-sm">
                            <span className="text-[#535861]">홈</span>
                            <i className="fas fa-chevron-right text-[#717680] text-xs"></i>
                            <span className="text-[#535861]">성공사례</span>
                            <i className="fas fa-chevron-right text-[#717680] text-xs"></i>
                            <span className="text-[#717680]">{data.title}</span>
                        </nav>
                    </div>
                </section>

                <section id="overview" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Hero Image */}
                        {data.detailImageUrl && (
                            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={data.detailImageUrl}
                                    alt={data.title}
                                    className="w-full h-64 md:h-96 object-cover object-top"
                                />
                            </div>
                        )}

                        <div className="mb-12">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-[#f8f3ed] text-[#74634e] text-sm font-semibold rounded-full border border-[#e5ceb4]">
                                    {data.category}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">
                                {data.title}
                            </h1>
                            {/* Subtitle / Summary */}
                            <p className="text-xl text-[#535861] leading-relaxed">
                                {data.subTitle || data.summary}
                            </p>
                        </div>

                        {/* Meta Grid */}
                        <div className="bg-neutral-50 rounded-2xl p-8 mb-16">
                            <h2 className="text-2xl font-bold text-[#181d27] mb-8">사건 개요</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">의뢰인</span>
                                        <span className="text-[#181d27]">{formatClientName(data.client)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">사건 유형</span>
                                        <span className="text-[#181d27]">{data.caseType || '-'}</span>
                                    </div>
                                    {data.amount && (
                                        <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                            <span className="font-semibold text-[#535861]">관련 금액</span>
                                            <span className="text-[#181d27] font-bold">{data.amount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">처리 기간</span>
                                        <span className="text-[#181d27] font-bold">{data.period || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">담당 변호사</span>
                                        <span className="text-[#181d27]">{data.lawyer || '김법무 변호사'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">결과</span>
                                        <span className="text-green-600 font-bold">{data.result || '성공'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <span className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-semibold cursor-not-allowed inline-block opacity-75">
                                    상담 신청하기 (Preview)
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WYSIWYG Content Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none text-[#535861] prose-headings:text-[#181d27] prose-a:text-[#8a765e]">
                            <div dangerouslySetInnerHTML={{ __html: data.content || '<p>내용이 없습니다.</p>' }} />
                        </div>
                    </div>
                </section>

                {/* KPI Result Section (Dynamic) */}
                <section id="result" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">결과</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {kpiGrid.map((kpi: any, idx: number) => (
                                <div key={idx} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#8a765e] transition-colors">
                                    <div className="text-4xl font-bold text-[#8a765e] mb-2">{kpi.value}</div>
                                    <div className="text-lg font-semibold text-[#181d27] mb-1">{kpi.label}</div>
                                    <div className="text-sm text-[#535861]">{kpi.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="lawyer-quote" className="py-16 bg-[#8a765e]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <blockquote className="text-xl text-[#181d27] leading-relaxed mb-6 italic">
                                "단순히 소송만 제기하는 것이 아니라, 사전 재산보전과 체계적인 재산조사를 통해 실질적인 회수 가능성을 높이는 것이 핵심입니다."
                            </blockquote>
                            <div className="flex items-center justify-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                            </div>
                            <cite className="text-[#535861] font-semibold">
                                {formatClientName(data.client)} 고객
                            </cite>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
