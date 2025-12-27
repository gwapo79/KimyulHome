
"use client";

import { useState } from 'react';
import { MOCK_REVIEWS } from '@/data/mock_reviews';
import Link from 'next/link';
import { Star, Eye, EyeOff, ThumbsUp, MoreVertical, MessageSquare, Plus } from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState(MOCK_REVIEWS);

    const toggleVisibility = (id: string) => {
        setReviews(reviews.map(r =>
            r.id === id ? { ...r, status: r.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE' } : r
        ));
    };

    const toggleBest = (id: string) => {
        setReviews(reviews.map(r =>
            r.id === id ? { ...r, isBest: !r.isBest } : r
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">후기 관리</h2>
                    <p className="text-slate-500 text-sm mt-1">고객 리얼 후기 관리 및 베스트 선정</p>
                </div>
                <Link
                    href="/admin/reviews/new"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#8a765e] rounded-lg hover:bg-[#75644e] transition-colors"
                >
                    <Plus className="w-4 h-4" /> 후기 직접 등록
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className={`bg-white rounded-xl border p-6 transition-all ${review.status === 'HIDDEN' ? 'border-red-200 bg-red-50 opacity-75' : 'border-slate-200 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {review.authorName[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{review.authorName}</p>
                                    <p className="text-xs text-slate-400">{review.date} • {review.source}</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-slate-700 min-h-[4.5rem] line-clamp-3 mb-4 leading-relaxed">
                            {review.content}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <button
                                onClick={() => toggleBest(review.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${review.isBest
                                    ? 'bg-[#d4af37] text-white hover:bg-[#c4a132]'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                <ThumbsUp className="w-3 h-3" /> {review.isBest ? '베스트 선정됨' : '베스트 선정'}
                            </button>

                            <button
                                onClick={() => toggleVisibility(review.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${review.status === 'VISIBLE'
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                    }`}
                            >
                                {review.status === 'VISIBLE' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {review.status === 'VISIBLE' ? '노출 중' : '숨김 처리'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
