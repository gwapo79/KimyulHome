import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeamMemberByName } from '@/app/constants/team';
import { formatClientName } from '@/lib/utils';

// Prevent static generation issues with dynamic params if needed, or allow dynamic rendering


interface Props {
    params: {
        id: string;
    };
}

export default async function SuccessCaseDetailPage({ params }: Props) {
    // Await params if using standard Next.js constraints or future proofs
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    const data = await prisma.successCase.findFirst({
        where: { id },
        include: { teamMember: true }
    });

    if (!data) {
        notFound();
    }


    // Parse lists
    let strategyList: any[] = [];
    try {
        if (data.strategy) {
            const trimmed = data.strategy.trim();
            // Check if it looks like JSON
            if (trimmed.startsWith('[')) {
                const parsed = JSON.parse(trimmed);
                // Handle double-stringified JSON (e.g. "[{...}]")
                if (typeof parsed === 'string') {
                    strategyList = JSON.parse(parsed);
                } else {
                    strategyList = parsed;
                }
            } else {
                // Fallback for plain text
                const lines = trimmed.split('\n').filter(Boolean);
                strategyList = [];

                // Check if lines follow "1. Title: Desc" pattern
                const isNumbered = lines.some(l => /^\d+\./.test(l));

                if (isNumbered) {
                    lines.forEach(line => {
                        // Regex to capture: 1. [Title]: Desc OR 1. **[Title]**: Desc
                        // Handles optional ** and []
                        const match = line.match(/^\d+\.\s*(?:\*\*)?(?:\[)?(.*?)(?:\])?(?:\*\*)?:\s*(.*)$/);
                        if (match) {
                            strategyList.push({
                                title: match[1], // Captured Title
                                description: match[2] // Captured Description
                            });
                        } else {
                            // Fallback if regex fails but it's a line
                            strategyList.push({
                                title: "Solution Step",
                                description: line.replace(/^\d+\.\s*/, '')
                            });
                        }
                    });
                } else {
                    // Legacy pairing mode (Title \n Description)
                    for (let i = 0; i < lines.length; i += 2) {
                        strategyList.push({
                            title: lines[i],
                            description: lines[i + 1] || ''
                        });
                    }
                }
            }
        }
    } catch (e) {
        console.error("Failed to parse strategy JSON:", e, data.strategy);
        // Fallback
        strategyList = [{ title: "해결 전략", description: data.strategy || "" }];
    }

    let outcomeList: string[] = [];
    try {
        if (data.outcomes) {
            const trimmed = data.outcomes.trim();
            if (trimmed.startsWith('[')) {
                const parsed = JSON.parse(trimmed);
                if (typeof parsed === 'string') {
                    outcomeList = JSON.parse(parsed);
                } else {
                    outcomeList = parsed;
                }
            } else {
                outcomeList = trimmed.split('\n').filter(Boolean);
            }
        }
    } catch (e) {
        console.error("Failed to parse outcomes JSON:", e, data.outcomes);
        outcomeList = data.outcomes ? data.outcomes.split('\n').filter(Boolean) : [];
    }

    const lawyerProfile = getTeamMemberByName(data.lawyer || '김서윤');

    return (
        <main>
            <section id="breadcrumb" className="bg-neutral-50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav aria-label="브레드크럼 네비게이션" className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-[#535861] hover:text-[#74634e] cursor-pointer">홈</Link>
                        <i className="fas fa-chevron-right text-[#717680] text-xs"></i>
                        <Link href="/legal/success-cases" className="text-[#535861] hover:text-[#74634e] cursor-pointer">성공사례</Link>
                        <i className="fas fa-chevron-right text-[#717680] text-xs"></i>
                        <span className="text-[#717680]">{data.title}</span>
                    </nav>
                </div>
            </section>
            <section id="overview" className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {data.detailImageUrl && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={data.detailImageUrl}
                                alt={data.title}
                                className="w-full h-64 md:h-96 object-cover object-top"
                            />
                        </div>
                    )}
                    <div className="mb-12">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-[#f8f3ed] text-[#74634e] text-sm font-semibold rounded-full border border-[#e5ceb4]">
                                {data.category}
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">
                            {data.title}
                        </h1>
                        <p className="text-xl text-[#535861] leading-relaxed">
                            {data.summary}
                        </p>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl p-8 mb-16">
                        <h2 className="text-2xl font-bold text-[#181d27] mb-8">사건 개요</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                    <span className="font-semibold text-[#535861]">의뢰인</span>
                                    <span className="text-[#181d27]">{formatClientName(data.client)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                    <span className="font-semibold text-[#535861]">사건 유형</span>
                                    <span className="text-[#181d27]">{data.caseType || '-'}</span>
                                </div>
                                {data.amount && (
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">
                                            {data.category.includes('회생') || data.category.includes('파산') ? '총 채무액' :
                                                data.category.includes('부동산') || data.category.includes('임대차') ? '보증금/피해액' :
                                                    data.category.includes('금융') ? '피해 금액' : '분쟁 금액'}
                                        </span>
                                        <span className="text-[#181d27] font-bold">{data.amount}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                    <span className="font-semibold text-[#535861]">처리 기간</span>
                                    <span className="text-[#181d27] font-bold">{data.period || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                    <span className="font-semibold text-[#535861]">담당 변호사</span>
                                    <span className="text-[#181d27]">{data.lawyer || '김법무 변호사'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                    <span className="font-semibold text-[#535861]">
                                        {data.category.includes('형사') ? '처분 결과' :
                                            data.category.includes('회생') ? '인가 내용' : '최종 결과'}
                                    </span>
                                    <span className="text-green-600 font-bold">{data.result || '성공'}</span>
                                </div>
                            </div>
                        </div>
                        {data.background && (
                            <div className="mt-8 pt-6 border-t border-[#e9e9eb]">
                                <h3 className="text-lg font-semibold text-[#181d27] mb-4">사건 배경</h3>
                                <p className="text-[#535861] leading-relaxed whitespace-pre-wrap">
                                    {data.background.replace(/### \[사건 개요\]\s*/g, '').replace(/### \[사건의 난제\]/g, '\n[사건의 난제]').replace(/\*\*/g, '')}
                                </p>
                            </div>
                        )}
                        <div className="mt-8 text-center">
                            <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-semibold cursor-pointer inline-block">
                                상담 신청하기
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {strategyList.length > 0 && (
                <section id="strategy" className="py-16 bg-neutral-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">어떻게 해결했나요?</h2>
                        <div className="space-y-8 mb-12">
                            {strategyList.map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#8a765e] text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                                        {item.step || index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-[#181d27] mb-3">{item.title}</h3>
                                        <p className="text-[#535861] leading-relaxed">
                                            {item.description || item.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-8 border-l-4 border-[#8a765e]">
                            <blockquote className="text-xl italic text-[#181d27] mb-4">
                                "{data.lawyerComment || "단순히 소송만 제기하는 것이 아니라, 사전 재산보전과 체계적인 재산조사를 통해 실질적인 회수 가능성을 높이는 것이 핵심입니다."}"
                            </blockquote>
                            <div className="flex items-center mt-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                    <img
                                        src={data.teamMember?.imageUrl || lawyerProfile.imageUrl}
                                        alt={data.teamMember?.name || lawyerProfile.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <cite className="text-[#535861] font-semibold not-italic tracking-tight font-pretendard-gov">{lawyerProfile.name} {lawyerProfile.role}</cite>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-semibold cursor-pointer inline-block">
                                상담 신청하기
                            </Link>
                        </div>
                    </div>
                </section>
            )}
            <section id="result" className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">결과</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                            <div className="text-lg font-semibold text-[#181d27] mb-1">전액 회수</div>
                            <div className="text-sm text-[#535861]">보증금 {data.amount} 완전 회수</div>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{data.period}</div>
                            <div className="text-lg font-semibold text-[#181d27] mb-1">신속 해결</div>
                            <div className="text-sm text-[#535861]">평균 대비 50% 단축</div>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
                            <div className="text-4xl font-bold text-purple-600 mb-2">+α</div>
                            <div className="text-lg font-semibold text-[#181d27] mb-1">지연이자 포함</div>
                            <div className="text-sm text-[#535861]">추가 손해배상 확보</div>
                        </div>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-[#181d27] mb-6">상세 성과</h3>
                        <div className="space-y-4">
                            {outcomeList.map((outcome, index) => (
                                <div key={index} className="flex items-center">
                                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                                    <span className="text-[#535861]">{outcome}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <Link href={`/legal/success-cases?category=${data.category}`} className="px-6 py-3 bg-white text-[#8a765e] border-2 border-[#8a765e] rounded-lg hover:bg-[#8a765e] hover:text-white transition-colors font-semibold cursor-pointer mr-4 inline-block">
                            더 많은 {data.category} 사례 보기
                        </Link>
                    </div>
                </div>
            </section>
            <section id="quote" className="py-16 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-12">고객 후기</h2>
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <div className="mb-6">
                            <img src="/assets/images/profiles/profile_07_v2.png" alt="고객 리뷰" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-[#8a765e]" />
                            <div className="text-5xl text-[#8a765e] mb-4">"</div>
                        </div>
                        <blockquote className="text-xl text-[#181d27] leading-relaxed mb-6 italic">
                            처음엔 {data.amount}이라는 큰 금액을 정말 돌려받을 수 있을지 반신반의했습니다. 하지만 {data.lawyer}님께서 체계적인 계획을 세워주시고 끝까지 포기하지 않고 이끌어주셔서 전액을 회수할 수 있었습니다. 정말 감사드립니다.
                        </blockquote>
                        <div className="flex items-center justify-center space-x-1 mb-4">
                            <i className="fas fa-star text-yellow-400"></i>
                            <i className="fas fa-star text-yellow-400"></i>
                            <i className="fas fa-star text-yellow-400"></i>
                            <i className="fas fa-star text-yellow-400"></i>
                            <i className="fas fa-star text-yellow-400"></i>
                        </div>
                        <cite className="text-[#535861] font-semibold">{formatClientName(data.client)} 고객</cite>
                    </div>
                    <div className="mt-8">
                        <Link href="/company/consultation" className="px-6 py-3 bg-white text-[#8a765e] rounded-lg hover:bg-neutral-100 transition-colors font-semibold cursor-pointer inline-block">
                            상담하기
                        </Link>
                    </div>
                </div>
            </section>
            <section id="related" className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">유사한 사례</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {
                            (await (async () => {
                                const [similarCases, similarBlogs] = await Promise.all([
                                    prisma.successCase.findMany({
                                        where: {
                                            category: data.category,
                                            id: { not: data.id }
                                        },
                                        take: 2,
                                        orderBy: { createdAt: 'desc' }
                                    }),
                                    prisma.blogPost.findMany({
                                        where: {
                                            category: data.category
                                        },
                                        take: 2,
                                        orderBy: { createdAt: 'desc' }
                                    })
                                ]);

                                // Normalize Success Cases
                                const normalizedCases = similarCases.map(item => ({
                                    id: item.id,
                                    type: 'legal/success-cases',
                                    title: item.title,
                                    category: item.category,
                                    summary: item.summary,
                                    imageUrl: item.imageUrl,
                                    date: item.createdAt,
                                    authorName: (item as any).lawyer || '김서윤',
                                    authorId: (item as any).lawyerId
                                }));

                                // Normalize Blog Posts
                                const normalizedBlogs = similarBlogs.map(item => ({
                                    id: item.id,
                                    type: 'media/blog',
                                    title: item.title,
                                    category: item.category,
                                    summary: item.excerpt, // Blog uses excerpt
                                    imageUrl: item.thumbnailUrl, // Blog uses thumbnailUrl
                                    date: item.createdAt,
                                    authorName: (item as any).author || '박준혁',
                                    authorId: (item as any).authorId
                                }));

                                return [...normalizedCases, ...normalizedBlogs];
                            })()).map((item) => {
                                const profile = getTeamMemberByName(item.authorName);
                                return (
                                    <Link key={item.id} href={`/${item.type}/${item.id}`} className="block group">
                                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                                            <div className="h-48 overflow-hidden bg-gray-200">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#e5ceb4] flex items-center justify-center text-[#74634e]">
                                                        <i className="fas fa-scale-unbalanced text-4xl"></i>
                                                    </div>
                                                )}
                                                {item.type === 'media/blog' && (
                                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#8a765e]">
                                                        BLOG
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <p className="text-sm text-[#8a765e] font-semibold mb-2">{item.category}</p>
                                                <h3 className="text-xl font-bold text-[#181d27] mb-3 line-clamp-2 bg-gradient-to-r from-[#181d27] to-[#181d27] bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-300 ease-out">{item.title}</h3>
                                                <p className="text-[#535861] mb-4 line-clamp-2">{item.summary}</p>
                                                <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-100 border border-gray-200 flex-shrink-0">
                                                        <img
                                                            src={profile.imageUrl}
                                                            alt={profile.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-[#181d27] tracking-tight font-pretendard-gov">{profile.name}</p>
                                                        <p className="text-xs text-[#717680]">{new Date(item.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <i className="fas fa-arrow-right ml-auto text-[#717680] group-hover:text-[#8a765e] transition-colors translate-x-0 group-hover:translate-x-1 duration-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <div className="mt-12 text-center">
                        <Link href={`/legal/success-cases?category=${data.category}`} className="px-6 py-3 bg-white text-[#8a765e] border-2 border-[#8a765e] rounded-lg hover:bg-[#8a765e] hover:text-white transition-colors font-semibold cursor-pointer inline-block">
                            더 많은 {data.category} 사례 보기
                        </Link>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">비슷한 상황으로 고민 중이신가요?</h2>
                    <p className="text-lg text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
                        전세금 반환 문제는 시간이 지날수록 해결이 어려워집니다. 지금 바로 전문가와 상담하여 최선의 해결책을 찾아보세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/company/consultation" className="px-8 py-4 bg-white text-[#8a765e] rounded-lg font-semibold hover:bg-neutral-100 transition-colors cursor-pointer text-lg">
                            무료 상담 신청
                        </Link>
                        <Link href={`/legal/success-cases?category=${data.category}`} className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#8a765e] transition-colors cursor-pointer text-lg">
                            성공사례 더보기
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
