
"use client";

import { useState } from 'react';
import { ArrowLeft, Save, Globe, Image as ImageIcon, LayoutTemplate, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import RichTextEditor from '../../../components/admin/RichTextEditor';

export default function NewBlogPostPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState('');

    const handleSave = () => {
        setIsLoading(true);
        // Mock save
        setTimeout(() => {
            alert('글이 발행되었습니다.');
            router.push('/admin/blog');
        }, 1000);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header / Actions */}
            <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-slate-50 pt-4 pb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">새 블로그 글 작성</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        임시저장
                    </button>
                    <button
                        onClick={handleSave}
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
                            placeholder="제목을 입력하세요"
                            className="w-full text-3xl font-bold text-slate-800 placeholder:text-slate-300 border-none focus:ring-0 p-0 mb-6 bg-transparent"
                        />
                        <div className="w-full h-[1px] bg-slate-100 mb-6" />

                        {/* Mock WYSIWYG Body */}
                        {/* Mock WYSIWYG Body */}
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
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> 작성자 (Author)
                        </h3>
                        <select className="w-full text-sm border-slate-200 rounded-lg focus:ring-[#8a765e]">
                            <option>김지율 대표변호사</option>
                            <option>이영희 파트너 변호사</option>
                            <option>박철수 법무사</option>
                            <option>관리자 (Admin)</option>
                        </select>
                    </div>
                    {/* Category */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Tag className="w-4 h-4" /> 카테고리
                        </h3>
                        <div className="space-y-2">
                            {['법률상식', '사무소소식', '언론보도', '승소사례'].map((cat) => (
                                <label key={cat} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="radio" name="category" className="text-[#8a765e] focus:ring-[#8a765e]" />
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
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-[#8a765e] hover:bg-[#fffdfa] transition-colors cursor-pointer group">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8a765e] group-hover:text-white transition-colors">
                                <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </div>
                            <p className="text-xs text-slate-400">클릭하여 이미지 업로드</p>
                            <p className="text-[10px] text-slate-300 mt-1">권장: 1200 x 630px</p>
                        </div>
                    </div>

                    {/* SEO / Settings */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" /> 설정
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 block mb-1">URL 슬러그</label>
                                <input type="text" className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded bg-slate-50" placeholder="ex) jeonse-scam-guide" />
                            </div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">공개 여부</span>
                                <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#8a765e]">
                                    <span className="translate-x-5 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
