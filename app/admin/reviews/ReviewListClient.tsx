'use client';

import { useState } from 'react';
import { Review } from '@prisma/client';
import { Star, Eye, EyeOff, ThumbsUp, MoreVertical, Plus } from 'lucide-react';
import Link from 'next/link';
import { toggleReviewBest, toggleReviewVisibility } from '@/app/actions/review';
import { toast } from 'sonner';
import Avatar from '@/app/components/ui/Avatar';

interface ReviewListClientProps {
    initialReviews: (Review & { counselor?: any })[];
}

export default function ReviewListClient({ initialReviews }: ReviewListClientProps) {
    // Optimistic UI could be used here, but for simplicity relying on router refresh (via Server Action revalidatePath)
    // However, to make it instant, let's keep local state too, syncing with props if they change.
    const [reviews, setReviews] = useState(initialReviews);

    const handleToggleBest = async (id: string, currentBest: boolean) => {
        // Optimistic update
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isBest: !currentBest } : r));

        const result = await toggleReviewBest(id, currentBest);
        if (!result.success) {
            toast.error('변경 실패');
            // Revert
            setReviews(prev => prev.map(r => r.id === id ? { ...r, isBest: currentBest } : r));
        } else {
            toast.success(currentBest ? '베스트 해제됨' : '베스트 선정됨');
        }
    };

    const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
        // Optimistic update
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isVisible: !currentVisible } : r));

        const result = await toggleReviewVisibility(id, currentVisible);
        if (!result.success) {
            toast.error('변경 실패');
            // Revert
            setReviews(prev => prev.map(r => r.id === id ? { ...r, isVisible: currentVisible } : r));
        } else {
            toast.success(currentVisible ? '숨김 처리됨' : '노출 처리됨');
        }
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
                {reviews.map((review) => {
                    // Name Masking Helper
                    const maskName = (name: string) => {
                        // 1. Filter out "Code" names (e.g. "의뢰인 W74", "User G32")
                        // Checks for patterns: starts with "의뢰인" or "User" followed by alphanumeric
                        if (/^(의뢰인|User)\s*[A-Z0-9]+$/.test(name) || name === '익명') {
                            return '익명 의뢰인';
                        }

                        // 2. Real Name Masking
                        if (name.length <= 1) return name; // Single char?
                        if (name.length === 2) return name[0] + '*'; // "김철" -> "김*"
                        return name[0] + '*'.repeat(name.length - 1); // "홍길동" -> "홍**"
                    };

                    const maskedAuthor = maskName(review.author);

                    return (
                        <div
                            key={review.id}
                            className={`bg-white rounded-xl border p-6 transition-all ${!review.isVisible ? 'border-red-200 bg-red-50 opacity-75' : 'border-slate-200 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={review.authorImageUrl}
                                        alt={maskedAuthor}
                                        fallback={maskedAuthor}
                                        className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                            {maskedAuthor}
                                            {maskedAuthor === '익명 의뢰인' && (
                                                <span className="text-[10px] text-slate-400 font-normal bg-slate-100 px-1.5 py-0.5 rounded-full">
                                                    비회원
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {review.date || new Date(review.createdAt).toLocaleDateString()} • {review.category || '기타'}
                                        </p>
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

                            <p className="text-sm text-slate-700 min-h-[4.5rem] line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
                                {review.content}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleToggleBest(review.id, review.isBest)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${review.isBest
                                        ? 'bg-[#d4af37] text-white hover:bg-[#c4a132]'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    <ThumbsUp className="w-3 h-3" /> {review.isBest ? '베스트 선정됨' : '베스트 선정'}
                                </button>

                                <button
                                    onClick={() => handleToggleVisibility(review.id, review.isVisible)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${review.isVisible
                                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                        }`}
                                >
                                    {review.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {review.isVisible ? '노출 중' : '숨김 처리'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                    <p className="text-slate-500">등록된 후기가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
