'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function createBlogPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string || 'PUBLISHED';
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;
    const thumbnailUrl = formData.get('thumbnailUrl') as string;
    const assignedProfileId = formData.get('assignedProfileId') as string;

    const newPost = await prisma.blogPost.create({
        data: {
            title,
            content,
            category,
            status,
            author, // Keep for fallback
            excerpt,
            thumbnailUrl,
            assignedProfileId: assignedProfileId || null
        }
    });

    revalidatePath('/admin/blog');
    redirect(`/admin/blog/${newPost.id}`);
}

export async function updateBlogPost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const author = formData.get('author') as string;
    const excerpt = formData.get('excerpt') as string;
    const thumbnailUrl = formData.get('thumbnailUrl') as string;
    const assignedProfileId = formData.get('assignedProfileId') as string;

    await prisma.blogPost.update({
        where: { id },
        data: {
            title,
            content,
            category,
            status,
            author,
            excerpt,
            thumbnailUrl,
            assignedProfileId: assignedProfileId || null
        }
    });

    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${id}`);
    redirect(`/admin/blog/${id}`);
}

export async function deleteBlogPost(id: string) {
    await prisma.blogPost.delete({
        where: { id }
    });
    revalidatePath('/admin/blog');
    redirect('/admin/blog');
}
