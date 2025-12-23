
import Image from 'next/image';

export default function ReviewsPage() {
    return (
        <main>
            {/* Hero Section */}
            <section id="hero" className="py-16 lg:py-24 bg-[#5e503f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            고객들이 전하는 경험
                        </h1>
                        <p className="text-xl text-[#e5ceb4] max-w-3xl mx-auto">
                            실제 고객들의 생생한 후기를 통해 저희의 전문성을 확인하세요
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-16 bg-[#f9fafb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-[#8a765e] mb-2">95%</div>
                            <div className="text-[#535861] font-medium">고객 만족도</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-[#8a765e] mb-2">5,000+</div>
                            <div className="text-[#535861] font-medium">누적 성공 건</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-[#8a765e] mb-2">3개월</div>
                            <div className="text-[#535861] font-medium">평균 해결 기간</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-[#8a765e] mb-2">92%</div>
                            <div className="text-[#535861] font-medium">지인 추천율</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section id="filters" className="py-12 bg-white border-b border-[#e9e9eb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-[#181d27] mb-2">분야와 평점을 선택하세요</h2>
                            <p className="text-[#535861]">원하는 조건으로 후기를 필터링하여 확인할 수 있습니다</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-4 py-2 bg-[#8a765e] text-white rounded-full text-sm font-medium cursor-pointer">전체</span>
                                <span className="px-4 py-2 bg-white border border-[#d5d6d9] text-[#535861] rounded-full text-sm font-medium hover:border-[#8a765e] hover:text-[#8a765e] transition-colors cursor-pointer">부동산</span>
                                <span className="px-4 py-2 bg-white border border-[#d5d6d9] text-[#535861] rounded-full text-sm font-medium hover:border-[#8a765e] hover:text-[#8a765e] transition-colors cursor-pointer">금융</span>
                                <span className="px-4 py-2 bg-white border border-[#d5d6d9] text-[#535861] rounded-full text-sm font-medium hover:border-[#8a765e] hover:text-[#8a765e] transition-colors cursor-pointer">회생</span>
                            </div>
                            <div className="relative">
                                <select className="px-4 py-2 bg-white border border-[#d5d6d9] rounded-lg text-[#535861] focus:border-[#8a765e] focus:outline-none cursor-pointer">
                                    <option>최신순</option>
                                    <option>인기순</option>
                                    <option>평점 높은순</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section id="cards" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Review 1 */}
                        <div className="bg-white border border-[#e9e9eb] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <img src="/assets/images/profiles/profile_02.png" alt="김○○ 고객" className="w-12 h-12 rounded-full" />
                                    <div className="ml-4">
                                        <div className="font-semibold text-[#181d27]">김○○</div>
                                        <div className="text-sm text-[#535861]">전세사기 피해자</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-[#f8f3ed] text-[#74634e] rounded-full text-sm font-medium">부동산</span>
                            </div>
                            <div aria-label="5점 만점에 5점" className="flex text-[#8a765e] mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                <span className="ml-2 text-sm text-[#535861]">5.0</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#181d27] mb-3">전세금 4억 전액 회수</h3>
                            <p className="text-[#535861] leading-relaxed mb-4">
                                "전세보증금을 못 받을 뻔했는데, 법무법인에서 도움을 받아 전액 회수했습니다. 절차도 투명하게 안내해주시고, 결과도 만족스러워요. 정말 감사합니다."
                            </p>
                            <div className="flex items-center justify-between text-sm text-[#717680]">
                                <span>해결기간: 3개월</span><span>2024.12.15</span>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white border border-[#e9e9eb] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <img src="/assets/images/profiles/profile_01.png" alt="박○○ 고객" className="w-12 h-12 rounded-full" />
                                    <div className="ml-4">
                                        <div className="font-semibold text-[#181d27]">박○○</div>
                                        <div className="text-sm text-[#535861]">다중채무자</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-[#eef3ff] text-[#3537cc] rounded-full text-sm font-medium">금융</span>
                            </div>
                            <div aria-label="5점 만점에 4점" className="flex text-[#8a765e] mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i>
                                <span className="ml-2 text-sm text-[#535861]">4.0</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#181d27] mb-3">이자 25% 경감</h3>
                            <p className="text-[#535861] leading-relaxed mb-4">
                                "다중채무로 고생했는데, 전문가 상담을 받고 채무를 크게 줄일 수 있었습니다. 이제 새로운 시작을 할 수 있게 되어 정말 고맙습니다."
                            </p>
                            <div className="flex items-center justify-between text-sm text-[#717680]">
                                <span>해결기간: 4개월</span><span>2024.12.10</span>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white border border-[#e9e9eb] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <img src="/assets/images/profiles/profile_03.png" alt="이○○ 고객" className="w-12 h-12 rounded-full" />
                                    <div className="ml-4">
                                        <div className="font-semibold text-[#181d27]">이○○</div>
                                        <div className="text-sm text-[#535861]">개인회생 신청자</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-[#fdf1f9] text-[#c01573] rounded-full text-sm font-medium">회생</span>
                            </div>
                            <div aria-label="5점 만점에 5점" className="flex text-[#8a765e] mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                <span className="ml-2 text-sm text-[#535861]">5.0</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#181d27] mb-3">개인회생 인가 완료</h3>
                            <p className="text-[#535861] leading-relaxed mb-4">
                                "개인회생 절차가 복잡할 줄 알았는데, 차근차근 안내해주셔서 수월하게 진행됐습니다. 앞으로 계획적으로 상환하며 신용을 회복해나가겠습니다."
                            </p>
                            <div className="flex items-center justify-between text-sm text-[#717680]">
                                <span>해결기간: 6개월</span><span>2024.12.08</span>
                            </div>
                        </div>

                        {/* Review 4 */}
                        <div className="bg-white border border-[#e9e9eb] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <img src="/assets/images/profiles/profile_06.png" alt="최○○ 고객" className="w-12 h-12 rounded-full" />
                                    <div className="ml-4">
                                        <div className="font-semibold text-[#181d27]">최○○</div>
                                        <div className="text-sm text-[#535861]">경매 관련 상담</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-[#f8f3ed] text-[#74634e] rounded-full text-sm font-medium">부동산</span>
                            </div>
                            <div aria-label="5점 만점에 4점" className="flex text-[#8a765e] mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i>
                                <span className="ml-2 text-sm text-[#535861]">4.0</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#181d27] mb-3">경매 권리분석 성공</h3>
                            <p className="text-[#535861] leading-relaxed mb-4">
                                "경매 관련해서 복잡한 문제가 있었는데, 전문적인 조언을 받아 잘 해결됐습니다. 24시간 상담 지원도 정말 도움이 됐어요."
                            </p>
                            <div className="flex items-center justify-between text-sm text-[#717680]">
                                <span>해결기간: 2개월</span><span>2024.12.05</span>
                            </div>
                        </div>

                        {/* Review 5 */}
                        <div className="bg-white border border-[#e9e9eb] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <img src="/assets/images/profiles/profile_05.png" alt="정○○ 고객" className="w-12 h-12 rounded-full" />
                                    <div className="ml-4">
                                        <div className="font-semibold text-[#181d27]">정○○</div>
                                        <div className="text-sm text-[#535861]">상속 분쟁</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-[#f8f3ed] text-[#74634e] rounded-full text-sm font-medium">부동산</span>
                            </div>
                            <div aria-label="5점 만점에 4점" className="flex text-[#8a765e] mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i>
                                <span className="ml-2 text-sm text-[#535861]">4.0</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#181d27] mb-3">상속 분쟁 합의</h3>
                            <p className="text-[#535861] leading-relaxed mb-4">
                                "가족 간 상속 분쟁으로 어려웠는데, 중재를 통해 원만하게 해결할 수 있었습니다. 전문적이면서도 인간적인 접근이 인상적이었어요."
                            </p>
                            <div className="flex items-center justify-between text-sm text-[#717680]">
                                <span>해결기간: 5개월</span><span>2024.12.01</span>
                            </div>
                        </div>

                        {/* Review 6 */}
                        <div className="bg-white border border-[#e9e9eb] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <img src="/assets/images/profiles/profile_04.png" alt="한○○ 고객" className="w-12 h-12 rounded-full" />
                                    <div className="ml-4">
                                        <div className="font-semibold text-[#181d27]">한○○</div>
                                        <div className="text-sm text-[#535861]">채권 압류</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-[#eef3ff] text-[#3537cc] rounded-full text-sm font-medium">금융</span>
                            </div>
                            <div aria-label="5점 만점에 5점" className="flex text-[#8a765e] mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                <span className="ml-2 text-sm text-[#535861]">5.0</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#181d27] mb-3">채권 압류 해제</h3>
                            <p className="text-[#535861] leading-relaxed mb-4">
                                "급여 압류로 생활이 어려웠는데, 신속한 대응으로 압류를 해제할 수 있었습니다. 정말 막막했던 상황에서 큰 도움이 되었어요."
                            </p>
                            <div className="flex items-center justify-between text-sm text-[#717680]">
                                <span>해결기간: 1개월</span><span>2024.11.28</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="px-8 py-3 bg-white border border-[#d5d6d9] text-[#535861] rounded-lg hover:border-[#8a765e] hover:text-[#8a765e] transition-colors font-medium">
                            더 많은 후기 보기
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-16 lg:py-24 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        나도 해결할 수 있습니다
                    </h2>
                    <p className="text-xl text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
                        지금 상담으로 첫걸음을 시작하세요. 5,000+ 사례 경험을 바탕으로 최선의 해결책을 찾아드리겠습니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-[#74634e] rounded-lg font-semibold hover:bg-neutral-50 transition-colors">
                            무료 상담 신청하기
                        </button>
                        <button className="px-8 py-4 bg-[#74634e] text-white rounded-lg font-semibold hover:bg-[#5e503f] transition-colors">
                            후기 남기기
                        </button>
                    </div>
                    <p className="text-sm text-[#e5ceb4] mt-6">
                        평균 응답시간 30분 이내 · 24시간 상담 지원
                    </p>
                </div>
            </section>
        </main>
    );
}
