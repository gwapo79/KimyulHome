
import Link from "next/link";

export default function CookiePage() {
    return (
        <main>
            <section id="cookie-header" className="py-16 lg:py-24 bg-neutral-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4"><i className="fas fa-cookie-bite text-[300px] text-[#8a765e]"></i></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">쿠키 정책
                        </h1>
                        <p className="text-xl text-[#535861] mb-8">
                            더 나은 사용자 경험을 위해 쿠키를 사용하는 방법을 설명합니다
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center"><button id="open-cookie-settings" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors"><i className="fas fa-sliders mr-2"></i>
                            쿠키 설정 변경
                        </button><span className="px-6 py-3 border border-[#d5d6d9] text-[#414651] rounded-lg font-semibold hover:bg-neutral-50 transition-colors cursor-pointer">
                                문의하기
                            </span></div>
                    </div>
                </div>
            </section>
            <section id="doc" role="document" className="py-16 lg:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/3">
                            <div className="sticky top-32">
                                <div className="bg-neutral-50 rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-[#181d27] mb-4">목차</h2>
                                    <nav role="navigation" aria-label="쿠키 정책 목차" className="space-y-3">
                                        <span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">1.
                                            쿠키란?</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">2.
                                                사용 목적</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">3.
                                                    쿠키 종류</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">4.
                                                        타사 쿠키</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">5.
                                                            쿠키 관리</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">6.
                                                                정책 변경</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">7.
                                                                    문의처</span></nav>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="prose prose-lg max-w-none">
                                <section id="definition" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#fdf1f9] flex items-center justify-center mr-4">
                                            <i className="fas fa-question text-[#c01573]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">1. 쿠키(Cookie)란?
                                        </h2>
                                    </div>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        쿠키는 웹사이트를 방문할 때 사용자의 컴퓨터나 모바일 기기에 저장되는 작은 텍스트 파일입니다.
                                        쿠키를 통해 웹사이트는 사용자의 방문 기록, 기본 설정(예: 언어, 글자 크기 등) 및 기타 정보를
                                        일정 기간 동안 기억할 수 있습니다.
                                    </p>
                                </section>
                                <section id="purpose" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#eef3ff] flex items-center justify-center mr-4">
                                            <i className="fas fa-bullseye text-[#3537cc]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">2. 사용 목적</h2>
                                    </div>
                                    <p className="text-[#535861] leading-relaxed mb-4">회사는 다음과 같은 목적으로 쿠키를
                                        사용합니다:</p>
                                    <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                        <li>사용자가 웹사이트를 효율적으로 이용할 수 있도록 지원</li>
                                        <li>사용자의 개인 설정 정보를 저장하여 편의성 제공 (예: 로그인 유지)</li>
                                        <li>웹사이트 방문 트래픽 분석 및 서비스 개선을 위한 통계 자료 수집</li>
                                        <li>사용자 관심사에 맞춘 타겟 마케팅 및 광고 제공</li>
                                    </ul>
                                </section>
                                <section id="types" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center mr-4">
                                            <i className="fas fa-list-check text-[#15803d]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">3. 사용하는 쿠키의 종류
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-bold text-[#181d27] mb-2 flex items-center">
                                                <i className="fas fa-circle-check text-[#15803d] mr-2"></i> 필수 쿠키 (Necessary
                                                Cookies)</h3>
                                            <p className="text-[#535861] text-sm">
                                                웹사이트의 기본적인 기능을 작동시키는 데 필수적인 쿠키입니다. 이 쿠키가 없으면 보안 로그인,
                                                네트워크 관리 등의 서비스를 제공할 수 없습니다. 사용자는 브라우저 설정에서 이를 차단할 수
                                                있으나, 웹사이트 일부 기능이 작동하지 않을 수 있습니다.
                                            </p>
                                        </div>
                                        <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-bold text-[#181d27] mb-2 flex items-center">
                                                <i className="fas fa-chart-line text-[#3537cc] mr-2"></i> 분석 쿠키 (Analytics
                                                Cookies)</h3>
                                            <p className="text-[#535861] text-sm">
                                                방문자들이 웹사이트를 어떻게 사용하는지 정보를 수집합니다. 예를 들어 가장 많이 방문하 페이지,
                                                에러 메시지 발생 여부 등을 파악하여 웹사이트 성능을 개선하는 데 사용됩니다. 수집된 정보는
                                                익명으로 처리됩니다.
                                            </p>
                                        </div>
                                        <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-bold text-[#181d27] mb-2 flex items-center">
                                                <i className="fas fa-rectangle-ad text-[#c01573] mr-2"></i> 마케팅 쿠키 (Marketing
                                                Cookies)</h3>
                                            <p className="text-[#535861] text-sm">
                                                사용자의 관심사를 파악하여 맞춤형 광고를 제공하거나 광고 효율을 측정하는 데 사용됩니다.
                                                타사 광고주나 광고 네트워크에 의해 설정될 수 있으며, 사용자의 브라우저 및 기기를 식별할 수
                                                있습니다.
                                            </p>
                                        </div>
                                        <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-bold text-[#181d27] mb-2 flex items-center">
                                                <i className="fas fa-wrench text-[#8a765e] mr-2"></i> 기능 쿠키 (Functional
                                                Cookies)</h3>
                                            <p className="text-[#535861] text-sm">
                                                언어 설정, 지역 설정 등 사용자의 선택 사항을 기억하여 더욱 개인화된 서비스를 제공합니다.
                                                이 정보를 익명으로 저장되며 타 웹사이트에서의 활동을 추적하지 않습니다.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                                <section id="third-party" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#fef3f2] flex items-center justify-center mr-4">
                                            <i className="fas fa-share-nodes text-[#dc2626]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">4. 타사 쿠키</h2>
                                    </div>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        회사 웹사이트에서는 신뢰할 수 있는 제3자가 제공하는 쿠키도 사용됩니다.
                                        현재 웹사이트에서 사용되는 주요 타사 서비스는 다음과 같습니다:
                                    </p>
                                    <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                        <li><strong>Google Analytics:</strong> 웹사이트 트래픽 분석 및 사용자 행동 파악</li>
                                        <li><strong>Facebook Pixel:</strong> 광고 효율 측정 및 타겟 마케팅</li>
                                        <li><strong>Kakao Pixel:</strong> 카카오 서비스 연계 마케팅</li>
                                    </ul>
                                </section>
                                <section id="management" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#fffbeb] flex items-center justify-center mr-4">
                                            <i className="fas fa-sliders text-[#b45309]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">5. 쿠키 관리 방법</h2>
                                    </div>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        사용자는 쿠키에 대한 선택권을 가지고 있습니다. 웹 브라우저 설정을 통해 쿠키 허용 여부를 결정하거나
                                        저장된 쿠키를 삭제할 수 있습니다.
                                    </p>
                                    <div className="bg-neutral-50 p-6 rounded-xl space-y-4">
                                        <h4 className="font-semibold text-[#181d27]">주요 브라우저별 설정 방법:</h4>
                                        <ul className="space-y-2 text-sm text-[#535861]">
                                            <li><a href="#" className="flex items-center hover:text-[#3537cc]"><i className="fab fa-chrome w-5 text-center mr-2"></i>
                                                Chrome: 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</a></li>
                                            <li><a href="#" className="flex items-center hover:text-[#3537cc]"><i className="fab fa-edge w-5 text-center mr-2"></i>
                                                Edge: 설정 &gt; 쿠키 및 사이트 권한</a></li>
                                            <li><a href="#" className="flex items-center hover:text-[#3537cc]"><i className="fab fa-safari w-5 text-center mr-2"></i>
                                                Safari: 환경설정 &gt; 개인정보 보호</a></li>
                                            <li><a href="#" className="flex items-center hover:text-[#3537cc]"><i className="fab fa-firefox-browser w-5 text-center mr-2"></i>
                                                Firefox: 설정 &gt; 개인정보 및 보안</a></li>
                                        </ul>
                                    </div>
                                </section>
                                <section id="updates" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#fdf2f8] flex items-center justify-center mr-4">
                                            <i className="fas fa-clock-rotate-left text-[#db2777]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">6. 정책의 변경</h2>
                                    </div>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        법률이나 서비스의 변경 사항을 반영하기 위해 본 쿠키 정책을 수정할 수 있습니다.
                                        중요한 변경 사항이 있을 경우 웹사이트 공지사항을 통해 미리 알려드립니다.
                                    </p>
                                    <p className="text-sm text-[#717680]">최종 수정일: 2025년 4월 11일</p>
                                </section>
                                <section id="contact" className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center mr-4">
                                            <i className="fas fa-envelope-open-text text-[#4f46e5]"></i></div>
                                        <h2 className="text-2xl font-bold text-[#181d27] m-0">7. 문의처</h2>
                                    </div>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        쿠키 정책에 대해 궁금한 점이 있거나 의견이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
                                    </p>
                                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-6">
                                        <ul className="space-y-3">
                                            <li className="flex items-center"><i className="fas fa-building text-[#94a3b8] w-8"></i>
                                                <span className="text-[#1e293b] font-medium">서초지율
                                                    합동법률사무소</span></li>
                                            <li className="flex items-center"><i className="fas fa-envelope text-[#94a3b8] w-8"></i>
                                                <span className="text-[#1e293b]">privacy@서초지율.com</span></li>
                                            <li className="flex items-center"><i className="fas fa-phone text-[#94a3b8] w-8"></i>
                                                <span className="text-[#1e293b]">02-0000-0000</span></li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
