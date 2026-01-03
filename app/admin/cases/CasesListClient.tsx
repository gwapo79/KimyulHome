'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Briefcase, Calendar, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminCases } from '@/app/actions/case';

// Simple Hook implementation to avoid dependency issues
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function CasesListClient() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState<any[]>([]);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchCases = async () => {
        setLoading(true);
        const { success, data } = await getAdminCases({ status: statusFilter, search: debouncedSearch });
        if (success && data) {
            setCases(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCases();
    }, [statusFilter, debouncedSearch]);

    const getStatusBadge = (status: string) => {
        // Simple mapping, adjust as needed based on your DB enum
        const colors: any = {
            'INVESTIGATION': 'bg-orange-100 text-orange-800',
            'PROSECUTION': 'bg-purple-100 text-purple-800',
            'TRIAL_1': 'bg-blue-100 text-blue-800',
            'TRIAL_2': 'bg-indigo-100 text-indigo-800',
            'JUDGMENT': 'bg-red-100 text-red-800',
            'CLOSED': 'bg-slate-100 text-slate-800',
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">사건 관리</h2>
                    <p className="text-slate-500 text-sm mt-1">진행 중인 사건 현황 및 타임라인 관리 (Supabase Real Data)</p>
                </div>
                <Link href="/admin/cases/new">
                    <button className="bg-[#181d27] text-white px-4 py-2 rounded-lg hover:bg-[#2a3241] transition-colors text-sm font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> 신규 사건 등록
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <button onClick={() => setStatusFilter('ALL')} className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${statusFilter === 'ALL' ? 'bg-[#181d27] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>전체</button>
                    <button onClick={() => setStatusFilter('INVESTIGATION')} className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${statusFilter === 'INVESTIGATION' ? 'bg-orange-100 text-orange-800' : 'text-slate-600 hover:bg-slate-100'}`}>수사중</button>
                    <button onClick={() => setStatusFilter('PROSECUTION')} className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${statusFilter === 'PROSECUTION' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'}`}>검찰송치</button>
                    <button onClick={() => setStatusFilter('TRIAL_1')} className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${statusFilter === 'TRIAL_1' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-100'}`}>재판중</button>
                    <button onClick={() => setStatusFilter('CLOSED')} className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${statusFilter === 'CLOSED' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>종결</button>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="사건명, 사건번호 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-slate-400 gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" /> 불러오는 중...
                    </div>
                ) : cases.length === 0 ? (
                    <div className="flex justify-center items-center h-40 text-slate-400">
                        데이터가 없습니다.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-8">사건번호 / 사건명</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">의뢰인</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">담당자</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">최근 업데이트</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cases.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => router.push(`/admin/cases/${item.id}`)}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 pl-8">
                                        <div>
                                            <p className="text-xs text-[#8a765e] font-mono mb-0.5">{item.caseNumber}</p>
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-[#8a765e] transition-colors">{item.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                                                {item.clientName[0]}
                                            </div>
                                            <span className="text-sm text-slate-700">{item.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {item.lawyerName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {item.updatedAt}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 inline-block" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
