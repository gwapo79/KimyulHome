
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Edit, Trophy, User } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    };
}

export default async function SuccessDetailPage({ params }: Props) {
    const { id } = await params;
    const item = await prisma.successCase.findUnique({
        where: { id }
    });

    if (!item) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/success" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
                </Link>
                <div className="flex gap-3">
                    <Link
                        href={`/admin/success/${item.id}/edit`}
                        className="flex items-center gap-2 bg-[#181d27] text-white px-4 py-2 rounded-lg hover:bg-[#2a3241] transition-colors"
                    >
                        <Edit className="w-4 h-4" /> 수정하기
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Title & Badge */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
                                {item.category}
                            </span>
                            {item.result && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-bold bg-[#181d27] text-[#d4af37] border border-[#d4af37]">
                                    🏆 {item.result}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>
                        <div className="flex items-center gap-2 text-slate-500">
                            <User className="w-4 h-4" />
                            <span>담당: {item.lawyer || '미지정'}</span>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">사건 개요 (Summary)</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.summary || '-'}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">처리 결과 (Outcomes)</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.outcomes || '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">대응 전략 (Strategy)</h3>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {item.strategy || '내용 없음'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-xs text-slate-400 text-right">
                ID: {item.id}
            </div>
        </div>
    );
}
