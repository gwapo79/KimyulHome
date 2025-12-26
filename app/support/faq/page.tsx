import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import FAQList from '@/app/components/support/FAQList';

export const revalidate = 0; // Ensure dynamic fetching if we add features later

export const metadata: Metadata = {
    title: '자주 묻는 질문 | 서초지율',
    description: '법률 상담, 비용, 절차 등 고객님들이 자주 궁금해하시는 질문과 답변을 확인하세요.',
};

export default async function FAQPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { category: 'asc' }
    });

    return (
        <main>
            <section id="hero" className="bg-[#6F614D] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#F5F1E8] mb-4">자주 묻는 질문 (FAQ)</h1>
                    <p className="text-xl text-[#DCD6C9] max-w-2xl mx-auto">
                        무엇을 도와드릴까요? 자주 묻는 질문을 통해 빠르고 정확한 답변을 확인하세요.
                    </p>
                </div>
            </section>

            <section className="bg-white">
                <FAQList initialFaqs={faqs} />
            </section>
        </main>
    );
}
