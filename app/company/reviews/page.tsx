
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

interface Props {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function ReviewsPage({ searchParams }: Props) {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const itemsPerPage = 10;

    const totalCount = await prisma.review.count();
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const reviews = await prisma.review.findMany({
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        orderBy: { createdAt: 'desc' },
    });

    const getPageUrl = (pageNum: number) => {
        return `/company/reviews?page=${pageNum}`;
    };

    return (
        <main>
            <section id="hero" className="bg-[#6F614D] h-[320px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                    <div className="text-center">
                        <p className="text-[#DCD6C9] font-semibold mb-2">고객 후기</p>
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#F5F1E8] mb-4">고객님들이 전하는 생생한 이야기</h1>
                        <p className="text-lg text-[#DCD6C9] max-w-2xl mx-auto">
                            진심을 담은 상담과 확실한 해결로 보답해 드린 결과입니다.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#F9FAFB]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center text-[#535861] font-bold">
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[#181d27] block">{review.author}</span>
                                            <span className="text-xs text-[#9ca3af]">
                                                {new Date(review.createdAt).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }).replace(/\. /g, '.').slice(0, -1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[#8a765e] bg-[#8a765e]/10 px-3 py-1 rounded-full">{review.category}</span>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-gray-200'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[#535861] leading-relaxed text-lg">
                                    "{review.content}"
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-16 gap-2">
                            <Link
                                href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                                className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${currentPage > 1 ? 'text-[#535861] hover:text-[#8a765e] hover:bg-neutral-100' : 'text-gray-300 pointer-events-none'
                                    }`}
                                aria-disabled={currentPage <= 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </Link>

                            {/* Simple Pagination Range */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Link
                                    key={pageNum}
                                    href={getPageUrl(pageNum)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${currentPage === pageNum
                                            ? 'bg-[#8a765e] text-white shadow-sm'
                                            : 'text-[#535861] hover:bg-neutral-100'
                                        }`}
                                >
                                    {pageNum}
                                </Link>
                            ))}

                            <Link
                                href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                                className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${currentPage < totalPages ? 'text-[#535861] hover:text-[#8a765e] hover:bg-neutral-100' : 'text-gray-300 pointer-events-none'
                                    }`}
                                aria-disabled={currentPage >= totalPages}
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
