'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';

interface Case {
    id: string;
    title: string;
    description: string;
    status: string;
    statusColor: string;
    caseNumber: string;
    createdAt: string;
}

export default function MyCasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchCases = async () => {
            const stored = localStorage.getItem("user");
            if (!stored) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(stored);
            if (!user.id) {
                setError('로그인 정보가 유효하지 않습니다.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/cases?userId=${user.id}`);
                if (!res.ok) {
                    throw new Error('사건 정보를 불러오는 데 실패했습니다.');
                }
                const data = await res.json();
                setCases(data.cases);
            } catch (err) {
                setError('서버 연결 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, [router]);

    const getStatusColor = (color: string) => {
        switch (color) {
            case 'warning': return 'bg-orange-100 text-orange-700';
            case 'success': return 'bg-green-100 text-green-700';
            case 'info': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadge = (color: string) => {
        switch (color) {
            case 'warning': return 'w-2 h-2 bg-orange-500 rounded-full mr-3';
            case 'success': return 'w-2 h-2 bg-green-500 rounded-full mr-3';
            case 'info': return 'w-2 h-2 bg-blue-500 rounded-full mr-3';
            case 'completed': return 'w-2 h-2 bg-gray-400 rounded-full mr-3';
            default: return 'w-2 h-2 bg-gray-400 rounded-full mr-3';
        }
    };

    return (
        <>
            <section id="filters" role="region" aria-label="사건 필터 및 검색">
                <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-2">내 사건</h1>
                            <p className="text-[#535861]">가장 긴급한 사건부터 확인하세요</p>
                        </div>
                        <div className="mt-4 lg:mt-0 text-sm text-[#535861]">
                            총 <span className="font-medium text-[#181d27]">{cases.length}건</span>의 사건
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="case-search" className="sr-only">사건 검색</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-magnifying-glass text-[#717680]"></i>
                            </div>
                            <input type="text" id="case-search" placeholder="사건명, 담당자, 내용으로 검색..." className="w-full pl-10 pr-4 py-3 border border-[#d5d6d9] rounded-lg focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] placeholder-[#717680]" />
                        </div>
                    </div>
                    {/* Visual-only filters for now as requested to just render UI */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="filter-chip active flex items-center px-4 py-2 bg-[#8a765e] text-white rounded-full text-sm font-medium cursor-pointer">
                            <i className="fas fa-list mr-2"></i> 전체
                        </div>
                        <div className="filter-chip flex items-center px-4 py-2 border border-[#e9e9eb] text-[#535861] rounded-full text-sm font-medium hover:bg-neutral-50 cursor-pointer">
                            <i className="fas fa-clock mr-2"></i> 진행중
                        </div>
                        <div className="filter-chip flex items-center px-4 py-2 border border-[#e9e9eb] text-[#535861] rounded-full text-sm font-medium hover:bg-neutral-50 cursor-pointer">
                            <i className="fas fa-triangle-exclamation mr-2"></i> 보완 요청
                        </div>
                        <div className="filter-chip flex items-center px-4 py-2 border border-[#e9e9eb] text-[#535861] rounded-full text-sm font-medium hover:bg-neutral-50 cursor-pointer">
                            <i className="fas fa-circle-check mr-2"></i> 종결
                        </div>
                    </div>
                </div>
            </section>

            <section id="table" role="region" aria-label="사건 목록">
                <div className="bg-white rounded-2xl border border-[#e9e9eb] overflow-hidden">
                    {loading ? (
                        <div className="text-center py-12">
                            <i className="fas fa-spinner fa-spin text-2xl text-[#8a765e]"></i>
                            <p className="mt-2 text-[#535861]">사건 정보를 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                            <p>{error}</p>
                        </div>
                    ) : cases.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[#535861]">진행 중인 사건이 없습니다.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block table-responsive">
                                <table role="table" aria-label="사건 목록 테이블" className="w-full">
                                    <thead className="bg-neutral-50 border-b border-[#e9e9eb]">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">사건명</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">상태</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">마감일(임시)</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">접수일</th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#535861]">최근 업데이트</th>
                                            <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-[#535861]">액션</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e9e9eb]">
                                        {cases.map((c) => (
                                            <tr key={c.id} onClick={() => router.push(`/dashboard/case_detail?id=${c.id}`)} className="hover:bg-neutral-50 cursor-pointer case-row">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className={getStatusBadge(c.statusColor)}></div>
                                                        <div>
                                                            <div className="font-medium text-[#181d27]">{c.title}</div>
                                                            <div className="text-sm text-[#535861]">{c.caseNumber}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(c.statusColor)}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[#181d27]">2025-04-30</div>
                                                    <div className="text-xs text-[#535861]">예정</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[#181d27]">{new Date(c.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[#181d27]">{new Date(c.createdAt).toLocaleDateString()}</div>
                                                    <div className="text-xs text-[#535861]">업데이트</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button className="text-[#8a765e] hover:text-[#74634e] font-medium">
                                                        <i className="fas fa-arrow-right"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden mobile-cards space-y-4 p-4">
                                {cases.map((c) => (
                                    <div key={c.id} onClick={() => router.push(`/dashboard/case_detail?id=${c.id}`)} className="bg-white border border-[#e9e9eb] rounded-lg p-4 hover:border-[#8a765e] transition-colors cursor-pointer case-card">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className={getStatusBadge(c.statusColor)}></div>
                                                <div>
                                                    <h3 className="font-medium text-[#181d27]">{c.title}</h3>
                                                    <p className="text-sm text-[#535861]">{c.caseNumber}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.statusColor)}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                            <div>
                                                <div className="text-[#535861]">접수일</div>
                                                <div className="font-medium text-[#181d27]">{new Date(c.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-[#535861]">내용</div>
                                                <div className="font-medium text-[#181d27] truncate">{c.description}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-[#e9e9eb]">
                                            <div className="text-xs text-[#535861]">최근 업데이트</div>
                                            <button className="text-[#8a765e] hover:text-[#74634e] font-medium text-sm">
                                                상세보기 <i className="fas fa-arrow-right ml-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
