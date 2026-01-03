
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function PracticeAreasPage() {
    const [openFaq, setOpenFaq] = useState<number[]>([]);

    const toggleFaq = (index: number) => {
        setOpenFaq(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <main>
            {/* Hero Section */}
            <section id="hero" className="bg-[#5e503f] h-[500px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="w-full text-center">
                        <p className="text-lg text-[#e5ceb4] mb-4">부동산 · 금융 · 개인회생을 한 곳에서</p>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                            당신의 사건에 맞춘<br />맞춤형 솔루션
                        </h1>
                        <p className="text-xl text-[#e5ceb4] mb-12 max-w-2xl mx-auto">
                            5,000+ 사례 데이터로 안전하게 진행합니다.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/company/consultation" className="px-8 py-4 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors">
                                상담 신청
                            </Link>
                            <Link href="/legal/success-cases" className="px-8 py-4 bg-white text-[#5e503f] rounded-lg font-semibold hover:bg-neutral-50 transition-colors">
                                성공 사례 보기
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="categories" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-[#74634e] uppercase tracking-wider mb-2">Services</p>
                        <h2 className="text-4xl font-bold text-[#181d27] mb-4">핵심 서비스</h2>
                        <p className="text-lg text-[#535861] max-w-3xl mx-auto">
                            법률과 금융의 통합 전문성으로 고객의 문제를 근본적으로 해결합니다.
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Real Estate */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e9e9eb] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                            <div className="w-16 h-16 bg-[#8a765e] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#74634e] transition-colors">
                                <i className="fas fa-scale-balanced text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-[#181d27] mb-4">부동산 법률 지원</h3>
                            <ul className="text-[#535861] space-y-2 mb-6">
                                <li>• 전세보증금 반환 소송</li>
                                <li>• 임대차 분쟁 해결</li>
                                <li>• 경매 및 명도 절차</li>
                                <li>• 가압류/가처분 신청</li>
                            </ul>
                            <div className="flex items-center justify-between">
                                <span className="text-[#74634e] font-semibold hover:underline">자세히 보기</span>
                                <Link href="/company/consultation" className="px-4 py-2 bg-[#8a765e] text-white rounded-lg text-sm hover:bg-[#74634e] transition-colors">
                                    상담 신청
                                </Link>
                            </div>
                        </div>

                        {/* Finance */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e9e9eb] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                            <div className="w-16 h-16 bg-[#8a765e] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#74634e] transition-colors">
                                <i className="fas fa-hand-holding-dollar text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-[#181d27] mb-4">금융 솔루션</h3>
                            <ul className="text-[#535861] space-y-2 mb-6">
                                <li>• 채무조정 및 협상</li>
                                <li>• 이자 경감 신청</li>
                                <li>• 브리지론 및 대환</li>
                                <li>• 신용 회복 지원</li>
                            </ul>
                            <div className="flex items-center justify-between">
                                <span className="text-[#74634e] font-semibold hover:underline">자세히 보기</span>
                                <Link href="/company/consultation" className="px-4 py-2 bg-[#8a765e] text-white rounded-lg text-sm hover:bg-[#74634e] transition-colors">
                                    상담 신청
                                </Link>
                            </div>
                        </div>

                        {/* Recovery */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e9e9eb] hover:shadow-xl transition-all duration-300 cursor-pointer group">
                            <div className="w-16 h-16 bg-[#8a765e] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#74634e] transition-colors">
                                <i className="fas fa-file-invoice-dollar text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-[#181d27] mb-4">개인회생</h3>
                            <ul className="text-[#535861] space-y-2 mb-6">
                                <li>• 준비부터 접수까지</li>
                                <li>• 변제계획안 작성</li>
                                <li>• 인가 전 과정 지원</li>
                                <li>• 사후관리 서비스</li>
                            </ul>
                            <div className="flex items-center justify-between">
                                <span className="text-[#74634e] font-semibold hover:underline">자세히 보기</span>
                                <Link href="/company/consultation" className="px-4 py-2 bg-[#8a765e] text-white rounded-lg text-sm hover:bg-[#74634e] transition-colors">
                                    상담 신청
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-[#74634e] uppercase tracking-wider mb-2">Process</p>
                        <h2 className="text-4xl font-bold text-[#181d27] mb-4">진행 절차</h2>
                        <p className="text-lg text-[#535861] max-w-3xl mx-auto">
                            체계적이고 투명한 절차로 고객의 문제를 단계별로 해결합니다.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute top-12 left-0 right-0 h-0.5 bg-[#e9e9eb] hidden lg:block"></div>
                        <div className="grid lg:grid-cols-6 gap-8">
                            {[
                                { step: 1, title: '초진단', desc: '현재 상황 분석 및 권리관계 검토', icon: 'fa-stethoscope' },
                                { step: 2, title: '전략수립', desc: '최적의 해결방안 제시 및 타임라인 설정', icon: 'fa-chess' },
                                { step: 3, title: '서류 준비', desc: '필요 서류 수집 및 신청서 작성', icon: 'fa-file-alt' },
                                { step: 4, title: '접수/집행', desc: '법원 접수 및 절차 진행', icon: 'fa-paper-plane' },
                                { step: 5, title: '판결/인가', desc: '결과 확정 및 후속 조치', icon: 'fa-gavel' },
                                { step: 6, title: '사후관리', desc: '지속적인 모니터링 및 지원', icon: 'fa-handshake' },
                            ].map((item, index) => (
                                <div key={index} className="text-center relative">
                                    <div className="w-24 h-24 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                                        <i className={`fas ${item.icon} text-white text-2xl`}></i>
                                    </div>
                                    <h3 className="font-semibold text-[#181d27] mb-2">{item.step}. {item.title}</h3>
                                    <p className="text-sm text-[#535861]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mini FAQ Section */}
            <section id="mini_faq" className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-[#74634e] uppercase tracking-wider mb-2">FAQ</p>
                        <h2 className="text-4xl font-bold text-[#181d27] mb-4">자주 묻는 질문</h2>
                        <p className="text-lg text-[#535861]">
                            상담 전 궁금한 점들을 미리 확인해보세요.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: '예상 소요 기간은 어떻게 되나요?', a: '평균 3~6개월입니다. 사건의 복잡도와 상대방의 대응에 따라 달라질 수 있으며, 초기 상담 시 구체적인 예상 기간을 안내드립니다.' },
                            { q: '비용은 어떻게 산정되나요?', a: '난이도와 소요시간에 따라 사전 견적을 드립니다. 투명한 비용 구조로 숨겨진 수수료 없이 명확하게 안내해드립니다.' },
                            { q: '서류 준비는 어떻게 하나요?', a: '기본 신분증, 계약서, 금융 내역 등을 준비해주시면 됩니다. 상세한 준비 서류 목록은 상담 시 개별적으로 안내드립니다.' },
                            { q: '승소/인가 확률은 어떻게 되나요?', a: '케이스별로 다르며, 과거 유사 사례 데이터를 기반으로 승소 가능성을 분석하여 설명드립니다. 5,000+ 사례 데이터를 보유하고 있습니다.' },
                        ].map((item, index) => (
                            <div key={index} className="border border-[#e9e9eb] rounded-lg">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-neutral-50 transition-colors"
                                >
                                    <span className="font-semibold text-[#181d27]">Q{index + 1}. {item.q}</span>
                                    <i className={`fas ${openFaq.includes(index) ? 'fa-minus rotate-180' : 'fa-plus rotate-0'} text-[#74634e] transition-transform duration-200`}></i>
                                </button>
                                <div className={`px-6 pb-4 text-[#535861] ${openFaq.includes(index) ? 'block' : 'hidden'}`}>
                                    {item.a}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors">
                            상담 신청
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-24 bg-[#5e503f]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">무료 상담으로 시작하세요</h2>
                    <p className="text-xl text-[#e5ceb4] mb-12">
                        지금 상황을 알려주시면 전략을 제안합니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/company/consultation" className="px-8 py-4 bg-white text-[#5e503f] rounded-lg font-semibold hover:bg-neutral-50 transition-colors">
                            무료 상담 신청
                        </Link>
                        <a href="tel:02-6080-3377" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#5e503f] transition-colors">
                            02-6080-3377
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
