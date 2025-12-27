
"use client";

import { useState } from 'react';
import { MOCK_CLIENTS } from '@/data/mock_users';
import { Search, MoreVertical, Users, ShieldAlert, KeyRound } from 'lucide-react';

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Logic
    const filteredUsers = MOCK_CLIENTS.filter(user => {
        const matchesSearch = user.name.includes(searchQuery) || user.email.includes(searchQuery);
        return matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        if (status === 'ACTIVE') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">정상</span>;
        if (status === 'BLOCKED') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">차단</span>;
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">탈퇴</span>;
    };

    const getPathBadge = (path: string) => {
        switch (path) {
            case 'NAVER': return <span className="text-[10px] font-bold text-white bg-[#03C75A] px-1.5 py-0.5 rounded">N</span>;
            case 'GOOGLE': return <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">G</span>;
            default: return <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">직접</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">일반 회원 관리 (Clients)</h2>
                    <p className="text-slate-500 text-sm mt-1">총 {MOCK_CLIENTS.length}명의 고객이 등록되어 있습니다.</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="이름 또는 이메일 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">회원 정보</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">가입 경로</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">가입일</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getPathBadge(user.joinPath)}
                                            <span className="text-xs text-slate-600">{user.joinPath}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {user.joinedAt}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="비밀번호 초기화">
                                                <KeyRound className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="강제 탈퇴/차단">
                                                <ShieldAlert className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
