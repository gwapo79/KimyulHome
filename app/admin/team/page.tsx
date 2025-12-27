
"use client";

import { useState } from 'react';
import { MOCK_TEAM } from '@/data/mock_users';
import { Search, Plus, MoreVertical, Shield, Briefcase, UserCog, Eye, EyeOff } from 'lucide-react';

export default function TeamPage() {
    const [team, setTeam] = useState(MOCK_TEAM);

    const togglePublic = (id: string) => {
        setTeam(team.map(member =>
            member.id === id ? { ...member, isPublic: !member.isPublic } : member
        ));
    };

    const getRoleBadge = (badge: string) => {
        switch (badge) {
            case 'ADMIN':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Shield className="w-3 h-3" /> Admin</span>;
            case 'LAWYER':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Briefcase className="w-3 h-3" /> Lawyer</span>;
            case 'STAFF':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><UserCog className="w-3 h-3" /> Staff</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">구성원 관리 (Team)</h2>
                    <p className="text-slate-500 text-sm mt-1">변호사 및 스태프 권한 관리</p>
                </div>
                <button className="bg-[#181d27] text-white px-4 py-2 rounded-lg hover:bg-[#2a3241] transition-colors text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> 구성원 추가
                </button>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">프로필 / 직책</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">부서</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">권한 (Role)</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">담당 사건</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">홈페이지 노출</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {team.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                                            {member.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{member.name} {member.position}</p>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {member.department}
                                </td>
                                <td className="px-6 py-4">
                                    {getRoleBadge(member.roleBadge)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                    {member.assignedCases} 건
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => togglePublic(member.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${member.isPublic
                                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                    >
                                        {member.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {member.isPublic ? '노출 중' : '비공개'}
                                    </button>
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
