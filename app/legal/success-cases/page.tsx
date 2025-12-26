import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const revalidate = 0; // Disable static optimization for this page to always fetch fresh data


interface Props {
    searchParams: Promise<{
        category?: string;
        page?: string;
        keyword?: string;
        sort?: string;
    }>;
}

import SearchAndFilter from '@/app/components/legal/SearchAndFilter';

export default async function SuccessCasesPage({ searchParams }: Props) {
    // In Next.js 15+, searchParams is a Promise. We must await it.
    const { category, page, keyword, sort } = await searchParams;
    const currentPage = Number(page) || 1;
    const itemsPerPage = 12;
    const currentSort = sort || 'latest';

    // Build Prisma 'where' clause
    const where: any = {};
    if (category) {
        where.category = category;
    }
    if (keyword) {
        where.OR = [
            { title: { contains: keyword, mode: 'insensitive' } },
            { summary: { contains: keyword, mode: 'insensitive' } },
        ];
    }

    // Build Prisma 'orderBy' clause
    let orderBy: any = { createdAt: 'desc' }; // Default: latest
    if (currentSort === 'oldest') {
        orderBy = { createdAt: 'asc' };
    }
    // Add other sort options here if needed

    const totalCount = await prisma.successCase.count({ where });
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const cases = await prisma.successCase.findMany({
        where,
        orderBy,
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        include: {
            teamMember: true,
        },
    });

    const getPageUrl = (pageNum: number) => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (keyword) params.set('keyword', keyword);
        if (currentSort !== 'latest') params.set('sort', currentSort);
        params.set('page', pageNum.toString());
        return `/legal/success-cases?${params.toString()}`;
    };

    return (
        <main>
            <section id="hero" className="bg-[#6F614D] h-[480px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                    <div className="text-center">
                        <p className="text-[#DCD6C9] font-semibold mb-2">성공 사례 모음</p>
                        <h1 className="text-5xl lg:text-6xl font-bold text-[#F5F1E8] mb-4">실제 사례로 검증된 결과</h1>
                        <p className="text-xl text-[#DCD6C9] max-w-3xl mx-auto">
                            유사한 사례를 찾아보며 해결 전략을 참고하세요. 부동산, 금융, 개인회생 등 다양한 사건에서 고객의 권리와 재산을 지켜낸 실제 사례를 소개합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section id="cards" className="py-24 bg-[#F9FAFB]"> {/* bg-brand-gray-light approx */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div className="flex flex-wrap gap-2">
                            <Link href="/legal/success-cases" className={`px-4 py-2 rounded-full font-medium cursor-pointer transition-colors ${!category ? 'bg-[#8a765e] text-white' : 'bg-white border border-[#cfd2d6] text-[#535861] hover:bg-neutral-100'}`}>전체 보기</Link>
                            <Link href="/legal/success-cases?category=부동산 법률" className={`px-4 py-2 rounded-full font-medium cursor-pointer transition-colors ${category === '부동산 법률' ? 'bg-[#8a765e] text-white' : 'bg-white border border-[#cfd2d6] text-[#535861] hover:bg-neutral-100'}`}>부동산 법률</Link>
                            <Link href="/legal/success-cases?category=금융 솔루션" className={`px-4 py-2 rounded-full font-medium cursor-pointer transition-colors ${category === '금융 솔루션' ? 'bg-[#8a765e] text-white' : 'bg-white border border-[#cfd2d6] text-[#535861] hover:bg-neutral-100'}`}>금융 솔루션</Link>
                            <Link href="/legal/success-cases?category=개인회생" className={`px-4 py-2 rounded-full font-medium cursor-pointer transition-colors ${category === '개인회생' ? 'bg-[#8a765e] text-white' : 'bg-white border border-[#cfd2d6] text-[#535861] hover:bg-neutral-100'}`}>개인회생</Link>
                            <Link href="/legal/success-cases?category=기타 법률" className={`px-4 py-2 rounded-full font-medium cursor-pointer transition-colors ${category === '기타 법률' ? 'bg-[#8a765e] text-white' : 'bg-white border border-[#cfd2d6] text-[#535861] hover:bg-neutral-100'}`}>기타 법률</Link>
                        </div>
                        {/* Interactive Search and Filter Component */}
                        <SearchAndFilter />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cases.length === 0 ? (
                            <div className="col-span-3 text-center py-20 flex flex-col items-center justify-center">
                                <div className="mb-6 text-6xl text-[#cfd2d6]">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-[#181d27] mb-2">검색 결과가 없습니다</h3>
                                <p className="text-[#535861] mb-8">
                                    {keyword ? `'${keyword}'에 대한 검색 결과가 없습니다.` : '등록된 성공사례가 없습니다.'}<br />
                                    다른 검색어로 다시 시도해보시거나 전체 목록을 확인해보세요.
                                </p>
                                <Link
                                    href="/legal/success-cases"
                                    className="px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#7a6855] transition-colors"
                                >
                                    전체 보기
                                </Link>
                            </div>
                        ) : (
                            cases.map((successCase, index) => {
                                // Placeholder images logic based on legacy html structure if meaningful, 
                                // or just cycle through a few generic ones if no specific image in DB
                                const images = [
                                    "https://storage.googleapis.com/uxpilot-auth.appspot.com/60131c9c67-c6b77a8f842aee14bb3f.png",
                                    "https://storage.googleapis.com/uxpilot-auth.appspot.com/7de993d8fd-bddc55e6c22ef6f4fcfd.png",
                                    "https://storage.googleapis.com/uxpilot-auth.appspot.com/59ed444242-a061075731e5874db185.png",
                                    "https://storage.googleapis.com/uxpilot-auth.appspot.com/a755204ee1-57210b530f8586220afe.png",
                                    "https://storage.googleapis.com/uxpilot-auth.appspot.com/0ed1c78dc7-c96b0e2f302cb3b67539.png",
                                    "https://storage.googleapis.com/uxpilot-auth.appspot.com/fee7fea59e-34d4fd1500c79fe7ded2.png"
                                ];
                                // Use DB image if available, else pick strictly by index for consistent demo look
                                const bgImage = successCase.imageUrl || images[index % images.length];

                                return (
                                    <Link href={`/legal/success-cases/${successCase.id}`} key={successCase.id}>
                                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer h-full">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={bgImage}
                                                    alt={successCase.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <p className="text-sm text-[#8a765e] font-semibold mb-2">{successCase.category}</p>
                                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">{successCase.title}</h3>
                                                <p className="text-[#535861] mb-4 line-clamp-2">{successCase.summary}</p>
                                                <div className="flex items-center mt-auto">
                                                    <img
                                                        src={successCase.teamMember?.imageUrl || successCase.lawyerImageUrl || "/assets/images/profiles/profile_07_v2.png"}
                                                        alt={successCase.lawyer || "변호사"}
                                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-sm text-[#181d27]">{successCase.lawyer || '담당 변호사'}</p>
                                                        <p className="text-xs text-[#9ca3af]">10 Apr 2025</p>
                                                    </div>
                                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div id="pagination" className="flex justify-center items-center mt-16 space-x-2">
                            {/* Prev Button */}
                            <Link
                                href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                                className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg ${currentPage > 1
                                    ? 'text-[#535861] hover:text-[#8a765e] cursor-pointer'
                                    : 'text-gray-300 pointer-events-none'
                                    }`}
                                aria-disabled={currentPage <= 1}
                            >
                                <i className="fas fa-arrow-left"></i>
                            </Link>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Link
                                    key={pageNum}
                                    href={getPageUrl(pageNum)}
                                    className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${currentPage === pageNum
                                        ? 'bg-[#8a765e] text-white font-bold'
                                        : 'text-[#535861] hover:bg-neutral-100'
                                        }`}
                                >
                                    {pageNum}
                                </Link>
                            ))}

                            {/* Next Button */}
                            <Link
                                href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                                className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg ${currentPage < totalPages
                                    ? 'text-[#535861] hover:text-[#8a765e] cursor-pointer'
                                    : 'text-gray-300 pointer-events-none'
                                    }`}
                                aria-disabled={currentPage >= totalPages}
                            >
                                <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <section id="cta" className="py-24 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">나와 비슷한 사례가 있나요?</h2>
                    <p className="text-lg text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
                        혼자 고민하지 마세요. 저희 전문가팀이 고객님의 상황과 가장 유사한 성공 사례를 비교 분석하여 최적의 해결책을 제시해 드립니다.
                    </p>
                    <Link href="/company/consultation" className="px-8 py-4 bg-white text-[#5f4e3c] rounded-lg font-semibold hover:bg-neutral-100 transition-colors cursor-pointer text-lg inline-block">
                        전문가와 케이스 비교하기
                    </Link>
                </div>
            </section>
        </main>
    );
}
