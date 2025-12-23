
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function BlogPage() {
    const [category, setCategory] = useState("all");

    const posts = [
        {
            id: 1,
            category: "real-estate",
            categoryLabel: "부동산 분쟁",
            readTime: "5분 읽기",
            gradient: "from-[#8a765e] to-[#74634e]",
            icon: "fa-house",
            date: "2025년 1월 15일",
            views: "1,250",
            title: "전세사기 판례 분석: 핵심 쟁점 3가지",
            excerpt: "최근 대법원 판례를 바탕으로 전세사기 피해 구제의 핵심 쟁점을 분석하고, 실무에서 적용할 수 있는 전략을 제시합니다.",
            author: "김○○ 변호사",
            authorImg: "/assets/images/profiles/profile_03.png"
        },
        {
            id: 2,
            category: "recovery",
            categoryLabel: "개인회생",
            readTime: "8분 읽기",
            gradient: "from-[#3537cc] to-[#2563eb]",
            icon: "fa-chart-line",
            date: "2025년 1월 12일",
            views: "980",
            title: "개인회생 절차, 평균 6개월 타임라인",
            excerpt: "개인회생 신청부터 인가까지의 전체 과정을 단계별로 상세히 설명하고, 각 단계별 소요 기간과 준비사항을 안내합니다.",
            author: "박○○ 변호사",
            authorImg: "/assets/images/profiles/profile_01.png"
        },
        {
            id: 3,
            category: "debt",
            categoryLabel: "채무 관리",
            readTime: "6분 읽기",
            gradient: "from-[#15803d] to-[#16a34a]",
            icon: "fa-calculator",
            date: "2025년 1월 10일",
            views: "1,480",
            title: "채무이자 25% 줄이는 협상 팁",
            excerpt: "금융기관과의 효과적인 협상 전략과 이자 경감을 위한 실무 노하우를 실제 사례를 통해 상세히 설명합니다.",
            author: "이○○ 변호사",
            authorImg: "/assets/images/profiles/profile_02.png"
        },
        {
            id: 4,
            category: "case-law",
            categoryLabel: "판례",
            readTime: "7분 읽기",
            gradient: "from-[#c01573] to-[#be185d]",
            icon: "fa-gavel",
            date: "2025년 1월 8일",
            views: "2,150",
            title: "2025년 달라지는 부동산 법률",
            excerpt: "올해부터 시행되는 부동산 관련 법률 개정사항을 정리하고, 실무에 미치는 영향을 분석합니다.",
            author: "최○○ 변호사",
            authorImg: "/assets/images/profiles/profile_06.png"
        },
        {
            id: 5,
            category: "guide",
            categoryLabel: "가이드",
            readTime: "10분 읽기",
            gradient: "from-[#ea580c] to-[#dc2626]",
            icon: "fa-list-check",
            date: "2025년 1월 5일",
            views: "1,750",
            title: "상속 분쟁을 줄이는 계약 체크리스트",
            excerpt: "상속 과정에서 발생할 수 있는 분쟁을 미리 방지하기 위한 계약서 작성 가이드와 필수 체크포인트를 제시합니다.",
            author: "정○○ 변호사",
            authorImg: "/assets/images/profiles/profile_05.png"
        },
        {
            id: 6,
            category: "guide",
            categoryLabel: "가이드",
            readTime: "9분 읽기",
            gradient: "from-[#7c3aed] to-[#6d28d9]",
            icon: "fa-shield-halved",
            date: "2025년 1월 3일",
            views: "1,320",
            title: "압류 전 알아야 할 권리 가이드",
            excerpt: "압류 통지를 받았을 때 당황하지 말고 알아둬야 할 권리와 대응 방법을 단계별로 상세히 안내합니다.",
            author: "한○○ 변호사",
            authorImg: "/assets/images/profiles/profile_07_v2.png"
        }
    ];

    const filteredPosts = category === "all" ? posts : posts.filter(post => post.category === category);

    return (
        <main>
            {/* Hero Section */}
            <section id="hero" className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">
                            법률·금융 인사이트
                        </h1>
                        <p className="text-xl text-[#535861] max-w-3xl mx-auto mb-8">
                            최신 판례와 실전 가이드를 확인하세요
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="궁금한 주제를 검색해보세요 (예: 전세사기 판례, 개인회생 절차)"
                                aria-label="블로그 검색"
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
                            { id: 'real-estate', label: '부동산 분쟁' },
                            { id: 'debt', label: '채무 관리' },
                            { id: 'recovery', label: '개인회생' },
                            { id: 'case-law', label: '판례' },
                            { id: 'guide', label: '가이드' }
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white border-2 border-[#8a765e] text-[#8a765e] rounded-lg font-semibold hover:bg-[#8a765e] hover:text-white transition-colors">
                            구독 신청
                        </button>
                        <button className="px-8 py-4 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors">
                            무료 상담 신청하기
                        </button>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section id="cards" className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-6">추천 아티클</h2>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-[#f8f3ed] text-[#74634e] rounded-full text-sm">최신</span>
                                <span className="px-3 py-1 bg-[#eef3ff] text-[#3537cc] rounded-full text-sm">인기</span>
                                <span className="px-3 py-1 bg-[#f0fdf4] text-[#15803d] rounded-full text-sm">추천</span>
                            </div>
                            <select className="px-4 py-2 bg-white border border-[#d5d6d9] rounded-lg focus:border-[#8a765e] focus:outline-none">
                                <option>최신순</option>
                                <option>인기순</option>
                                <option>조회순</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                                <div className={`h-48 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium ${post.categoryLabel === "부동산 분쟁" ? "text-[#74634e]" :
                                                    post.categoryLabel === "개인회생" ? "text-[#3537cc]" :
                                                        post.categoryLabel === "채무 관리" ? "text-[#15803d]" :
                                                            post.categoryLabel === "판례" ? "text-[#c01573]" :
                                                                post.categoryLabel === "가이드" && post.gradient.includes("from-[#ea580c]") ? "text-[#ea580c]" :
                                                                    "text-[#7c3aed]"
                                                }`}>
                                                {post.categoryLabel}
                                            </span>
                                            <span className="text-white text-sm">{post.readTime}</span>
                                        </div>
                                    </div>
                                    <i className={`fas ${post.icon} text-white text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20`}></i>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <time className="text-sm text-[#717680]">{post.date}</time>
                                        <div className="flex items-center text-sm text-[#717680]">
                                            <i className="fas fa-eye mr-1"></i> {post.views}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#181d27] mb-3 hover:text-[#74634e] transition-colors cursor-pointer">
                                        {post.title}
                                    </h3>
                                    <p className="text-[#535861] mb-4 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src={post.authorImg} alt={post.author} className="w-8 h-8 rounded-full mr-2" />
                                            <span className="text-sm text-[#535861]">{post.author}</span>
                                        </div>
                                        <button className="flex items-center text-[#8a765e] hover:text-[#74634e] font-medium transition-colors">
                                            자세히 보기 <i className="fas fa-arrow-right ml-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-white border border-[#d5d6d9] text-[#535861] rounded-lg hover:border-[#8a765e] hover:text-[#8a765e] transition-colors font-medium">
                            더 많은 글 보기
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section id="newsletter" className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-neutral-50 rounded-3xl p-8 lg:p-12">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#8a765e] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-envelope text-white text-2xl"></i>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-4">최신 소식을 이메일로</h2>
                            <p className="text-xl text-[#535861] mb-2">
                                주 1~2회, 꼭 필요한 소식만 전합니다.
                            </p>
                            <p className="text-sm text-[#717680]">
                                * 언제든 구독을 해지할 수 있습니다
                            </p>
                        </div>
                        <form className="max-w-md mx-auto space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#414651] mb-2">이메일 주소</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none"
                                />
                                <p className="text-xs text-[#717680] mt-1">올바른 이메일 형식을 입력해주세요</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="marketing-consent"
                                        name="marketing-consent"
                                        className="mt-1 w-4 h-4 text-[#8a765e] border-[#d5d6d9] rounded focus:ring-[#8a765e]"
                                    />
                                    <label htmlFor="marketing-consent" className="ml-2 text-sm text-[#535861]">
                                        마케팅 정보 수신에 동의합니다 (선택)
                                    </label>
                                </div>
                                <p className="text-xs text-[#717680] ml-6">
                                    법률 정보, 세미나 안내, 프로모션 정보를 받아보실 수 있습니다
                                </p>
                            </div>
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="privacy-consent"
                                    name="privacy-consent"
                                    required
                                    className="mt-1 w-4 h-4 text-[#8a765e] border-[#d5d6d9] rounded focus:ring-[#8a765e]"
                                />
                                <label htmlFor="privacy-consent" className="ml-2 text-sm text-[#535861]">
                                    <span className="text-[#8a765e]">개인정보 처리방침</span>에 동의합니다 (필수)
                                </label>
                            </div>
                            <p className="text-xs text-[#717680] ml-6">
                                이메일 주소는 뉴스레터 발송 목적으로만 사용되며, 3년간 보관 후 자동 삭제됩니다
                            </p>
                            <button type="submit" className="w-full px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors">
                                구독하기
                            </button>
                            <div className="text-center">
                                <button type="button" className="text-sm text-[#8a765e] hover:text-[#74634e] underline transition-colors">
                                    개인정보 처리방침 전문 보기
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 pt-8 border-t border-[#e9e9eb]">
                            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#717680]">
                                <div className="flex items-center">
                                    <i className="fas fa-users mr-2 text-[#8a765e]"></i>
                                    구독자 1,200+명
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-star mr-2 text-[#8a765e]"></i>
                                    평점 4.8/5.0
                                </div>
                                <div className="flex items-center">
                                    <i className="fas fa-clock mr-2 text-[#8a765e]"></i>
                                    주 1~2회 발송
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
