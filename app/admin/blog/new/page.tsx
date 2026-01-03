
"use client";

import { useState } from 'react';
import { ArrowLeft, Save, Globe, Image as ImageIcon, LayoutTemplate, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBlogPost } from '@/app/actions/blog';
import RichTextEditor from '../../../components/admin/RichTextEditor';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector';
import ImageUploadBox from '@/app/components/admin/ImageUploadBox';


export default function NewBlogPostPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [assignedProfileId, setAssignedProfileId] = useState<string | null>(null);

    return (
        <form action={createBlogPost} className="max-w-6xl mx-auto pb-20">
            {/* Header / Actions */}
            <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-slate-50 pt-4 pb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">새 블로그 글 작성</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        임시저장
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#8a765e] rounded-lg hover:bg-[#75644e] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? '발행 중...' : (
                            <>
                                <Globe className="w-4 h-4" /> 발행하기
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[calc(100vh-12rem)]">
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="제목을 입력하세요"
                            className="w-full text-3xl font-bold text-slate-800 placeholder:text-slate-300 border-none focus:ring-0 p-0 mb-6 bg-transparent"
                        />
                        <div className="w-full h-[1px] bg-slate-100 mb-6" />

                        {/* Hidden Inputs for Non-Input State */}
                        <input type="hidden" name="content" value={content} />
                        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
                        <input type="hidden" name="assignedProfileId" value={assignedProfileId || ''} />

                        {/* Fallback Author Name (Optional) */}
                        <input type="hidden" name="author" value="Admin" />

                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                </div>

                {/* Sidebar Options */}
                <div className="space-y-6">
                    {/* Author Selection */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <AssigneeSelector
                            label="작성자 선택 (외부 노출용)"
                            roleFilter={['LAWYER', 'PROFESSIONAL', 'CEO'] as any}
                            currentAssigneeId={assignedProfileId}
                            onAssign={setAssignedProfileId}
                        />
                    </div>
                    {/* Category */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Tag className="w-4 h-4" /> 카테고리
                        </h3>
                        <div className="space-y-2">
                            {['법률상식', '사무소소식', '언론보도', '승소사례'].map((cat) => (
                                <label key={cat} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="radio" name="category" value={cat} className="text-[#8a765e] focus:ring-[#8a765e]" defaultChecked={cat === '법률상식'} />
                                    <span className="text-sm text-slate-700">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> 썸네일
                        </h3>
                        <ImageUploadBox
                            label="썸네일 업로드"
                            initialUrl={thumbnailUrl}
                            onUploadComplete={setThumbnailUrl}
                            onRemove={() => setThumbnailUrl('')}
                            aspectRatio="aspect-[1.91/1]"
                        />
                    </div>

                    {/* SEO / Settings */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" /> 설정 (SEO)
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 block mb-1">한 줄 요약 (Excerpt)</label>
                                <textarea name="excerpt" rows={3} className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded bg-slate-50" placeholder="목록에 표시될 요약문" />
                            </div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">공개 여부</span>
                                <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#8a765e]">
                                    <span className="translate-x-5 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition" />
                                </div>
                                <input type="hidden" name="status" value="PUBLISHED" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
