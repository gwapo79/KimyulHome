
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { getTeamMemberByName } from '@/app/constants/team';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const revalidate = 0;

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { title: '게시물을 찾을 수 없습니다' };

    return {
        title: `${post.title}`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `/media/blog/${id}`,
            images: [
                {
                    url: post.thumbnailUrl || '/assets/images/logo.jpg',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author],
        }
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
            authorMember: true,
            assignedProfile: true
        }
    });

    if (!post) {
        notFound();
    }

    // Fallback Logic
    const authorName = post.assignedProfile?.name || post.authorMember?.name || post.author || "서초지율 법률팀";

    const mapRole = (role?: string) => {
        if (role === 'CEO') return '대표 변호사';
        if (role === 'PROFESSIONAL' || role === 'LAWYER') return '담당 변호사';
        if (role === 'STAFF') return '법률 스태프';
        return '법률 전문가';
    };
    const authorRole = mapRole(post.assignedProfile?.role as string) || "법률 전문가";
    const authorImage = post.assignedProfile?.avatarUrl || post.authorMember?.imageUrl || getTeamMemberByName(post.author || '').imageUrl;

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#fdfcfb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category & Date */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="px-3 py-1 rounded-full bg-[#8a765e] text-white text-sm font-bold">
                            {post.category}
                        </span>
                        <span className="text-[#8a765e] text-sm font-medium">
                            Legal Insights
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-[#181d27] text-center leading-tight mb-8 break-keep">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#717680] mb-8">
                        <div className="flex items-center">
                            {authorImage ? (
                                <img
                                    src={authorImage}
                                    alt={authorName}
                                    className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500 font-bold">
                                    {authorName[0]}
                                </div>
                            )}
                            <div className="text-left">
                                <div className="font-medium text-[#181d27]">{authorName}</div>
                                <div className="text-[#717680]">{authorRole}</div>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-[#e9e9eb]"></div>
                        <div>
                            <i className="fa-solid fa-calendar mr-2 text-[#8a765e]"></i>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-[#e9e9eb]"></div>
                        <div>
                            <i className="fa-solid fa-eye mr-2 text-[#8a765e]"></i>
                            {post.viewCount}회 조회
                        </div>
                    </div>

                    {/* Social Share (Visual Only) */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-sm text-[#717680] mr-2">공유하기:</span>
                        <button aria-label="페이스북 공유" className="w-10 h-10 bg-[#1877f2] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                            <i className="fa-brands fa-facebook-f"></i>
                        </button>
                        <button aria-label="트위터 공유" className="w-10 h-10 bg-[#1da1f2] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                            <i className="fa-brands fa-twitter"></i>
                        </button>
                        <button aria-label="카카오톡 공유" className="w-10 h-10 bg-[#fee500] text-[#000000] rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                            <i className="fa-solid fa-comment"></i>
                        </button>
                        <button aria-label="링크 복사" className="w-10 h-10 bg-[#00c73c] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                            <i className="fa-solid fa-link"></i>
                        </button>
                    </div>

                    {/* Featured Image - Hero Banner */}
                    <div className="mb-12">
                        <div className="aspect-video w-full rounded-2xl relative overflow-hidden bg-gray-100 shadow-lg">
                            {post.thumbnailUrl ? (
                                <img
                                    src={post.thumbnailUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.category)} flex items-center justify-center`}>
                                    <i className={`fa-solid ${getIcon(post.category)} text-white text-9xl opacity-20`}></i>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 sm:p-8">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block border border-white/20">
                                    <h3 className="text-white font-semibold text-lg mb-1">전문가 법률 가이드</h3>
                                    <p className="text-white/90 text-sm">서초지율 합동법률사무소 제공</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-[#717680] mt-3 text-center">
                            * 본 게시물의 내용은 참고용이며, 개별 사건의 결과를 보장하지 않습니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <section id="article-body" className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* React Markdown Renderer */}
                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#181d27] prose-p:text-[#535861] prose-a:text-[#8a765e] prose-strong:text-[#181d27]">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                h2: ({ node, ...props }: any) => (
                                    <h2 className="text-3xl font-bold mt-12 mb-6 pb-2 border-b-2 border-[#8a765e] inline-block" {...props} />
                                ),
                                h3: ({ node, ...props }: any) => (
                                    <h3 className="text-xl font-bold mt-8 mb-4 text-[#74634e] flex items-center" {...props}>
                                        <span className="w-2 h-2 rounded-full bg-[#8a765e] mr-3 inline-block"></span>
                                        {props.children}
                                    </h3>
                                ),
                                strong: ({ node, ...props }: any) => (
                                    <strong className="bg-[#fff5b1] px-1 rounded text-[#181d27] font-extrabold" {...props} />
                                ),
                                blockquote: ({ node, ...props }: any) => (
                                    <blockquote className="bg-[#f9fafb] border-l-4 border-[#8a765e] p-6 my-8 rounded-r-lg shadow-sm" {...props}>
                                        <div className="flex items-start">
                                            <i className="fa-solid fa-quote-left text-[#8a765e] text-2xl mr-4 opacity-30"></i>
                                            <div className="text-lg font-medium text-[#181d27] italic">
                                                {props.children}
                                            </div>
                                        </div>
                                    </blockquote>
                                ),
                                ul: ({ node, ...props }: any) => (
                                    <ul className="list-none space-y-2 my-6 pl-0" {...props} />
                                ),
                                li: ({ node, ...props }: any) => (
                                    <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#8a765e] before:font-bold">
                                        {props.children}
                                    </li>
                                ),
                                table: ({ node, ...props }: any) => (
                                    <div className="overflow-x-auto my-8 border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200" {...props} />
                                    </div>
                                ),
                                th: ({ node, ...props }: any) => (
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                                ),
                                td: ({ node, ...props }: any) => (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-t border-gray-100" {...props} />
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Back Button */}
                    <div className="mt-16 text-center border-t border-gray-100 pt-12">
                        <Link
                            href="/media/blog"
                            className="inline-flex items-center px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#8a765e] hover:text-[#8a765e] transition-colors text-gray-600 font-medium"
                        >
                            <i className="fa-solid fa-list mr-2"></i>
                            목록으로 돌아가기
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function getGradient(category: string) {
    switch (category) {
        case '민사': return 'from-blue-500 to-cyan-500';
        case '형사': return 'from-red-500 to-orange-500';
        case '가사': return 'from-pink-500 to-rose-500';
        case '기업': return 'from-indigo-500 to-purple-500';
        default: return 'from-slate-500 to-gray-500';
    }
}

function getIcon(category: string) {
    switch (category) {
        case '민사': return 'fa-scale-balanced';
        case '형사': return 'fa-gavel';
        case '가사': return 'fa-hands-holding-child';
        case '기업': return 'fa-building';
        default: return 'fa-scale-unbalanced';
    }
}
