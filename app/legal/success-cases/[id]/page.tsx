
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface StrategyStep {
    step: number;
    title: string;
    description: string;
}

// Ensure the page assumes dynamic rendering if we want valid SSG/SSR behavior for new DB entries
export const revalidate = 0;

export default async function SuccessCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const successCase = await prisma.successCase.findUnique({
        where: { id },
    });

    if (!successCase) {
        notFound();
    }

    // Parse JSON data safely
    let strategySteps: StrategyStep[] = [];
    try {
        if (successCase.strategy) {
            strategySteps = JSON.parse(successCase.strategy);
        }
    } catch (e) {
        console.error("Failed to parse strategy JSON", e);
    }

    let outcomesList: string[] = [];
    try {
        if (successCase.outcomes) {
            outcomesList = JSON.parse(successCase.outcomes);
        }
    } catch (e) {
        console.error("Failed to parse outcomes JSON", e);
    }

    return (
        <>
            <header id="header" className="sticky top-0 z-50 bg-white border-b border-[#e9e9eb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        <Link href="/" className="flex items-center">
                            <Image src="/assets/images/logo.jpg" alt="서초지율 합동법률사무소" width={200} height={72} className="h-[72px] w-auto" />
                        </Link>
                        <nav className="hidden lg:flex items-center space-x-8">
                            <Link href="/" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">홈</Link>
                            <Link href="/company/about" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">회사소개</Link>
                            <div className="relative group">
                                <button className="text-[#535861] hover:text-[#74634e] transition-colors flex items-center">
                                    전문분야
                                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#e9e9eb] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="p-2">
                                        <Link href="/services/practice-areas" className="block px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] cursor-pointer">부동산 분쟁</Link>
                                        <Link href="/services/practice-areas" className="block px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] cursor-pointer">채무 조정</Link>
                                        <Link href="/services/practice-areas" className="block px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] cursor-pointer">개인회생/파산</Link>
                                    </div>
                                </div>
                            </div>
                            <Link href="/services/success-cases" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">성공사례</Link>
                            <Link href="/services/reviews" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">고객후기</Link>
                            <Link href="/resources/faq" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">FAQ</Link>
                            <Link href="/resources/blog" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">블로그</Link>
                        </nav>
                        <div className="hidden lg:flex items-center space-x-4">
                            <Link href="/login" className="px-4 py-2 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">로그인</Link>
                            <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium cursor-pointer">무료 상담 신청</Link>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <section id="breadcrumb" className="bg-neutral-50 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav aria-label="브레드크럼 네비게이션" className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-[#535861] hover:text-[#74634e] cursor-pointer">홈</Link>
                            <i className="fas fa-chevron-right text-[#717680] text-xs"></i>
                            <Link href="/services/success-cases" className="text-[#535861] hover:text-[#74634e] cursor-pointer">성공사례</Link>
                            <i className="fas fa-chevron-right text-[#717680] text-xs"></i>
                            <span className="text-[#717680]">{successCase.title}</span>
                        </nav>
                    </div>
                </section>

                <section id="overview" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-[#f8f3ed] text-[#74634e] text-sm font-semibold rounded-full border border-[#e5ceb4]">
                                    {successCase.category}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">
                                {successCase.title}
                            </h1>
                            <p className="text-xl text-[#535861] leading-relaxed">
                                {successCase.summary}
                            </p>
                        </div>

                        <div className="bg-neutral-50 rounded-2xl p-8 mb-16">
                            <h2 className="text-2xl font-bold text-[#181d27] mb-8">사건 개요</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">의뢰인</span>
                                        <span className="text-[#181d27]">{successCase.client}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">사건 유형</span>
                                        <span className="text-[#181d27]">{successCase.caseType}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">분쟁 금액</span>
                                        <span className="text-[#181d27] font-bold">{successCase.amount}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">처리 기간</span>
                                        <span className="text-[#181d27] font-bold">{successCase.period}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">담당 변호사</span>
                                        <span className="text-[#181d27]">{successCase.lawyer}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#e9e9eb]">
                                        <span className="font-semibold text-[#535861]">최종 결과</span>
                                        <span className="text-green-600 font-bold">{successCase.result}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#e9e9eb]">
                                <h3 className="text-lg font-semibold text-[#181d27] mb-4">사건 배경</h3>
                                <p className="text-[#535861] leading-relaxed">
                                    {successCase.background}
                                </p>
                            </div>
                            <div className="mt-8 text-center">
                                <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-semibold cursor-pointer">
                                    상담 신청하기
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="strategy" className="py-16 bg-neutral-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">어떻게 해결했나요?</h2>
                        <div className="space-y-8 mb-12">
                            {strategySteps.map((step, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#8a765e] text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                                        {step.step}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-[#181d27] mb-3">{step.title}</h3>
                                        <p className="text-[#535861] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl p-8 border-l-4 border-[#8a765e]">
                            <blockquote className="text-xl italic text-[#181d27] mb-4">
                                &quot;단순히 소송만 제기하는 것이 아니라, 사전 재산보전과 체계적인 재산조사를 통해 실질적인 회수 가능성을 높이는 것이 핵심입니다.&quot;
                            </blockquote>
                            <cite className="text-[#535861] font-semibold">- {successCase.lawyer}</cite>
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-semibold cursor-pointer">
                                상담 신청하기
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="result" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-[#181d27] mb-12 text-center">결과</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                                <div className="text-lg font-semibold text-[#181d27] mb-1">전액 회수</div>
                                <div className="text-sm text-[#535861]">보증금 4억원 완전 회수</div>
                            </div>
                            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                                <div className="text-4xl font-bold text-blue-600 mb-2">3개월</div>
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
                                {outcomesList.map((outcome, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-3"></i>
                                        <span className="text-[#535861]">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/services/success-cases" className="px-6 py-3 bg-white text-[#8a765e] border-2 border-[#8a765e] rounded-lg hover:bg-[#8a765e] hover:text-white transition-colors font-semibold cursor-pointer mr-4">
                                관련 사례 보기
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="quote" className="py-16 bg-[#8a765e]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-12">고객 후기</h2>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="mb-6">
                                <Image src="/assets/images/profiles/profile_07_v2.png" alt="김OO 고객" width={64} height={64} className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-[#8a765e]" />
                                <div className="text-5xl text-[#8a765e] mb-4">&quot;</div>
                            </div>
                            <blockquote className="text-xl text-[#181d27] leading-relaxed mb-6 italic">
                                처음엔 {successCase.amount}이라는 큰 금액을 정말 돌려받을 수 있을지 반신반의했습니다. 하지만 {successCase.lawyer} 변호사님께서 체계적인 계획을
                                세워주시고 끝까지 포기하지 않고 이끌어주셔서 전액을 회수할 수 있었습니다. 정말 감사드립니다.
                            </blockquote>
                            <div className="flex items-center justify-center space-x-1 mb-4">
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                            </div>
                            <cite className="text-[#535861] font-semibold">{successCase.client} 고객</cite>
                        </div>
                        <div className="mt-8">
                            <Link href="/company/consultation" className="px-6 py-3 bg-white text-[#8a765e] rounded-lg hover:bg-neutral-100 transition-colors font-semibold cursor-pointer">
                                상담하기
                            </Link>
                        </div>
                    </div>
                </section>

                <footer id="footer" className="bg-white border-t border-[#e9e9eb] py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-6">
                                    <Image src="/assets/images/logo.jpg" alt="서초지율 합동법률사무소" width={200} height={72} className="h-[72px] w-auto" />
                                </div>
                                <p className="text-[#535861] mb-6 max-w-md">
                                    부동산 분쟁부터 채무 조정까지, 법률과 금융의 통합 전문성으로
                                    고객의 문제를 근본적으로 해결합니다.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-[#e9e9eb] pt-8 flex flex-col lg:flex-row justify-between items-center">
                            <div className="text-[#717680] text-sm mb-4 lg:mb-0">© 2025 서초지율 합동법률사무소. All rights reserved.</div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
