
import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import HeroConsultationForm from './components/home/HeroConsultationForm';
import FAQList from './components/home/FAQList';
import { SuccessCase, Review, FAQ } from '@prisma/client';
import { formatClientName } from '@/lib/utils';



async function getSuccessCases() {
  return await prisma.successCase.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
}

async function getReviews() {
  return await prisma.review.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });
}

async function getFAQs() {
  return await prisma.fAQ.findMany({
    take: 5,
    orderBy: { order: 'asc' },
  });
}

export default async function Home() {
  let successCases: SuccessCase[] = [];
  let reviews: Review[] = [];
  let faqs: FAQ[] = [];

  try {
    successCases = await getSuccessCases();
    reviews = await getReviews();
    faqs = await getFAQs();
  } catch (error) {
    console.error("Error fetching data in Home:", error);
  }

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
                <Link href="/legal/success-cases" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#74634e] transition-colors cursor-pointer text-center">
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
                  <HeroConsultationForm />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successCases.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                {/* Image Section */}
                <div className="relative h-48 w-full bg-neutral-200">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <i className="fas fa-image text-3xl"></i>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#74634e] rounded-full text-sm font-medium shadow-sm">{item.category}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#535861] flex items-center">
                      <i className="fas fa-user-tie mr-2 text-[#8a765e]"></i>
                      {item.lawyer || '담당 변호사'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#181d27] mb-3 line-clamp-2 leading-snug">
                    <Link href={`/legal/success-cases/${item.id}`} className="hover:text-[#8a765e] transition-colors">{item.title}</Link>
                  </h3>
                  <p className="text-[#535861] mb-4 line-clamp-3 flex-grow">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[#8a765e] font-semibold text-sm">{item.amount || '해결 완료'}</span>
                    <span className="text-[#8a765e] hover:text-[#74634e] transition-colors cursor-pointer">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/legal/success-cases" className="px-8 py-4 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors cursor-pointer">
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
            {reviews.map((review) => (
              <div key={review.id} className="bg-neutral-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#8a765e]/20 rounded-full flex items-center justify-center text-[#8a765e] text-xl font-bold">
                    {formatClientName(review.author)[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-[#181d27]">{formatClientName(review.author)}</div>
                    <div className="text-sm text-[#535861]">{review.category} 고객</div>
                  </div>
                  <div className="ml-auto flex text-[#8a765e] space-x-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
                <p className="text-[#535861] leading-relaxed">
                  "{review.content}"
                </p>
              </div>
            ))}
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

          <FAQList items={faqs} />

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
              02-6080-3377
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
