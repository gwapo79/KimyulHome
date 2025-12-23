
import Link from "next/link";

export default function ConsultationPage() {
    return (
        <main>
            <section id="hero" className="py-16 lg:py-24 bg-[#5e503f]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-6"><span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-[#e5ceb4] text-[#74634e] font-medium"><i className="fas fa-clock mr-2"></i>
                        평균 응답시간 30분 이내
                    </span></div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        무료 상담으로<br /><span className="text-[#e5ceb4]">해결책을 찾아보세요</span></h1>
                    <p className="text-xl text-[#e5ceb4] mb-8 max-w-3xl mx-auto leading-relaxed">
                        전문가가 24시간 내 연락드립니다.<br />
                        5,000+ 사례 경험을 바탕으로 최적의 해결 방향을 제시해드리겠습니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center"><button className="px-8 py-4 bg-white text-[#74634e] rounded-lg font-semibold hover:bg-neutral-50 transition-colors">
                        상담 신청하기
                    </button><button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#74634e] transition-colors"><i className="fas fa-comments mr-2"></i>
                            채팅 상담
                        </button></div>
                </div>
            </section>
            <section id="instructions" className="py-16 lg:py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-4">준비하면
                            좋은 서류</h2>
                        <p className="text-xl text-[#535861]">
                            아래 서류들이 있으면 더 정확한 상담이 가능합니다 (선택사항)
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#eef3ff] rounded-lg flex items-center justify-center">
                                    <i className="fas fa-id-card text-[#3537cc] text-xl"></i></div>
                                <h3 className="text-lg font-semibold text-[#181d27] ml-4">신분 관련</h3>
                            </div>
                            <ul role="list" aria-label="신분 관련 서류 목록" className="space-y-3">
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    신분증 사본
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    주민등록등본
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    가족관계증명서 (필요시)
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                                    <i className="fas fa-file-contract text-[#15803d] text-xl"></i></div>
                                <h3 className="text-lg font-semibold text-[#181d27] ml-4">계약/거래</h3>
                            </div>
                            <ul role="list" aria-label="계약 거래 관련 서류 목록" className="space-y-3">
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    계약서 사본
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    영수증/입금확인서
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    등기부등본 (부동산 관련)
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#fef3f2] rounded-lg flex items-center justify-center">
                                    <i className="fas fa-credit-card text-[#dc2626] text-xl"></i></div>
                                <h3 className="text-lg font-semibold text-[#181d27] ml-4">금융 내역</h3>
                            </div>
                            <ul role="list" aria-label="금융 관련 서류 목록" className="space-y-3">
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    통장 거래 내역
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    대출/신용카드 내역
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    소득금액증명원
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-[#fdf1f9] rounded-lg flex items-center justify-center">
                                    <i className="fas fa-envelope text-[#c01573] text-xl"></i></div>
                                <h3 className="text-lg font-semibold text-[#181d27] ml-4">공문/통지</h3>
                            </div>
                            <ul role="list" aria-label="공문 통지 관련 서류 목록" className="space-y-3">
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    법원/관공서 공문
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    독촉장/압류통지서
                                </li>
                                <li className="flex items-center text-[#535861]"><i className="fas fa-check text-[#8a765e] mr-3 text-sm"></i>
                                    관련 문자/이메일
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-[#f8f3ed] border-l-4 border-[#8a765e] p-6 mt-8">
                        <div className="flex items-start"><i className="fas fa-circle-info text-[#8a765e] text-xl mr-3 mt-1"></i>
                            <div>
                                <h4 className="font-semibold text-[#181d27] mb-2">안내사항</h4>
                                <p className="text-[#535861] leading-relaxed">
                                    서류가 없어도 상담 가능합니다. 상황을 말씀해주시면 필요한 서류를 안내드리고,
                                    준비 과정부터 함께 도와드리겠습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="form" className="py-16 lg:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-4">상담
                            신청서</h2>
                        <p className="text-xl text-[#535861]">
                            간단한 정보만 입력하시면 전문가가 빠르게 연락드리겠습니다
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <form id="counselForm" noValidate className="space-y-6">
                            {/* Form fields can be added here as per the original HTML if needed, but original used JS to generate/insert form content or handled it separately? 
                  Ah, the original HTML has <form id="counselForm" ...></form> empty! 
                  It seems it might have been dynamically populated or just empty in the provided file.
                  Wait, looking at about.html, it had a full form. 
                  In consultation.html line 335, <form id="counselForm" novalidate="" class="space-y-6"></form>. 
                  It is indeed empty in the source I read. 
                  However, I should probably provide a basic form structure similar to about.html if it's missing, or maybe the user intends to add it later?
                  Actually, about.html has a form at line 325-354.
                  consultation.html seems to rely on JS or it was omitted. 
                  I will add a basic form structure similar to the one in about.html for better UX.
              */}
                            <div><label htmlFor="name" className="block text-sm font-medium text-brand-text-primary mb-1">이름
                                <span className="text-red-500">*</span></label><input type="text" placeholder="이름을 입력해주세요" className="w-full px-4 py-3 rounded-lg border border-brand-gray-dark focus:border-brand-brown focus:ring-brand-brown focus:ring-opacity-50" />
                            </div>
                            <div><label htmlFor="phone" className="block text-sm font-medium text-brand-text-primary mb-1">연락처
                                <span className="text-red-500">*</span></label><input type="tel" id="phone" name="phone" placeholder="예: 010-1234-5678" className="w-full px-4 py-3 rounded-lg border border-brand-gray-dark focus:border-brand-brown focus:ring-brand-brown focus:ring-opacity-50" />
                            </div>
                            <div><label htmlFor="message" className="block text-sm font-medium text-brand-text-primary mb-1">상담
                                내용 <span className="text-red-500">*</span></label><textarea id="message" name="message" rows={5} placeholder="부동산·채무·회생 등 상담이 필요한 내용을 적어주세요." className="w-full px-4 py-3 rounded-lg border border-brand-gray-dark focus:border-brand-brown focus:ring-brand-brown focus:ring-opacity-50"></textarea>
                            </div>
                            <div className="flex items-start"><input id="privacy-agreement" name="privacy-agreement" type="checkbox" className="h-4 w-4 text-brand-brown border-brand-gray-dark rounded focus:ring-brand-brown mt-0.5" /><label htmlFor="privacy-agreement" className="ml-3 block text-sm text-brand-text-secondary">
                                본인은 입력한 개인정보가 상담 목적에 한해 수집·이용되는 것에 동의합니다.
                            </label></div>
                            <div><button type="submit" className="w-full px-6 py-4 bg-brand-brown text-white rounded-lg font-semibold hover:bg-brand-brown-dark transition-colors">
                                무료 상담 신청하기
                            </button></div>
                        </form>
                        <div id="successMessage" role="alert" aria-live="polite" className="hidden mt-8 p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg">
                            {/* Success message structure */}
                        </div>
                    </div>
                </div>
            </section>
            <section id="contact" className="py-16 lg:py-20 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-4">다양한
                            방법으로 연결하세요</h2>
                        <p className="text-xl text-[#535861]">
                            전화 02-6080-3377, 평일 09:00~18:00
                        </p>
                        <p className="text-sm text-[#717680] mt-2">
                            주말·공휴일에도 온라인 상담은 24시간 접수 가능합니다
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-[#eef3ff] rounded-lg flex items-center justify-center">
                                        <i className="fas fa-phone text-[#3537cc] text-xl"></i></div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-[#181d27]">전화 상담</h3>
                                        <p className="text-sm text-[#535861]">즉시 연결 가능</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-[#535861] mb-3">
                                        긴급한 상황이거나 직접 통화를 원하시는 경우 전화로 연락해주세요.
                                    </p>
                                    <div className="space-y-2 text-sm text-[#717680]">
                                        <div className="flex items-center"><i className="fas fa-clock w-4 mr-2"></i>
                                            평일 09:00 - 18:00
                                        </div>
                                        <div className="flex items-center"><i className="fas fa-calendar-xmark w-4 mr-2"></i>
                                            주말·공휴일 휴무
                                        </div>
                                    </div>
                                </div><button className="w-full px-6 py-3 bg-[#3537cc] text-white rounded-lg font-semibold hover:bg-[#2563eb] transition-colors"><i className="fas fa-phone mr-2"></i>
                                    02-6080-3377로 전화하기
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                                        <i className="fas fa-comments text-[#15803d] text-xl"></i></div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-[#181d27]">온라인 채팅</h3>
                                        <p className="text-sm text-[#535861]">24시간 접수</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-[#535861] mb-3">
                                        시간에 관계없이 채팅으로 상담받으실 수 있습니다.
                                        업무시간 외에는 다음 영업일에 답변드립니다.
                                    </p>
                                    <div className="space-y-2 text-sm text-[#717680]">
                                        <div className="flex items-center"><i className="fas fa-clock w-4 mr-2"></i>
                                            24시간 접수 가능
                                        </div>
                                        <div className="flex items-center"><i className="fas fa-reply w-4 mr-2"></i>
                                            평균 응답시간 30분
                                        </div>
                                    </div>
                                </div><button className="w-full px-6 py-3 bg-[#15803d] text-white rounded-lg font-semibold hover:bg-[#16a34a] transition-colors"><i className="fas fa-comments mr-2"></i>
                                    채팅 상담 시작하기
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-[#fef3f2] rounded-lg flex items-center justify-center">
                                        <i className="fas fa-location-dot text-[#dc2626] text-xl"></i></div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-[#181d27]">직접 방문</h3>
                                        <p className="text-sm text-[#535861]">예약 필수</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-[#535861] mb-3">
                                        대면 상담을 원하시는 경우 미리 예약 후 방문해주세요.
                                    </p>
                                    <address className="text-sm text-[#717680] not-italic">
                                        서울시 강남구 테헤란로 123<br />
                                        456빌딩 7층 (역삼역 2번 출구 도보 3분)
                                    </address>
                                </div><button className="w-full px-6 py-3 bg-[#dc2626] text-white rounded-lg font-semibold hover:bg-[#b91c1c] transition-colors"><i className="fas fa-diamond-turn-right mr-2"></i>
                                    오시는 길 보기
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-2 shadow-sm">
                            <div className="w-full h-96 bg-neutral-100 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center"><i className="fas fa-map-location-dot text-[#8a765e] text-4xl mb-4"></i>
                                        <h4 className="text-lg font-semibold text-[#181d27] mb-2">법무법인
                                            위치</h4>
                                        <p className="text-[#535861] text-sm mb-4">서울시 강남구 테헤란로 123,
                                            456빌딩 7층</p><button className="px-4 py-2 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors">
                                            지도에서 보기
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-2 text-xs text-[#717680]">
                                    * 실제 서비스에서는 네이버/카카오맵 연동
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-[#181d27] mb-2">교통편 안내</h4>
                                <div className="space-y-2 text-sm text-[#535861]">
                                    <div className="flex items-center"><i className="fas fa-train-subway text-[#8a765e] w-4 mr-2"></i>
                                        지하철 2호선 역삼역 2번 출구 도보 3분
                                    </div>
                                    <div className="flex items-center"><i className="fas fa-bus text-[#8a765e] w-4 mr-2"></i>
                                        간선버스 146, 740, 750 역삼역 정류장
                                    </div>
                                    <div className="flex items-center"><i className="fas fa-car text-[#8a765e] w-4 mr-2"></i>
                                        건물 지하 주차장 이용 가능 (2시간 무료)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
