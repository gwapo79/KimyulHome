
'use client';

import { useState } from 'react';
import { prisma } from '@/lib/prisma';

// Define the FAQ type
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Client Component part
function FAQList({ initialFaqs }: { initialFaqs: FAQItem[] }) {
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = ['전체', '부동산', '채무/금융', '개인회생', '비용/절차'];

  const filteredFaqs = initialFaqs.filter((faq) => {
    const matchesCategory = activeTab === '전체' || faq.category === activeTab;
    const matchesSearch = faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#333] mb-4">자주 묻는 질문</h1>
        <p className="text-gray-600">고객님들이 자주 궁금해하시는 질문들을 정리했습니다.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <input
          type="text"
          placeholder="궁금한 내용을 검색해보세요 (예: 비용, 기간)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8a765e] text-lg shadow-sm"
        />
        <i className="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveTab(cat); setOpenId(null); }}
            className={`px-6 py-2.5 rounded-full text-base font-medium transition-colors duration-200 
              ${activeTab === cat 
                ? 'bg-[#8a765e] text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List (Accordion) */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none bg-white"
              >
                <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8a765e] text-white flex items-center justify-center font-bold text-sm">Q</span>
                    <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}></i>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="bg-gray-50 px-6 py-6 border-t border-gray-100 flex gap-4">
                     <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm">A</span>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
       <div className="mt-12 text-center text-gray-500 text-sm">
        찾으시는 질문이 없나요? <a href="/company/consultation" className="text-[#8a765e] font-semibold underline underline-offset-4 hover:text-[#6f5e4b]">무료 상담 신청하기</a>
      </div>
    </div>
  );
}

// Server Component Wrapper (default export)
import { PrismaClient } from '@prisma/client';

// We need to instantiate PrismaClient here or import it. import { prisma } ... is standard but 
// for server components we usually fetch data in the async component.
// Note: "use client" sits at the top, so we cannot do direct DB calls in the same file if we export it as default directly.
// We must split this. 
// Actually, in Next.js App Router, we can pass data from Server Component to Client Component.

// Let's create two files ideally, but to keep it simple with one file we can put the client component below or separate.
// Given the prompt asks to create `app/support/faq/page.tsx`, I will make the page a server component that fetches data, 
// and imports a client component.
// But wait, I can't write two files in one `write_to_file`.
// The user prompt asked to create `app/support/faq/page.tsx`.
// I will create `app/components/faq/FAQClient.tsx` first, then the page.
