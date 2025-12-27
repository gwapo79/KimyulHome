
"use client";

import { MOCK_SUCCESS_CASES } from '@/data/mock_success';
import { Search, Trophy, MoreVertical, Plus, Gavel } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function SuccessCasesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCases = MOCK_SUCCESS_CASES.filter(c =>
        c.title.includes(searchQuery) || c.lawyer.includes(searchQuery)
    );

    const getResultBadge = (result: string) => {
        switch (result) {
            case '승소':
            case '무혐의':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#181d27] text-[#d4af37] border border-[#d4af37]">🏆 {result}</span>;
            case '화해':
            case '조정':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{result}</span>;
            case '기각':
            case '패소':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">{result}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">성공사례 관리</h2>
                    <p className="text-slate-500 text-sm mt-1">로펌 승소 실적 및 판결문 등록</p>
                </div>
                <Link href="/admin/success/new" className="bg-[#181d27] text-white px-4 py-2 rounded-lg hover:bg-[#2a3241] transition-colors text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> 성공사례 등록
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="사건명 또는 담당변호사 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-8">사건명 (Title)</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">분야</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">결과</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">담당변호사</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">판결일</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCases.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-full text-slate-400">
                                            <Gavel className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                        {item.field}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {getResultBadge(item.result)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {item.lawyer}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {item.date}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
