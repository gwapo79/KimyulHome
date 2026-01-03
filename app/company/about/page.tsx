
import Link from "next/link";
import Image from "next/image";
import ConsultationForm from "@/app/components/consultation/ConsultationForm";

export default function AboutPage() {
    return (
        <main>
            <section id="about-hero" className="py-24 lg:py-32 bg-[#5e503f]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="w-full flex justify-between items-end">
                        <div className="max-w-3xl">
                            <p className="text-xl font-medium text-[#e5ceb4] mb-4">새로운 시작을 돕는 법률-금융 전문가 그룹</p>
                            <h1 className="text-4xl lg:text-7xl font-bold text-white tracking-tight leading-snug lg:leading-tight">
                                서초지율을<br />소개합니다
                            </h1>
                        </div>
                        <p className="hidden lg:block text-[#e5ceb4] text-lg max-w-sm text-right pb-2 leading-relaxed">
                            법과 금융의 전문성을 결합해,<br />
                            집과 재산을 지키는<br />
                            종합 법률-금융 서비스 파트너<br />
                            새희망홀입니다.
                        </p>
                    </div>
                </div>
            </section>
            <section id="mission-vision" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <p className="text-sm font-semibold text-brand-brown-dark uppercase tracking-wider mb-2">
                                Features</p>
                            <h2 className="text-4xl font-bold text-brand-text-primary mb-4">미션 및
                                비전</h2>
                            <p className="text-lg text-brand-text-secondary mb-12">
                                위기에 처한 고객이 집과 가족, 재정의 미래를 지킬 수 있도록 돕는 것. 법률과 금융을 아우르는 맞춤 솔루션으로,
                                누구나 다시 일어설 수 있는 새로운 시작을 지원합니다.
                            </p>
                            <div className="space-y-10">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-gray flex items-center justify-center">
                                        <i className="fas fa-scale-balanced text-brand-brown text-xl"></i>
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                                            서초지율합동법률사무소</h3>
                                        <p className="text-brand-text-secondary">부동산·경매 법률에 특화된 전문
                                            조직으로, 전세보증금 반환·임대차 분쟁·명도·가압류/가처분 등 복잡한 사건을 전담합니다. 초기 권리분석과
                                            타임라인 수립으로 리스크를 최소화하고, 소송부터 집행·등기까지 원스톱으로 대리합니다. 표준 체크리스트를
                                            통해 진행 현황을 투명하게 공유합니다.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-gray flex items-center justify-center">
                                        <i className="fas fa-hand-holding-dollar text-brand-brown text-xl"></i>
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                                            영투투자대부(주)</h3>
                                        <p className="text-brand-text-secondary">브리지론·대환·채무조정 협상에
                                            강점을 가진 윤리적 금융기관입니다. 고객 재무를 분석해 상환 가능성 중심 설계를 원칙으로 하며, 숨겨진
                                            수수료 없이 조건·비용을 사전 고지합니다. 실행 후에는 상환 일정 관리와 리스크 신호 감지로
                                            연체·재악화를 예방합니다.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-gray flex items-center justify-center">
                                        <i className="fas fa-file-invoice-dollar text-brand-brown text-xl"></i>
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                                            엘아이피(주)</h3>
                                        <p className="text-brand-text-secondary">개인회생에 특화된 전문팀이 서류
                                            준비·소득·재산 검토부터 변제계획안 작성·보정 대응까지 동행합니다. 인가 전 과정에서 생길 수 있는
                                            변수에 대비하고, 인가 후에도 납입 일정 관리·신용 회복 가이드를 제공합니다. 수임료 부담을 낮추기 위한
                                            분납·지원 프로그램을 투명하게 안내합니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-full min-h-[500px]">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                <img
                                    src="/images/about/about_vision_final.png"
                                    alt="Legal expert consulting happily with clients in a premium office"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="why-us" className="py-24 bg-brand-brown-darkest">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-8">어려움을 겪는 고객이 선택한 이유
                            </h2>
                            <ul className="space-y-4 text-lg text-brand-brown-light mb-12">
                                <li className="pl-4 border-l-2 border-brand-brown-dark">- 통합 전문성:
                                    법률과 금융을 아우른 종합 솔루션 제공</li>
                                <li className="pl-4 border-l-2 border-brand-brown-dark">- 숙련된 전문가:
                                    법률·금융·회생 분야 수십 년 경험</li>
                                <li className="pl-4 border-l-2 border-brand-brown-dark">- 고객 중심: 개인별
                                    맞춤 전략과 세심한 지원</li>
                                <li className="pl-4 border-l-2 border-brand-brown-dark">- 윤리적 운영:
                                    투명하고 합법적인 절차 준수</li>
                                <li className="pl-4 border-l-2 border-brand-brown-dark">- 입증된 결과: 수천
                                    건 성공 사례로 검증된 신뢰</li>
                            </ul>
                            <div className="flex items-center space-x-4"><span className="px-6 py-3 bg-brand-brown text-white rounded-lg font-semibold hover:bg-brand-brown-dark transition-colors cursor-pointer">상담
                                신청하기</span></div>
                        </div>
                        <div className="grid grid-cols-3 grid-rows-2 gap-4">
                            <div className="col-span-2 rounded-lg overflow-hidden">
                                <img
                                    src="/images/about/about_finance_premium.png"
                                    alt="Premium financial workspace with city view"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden">
                                <img
                                    src="/images/about/about_rehab_premium.png"
                                    alt="VIP consultation niche with leather armchairs"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="rounded-lg overflow-hidden">
                                <img
                                    src="/images/about/about_consult_premium.png"
                                    alt="Legal expert in navy suit with tablet"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="col-span-2 rounded-lg overflow-hidden">
                                <img
                                    src="/images/about/about_legal_premium.png"
                                    alt="Designer fountain pen on legal brief"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="contact-form-section" className="py-24 bg-brand-gray-light">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-4">
                        <p className="text-brand-brown-dark font-semibold">상담 문의</p>
                    </div>
                    <h2 className="text-4xl font-bold text-brand-text-primary text-center mb-4">
                        서초지율 상담팀에 지금 문의하세요</h2>
                    <p className="text-lg text-brand-text-secondary max-w-3xl mx-auto text-center mb-16">
                        부동산·채무·회생 문제로 고민이신가요? 지금 연락 주시면 전문 상담원이 빠르고 친절하게 도와드립니다.
                    </p>
                    <div className="grid lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 content-start">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <i className="far fa-envelope text-brand-brown"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-brand-text-primary">이메일</h3>
                                    <p className="text-brand-text-secondary text-sm mb-1">이메일 문의 시
                                        24시간 내 답변드립니다.</p><span className="text-brand-brown-dark font-semibold text-sm hover:underline cursor-pointer">info@서초지율.com</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <i className="far fa-comments text-brand-brown"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-brand-text-primary">실시간 채팅</h3>
                                    <p className="text-brand-text-secondary text-sm mb-1">실시간 채팅으로 즉시
                                        상담이 가능합니다.</p><span className="text-brand-brown-dark font-semibold text-sm hover:underline cursor-pointer">채팅
                                            상담 시작하기</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <i className="far fa-building text-brand-brown"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-brand-text-primary">사무실</h3>
                                    <p className="text-brand-text-secondary text-sm">사전 예약 후 방문 상담도
                                        지원해드립니다.</p>
                                    <p className="text-brand-text-secondary text-sm">서울특별시 서초구 서초중앙로
                                        24길 3, 402호 (서초동, 서전빌딩)</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <i className="fas fa-phone-volume text-brand-brown"></i>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-brand-text-primary">전화</h3>
                                    <p className="text-brand-text-secondary text-sm">긴급 문의는 평일 09~18시
                                        전화주세요.</p>
                                    <p className="text-brand-text-secondary font-semibold">
                                        02-6080-3377</p>
                                    <p className="text-brand-text-tertiary text-xs">(평일 오전 9시 - 오후 6시)
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-md">
                            <ConsultationForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
