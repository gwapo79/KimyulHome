'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DocumentManager from './components/DocumentManager';

interface TimelineEvent {
    date: string;
    title: string;
    description: string;
}

interface CaseDetail {
    id: string;
    title: string;
    description: string;
    status: string;
    statusColor: string;
    caseNumber: string;
    courtName?: string;
    judgeInfo?: string;
    opponentName?: string;
    lawyerInCharge?: string;
    claimAmount?: string;
    contractDate?: string;
    caseDescriptionLong?: string;
    timelineJson?: TimelineEvent[];
    createdAt: string;
    documents?: any[];
}

function CaseDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchCaseDetail = async () => {
            const stored = localStorage.getItem("user");
            if (!stored) {
                router.push('/login');
                return;
            }

            if (!id) {
                setError('유효하지 않은 접근입니다.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/cases/${id}`);
                if (!res.ok) {
                    throw new Error('사건 정보를 불러오는 데 실패했습니다.');
                }
                const data = await res.json();
                setCaseDetail(data.case);
            } catch (err) {
                setError('서버 연결 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseDetail();
    }, [id, router]);

    const getStatusColor = (color: string) => {
        switch (color) {
            case 'warning': return 'bg-orange-100 text-orange-700';
            case 'success': return 'bg-green-100 text-green-700';
            case 'info': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-2xl text-[#8a765e]"></i>
                    <p className="mt-2 text-[#535861]">사건 상세 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !caseDetail) {
        return (
            <div className="text-center py-12 text-red-600">
                <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>{error || '사건을 찾을 수 없습니다.'}</p>
                <Link href="/dashboard/my_cases" className="mt-4 inline-block text-[#8a765e] hover:underline">
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li><Link href="/dashboard" className="text-[#8a765e] hover:text-[#74634e]">마이페이지</Link></li>
                    <li><i className="fas fa-chevron-right text-[#d5d6d9] text-xs"></i></li>
                    <li><Link href="/dashboard/my_cases" className="text-[#8a765e] hover:text-[#74634e]">내 사건</Link></li>
                    <li><i className="fas fa-chevron-right text-[#d5d6d9] text-xs"></i></li>
                    <li><span aria-current="page" className="text-[#535861] font-medium">{caseDetail.title}</span></li>
                </ol>
            </nav>

            <section id="summary" role="region" aria-label="사건 요약">
                <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center mb-4">
                                <div aria-label={caseDetail.status} className={`w-3 h-3 rounded-full mr-3 ${caseDetail.statusColor === 'warning' ? 'bg-orange-500' : caseDetail.statusColor === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27]">{caseDetail.title}</h1>
                            </div>
                            <p className="text-[#535861] text-lg mb-4">{caseDetail.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#535861]">
                                <span>사건번호: {caseDetail.caseNumber}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>접수일: {new Date(caseDetail.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end space-y-2">
                            <span className={`px-4 py-2 ${getStatusColor(caseDetail.statusColor)} rounded-full text-sm font-medium`}>
                                {caseDetail.status}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-[#e9e9eb]">
                                <tr>
                                    <th className="px-0 py-4 text-sm font-medium text-[#535861] w-32">담당 변호사</th>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                                                <i className="fas fa-user-tie"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-[#181d27]">{caseDetail.lawyerInCharge || '미정'}</div>
                                                <div className="text-sm text-[#535861]">담당 변호사</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="px-0 py-4 text-sm font-medium text-[#535861]">관할 법원</th>
                                    <td className="px-4 py-4 text-[#181d27]">{caseDetail.courtName || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="px-0 py-4 text-sm font-medium text-[#535861]">재판부</th>
                                    <td className="px-4 py-4 text-[#181d27]">{caseDetail.judgeInfo || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="px-0 py-4 text-sm font-medium text-[#535861]">상대방</th>
                                    <td className="px-4 py-4 text-[#181d27]">{caseDetail.opponentName || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="px-0 py-4 text-sm font-medium text-[#535861]">청구 금액</th>
                                    <td className="px-4 py-4 text-[#181d27] font-medium">
                                        {caseDetail.claimAmount ? parseInt(caseDetail.claimAmount).toLocaleString() + '원' : '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {caseDetail.caseDescriptionLong && (
                        <div className="mt-8 pt-8 border-t border-[#e9e9eb]">
                            <h3 className="text-lg font-semibold text-[#181d27] mb-4">사건 개요</h3>
                            <p className="text-[#535861] leading-relaxed whitespace-pre-line">
                                {caseDetail.caseDescriptionLong}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {caseDetail.timelineJson && (caseDetail.timelineJson as any).length > 0 && (
                <section role="region" aria-label="진행 타임라인">
                    <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-[#181d27]">진행 타임라인</h2>
                        </div>
                        <div id="timeline-list" role="list">
                            {(caseDetail.timelineJson as any).map((event: TimelineEvent, index: number) => (
                                <div key={index} role="listitem" className="timeline-item relative pl-8 pb-8 last:pb-0 border-l-2 border-[#e9e9eb] last:border-l-0 ml-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#8a765e] border-2 border-white ring-1 ring-[#e9e9eb]"></div>
                                    <div className="pl-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                            <h3 className="font-medium text-[#181d27]">{event.title}</h3>
                                            <span className="text-sm text-[#535861]">{event.date}</span>
                                        </div>
                                        <p className="text-[#535861] text-sm">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Document Manager Section */}
            {caseDetail.id && (
                <DocumentManager
                    caseId={caseDetail.id}
                    userId={JSON.parse(localStorage.getItem("user") || "{}").id || ""}
                    initialDocuments={caseDetail.documents || []}
                />
            )}
        </div>
    );
}

export default function CaseDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CaseDetailContent />
        </Suspense>
    );
}
