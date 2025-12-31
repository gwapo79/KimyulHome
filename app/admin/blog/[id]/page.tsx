
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Edit, Calendar, User, Eye, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { id }
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Link href="/admin/blog" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
                </Link>
                <div className="flex gap-3">
                    <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="flex items-center gap-2 bg-[#8a765e] text-white px-4 py-2 rounded-lg hover:bg-[#75644e] transition-colors"
                    >
                        <Edit className="w-4 h-4" /> 수정하기
                    </Link>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Meta Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                    <div className="flex gap-2 mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-slate-200 text-slate-600">
                            {post.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {post.status}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>{post.viewCount} 조회</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8">
                    {/* Thumbnail if exists */}
                    {post.thumbnailUrl && (
                        <div className="mb-8 rounded-lg overflow-hidden border border-slate-100">
                            <img src={post.thumbnailUrl} alt="Thumbnail" className="w-full h-auto max-h-[400px] object-cover" />
                        </div>
                    )}


                    {/* Direct HTML Rendering for WYSIWYG Content */}
                    <div
                        className="prose prose-slate max-w-none leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />
                </div>
            </div>

            {/* Additional Info / ID */}
            <div className="text-xs text-slate-400 text-right">
                ID: {post.id}
            </div>
        </div>
    );
}
