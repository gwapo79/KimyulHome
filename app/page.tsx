'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main>
      <section id="hero" className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5e503f]/90 to-[#74634e]/80 z-10"></div>
        <img
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5359bb7b39-e88f5d2ad7e760d6699f.png"
          alt="Korean business professional lawyer in a modern office"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#e5ceb4] text-[#74634e] font-medium">
                  <i className="fas fa-shield-halved mr-2"></i>
                  5,000+ 사례 해결 경험
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                부동산 분쟁부터<br />
                <Link href="/services/practice_areas" className="text-[#e5ceb4]">채무 조정</Link>까지<br />
                원스톱 해결
              </h1>
              <p className="text-xl text-[#e5ceb4] mb-8 max-w-2xl">
                전세사기, 경매, 다중채무, 개인회생까지 법률+금융 통합 전문성으로
                투명한 절차와 데이터 기반 전략을 제공합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/company/consultation" className="px-8 py-4 bg-white text-[#74634e] rounded-lg font-semibold hover:bg-neutral-50 transition-colors cursor-pointer text-center">
                  무료 상담 신청하기
                </Link>
                <Link href="/services/success_cases" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#74634e] transition-colors cursor-pointer text-center">
                  성공 사례 보기
                </Link>
              </div>
            </div>
            <div className="flex-1 max-w-lg lg:max-w-none">
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#8a765e] rounded-full flex items-center justify-center">
                      <i className="fas fa-user-tie text-white"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-[#181d27]">전문가와 상담</h3>
                      <p className="text-sm text-[#535861]">평균 응답시간 30분 이내</p>
                    </div>
                  </div>
                  <form className="space-y-4" action="/company/consultation">
                    <div>
                      <label className="block text-sm font-medium text-[#414651] mb-1">성함</label>
                      <input
                        type="text"
                        placeholder="성함을 입력해주세요"
                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#414651] mb-1">연락처</label>
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#414651] mb-1">상담 분야</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none">
                        <option>전세사기</option>
                        <option>경매</option>
                        <option>채무조정</option>
                        <option>개인회생</option>
                        <option>기타</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors"
                    >
                      무료 상담 신청
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#8a765e] mb-2">5,000+</div>
              <div className="text-[#535861]">해결 사례</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#8a765e] mb-2">95%</div>
              <div className="text-[#535861]">고객 만족도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#8a765e] mb-2">15년</div>
              <div className="text-[#535861]">전문 경력</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#8a765e] mb-2">24시간</div>
              <div className="text-[#535861]">상담 지원</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">전문 분야</h2>
            <p className="text-xl text-[#535861] max-w-3xl mx-auto">
              법률과 금융의 통합 전문성으로 복잡한 사건도 체계적으로 해결합니다
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#8a765e] rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-house text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#181d27] mb-4">부동산 분쟁</h3>
              <p className="text-[#535861] mb-6">
                전세사기, 경매, 권리분석 등 부동산 관련 모든 분쟁을 전문적으로 해결합니다.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  전세보증금 미회수 해결
                </li>
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  경매 절차 및 권리 분석
                </li>
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  임대차 분쟁 조정
                </li>
              </ul>
              <Link href="/services/practice_areas" className="inline-flex items-center text-[#8a765e] font-semibold hover:text-[#74634e] transition-colors cursor-pointer">
                자세히 보기
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#8a765e] rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-calculator text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#181d27] mb-4">채무 조정</h3>
              <p className="text-[#535861] mb-6">
                다중채무, 금융기관 협상, 이자 경감 등 채무 문제를 근본적으로 해결합니다.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  다중채무 통합 관리
                </li>
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  금리 인하 협상
                </li>
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  상환 계획 수립
                </li>
              </ul>
              <Link href="/services/practice_areas" className="inline-flex items-center text-[#8a765e] font-semibold hover:text-[#74634e] transition-colors cursor-pointer">
                자세히 보기
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#8a765e] rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#181d27] mb-4">개인회생/파산</h3>
              <p className="text-[#535861] mb-6">
                개인회생, 파산 절차를 통해 새로운 출발의 기회를 제공합니다.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  개인회생 신청 및 진행
                </li>
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  파산 절차 지원
                </li>
                <li className="flex items-center text-[#535861]">
                  <i className="fas fa-check text-[#8a765e] mr-3"></i>
                  신용 회복 컨설팅
                </li>
              </ul>
              <Link href="/services/practice_areas" className="inline-flex items-center text-[#8a765e] font-semibold hover:text-[#74634e] transition-colors cursor-pointer">
                자세히 보기
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">해결 과정</h2>
            <p className="text-xl text-[#535861] max-w-3xl mx-auto">
              투명한 절차로 고객과 함께 단계별로 진행합니다
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#181d27] mb-4">무료 상담</h3>
              <p className="text-[#535861]">
                사건 내용을 자세히 듣고 해결 방향을 제시합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#181d27] mb-4">사건 분석</h3>
              <p className="text-[#535861]">
                관련 법령과 판례를 바탕으로 정확한 분석을 진행합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#181d27] mb-4">전략 수립</h3>
              <p className="text-[#535861]">
                데이터 기반으로 최적의 해결 전략을 수립합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-[#181d27] mb-4">사건 해결</h3>
              <p className="text-[#535861]">
                체계적인 진행으로 최선의 결과를 도출합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="success-cases" className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">성공 사례</h2>
            <p className="text-xl text-[#535861] max-w-3xl mx-auto">
              실제 해결 사례를 통해 저희의 전문성을 확인하세요
            </p>
            <p className="text-sm text-[#717680] mt-4">
              * 아래 사례는 참고용이며, 개별 사건의 결과를 보장하지 않습니다
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#f8f3ed] text-[#74634e] rounded-full text-sm font-medium">전세사기</span>
                <span className="text-sm text-[#535861]">해결기간 4개월</span>
              </div>
              <h3 className="text-lg font-semibold text-[#181d27] mb-3">
                <Link href="/services/case_deposit_200m" className="hover:underline">전세보증금 2억원 전액 회수</Link>
              </h3>
              <p className="text-[#535861] mb-4">
                임대인의 부도로 전세보증금을 받지 못한 상황에서 법적 절차를 통해 전액 회수에 성공
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#8a765e] font-semibold">회수금액: 2억원</span>
                <span className="text-[#8a765e] hover:text-[#74634e] transition-colors cursor-pointer">
                  <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#eef3ff] text-[#3537cc] rounded-full text-sm font-medium">채무조정</span>
                <span className="text-sm text-[#535861]">해결기간 3개월</span>
              </div>
              <h3 className="text-lg font-semibold text-[#181d27] mb-3">
                <Link href="/services/case_debt_80percent" className="hover:underline">다중채무 80% 감면 성공</Link>
              </h3>
              <p className="text-[#535861] mb-4">
                5개 금융기관 총 1억 5천만원 채무를 협상을 통해 3천만원으로 감면
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#8a765e] font-semibold">감면금액: 1억 2천만원</span>
                <span className="text-[#8a765e] hover:text-[#74634e] transition-colors cursor-pointer">
                  <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#fdf1f9] text-[#c01573] rounded-full text-sm font-medium">개인회생</span>
                <span className="text-sm text-[#535861]">해결기간 6개월</span>
              </div>
              <h3 className="text-lg font-semibold text-[#181d27] mb-3">
                <Link href="/services/case_rehab_approval" className="hover:underline">개인회생 인가 결정</Link>
              </h3>
              <p className="text-[#535861] mb-4">
                총 8천만원 채무를 1천 6백만원으로 감면하고 5년 분할 상환 계획 승인
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#8a765e] font-semibold">감면률: 80%</span>
                <span className="text-[#8a765e] hover:text-[#74634e] transition-colors cursor-pointer">
                  <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/services/success_cases" className="px-8 py-4 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors cursor-pointer">
              더 많은 사례 보기
            </Link>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">고객 후기</h2>
            <p className="text-xl text-[#535861] max-w-3xl mx-auto">
              실제 고객들의 생생한 후기를 확인하세요
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-neutral-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <img src="/assets/images/profiles/profile_02.png" alt="김○○ 고객" className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <div className="font-semibold text-[#181d27]">김○○</div>
                  <div className="text-sm text-[#535861]">전세사기 피해자</div>
                </div>
                <div className="ml-auto flex text-[#8a765e] space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-[#535861] leading-relaxed">
                "전세보증금을 못 받을 뻔했는데, 법무법인에서 도움을 받아 전액 회수했습니다.
                절차도 투명하게 안내해주시고, 결과도 만족스러워요. 정말 감사합니다."
              </p>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <img src="/assets/images/profiles/profile_01.png" alt="박○○ 고객" className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <div className="font-semibold text-[#181d27]">박○○</div>
                  <div className="text-sm text-[#535861]">채무조정 고객</div>
                </div>
                <div className="ml-auto flex text-[#8a765e] space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-[#535861] leading-relaxed">
                "다중채무로 고생했는데, 전문가 상담을 받고 채무를 크게 줄일 수 있었습니다.
                이제 새로운 시작을 할 수 있게 되어 정말 고맙습니다."
              </p>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <img src="/assets/images/profiles/profile_03.png" alt="이○○ 고객" className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <div className="font-semibold text-[#181d27]">이○○</div>
                  <div className="text-sm text-[#535861]">개인회생 고객</div>
                </div>
                <div className="ml-auto flex text-[#8a765e] space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-[#535861] leading-relaxed">
                "개인회생 절차가 복잡할 줄 알았는데, 차근차근 안내해주셔서 수월하게 진행됐습니다.
                앞으로 계획적으로 상환하며 신용을 회복해나가겠습니다."
              </p>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <img src="/assets/images/profiles/profile_06.png" alt="최○○ 고객" className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <div className="font-semibold text-[#181d27]">최○○</div>
                  <div className="text-sm text-[#535861]">부동산 분쟁 고객</div>
                </div>
                <div className="ml-auto flex text-[#8a765e] space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-[#535861] leading-relaxed">
                "경매 관련해서 복잡한 문제가 있었는데, 전문적인 조언을 받아 잘 해결됐습니다.
                24시간 상담 지원도 정말 도움이 됐어요."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#181d27] mb-6">자주 묻는 질문</h2>
            <p className="text-xl text-[#535861]">
              고객들이 가장 궁금해하는 질문들을 정리했습니다
            </p>
          </div>
          <div className="space-y-4">
            {[
              { q: "상담비용은 얼마인가요?", a: "초기 상담은 무료로 진행됩니다. 사건 접수 후 비용은 사건의 복잡성과 예상 소요시간에 따라 투명하게 안내드리며, 착수금과 성공보수로 구분하여 합리적으로 책정됩니다." },
              { q: "사건 해결까지 얼마나 걸리나요?", a: "사건의 유형에 따라 다릅니다. 일반적인 부동산 등기 관련이나 단순 분쟁은 1~3개월, 소송이 진행되는 경우 6개월 이상 소요될 수 있습니다. 정확한 기간은 상담 시 안내해드립니다." },
              { q: "어떤 서류를 준비해야 하나요?", a: "관련 계약서, 등기부등본, 내용증명, 문자/카카오톡 내역 등 사건과 관련된 모든 자료를 준비해주시면 더 정확한 상담이 가능합니다." },
              { q: "성공 가능성을 미리 알 수 있나요?", a: "유사한 승소 사례 데이터와 판례 분석을 통해 예상되는 성공 확률을 제공해 드립니다. 다만, 소송은 상대방의 대응 등 변수가 존재하므로 100% 보장은 어렵습니다." },
              { q: "진행 상황을 어떻게 확인하나요?", a: "마이페이지 대시보드를 통해 실시간 진행 상황을 확인하실 수 있으며, 주요 단계마다 담당 변호사가 직접 연락 드려 설명해 드립니다." }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl border border-[#e9e9eb]">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-semibold text-[#181d27]">{item.q}</span>
                  <i className={`fas fa-chevron-down text-[#8a765e] transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}></i>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#535861] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-16 lg:py-24 bg-[#8a765e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            지금 바로 전문가와 상담하세요
          </h2>
          <p className="text-xl text-[#e5ceb4] mb-8 max-w-2xl mx-auto">
            걱정 마세요. 5,000+ 사례 경험을 바탕으로 최선의 해결책을 찾아드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/consultation" className="px-8 py-4 bg-white text-[#74634e] rounded-lg font-semibold hover:bg-neutral-50 transition-colors cursor-pointer text-center">
              무료 상담 신청하기
            </Link>
            <span className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#74634e] transition-colors cursor-pointer text-center flex items-center justify-center">
              <i className="fas fa-phone mr-2"></i>
              02-0000-0000
            </span>
          </div>
          <p className="text-sm text-[#e5ceb4] mt-6">
            평균 응답시간 30분 이내 · 24시간 상담 지원
          </p>
        </div>
      </section>
    </main>
  );
}
