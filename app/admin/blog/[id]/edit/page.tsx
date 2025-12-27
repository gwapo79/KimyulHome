
import { prisma } from '@/lib/prisma';
import BlogEditForm from '@/app/components/admin/BlogEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    };
}

export default async function BlogEditPage({ params }: Props) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { id }
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/admin/blog/${id}`} className="text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">블로그 글 수정</h1>
            </div>

            <BlogEditForm post={post} />
        </div>
    );
}
