'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Calendar, Eye, Smartphone, Monitor } from 'lucide-react';
import Avatar from '@/app/components/ui/Avatar';
import PostContent from '@/app/components/blog/PostContent';

interface AdminBlogDetailClientProps {
    post: any;
    authorName: string;
    authorImage: string;
    authorRole: string;
}

export default function AdminBlogDetailClient({ post, authorName, authorImage, authorRole }: AdminBlogDetailClientProps) {
    const [isMobileView, setIsMobileView] = useState(false);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
                    </Link>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setIsMobileView(false)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!isMobileView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Monitor className="w-4 h-4" /> PC 뷰
                        </button>
                        <button
                            onClick={() => setIsMobileView(true)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isMobileView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Smartphone className="w-4 h-4" /> 모바일 뷰
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="flex items-center gap-2 bg-[#8a765e] text-white px-4 py-2 rounded-lg hover:bg-[#75644e] transition-colors"
                    >
                        <Edit className="w-4 h-4" /> 수정하기
                    </Link>
                </div>
            </div>

            {/* Mobile View Container Wrapper */}
            <div className={`transition-all duration-300 mx-auto ${isMobileView ? 'max-w-[400px]' : 'max-w-4xl'}`}>

                {/* Main Content Card */}
                <div className={`bg-white shadow-sm border border-slate-200 overflow-hidden ${isMobileView ? 'rounded-[30px] border-4 border-slate-800 min-h-[800px]' : 'rounded-xl'}`}>

                    {/* Status Bar for Mobile Look */}
                    {isMobileView && (
                        <div className="h-7 bg-slate-800 flex items-center justify-between px-6">
                            <div className="text-[10px] text-white font-medium">9:41</div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-white opacity-20"></div>
                                <div className="w-3 h-3 rounded-full bg-white opacity-20"></div>
                            </div>
                        </div>
                    )}

                    {/* Meta Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-6">
                        <div className="flex gap-2 mb-3">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-white border border-slate-200 text-slate-600">
                                {post.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {post.status}
                            </span>
                        </div>
                        <h1 className={`${isMobileView ? 'text-xl' : 'text-2xl'} font-bold text-slate-900 mb-4 break-keep`}>{post.title}</h1>

                        <div className="flex flex-col gap-4">
                            {/* Author Row */}
                            <div className="flex items-center">
                                <Avatar
                                    src={authorImage}
                                    alt={authorName}
                                    fallback={authorName}
                                    className="w-10 h-10 mr-3 border border-gray-200"
                                />
                                <div className="text-left">
                                    <div className="font-medium text-[#181d27] text-sm">{authorName}</div>
                                    <div className="text-[#717680] text-xs">{authorRole}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-200 pt-3">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{post.viewCount} 조회</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className={`p-8 ${isMobileView ? 'p-5' : ''}`}>
                        {/* Thumbnail if exists */}
                        {post.thumbnailUrl && (
                            <div className="mb-8 rounded-lg overflow-hidden border border-slate-100">
                                <img src={post.thumbnailUrl} alt="Thumbnail" className="w-full h-auto max-h-[400px] object-cover" />
                            </div>
                        )}

                        {/* Direct HTML Rendering for WYSIWYG Content using PostContent */}
                        <PostContent content={post.content || ''} />
                    </div>
                </div>

                {/* Additional Info / ID */}
                <div className="text-xs text-slate-400 text-right mt-2 mr-2">
                    ID: {post.id}
                </div>
            </div>
        </div>
    );
}
