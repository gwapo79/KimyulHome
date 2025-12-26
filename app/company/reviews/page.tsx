import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatClientName } from '@/lib/utils';
export const dynamic = 'force-dynamic';

export const revalidate = 0;

interface Props {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function ReviewsPage({ searchParams }: Props) {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const itemsPerPage = 9; // 3x3 grid

    // Fetch from SuccessCase instead of Review
    const totalCount = await prisma.successCase.count();
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const reviews = await prisma.successCase.findMany({
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            category: true,
            summary: true,
            client: true,
            createdAt: true,
            lawyer: true,
        }
    });

    const getPageUrl = (pageNum: number) => {
        return `/company/reviews?page=${pageNum}`;
    };

    return (
        <main className="bg-[#F9FAFB] min-h-screen">
            {/* Hero Section */}
            <section id="hero" className="bg-[#6F614D] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-[#DCD6C9] font-medium mb-2 tracking-wide uppercase">Client Reviews</p>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#F5F1E8] mb-6">
                        의뢰인들이 전하는 <span className="text-white">감동의 메시지</span>
                    </h1>
                    <p className="text-lg text-[#E3DACE] max-w-2xl mx-auto leading-relaxed">
                        법무법인 율신과 함께 어려운 법적 문제를 해결하고<br className="hidden md:block" />
                        새로운 희망을 찾은 분들의 실제 이야기를 확인하세요.
                    </p>
                </div>
            </section>

            {/* Reviews Grid Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {reviews.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            아직 등록된 후기가 없습니다.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden group"
                                >
                                    <div className="p-8 flex flex-col flex-grow">
                                        {/* Header: Badge & Writer */}
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="inline-block px-3 py-1 bg-[#8a765e]/10 text-[#8a765e] text-xs font-semibold rounded-full">
                                                {review.category}
                                            </span>
                                            <div className="flex text-yellow-400 text-xs gap-0.5">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="mb-6 flex-grow">
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#8a765e] transition-colors">
                                                    {review.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                                                    "{review.summary || '내용이 없습니다.'}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer: Client Info & Button */}
                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                    {formatClientName(review.client || '익명 고객')[0]}
                                                </div>
                                                <div className="text-xs">
                                                    <p className="font-semibold text-gray-900">{formatClientName(review.client || '익명 고객')}</p>
                                                    <p className="text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link Button Area */}
                                    <Link
                                        href={`/legal/success-cases/${review.id}`}
                                        className="bg-gray-50 px-8 py-4 text-center text-sm font-medium text-[#535861] hover:bg-[#8a765e] hover:text-white transition-colors border-t border-gray-100 group-hover:border-[#8a765e]"
                                    >
                                        자세한 사례 보기 <i className="fas fa-arrow-right ml-2 text-xs"></i>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-16 gap-2">
                            <Link
                                href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${currentPage > 1 ? 'text-[#535861] hover:bg-white hover:shadow-sm' : 'text-gray-300 pointer-events-none'}`}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </Link>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Link
                                    key={pageNum}
                                    href={getPageUrl(pageNum)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${currentPage === pageNum
                                        ? 'bg-[#8a765e] text-white shadow-md'
                                        : 'text-[#535861] hover:bg-white hover:shadow-sm'
                                        }`}
                                >
                                    {pageNum}
                                </Link>
                            ))}

                            <Link
                                href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${currentPage < totalPages ? 'text-[#535861] hover:bg-white hover:shadow-sm' : 'text-gray-300 pointer-events-none'}`}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
