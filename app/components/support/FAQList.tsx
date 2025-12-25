'use client';

import { useState, useMemo } from 'react';
import { FAQ_DATA } from '@/app/data/faqs';

export default function FAQList() {
    const [activeTab, setActiveTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);

    const categories = ['전체', '부동산', '채무/금융', '개인회생', '비용/절차'];

    // Memoize filtering for performance with large dataset
    const filteredFaqs = useMemo(() => {
        return FAQ_DATA.filter((faq) => {
            const matchesCategory = activeTab === '전체' || faq.category === activeTab;
            const matchesSearch =
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    const toggleAccordion = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Search Bar */}
            <div className="relative mb-10 max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="궁금한 내용을 검색해보세요 (예: 비용, 기간, 절차, 사기)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-6 pr-12 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-lg shadow-sm transition-shadow hover:shadow-md"
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#8a765e]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setActiveTab(cat); setOpenId(null); }}
                        className={`px-6 py-2.5 rounded-full text-base font-bold transition-all duration-300 border
              ${activeTab === cat
                                ? 'bg-[#8a765e] text-white shadow-lg border-[#8a765e] scale-105 ring-2 ring-[#8a765e] ring-offset-2'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ List (Accordion) */}
            <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:border-[#8a765e]/50 hover:shadow-sm">
                            <button
                                onClick={() => toggleAccordion(faq.id)}
                                className={`w-full text-left px-6 py-5 flex justify-between items-start focus:outline-none bg-white transition-colors duration-200 ${openId === faq.id ? 'bg-[#fdfcfb]' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8a765e] text-white flex items-center justify-center font-bold text-sm shadow-sm mt-0.5">Q</span>
                                    <span className={`text-lg font-bold text-gray-800 leading-snug ${openId === faq.id ? 'text-[#8a765e]' : ''}`}>
                                        {faq.question}
                                    </span>
                                </div>
                                <div className={`ml-4 flex-shrink-0 mt-1.5 transition-transform duration-300 text-gray-400 ${openId === faq.id ? 'rotate-180 text-[#8a765e]' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === faq.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="bg-[#fbfcfa] px-6 py-8 border-t border-gray-100 flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-sm shadow-sm mt-0.5">A</span>
                                    <div className="text-gray-700 leading-8 whitespace-pre-wrap text-[1.05rem]">
                                        {faq.answer.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2 last:mb-0">
                                                {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                                                    part.startsWith('**') && part.endsWith('**') ?
                                                        <strong key={j} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong> :
                                                        part
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">검색 결과가 없습니다.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveTab('전체'); }}
                            className="mt-4 text-[#8a765e] hover:underline font-medium text-sm"
                        >
                            전체 질문 보기
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-16 text-center bg-[#F9FAFB] py-8 rounded-xl border border-gray-100">
                <p className="text-gray-600 mb-3">찾으시는 질문이 없나요?</p>
                <a href="/company/consultation" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#8a765e] hover:bg-[#7a6652] transition-colors md:py-3 md:text-lg md:px-8 shadow-sm">
                    무료 상담 신청하기
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
