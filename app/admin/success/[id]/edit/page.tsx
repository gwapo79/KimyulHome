
import { prisma } from '@/lib/prisma';
import SuccessCaseEditForm from '@/app/components/admin/SuccessCaseEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    };
}

export default async function SuccessEditPage({ params }: Props) {
    const { id } = await params;
    const item = await prisma.successCase.findUnique({
        where: { id }
    });

    if (!item) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/admin/success/${id}`} className="text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">성공사례 수정</h1>
            </div>

            <SuccessCaseEditForm item={item} />
        </div>
    );
}
