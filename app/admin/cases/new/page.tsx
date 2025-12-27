"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector';
import { MOCK_CLIENTS } from '@/data/mock_users';
import { CaseStatus } from '@/data/mock_cases';

export default function NewCasePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        caseNumber: '',
        clientId: '',
        lawyerId: '',
        status: 'INVESTIGATION' as CaseStatus,
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation mock
        if (!formData.title || !formData.caseNumber || !formData.clientId) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }

        // Mock Submission
        alert("사건이 성공적으로 등록되었습니다.");
        router.push('/admin/cases');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <Link href="/admin/cases" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-3">
                    <ChevronLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
                </Link>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">신규 사건 등록</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            사건명 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="예: 강남구 사기 혐의 방어"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent"
                        />
                    </div>

                    {/* Case Number */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            사건 번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.caseNumber}
                            onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                            placeholder="예: 2025형제1234"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                의뢰인 선택 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent bg-white"
                            >
                                <option value="">선택해주세요</option>
                                {MOCK_CLIENTS.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} ({client.phone})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                초기 진행 단계
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent bg-white"
                            >
                                <option value="INVESTIGATION">수사 개시 / 경찰 조사</option>
                                <option value="PROSECUTION">검찰 송치</option>
                                <option value="TRIAL_1">재판 중 (1심)</option>
                                <option value="JUDGMENT">판결 선고</option>
                            </select>
                        </div>
                    </div>

                    {/* Lawyer (Assignee) */}
                    <div>
                        <AssigneeSelector
                            label="담당 변호사 지정"
                            roleFilter={['LAWYER']}
                            currentAssigneeId={formData.lawyerId || null}
                            onAssign={(id) => setFormData({ ...formData, lawyerId: id || '' })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            사건 개요
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="사건의 주요 내용과 쟁점을 입력하세요..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent h-32 resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link
                            href="/admin/cases"
                            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                        >
                            취소
                        </Link>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#8a765e] text-white rounded-lg hover:bg-[#75644e] font-medium text-sm transition-colors shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            사건 등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
