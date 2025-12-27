'use client';

import { Search, PenSquare, FileText, Eye, MoreVertical, Edit } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector';
import { BlogPost } from '@prisma/client';

interface BlogListClientProps {
    initialPosts: BlogPost[];
}

export default function BlogListClient({ initialPosts }: BlogListClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMyTasks, setShowMyTasks] = useState(false);

    const filteredPosts = initialPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMyTask = showMyTasks ? post.author.includes('홍스탭') : true; // Keep legacy 'My Task' logic for now or update if needed
        return matchesSearch && matchesMyTask;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">공개</span>;
            case 'DRAFT': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">작성중</span>;
            case 'HIDDEN': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">비공개</span>;
            default: return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">블로그 관리</h2>
                    <p className="text-slate-500 text-sm mt-1">법률 상식 및 로펌 소식 콘텐츠 (DB 연동됨)</p>
                </div>
                <Link href="/admin/blog/new" className="bg-[#8a765e] text-white px-4 py-2 rounded-lg hover:bg-[#75644e] transition-colors text-sm font-medium flex items-center gap-2">
                    <PenSquare className="w-4 h-4" /> 새 글 쓰기
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="제목 또는 작성자 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showMyTasks}
                        onChange={(e) => setShowMyTasks(e.target.checked)}
                        className="rounded border-slate-300 text-[#8a765e] focus:ring-[#8a765e]"
                    />
                    <span className="text-sm font-medium text-slate-700">내 담당 업무만 보기</span>
                </label>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="table-fixed w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="w-[40%] px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-8">제목 / 정보</th>
                            <th className="w-[15%] px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">카테고리</th>
                            <th className="w-[15%] px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">실무 담당</th>
                            <th className="w-[10%] px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">조회수</th>
                            <th className="w-[10%] px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                            <th className="w-[10%] px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 pl-8">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-2 bg-slate-100 rounded text-slate-500">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Link href={`/admin/blog/${post.id}`} className="hover:underline hover:text-blue-600 block">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{post.title}</p>
                                            </Link>
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {post.category}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="w-full max-w-[140px]">
                                        <AssigneeSelector
                                            roleFilter={['STAFF', 'LAWYER']}
                                            currentAssigneeId={post.authorId || null}
                                            onAssign={(id: string | null) => {
                                                console.log('Assigned blog post to:', id);
                                                // TODO: Implement server action for immediate assignment update if needed
                                            }}
                                            label=""
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3 text-slate-400" />
                                        {post.viewCount.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(post.status)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100"
                                            title="수정"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
