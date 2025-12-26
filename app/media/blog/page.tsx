import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: '법률·금융 인사이트 | 서초지율',
    description: '최신 판례와 실전 가이드를 확인하세요.',
};

interface Props {
    searchParams: Promise<{
        page?: string;
        category?: string;
        q?: string;
    }>;
}

export default async function BlogListPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const category = params.category || 'all';
    const query = params.q || '';
    const limit = 9; // 3x3 grid
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};
    if (category && category !== 'all') {
        where.category = category;
    }
    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
        ];
    }

    // Fetch data
    const [posts, totalCount] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
            include: {
                authorMember: true,
            },
        } as any),
        prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Category map for display
    const categoryMap: Record<string, string> = {
        'all': '전체',
        'real-estate': '부동산 분쟁',
        'debt': '채무 관리',
        'rehab': '개인회생',
        'case-law': '판례',
        'guide': '가이드'
    };

    const getCategoryName = (cat: string) => categoryMap[cat] || cat;

    // Helper for category badge color
    const getBadgeColor = (cat: string) => {
        switch (cat) {
            case 'real-estate': return 'bg-white bg-opacity-90 text-[#74634e]'; // Brownish
            case 'debt': return 'bg-white bg-opacity-90 text-[#15803d]';        // Green
            case 'rehab': return 'bg-white bg-opacity-90 text-[#3537cc]';       // Blue
            case 'case-law': return 'bg-white bg-opacity-90 text-[#c01573]';    // Pink
            default: return 'bg-white bg-opacity-90 text-gray-700';
        }
    };
    // Helper for gradient bg
    const getGradient = (cat: string) => {
        switch (cat) {
            case 'real-estate': return 'from-[#8a765e] to-[#74634e]';
            case 'debt': return 'from-[#15803d] to-[#16a34a]';
            case 'rehab': return 'from-[#3537cc] to-[#2563eb]';
            case 'case-law': return 'from-[#c01573] to-[#be185d]';
            default: return 'from-gray-500 to-gray-600';
        }
    };


    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <section id="hero" className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">법률·금융 인사이트</h1>
                        <p className="text-xl text-[#535861] max-w-3xl mx-auto mb-8">
                            최신 판례와 실전 가이드를 확인하세요
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <form action="/media/blog" method="GET" className="relative">
                            <input type="hidden" name="category" value={category} />
                            <input
                                type="text"
                                name="q"
                                defaultValue={query}
                                placeholder="궁금한 주제를 검색해보세요 (예: 전세사기 판례, 개인회생 절차)"
                                className="w-full px-6 py-4 pl-12 rounded-2xl border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none text-lg"
                            />
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-[#717680]"></i>
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#8a765e] text-white rounded-xl hover:bg-[#74634e] transition-colors"
                            >
                                검색
                            </button>
                        </form>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {Object.keys(categoryMap).map((catKey) => (
                            <Link
                                key={catKey}
                                href={`/media/blog?category=${catKey}&q=${query}`}
                                className={`px-6 py-3 rounded-full font-medium transition-colors border ${category === catKey
                                    ? 'bg-[#8a765e] text-white border-[#8a765e]'
                                    : 'bg-white text-[#535861] border-[#d5d6d9] hover:border-[#8a765e] hover:text-[#8a765e]'
                                    }`}
                            >
                                {categoryMap[catKey]}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section id="cards" className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-6">
                            {query ? `'${query}' 검색 결과` : category === 'all' ? '추천 콘텐츠' : `${getCategoryName(category)}`}
                        </h2>
                        <div className="text-sm text-gray-500 mb-4">총 {totalCount}개의 글</div>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                                    {/* Thumbnail Area - Aspect Ratio 16:9 */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                                        {post.thumbnailUrl ? (
                                            <img
                                                src={post.thumbnailUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.category)}`}></div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                                        <div className="absolute bottom-4 left-4 right-4 z-10">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(post.category)} shadow-sm`}>
                                                    {getCategoryName(post.category)}
                                                </span>
                                                <span className="text-white text-sm font-medium drop-shadow-md">5분 읽기</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center justify-between mb-3 text-sm text-[#717680]">
                                            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                                            <div className="flex items-center">
                                                <i className="fa-solid fa-eye mr-1"></i>
                                                {post.viewCount.toLocaleString()}
                                            </div>
                                        </div>
                                        <Link href={`/media/blog/${post.id}`} className="block group">
                                            <h3 className="text-xl font-bold text-[#181d27] mb-3 group-hover:text-[#74634e] transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <p className="text-[#535861] mb-4 leading-relaxed line-clamp-2">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center">
                                                {/* Author Avatar */}
                                                {post.authorMember?.imageUrl ? (
                                                    <img
                                                        src={post.authorMember.imageUrl}
                                                        alt={post.author}
                                                        className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-xs font-bold text-gray-500">
                                                        {post.author[0]}
                                                    </div>
                                                )}
                                                <span className="text-sm text-[#535861]">{post.author}</span>
                                            </div>
                                            <Link href={`/media/blog/${post.id}`} className="flex items-center text-[#8a765e] hover:text-[#74634e] font-medium transition-colors text-sm">
                                                자세히 보기 <i className="fa-solid fa-arrow-right ml-2"></i>
                                            </Link>
                                        </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12 gap-2">
                            {page > 1 && (
                                <Link
                                    href={`/media/blog?page=${page - 1}&category=${category}&q=${query}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                                >
                                    이전
                                </Link>
                            )}
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const p = i + 1;
                                // Show limited range of pages for simplicity, or all if small
                                if (p !== 1 && p !== totalPages && Math.abs(p - page) > 2) return null; // Simple truncation logic could be better but sufficient for verified task
                                // Actually let's just show current, prev, next and ends

                                return (
                                    <Link
                                        key={p}
                                        href={`/media/blog?page=${p}&category=${category}&q=${query}`}
                                        className={`px-4 py-2 rounded-lg border ${page === p
                                            ? 'bg-[#8a765e] text-white border-[#8a765e]'
                                            : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        {p}
                                    </Link>
                                );
                            })}
                            {page < totalPages && (
                                <Link
                                    href={`/media/blog?page=${page + 1}&category=${category}&q=${query}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                                >
                                    다음
                                </Link>
                            )}
                        </div>
                    )}

                </div>
            </section >
        </main >
    );
}
