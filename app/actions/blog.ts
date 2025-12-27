'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateBlogPost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;
    const thumbnailUrl = formData.get('thumbnailUrl') as string;

    await prisma.blogPost.update({
        where: { id },
        data: {
            title,
            content,
            category,
            status,
            author,
            excerpt,
            thumbnailUrl
        }
    });

    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${id}`);
    redirect(`/admin/blog/${id}`);
}
