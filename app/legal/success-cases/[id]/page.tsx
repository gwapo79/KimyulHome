import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeamMemberByName } from '@/app/constants/team';
import { formatClientName } from '@/lib/utils';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

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

    // Parse KPI Data (New Field)
    let kpiGrid = [];
    if (data.kpiInfo) {
        // If it's already an object (Prisma Json), use it. If string, parse it.
        if (typeof data.kpiInfo === 'string') {
            try { kpiGrid = JSON.parse(data.kpiInfo); } catch (e) { }
        } else if (Array.isArray(data.kpiInfo)) {
            kpiGrid = data.kpiInfo;
        }
    } else {
        // Fallback to legacy hardcoded style mapping if no generic KPI data
        kpiGrid = [
            { value: '100%', label: '전액 회수', description: `보증금 ${data.amount || ''} 완전 회수` },
            { value: data.period || '3개월', label: '신속 해결', description: '평균 대비 50% 단축' },
            { value: '+α', label: '지연이자 포함', description: '추가 손해배상 확보' }
        ];
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <main className="pt-20">
                {/* SEO Metadata injection would go here via generateMetadata, but inline for now */}
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
                        {/* Hero Image */}
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
                            {/* Subtitle / Summary */}
                            <p className="text-xl text-[#535861] leading-relaxed">
                                {data.subTitle || data.summary}
                            </p>
                        </div>

                        {/* Meta Grid */}
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
                                            <span className="font-semibold text-[#535861]">관련 금액</span>
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
                                        <span className="font-semibold text-[#535861]">결과</span>
                                        <span className="text-green-600 font-bold">{data.result || '성공'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Old Background Field (Legacy support) */}
                            {data.background && !data.content && (
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

                {/* WYSIWYG Content Section (Replaces Strategy/Outcomes if present) */}
                {data.content ? (
                    <section className="py-16 bg-white">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="prose prose-lg max-w-none text-[#535861] prose-headings:text-[#181d27] prose-a:text-[#8a765e]">
                                <div dangerouslySetInnerHTML={{ __html: data.content }} />
                            </div>
                        </div>
                    </section>
                ) : (
                    /* Legacy Strategy View */
                    strategyList.length > 0 && (
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
                            </div>
                        </section>
                    )
                )}

                {/* KPI Result Section (Dynamic) */}
                <section id="result" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">결과</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {kpiGrid.map((kpi: any, idx: number) => (
                                <div key={idx} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#8a765e] transition-colors">
                                    <div className="text-4xl font-bold text-[#8a765e] mb-2">{kpi.value}</div>
                                    <div className="text-lg font-semibold text-[#181d27] mb-1">{kpi.label}</div>
                                    <div className="text-sm text-[#535861]">{kpi.description}</div>
                                </div>
                            ))}
                        </div>

                        {/* Legacy Outcome text if not using WYSIWYG */}
                        {!data.content && outcomeList.length > 0 && (
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
                        )}

                        <div className="mt-8 text-center">
                            <Link href={`/legal/success-cases?category=${data.category}`} className="px-6 py-3 bg-white text-[#8a765e] border-2 border-[#8a765e] rounded-lg hover:bg-[#8a765e] hover:text-white transition-colors font-semibold cursor-pointer mr-4 inline-block">
                                더 많은 {data.category} 사례 보기
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="lawyer-quote" className="py-16 bg-[#8a765e]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <blockquote className="text-xl text-[#181d27] leading-relaxed mb-6 italic">
                                "{data.lawyerComment || "단순히 소송만 제기하는 것이 아니라, 사전 재산보전과 체계적인 재산조사를 통해 실질적인 회수 가능성을 높이는 것이 핵심입니다."}"
                            </blockquote>
                            <div className="flex items-center justify-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                            </div>
                            <cite className="text-[#535861] font-semibold">
                                {formatClientName(data.client)} 고객
                            </cite>
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

                                    const normalizedBlogs = similarBlogs.map(item => ({
                                        id: item.id,
                                        type: 'media/blog',
                                        title: item.title,
                                        category: item.category,
                                        summary: item.excerpt,
                                        imageUrl: item.thumbnailUrl,
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
                            데이터 기반의 맞춤형 전략으로 귀사의 성장을 돕겠습니다.
                        </p>
                        <Link
                            href="/company/consultation"
                            className="inline-block bg-white text-[#8a765e] px-8 py-3 rounded-full font-semibold hover:bg-[#f5f5f5] transition-colors duration-300"
                        >
                            무료 상담 신청하기
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
