
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main>
            <section id="privacy-header" className="py-16 lg:py-24 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">개인정보
                            처리방침</h1>
                        <p className="text-xl text-[#535861] mb-8">
                            고객님의 소중한 개인정보를 안전하게 보호하겠습니다
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center"><button id="download-privacy" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors"><i className="fas fa-file-pdf mr-2"></i>
                            PDF로 다운로드
                        </button><span className="px-6 py-3 border border-[#d5d6d9] text-[#414651] rounded-lg font-semibold hover:bg-neutral-50 transition-colors cursor-pointer">
                                개인정보 보호책임자에게 문의
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
                                    <nav role="navigation" aria-label="개인정보 처리방침 목차" className="space-y-3">
                                        <span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">1.
                                            총칙</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">2.
                                                수집하는 개인정보</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">3.
                                                    처리 목적</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">4.
                                                        보유 및 이용기간</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">5.
                                                            제3자 제공</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">6.
                                                                처리 위탁</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">7.
                                                                    이용자 권리</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">8.
                                                                        보호책임자</span></nav>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="prose prose-lg max-w-none">
                                <section id="general" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        1. 총칙</h2>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        서초지율 합동법률사무소(이하 "회사")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법 등
                                        관련 법령을 준수하며, 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
                                        있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                                    </p>
                                </section>
                                <section id="collection" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        2. 수집하는 개인정보의 항목</h2>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">가. 회원가입 시
                                            수집항목</h3>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>필수항목: 이름, 이메일 주소, 비밀번호, 휴대전화번호</li>
                                            <li>선택항목: 추천인 코드, 수신 동의 여부(마케팅)</li>
                                        </ul>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">나. 상담 신청
                                            시 수집항목</h3>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>필수항목: 신청자명, 연락처, 상담분야, 상담내용</li>
                                            <li>선택항목: 첨부파일(사건 관련 자료)</li>
                                        </ul>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">다. 서비스 이용
                                            과정에서 자동 수집</h3>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록, 기기정보</li>
                                        </ul>
                                    </div>
                                </section>
                                <section id="purpose" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        3. 개인정보의 처리 목적</h2>
                                    <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                        <li><strong>회원 가입 및 관리:</strong> 회원제 서비스 이용에 따른 본인확인,
                                            개인식별, 가입의사 확인, 불만처리 등 </li>
                                        <li><strong>서비스 제공:</strong> 법률 상담 제공, 사건 진행 상황 안내, 계약서 및
                                            청구서 발송</li>
                                        <li><strong>마케팅 및 광고 활용:</strong> 신규 서비스(제품) 개발 및 맞춤 서비스
                                            제공, 이벤트 및 광고성 정보 제공 (동의 시)</li>
                                    </ul>
                                </section>
                                <section id="retention" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        4. 개인정보의 보유 및 이용 기간</h2>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의
                                        정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm whitespace-nowrap mb-6">
                                            <thead className="uppercase tracking-wider border-b-2 border-neutral-200 bg-neutral-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 rounded-tl-lg">보존
                                                        항목</th>
                                                    <th scope="col" className="px-6 py-4">보존 근거</th>
                                                    <th scope="col" className="px-6 py-4 rounded-tr-lg">보존
                                                        기간</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-neutral-100">
                                                    <td className="px-6 py-4">계약 또는 청약철회 등에 관한 기록</td>
                                                    <td className="px-6 py-4">전자상거래 등에서의 소비자보호에 관한 법률</td>
                                                    <td className="px-6 py-4">5년</td>
                                                </tr>
                                                <tr className="border-b border-neutral-100">
                                                    <td className="px-6 py-4">대금결제 및 재화 등의 공급에 관한 기록</td>
                                                    <td className="px-6 py-4">전자상거래 등에서의 소비자보호에 관한 법률</td>
                                                    <td className="px-6 py-4">5년</td>
                                                </tr>
                                                <tr className="border-b border-neutral-100">
                                                    <td className="px-6 py-4">소비자의 불만 또는 분쟁처리에 관한 기록</td>
                                                    <td className="px-6 py-4">전자상거래 등에서의 소비자보호에 관한 법률</td>
                                                    <td className="px-6 py-4">3년</td>
                                                </tr>
                                                <tr className="border-b border-neutral-100">
                                                    <td className="px-6 py-4">로그인 기록</td>
                                                    <td className="px-6 py-4">통신비밀보호법</td>
                                                    <td className="px-6 py-4">3개월</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <section id="third-party" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        5. 개인정보의 제3자 제공</h2>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
                                    </p>
                                    <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                        <li>이용자들이 사전에 동의한 경우</li>
                                        <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는
                                            경우</li>
                                    </ul>
                                </section>
                                <section id="consignment" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        6. 개인정보 처리 위탁</h2>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시
                                        개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
                                    </p>
                                    <div className="bg-amber-50 rounded-lg p-6">
                                        <ul className="space-y-2 text-sm text-[#535861]">
                                            <li className="flex justify-between border-b border-amber-100 pb-2"><span className="font-semibold">수탁업체</span><span className="font-semibold">위탁업무 내용</span></li>
                                            <li className="flex justify-between border-b border-amber-100 pb-2"><span>(주)다우기술</span><span>문자메시지 발송 대행</span></li>
                                            <li className="flex justify-between border-b border-amber-100 pb-2"><span>NICE평가정보(주)</span><span>본인확인, 실명인증</span></li>
                                            <li className="flex justify-between pb-2"><span>(주)케이지이니시스</span><span>결제 대행</span></li>
                                        </ul>
                                    </div>
                                </section>
                                <section id="rights" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        7. 이용자 및 법정대리인의 권리와 행사방법</h2>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도
                                        있습니다.
                                        개인정보 조회/수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을 가입해지(동의철회)를 위해서는
                                        '회원탈퇴'를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.
                                    </p>
                                </section>
                                <section id="contact" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        8. 개인정보 보호책임자</h2>
                                    <p className="text-[#535861] leading-relaxed mb-6">
                                        회사는 고개의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및
                                        개인정보 보호책임자를 지정하고 있습니다.
                                    </p>
                                    <div className="bg-neutral-100 rounded-xl p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="font-bold text-[#181d27] mb-3">개인정보 보호책임자</h4>
                                                <ul className="space-y-2 text-[#535861]">
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">성명</span>:
                                                        홍길동</li>
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">직책</span>:
                                                        대표변호사</li>
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">연락처</span>:
                                                        02-0000-0000</li>
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">이메일</span>:
                                                        privacy@서초지율.com</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#181d27] mb-3">개인정보 담당부서</h4>
                                                <ul className="space-y-2 text-[#535861]">
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">부서명</span>:
                                                        운영지원팀</li>
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">담당자</span>:
                                                        김철수 팀장</li>
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">연락처</span>:
                                                        02-0000-0000</li>
                                                    <li><span className="font-semibold text-[#74634e] w-20 inline-block">이메일</span>:
                                                        admin@서초지율.com</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section id="supplementary" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        9. 부칙</h2>
                                    <p className="text-[#535861] leading-relaxed mb-4">
                                        이 개인정보 처리방침은 2025년 4월 11일부터 적용됩니다.
                                    </p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="cta" className="py-16 lg:py-24 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        개인정보 관련 문의하기
                    </h2>
                    <p className="text-xl text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
                        개인정보 처리에 관해 궁금한 점이 있으시면 언제든 문의주세요
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center"><a href="mailto:privacy@서초지율.com" className="px-8 py-4 bg-white text-[#74634e] rounded-lg font-semibold hover:bg-neutral-50 transition-colors">
                        <i className="fas fa-envelope mr-2"></i> 이메일 문의
                    </a><a href="tel:02-0000-0000" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#74634e] transition-colors"><i className="fas fa-phone mr-2"></i>
                            전화 문의
                        </a></div>
                </div>
            </section>
        </main>
    );
}
