
"use client";
import React, { useState } from 'react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [category, setCategory] = useState("all");

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            id: 1,
            category: "real-estate",
            categoryLabel: "부동산",
            subCategoryLabel: "전세사기",
            subCategoryColor: "text-[#3537cc] bg-[#eef3ff]",
            question: "전세사기 보증금, 반드시 돌려받나요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed">
                        권리분석과 가압류를 병행할 때 회수율이 높아집니다. 다만 사건별로 임대인의 재산 상태, 다른 채권자 현황 등에
                        따라 결과가 달라질 수 있어 정확한 확인이 필요합니다.
                        과거 유사 사례를 바탕으로 회수 가능성을 안내드리며, 절차별 소요 비용과 기간도 투명하게 설명드립니다.
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            관련 상담 신청하기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 2,
            category: "cost",
            categoryLabel: "비용",
            subCategoryLabel: "상담",
            subCategoryColor: "text-[#15803d] bg-[#f0fdf4]",
            question: "상담 비용은 얼마인가요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        초기 상담은 무료로 진행됩니다. 사건을 정식으로 진행하실 경우에만 비용이 발생하며,
                        사건의 복잡성과 예상 소요시간에 따라 투명한 견적을 안내드립니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li className="flex items-center">
                                <i className="fas fa-check text-[#8a765e] mr-2"></i>
                                1차 상담: 무료 (30분~1시간)
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-[#8a765e] mr-2"></i>
                                착수금: 사건별 차등 (사전 견적 제공)
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-[#8a765e] mr-2"></i>
                                성공보수: 결과에 따른 차등 적용
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            무료 상담 신청하기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 3,
            category: "recovery",
            categoryLabel: "개인회생",
            subCategoryLabel: "기간",
            subCategoryColor: "text-[#3537cc] bg-[#eef3ff]",
            question: "개인회생 기간은 얼마나 걸리나요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        개인회생 절차는 평균 6개월 정도 소요되며, 법원의 일정과 서류 준비 상황에 따라 다를 수 있습니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">단계별 소요 기간</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li>• 서류 준비 및 신청: 1~2개월</li>
                            <li>• 법원 심사 및 보정: 2~3개월</li>
                            <li>• 인가 결정: 1~2개월</li>
                        </ul>
                    </div>
                    <p className="text-sm text-[#717680] mb-4">
                        * 개별 사안에 따라 기간이 달라질 수 있으며, 정확한 예상 기간은 상담을 통해 안내드립니다.
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            개인회생 상담 신청하기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 4,
            category: "debt",
            categoryLabel: "채무조정",
            subCategoryLabel: "이자경감",
            subCategoryColor: "text-[#15803d] bg-[#f0fdf4]",
            question: "채무 이자 경감이 가능한가요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        금융기관과의 협상이나 법정 조정 절차를 통해 이자 경감이 가능합니다.
                        저희 사례에서는 평균 25% 정도의 경감 효과를 보았으나, 개별 상황에 따라 다를 수 있습니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">이자 경감 방법</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li>• 금융기관 직접 협상</li>
                            <li>• 신용회복위원회 조정</li>
                            <li>• 법원 조정 절차 활용</li>
                            <li>• 개인회생 신청을 통한 감면</li>
                        </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            채무조정 상담 신청하기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 5,
            category: "cost",
            categoryLabel: "서류",
            subCategoryLabel: "절차",
            subCategoryColor: "text-[#15803d] bg-[#f0fdf4]",
            question: "어떤 서류를 준비해야 하나요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        사건 유형에 따라 필요한 서류가 다르지만, 기본적으로 계약서, 금융거래 내역, 공문서 등이 필요합니다.
                        상담 시 구체적인 서류 목록을 안내드립니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-neutral-50 rounded-lg p-4">
                            <h4 className="font-semibold text-[#181d27] mb-2">부동산 분쟁</h4>
                            <ul className="space-y-1 text-sm text-[#535861]">
                                <li>• 임대차 계약서</li>
                                <li>• 보증금 이체 내역</li>
                                <li>• 등기부등본</li>
                                <li>• 확정일자 증명서</li>
                            </ul>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-4">
                            <h4 className="font-semibold text-[#181d27] mb-2">채무/개인회생</h4>
                            <ul className="space-y-1 text-sm text-[#535861]">
                                <li>• 신용정보 조회서</li>
                                <li>• 소득/재산 증명서</li>
                                <li>• 대출 계약서</li>
                                <li>• 가족관계증명서</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            서류 준비 안내받기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 6,
            category: "etc",
            categoryLabel: "소송",
            subCategoryLabel: "대안절차",
            subCategoryColor: "text-[#15803d] bg-[#f0fdf4]",
            question: "소송이 꼭 필요한가요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        모든 사안에서 소송이 필요한 것은 아닙니다. 사안별로 협상, 조정, 중재 등 대체 절차를 먼저 검토하여
                        시간과 비용을 절약할 수 있는 방법을 찾아드립니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">대안 해결 방법</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li className="flex items-center"><i className="fas fa-handshake text-[#8a765e] mr-2"></i>당사자 간 협상</li>
                            <li className="flex items-center"><i className="fas fa-scale-balanced text-[#8a765e] mr-2"></i>법원 조정 절차</li>
                            <li className="flex items-center"><i className="fas fa-users text-[#8a765e] mr-2"></i>중재 기관 활용</li>
                            <li className="flex items-center"><i className="fas fa-file-lines text-[#8a765e] mr-2"></i>행정 기관 신고/신청</li>
                        </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            해결방법 상담받기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 7,
            category: "etc",
            categoryLabel: "확률",
            subCategoryLabel: "데이터",
            subCategoryColor: "text-[#3537cc] bg-[#eef3ff]",
            question: "승소/인가 확률을 미리 알 수 있나요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        저희가 보유한 과거 데이터와 판례를 바탕으로 예상 성공률을 안내드립니다.
                        다만 개별 사건마다 상황이 다르므로 정확한 결과를 보장할 수는 없습니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">분석 기준</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li>• 유사 사례 5,000+ 건 데이터 분석</li>
                            <li>• 관련 판례 및 법령 검토</li>
                            <li>• 상대방 재산/신용 상태 조사</li>
                            <li>• 증거자료의 충분성 평가</li>
                        </ul>
                    </div>
                    <p className="text-sm text-[#717680] mb-4">* 본 분석은 참고용이며, 실제 결과를 보장하지 않습니다.</p>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            사건 분석 받기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 8,
            category: "etc",
            categoryLabel: "원격",
            subCategoryLabel: "화상상담",
            subCategoryColor: "text-[#15803d] bg-[#f0fdf4]",
            question: "방문 없이도 진행이 가능한가요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        대부분의 절차는 원격으로 진행 가능합니다. 화상 상담, 온라인 서류 제출,
                        전자 서명 등을 통해 직접 방문 없이도 사건을 진행할 수 있습니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">원격 지원 서비스</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li className="flex items-center"><i className="fas fa-video text-[#8a765e] mr-2"></i>화상 상담 (Zoom, Teams 등)</li>
                            <li className="flex items-center"><i className="fas fa-cloud-arrow-up text-[#8a765e] mr-2"></i>온라인 서류 제출</li>
                            <li className="flex items-center"><i className="fas fa-signature text-[#8a765e] mr-2"></i>전자 서명 및 계약</li>
                            <li className="flex items-center"><i className="fas fa-mobile-screen-button text-[#8a765e] mr-2"></i>모바일 진행상황 확인</li>
                        </ul>
                    </div>
                    <p className="text-sm text-[#717680] mb-4">* 일부 절차(공증, 법원 출석 등)는 직접 방문이 필요할 수 있습니다.</p>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            화상 상담 신청하기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 9,
            category: "etc",
            categoryLabel: "개인정보",
            subCategoryLabel: "보안",
            subCategoryColor: "text-[#15803d] bg-[#f0fdf4]",
            question: "개인정보는 안전하게 보호되나요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        개인정보보호법에 따라 고객의 개인정보를 안전하게 보관하고 암호화하여 처리합니다.
                        법정 보관 기간 준수 및 목적 달성 후 즉시 파기 원칙을 적용합니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">보안 조치</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li className="flex items-center"><i className="fas fa-lock text-[#8a765e] mr-2"></i>SSL 암호화 통신</li>
                            <li className="flex items-center"><i className="fas fa-shield-halved text-[#8a765e] mr-2"></i>서버 접근 권한 제한</li>
                            <li className="flex items-center"><i className="fas fa-key text-[#8a765e] mr-2"></i>개인정보 접근 로그 관리</li>
                            <li className="flex items-center"><i className="fas fa-trash text-[#8a765e] mr-2"></i>보관기간 만료 시 자동 파기</li>
                        </ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-amber-800 mb-2">보관 기간</h4>
                        <ul className="space-y-1 text-sm text-amber-700">
                            <li>• 계약/결제 관련: 5년</li>
                            <li>• 상담 기록: 3년</li>
                            <li>• 웹사이트 방문 기록: 3개월</li>
                        </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e9e9eb]">
                        <button className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors flex items-center">
                            개인정보처리방침 보기 <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )
        },
        {
            id: 10,
            category: "cost",
            categoryLabel: "비용",
            subCategoryLabel: "변동",
            subCategoryColor: "text-[#3537cc] bg-[#eef3ff]",
            question: "진행 중에 비용이 변동될 수 있나요?",
            answer: (
                <>
                    <p className="text-[#535861] leading-relaxed mb-4">
                        예상치 못한 상황으로 추가 절차가 필요한 경우에만 비용 변동이 있을 수 있습니다.
                        이 경우 반드시 사전에 고지하고 고객 동의를 받은 후 진행합니다.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-[#181d27] mb-2">비용 변동 원칙</h4>
                        <ul className="space-y-2 text-sm text-[#535861]">
                            <li className="flex items-center"><i className="fas fa-circle-info text-[#8a765e] mr-2"></i>변동 사유 상세 설명</li>
                            <li className="flex items-center"><i className="fas fa-calculator text-[#8a765e] mr-2"></i>추가 비용 명세서 제공</li>
                            <li className="flex items-center"><i className="fas fa-handshake text-[#8a765e] mr-2"></i>고객 동의 후 진행</li>
                        </ul>
                    </div>
                </>
            )
        }
    ];

    const filteredFaqs = category === "all" ? faqs : faqs.filter(faq => faq.category === category);

    return (
        <main>
            {/* Hero Section */}
            <section id="hero" className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">자주 묻는 질문</h1>
                        <p className="text-xl text-[#535861] max-w-3xl mx-auto mb-8">
                            상담 전 궁금한 점을 빠르게 확인하세요
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="궁금한 내용을 검색해보세요 (예: 상담비용, 해결기간)"
                                aria-label="FAQ 검색"
                                className="w-full px-6 py-4 pl-12 rounded-2xl border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none text-lg"
                            />
                            <i className="fas fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-[#717680]"></i>
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#8a765e] text-white rounded-xl hover:bg-[#74634e] transition-colors">
                                검색
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {[
                            { id: 'all', label: '전체' },
                            { id: 'real-estate', label: '부동산' },
                            { id: 'debt', label: '채무/금융' },
                            { id: 'recovery', label: '개인회생' },
                            { id: 'cost', label: '비용/절차' },
                            { id: 'etc', label: '기타' }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-colors ${category === cat.id
                                    ? 'bg-[#8a765e] text-white'
                                    : 'bg-white border border-[#d5d6d9] text-[#535861] hover:border-[#8a765e] hover:text-[#8a765e]'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="text-center">
                        <button className="px-8 py-4 bg-white border-2 border-[#8a765e] text-[#8a765e] rounded-lg font-semibold hover:bg-[#8a765e] hover:text-white transition-colors">
                            무료 상담 신청하기
                        </button>
                    </div>
                </div>
            </section>

            {/* QA Section */}
            <section id="qa" className="py-16 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div key={faq.id} className="bg-white rounded-2xl border border-[#e9e9eb] faq-item">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-neutral-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[#181d27] mb-2">{faq.question}</h3>
                                        <div className="flex gap-2">
                                            {faq.categoryLabel === "비용" || faq.categoryLabel === "개인정보" || faq.categoryLabel === "원격" || faq.categoryLabel === "소송" || faq.categoryLabel === "부동산" ? (
                                                <span className="px-2 py-1 bg-[#f8f3ed] text-[#74634e] rounded-full text-xs">{faq.categoryLabel}</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-[#fdf1f9] text-[#c01573] rounded-full text-xs">{faq.categoryLabel}</span>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs ${faq.subCategoryColor}`}>
                                                {faq.subCategoryLabel}
                                            </span>
                                        </div>
                                    </div>
                                    <i className={`fas fa-plus text-[#8a765e] ml-4 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}></i>
                                </button>
                                <div className={`px-6 pb-6 ${openIndex === index ? 'block' : 'hidden'}`}>
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
