
"use client";

import { useState } from 'react';
import { MOCK_CONSULTATIONS, ConsultationStatus } from '@/data/mock_consultations';
import { Search, Phone, MoreVertical, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector'; // Import AssigneeSelector

export default function ConsultationsPage() {
    const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMyTasks, setShowMyTasks] = useState(false); // My Tasks Filter State
    const currentUserId = 't2'; // Mock logged-in user (Park Lawyer)

    const filteredList = consultations.filter(c => {
        const matchesSearch = c.name.includes(searchQuery) || c.phone.includes(searchQuery);
        const matchesMyTask = showMyTasks ? c.assigneeId === currentUserId : true;
        return matchesSearch && matchesMyTask;
    });

    const handleStatusChange = (id: string, newStatus: ConsultationStatus) => {
        setConsultations(prev => prev.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
        ));
    };

    const getStatusColor = (status: ConsultationStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONTACTED': return 'bg-blue-100 text-blue-800';
            case 'SCHEDULED': return 'bg-purple-100 text-purple-800';
            case 'HIRED': return 'bg-green-100 text-green-800';
            case 'DROPPED': return 'bg-slate-100 text-slate-500';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">상담 신청 관리</h2>
                    <p className="text-slate-500 text-sm mt-1">홈페이지 무료법률상담 접수 내역</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="이름 또는 연락처 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showMyTasks}
                        onChange={(e) => setShowMyTasks(e.target.checked)}
                        className="rounded border-slate-300 text-[#8a765e] focus:ring-[#8a765e]"
                    />
                    <span className="text-sm font-medium text-slate-700">내 담당 업무만 보기</span>
                </label>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-8">신청인 정보</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">문의 내용</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">담당자 배정</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">신청일</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredList.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                {/* 1. Applicant */}
                                <td className="px-6 py-4 pl-8">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                        <span className="text-xs text-slate-500 mt-0.5">{item.phone}</span>
                                    </div>
                                </td>

                                {/* 2. Category/Content */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col max-w-[300px]">
                                        <span className="text-xs font-medium text-slate-500 mb-1 px-1.5 py-0.5 bg-slate-100 rounded self-start">
                                            {item.category}
                                        </span>
                                        <span className="text-sm text-slate-700 truncate block" title={item.content}>
                                            {item.content}
                                        </span>
                                    </div>
                                </td>

                                {/* 3. Status */}
                                <td className="px-6 py-4">
                                    <div className="relative group inline-block">
                                        <button className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(item.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                                            {item.status}
                                            <ChevronDown className="w-3 h-3 opacity-50" />
                                        </button>
                                        <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover:block z-20">
                                            {['PENDING', 'CONTACTED', 'HIRED', 'DROPPED'].map((st) => (
                                                <button
                                                    key={st}
                                                    onClick={() => handleStatusChange(item.id, st as any)}
                                                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-700 block"
                                                >
                                                    {st}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </td>

                                {/* 4. Assignee */}
                                <td className="px-6 py-4">
                                    <div className="w-40">
                                        <AssigneeSelector
                                            roleFilter={['STAFF', 'LAWYER']}
                                            currentAssigneeId={item.assigneeId}
                                            onAssign={(id) => {
                                                setConsultations(prev => prev.map(c =>
                                                    c.id === item.id ? { ...c, assigneeId: id || undefined } : c
                                                ));
                                            }}
                                            label=""
                                        />
                                    </div>
                                </td>

                                {/* 5. Date */}
                                <td className="px-6 py-4 text-xs text-slate-400">
                                    {item.appliedAt}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
