
"use client";

import { useState } from 'react';
import { ArrowLeft, Save, Trophy, Scale, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import RichTextEditor from '../../../components/admin/RichTextEditor';

export default function NewSuccessCasePage() {
    const router = useRouter();
    const [content, setContent] = useState('');

    const handleSave = () => {
        alert('성공사례가 등록되었습니다.');
        router.push('/admin/success');
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header / Actions */}
            <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-slate-50 pt-4 pb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/success" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">새 성공사례 등록</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        임시저장
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#181d27] rounded-lg hover:bg-[#2a3241] transition-colors"
                    >
                        <Trophy className="w-4 h-4" /> 성공사례 등록
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">사건명 (Title)</label>
                        <input
                            type="text"
                            placeholder="ex) 강남구 전세사기 보증금 전액 반환 성공"
                            className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8a765e] focus:border-transparent"
                        />

                        <div className="mt-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">판결 요지 / 성과 내용</label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="사건의 개요, 변호인의 조력 내용, 최종 판결 결과를 상세히 기술하세요..."
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">판결문 등 증빙 이미지</h3>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex flex-col items-center justify-center text-slate-400 hover:bg-[#f9fafb] cursor-pointer">
                            <span className="text-sm">이미지 드래그 앤 드롭</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Input Fields */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">사건 정보</h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">사건 분야</label>
                            <select className="w-full text-sm border-slate-200 rounded-lg focus:ring-[#8a765e]">
                                <option>형사</option>
                                <option>민사</option>
                                <option>이혼/가사</option>
                                <option>부동산/건설</option>
                                <option>기업법무</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Scale className="w-3 h-3" /> 결과 (Result)
                            </label>
                            <select className="w-full text-sm font-bold text-[#8a765e] border-slate-200 rounded-lg focus:ring-[#8a765e]">
                                <option>승소 (Win)</option>
                                <option>무혐의</option>
                                <option>집행유예</option>
                                <option>화해/조정</option>
                                <option>기각/패소</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <User className="w-3 h-3" /> 담당 변호사
                            </label>
                            <select className="w-full text-sm border-slate-200 rounded-lg focus:ring-[#8a765e]">
                                <option>김지율 대표변호사</option>
                                <option>이영희 파트너 변호사</option>
                                <option>박철수 법무사</option>
                                <option>관리자 (Admin)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> 판결 일자
                            </label>
                            <input type="date" className="w-full text-sm border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
