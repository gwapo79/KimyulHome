'use client';

import { useState } from 'react';

type FAQItem = {
    question: string;
    answer: string;
};

export default function FAQList({ items }: { items: FAQItem[] }) {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl border border-[#e9e9eb]">
                    <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-neutral-50 transition-colors"
                    >
                        <span className="font-semibold text-[#181d27]">{item.question}</span>
                        <i className={`fas fa-chevron-down text-[#8a765e] transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}></i>
                    </button>
                    {openFaq === index && (
                        <div className="px-6 pb-6">
                            <p className="text-[#535861] leading-relaxed">{item.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
