
import Link from 'next/link';
import Image from 'next/image';

export default function SuccessCasesPage() {
    return (
        <main>
            {/* Hero Section */}
            <section id="hero" className="bg-[#6F614D] h-[480px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                    <div className="text-center">
                        <p className="text-[#DCD6C9] font-semibold mb-2">성공 사례 모음</p>
                        <h1 className="text-5xl lg:text-6xl font-bold text-[#F5F1E8] mb-4">
                            실제 사례로 검증된 결과
                        </h1>
                        <p className="text-xl text-[#DCD6C9] max-w-3xl mx-auto">
                            유사한 사례를 찾아보며 해결 전략을 참고하세요. 부동산, 금융, 개인회생 등 다양한 사건에서 고객의 권리와 재산을 지켜낸 실제 사례를 소개합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter and Cards Section */}
            <section id="cards" className="py-24 bg-[#F3F4F6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-2 bg-[#8a765e] text-white rounded-full font-medium cursor-pointer">
                                전체 보기
                            </span>
                            <span className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#535861] rounded-full hover:bg-[#e5e7eb] hover:border-[#8a765e] transition-colors cursor-pointer">
                                부동산 법률
                            </span>
                            <span className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#535861] rounded-full hover:bg-[#e5e7eb] hover:border-[#8a765e] transition-colors cursor-pointer">
                                금융 솔루션
                            </span>
                            <span className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#535861] rounded-full hover:bg-[#e5e7eb] hover:border-[#8a765e] transition-colors cursor-pointer">
                                개인회생
                            </span>
                            <span className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#535861] rounded-full hover:bg-[#e5e7eb] hover:border-[#8a765e] transition-colors cursor-pointer">
                                기타 법률
                            </span>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0">
                                <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"></i>
                                <input
                                    type="text"
                                    placeholder="사례 검색"
                                    className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e]"
                                />
                            </div>
                            <div className="relative">
                                <select className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e]">
                                    <option>최신순 정렬</option>
                                    <option>인기순 정렬</option>
                                    <option>처리기간 짧은순</option>
                                </select>
                                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Case Card 1 */}
                        <div id="case-card-1" className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/60131c9c67-c6b77a8f842aee14bb3f.png"
                                    alt="부동산 법률"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-[#5e503f] font-semibold mb-2">부동산 법률</p>
                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">
                                    전세금 4억 전액 회수 (3개월 소요)
                                </h3>
                                <p className="text-[#535861] mb-4">
                                    전세보증금을 돌려받지 못한 의뢰인을 소송을 통해 전액 회수에 성공한 사례
                                </p>
                                <div className="flex items-center mt-auto">
                                    <img
                                        src="/assets/images/profiles/profile_07_v2.png"
                                        alt="변호사"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-[#181d27]">김법무 변호사</p>
                                        <p className="text-xs text-[#9ca3af]">10 Apr 2025</p>
                                    </div>
                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 2 */}
                        <div id="case-card-2" className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7de993d8fd-bddc55e6c22ef6f4fcfd.png"
                                    alt="금융 솔루션"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-[#5e503f] font-semibold mb-2">금융 솔루션</p>
                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">
                                    다중 채무 통합 및 이자 25% 경감
                                </h3>
                                <p className="text-[#535861] mb-4">
                                    7개 금융기관 채무를 통합 조정하여 월 상환액을 35% 절감한 사례
                                </p>
                                <div className="flex items-center mt-auto">
                                    <img
                                        src="/assets/images/profiles/profile_04.png"
                                        alt="전문가"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-[#181d27]">이금융 전문가</p>
                                        <p className="text-xs text-[#9ca3af]">05 Apr 2025</p>
                                    </div>
                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 3 */}
                        <div id="case-card-3" className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/59ed444242-a061075731e5874db185.png"
                                    alt="개인회생"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-[#5e503f] font-semibold mb-2">개인회생</p>
                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">
                                    개인회생 인가 결정 (6개월 소요)
                                </h3>
                                <p className="text-[#535861] mb-4">
                                    5억 원 이상의 채무 부담을 개인회생 절차로 해결하고 인가를 받은 사례
                                </p>
                                <div className="flex items-center mt-auto">
                                    <img
                                        src="/assets/images/profiles/profile_08_v2.png"
                                        alt="컨설턴트"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-[#181d27]">박회생 컨설턴트</p>
                                        <p className="text-xs text-[#9ca3af]">01 Apr 2025</p>
                                    </div>
                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 4 */}
                        <div id="case-card-4" className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a755204ee1-57210b530f8586220afe.png"
                                    alt="부동산 법률"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-[#5e503f] font-semibold mb-2">부동산 법률</p>
                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">
                                    경매 낙찰 후 권리분석 성공
                                </h3>
                                <p className="text-[#535861] mb-4">
                                    재개발 구역 권리 분석을 통해 보상금을 30% 증액한 사례
                                </p>
                                <div className="flex items-center mt-auto">
                                    <img
                                        src="/assets/images/profiles/profile_09_v2.png"
                                        alt="법무사"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-[#181d27]">최부동 법무사</p>
                                        <p className="text-xs text-[#9ca3af]">25 Mar 2025</p>
                                    </div>
                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 5 */}
                        <div id="case-card-5" className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/0ed1c78dc7-c96b0e2f302cb3b67539.png"
                                    alt="기타 법률"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-[#5e503f] font-semibold mb-2">기타 법률</p>
                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">
                                    상속 분쟁 해결 사례
                                </h3>
                                <p className="text-[#535861] mb-4">
                                    복잡한 상속 분쟁을 법적 중재로 원만히 해결하고 가족 간 화해에 성공한 사례
                                </p>
                                <div className="flex items-center mt-auto">
                                    <img
                                        src="/assets/images/profiles/profile_05.png"
                                        alt="변호사"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-[#181d27]">한상속 변호사</p>
                                        <p className="text-xs text-[#9ca3af]">20 Mar 2025</p>
                                    </div>
                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 6 */}
                        <div id="case-card-6" className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/fee7fea59e-34d4fd1500c79fe7ded2.png"
                                    alt="부동산 법률"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-[#5e503f] font-semibold mb-2">부동산 법률</p>
                                <h3 className="text-xl font-bold text-[#181d27] mb-3 flex-grow">
                                    임대차 계약 분쟁 해결 사례
                                </h3>
                                <p className="text-[#535861] mb-4">
                                    계약 갱신 거절 상황에서 임차인의 권리를 지켜낸 임대차 분쟁 해결 사례
                                </p>
                                <div className="flex items-center mt-auto">
                                    <img
                                        src="/assets/images/profiles/profile_02.png"
                                        alt="법무사"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-[#181d27]">이임대 법무사</p>
                                        <p className="text-xs text-[#9ca3af]">15 Mar 2025</p>
                                    </div>
                                    <i className="fas fa-arrow-right ml-auto text-[#9ca3af] group-hover:text-[#8a765e] transition-colors"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div id="pagination" className="flex justify-center items-center mt-16 space-x-2">
                        <span className="p-2 w-10 h-10 flex items-center justify-center text-[#535861] hover:text-[#8a765e] cursor-pointer">
                            <i className="fas fa-arrow-left"></i>
                        </span>
                        <span className="p-2 w-10 h-10 flex items-center justify-center bg-[#8a765e] text-white rounded-lg font-bold cursor-pointer">
                            1
                        </span>
                        <span className="p-2 w-10 h-10 flex items-center justify-center text-[#535861] hover:bg-[#f3f4f6] rounded-lg cursor-pointer">
                            2
                        </span>
                        <span className="p-2 w-10 h-10 flex items-center justify-center text-[#535861] hover:bg-[#f3f4f6] rounded-lg cursor-pointer">
                            3
                        </span>
                        <span className="p-2 w-10 h-10 flex items-center justify-center text-[#535861]">
                            ...
                        </span>
                        <span className="p-2 w-10 h-10 flex items-center justify-center text-[#535861] hover:bg-[#f3f4f6] rounded-lg cursor-pointer">
                            10
                        </span>
                        <span className="p-2 w-10 h-10 flex items-center justify-center text-[#535861] hover:text-[#8a765e] cursor-pointer">
                            <i className="fas fa-arrow-right"></i>
                        </span>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-24 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        나와 비슷한 사례가 있나요?
                    </h2>
                    <p className="text-lg text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
                        혼자 고민하지 마세요. 저희 전문가팀이 고객님의 상황과 가장 유사한 성공 사례를 비교 분석하여 최적의 해결책을 제시해 드립니다.
                    </p>
                    <Link
                        href="/company/consultation"
                        className="inline-block px-8 py-4 bg-white text-[#5e503f] rounded-lg font-semibold hover:bg-[#f3f4f6] transition-colors text-lg"
                    >
                        전문가와 케이스 비교하기
                    </Link>
                </div>
            </section>
        </main>
    );
}
