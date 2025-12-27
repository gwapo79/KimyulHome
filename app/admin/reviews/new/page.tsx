"use client";

import { useState } from 'react';
import { ArrowLeft, Save, Star, Calendar, User, Scale } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewReviewPage() {
    const router = useRouter();
    const [rating, setRating] = useState(5);

    const handleSave = () => {
        alert('후기가 등록되었습니다.');
        router.push('/admin/reviews');
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header / Actions */}
            <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-slate-50 pt-4 pb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reviews" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">후기 수동 등록</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/reviews" className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        취소
                    </Link>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#8a765e] rounded-lg hover:bg-[#75644e] transition-colors"
                    >
                        <Save className="w-4 h-4" /> 후기 등록
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-800">의뢰인 문자/카톡 내용 등록</h2>
                    <p className="text-sm text-slate-500">의뢰인에게 받은 감사 메시지를 직접 입력하여 홈페이지에 노출합니다.</p>
                </div>

                <div className="w-full h-[1px] bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" /> 의뢰인명 (익명 권장)
                        </label>
                        <input
                            type="text"
                            placeholder="예) 서초동 김OO님"
                            className="w-full border-slate-200 rounded-lg focus:ring-[#8a765e]"
                        />
                    </div>

                    {/* Case Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Scale className="w-4 h-4" /> 사건 분야
                        </label>
                        <input
                            type="text"
                            placeholder="예) 이혼 재산분할"
                            className="w-full border-slate-200 rounded-lg focus:ring-[#8a765e]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4" /> 평점 (별점)
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> 작성 일자 (수신일)
                        </label>
                        <input
                            type="date"
                            className="w-full border-slate-200 rounded-lg focus:ring-[#8a765e]"
                        />
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">후기 내용 (원본 텍스트)</label>
                    <textarea
                        className="w-full h-60 border border-slate-200 rounded-lg p-4 focus:ring-[#8a765e] resize-none leading-relaxed bg-slate-50"
                        placeholder="문자나 카톡 내용을 여기에 복사해서 붙여넣으세요..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
