
import Link from "next/link";

export default function TermsPage() {
    return (
        <main>
            <section id="terms-header" className="py-16 lg:py-24 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">이용약관
                        </h1>
                        <p className="text-xl text-[#535861] mb-8">
                            본 약관은 2025년 4월 11일부터 시행됩니다
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center"><button id="download-terms" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors"><i className="fas fa-download mr-2"></i>
                            약관 다운로드
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
                                    <nav role="navigation" aria-label="약관 목차" className="space-y-3">
                                        <span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제1장
                                            총칙</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제2장
                                                회원</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제3장
                                                    서비스</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제4장
                                                        책임</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제5장
                                                            수수료</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제6장
                                                                분쟁</span><span className="block text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">제7장
                                                                    부칙</span></nav>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="prose prose-lg max-w-none">
                                <section id="general" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제1장 총칙</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제1조 (목적)
                                        </h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            이 약관은 법무법인(이하 "회사")이 제공하는 법률 상담 및 관련 서비스(이하 "서비스")의 이용과 관련하여
                                            회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                                        </p>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제2조 (정의)
                                        </h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">이 약관에서 사용하는 용어의
                                            정의는 다음과 같습니다:</p>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>"서비스"라 함은 회사가 제공하는 법률 상담, 사건 진행, 문서 작성 등 모든 법무 서비스를
                                                의미합니다.</li>
                                            <li>"이용자"라 함은 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                                            <li>"회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서 회사의 서비스를 지속적으로 이용할
                                                수 있는 자를 말합니다.</li>
                                            <li>"계정"이라 함은 이용자의 식별과 서비스 이용을 위하여 이용자가 정한 문자와 숫자의 조합을
                                                의미합니다.</li>
                                        </ul>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제3조 (약관의
                                            효력 및 변경)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 약관을 변경하는 경우에는
                                            적용일자 및 변경사유를 명시하여 현행약관과 함께 회사의 홈페이지에 그 적용일자 7일 이전부터
                                            적용일자 전일까지 공지합니다.
                                        </p>
                                    </div>
                                </section>
                                <section id="membership" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제2장 회원</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제4조
                                            (회원가입)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서
                                            회원가입을 신청합니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
                                            등록합니다:
                                        </p>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                                            <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                                            <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                                            <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                                        </ul>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제5조
                                            (회원정보의 변경)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 회원은 회원가입 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 회사에
                                            대하여 그 변경사항을 알려야 합니다.
                                        </p>
                                    </div>
                                </section>
                                <section id="services" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제3장 서비스</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제6조
                                            (서비스의 내용)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">회사가 제공하는 서비스는
                                            다음과 같습니다:</p>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>부동산 분쟁 관련 법률 상담 및 사건 진행</li>
                                            <li>채무 조정 및 금융 관련 법률 서비스</li>
                                            <li>개인회생 및 파산 관련 법률 서비스</li>
                                            <li>법률 문서 작성 및 검토</li>
                                            <li>기타 회사가 정하는 법률 관련 서비스</li>
                                        </ul>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제7조
                                            (서비스의 제공 및 변경)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 회사는 이용자에게 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 합니다.
                                            다만, 시스템 정기점검, 증설 및 교체를 위해 회사가 정한 날이나 시간에는 서비스를 일시 중단할 수
                                            있습니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능시간을 별도로 지정할 수 있습니다.
                                        </p>
                                    </div>
                                </section>
                                <section id="responsibility" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제4장 책임</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제8조 (회사의
                                            의무)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며
                                            이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하기 위해 노력합니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보보호를 위한 보안 시스템을
                                            구축합니다.
                                        </p>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제9조
                                            (이용자의 의무)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">이용자는 다음 행위를
                                            하여서는 안 됩니다:</p>
                                        <ul className="list-disc list-inside text-[#535861] leading-relaxed space-y-2 ml-4">
                                            <li>신청 또는 변경시 허위내용의 등록</li>
                                            <li>타인의 정보도용</li>
                                            <li>회사가 게시한 정보의 변경</li>
                                            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                                            <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                                            <li>기타 공서양속에 반하는 행위</li>
                                        </ul>
                                    </div>
                                    <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제10조
                                            (책임의 한계)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 회사는 법률 상담 및 사건 진행과 관련하여 최선의 노력을 다하나,
                                            특정 결과를 보장하지 않습니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 홈페이지에 게시된 성공 사례는 참고용이며, 개별 사건의 결과를 보장하지 않습니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ③ 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
                                            서비스 제공에 관한 책임이 면제됩니다.
                                        </p>
                                    </div>
                                </section>
                                <section id="fees" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제5장 수수료</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제11조
                                            (서비스 이용료)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 초기 상담은 무료로 제공됩니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 사건 진행을 위한 서비스 이용료는 사건의 복잡성, 예상 소요시간 등을 고려하여
                                            개별적으로 산정되며, 착수금과 성공보수로 구분됩니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ③ 모든 비용은 사전에 투명하게 안내되며, 이용자의 동의 없이 추가 비용이 발생하지 않습니다.
                                        </p>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제12조 (결제
                                            및 환불)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 서비스 이용료는 현금, 신용카드, 계좌이체 등의 방법으로 결제할 수 있습니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 환불 조건 및 절차는 별도의 환불 정책에 따릅니다.
                                        </p>
                                    </div>
                                </section>
                                <section id="disputes" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제6장 분쟁</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제13조
                                            (분쟁해결)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                                            피해보상처리기구를 설치·운영합니다.
                                        </p>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            ② 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 서울중앙지방법원을 관할법원으로 합니다.
                                        </p>
                                    </div>
                                </section>
                                <section id="supplementary" className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#181d27] mb-6 border-b border-[#e9e9eb] pb-3">
                                        제7장 부칙</h2>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제14조
                                            (시행일)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            이 약관은 2025년 4월 11일부터 시행됩니다.
                                        </p>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-[#181d27] mb-4">제15조
                                            (준거법)</h3>
                                        <p className="text-[#535861] leading-relaxed mb-4">
                                            이 약관의 해석 및 회사와 이용자 간의 관계에는 대한민국의 법을 적용합니다.
                                        </p>
                                    </div>
                                </section>
                                <section className="bg-neutral-50 rounded-2xl p-8">
                                    <h3 className="text-xl font-semibold text-[#181d27] mb-4">문의처</h3>
                                    <div className="space-y-2 text-[#535861]">
                                        <p><strong>회사명:</strong> 서초지율 합동법률사무소</p>
                                        <p><strong>주소:</strong> 서울시 강남구 테헤란로 123, 456빌딩 7층</p>
                                        <p><strong>전화:</strong> 02-0000-0000</p>
                                        <p><strong>이메일:</strong> info@서초지율.com</p>
                                        <p><strong>법무법인 등록번호:</strong> 123-45-67890</p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="cta" className="py-16 lg:py-24 bg-[#8a765e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        궁금한 점이 있으시면 문의해주세요
                    </h2>
                    <p className="text-xl text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
                        약관 관련 문의사항이나 법률 상담이 필요하시면 언제든 연락주세요
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center"><span className="px-8 py-4 bg-white text-[#74634e] rounded-lg font-semibold hover:bg-neutral-50 transition-colors cursor-pointer">
                        무료 상담 신청하기
                    </span><span className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#74634e] transition-colors cursor-pointer"><i className="fas fa-phone mr-2"></i>
                            02-0000-0000
                        </span></div>
                </div>
            </section>
        </main>
    );
}
