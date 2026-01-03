'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Review } from '@prisma/client';

export async function getReviews() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                counselor: true // To show counselor info if needed
            }
        });
        return { success: true, data: reviews };
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return { success: false, error: 'Failed to fetch reviews' };
    }
}

export async function toggleReviewBest(id: string, currentStatus: boolean) {
    try {
        await prisma.review.update({
            where: { id },
            data: { isBest: !currentStatus }
        });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle review best status:', error);
        return { success: false, error: 'Failed to update review' };
    }
}

export async function toggleReviewVisibility(id: string, currentStatus: boolean) {
    try {
        await prisma.review.update({
            where: { id },
            data: { isVisible: !currentStatus }
        });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle review visibility:', error);
        return { success: false, error: 'Failed to update review' };
    }
}

export async function createReview(data: Partial<Review>) {
    try {
        await prisma.review.create({
            data: {
                author: data.author || '익명',
                rating: data.rating || 5,
                content: data.content || '',
                category: data.category || '기타',
                authorImageUrl: data.authorImageUrl,
                isVisible: true,
                isBest: false,
                role: data.role,
                date: data.date || new Date().toISOString().split('T')[0],
            }
        });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        console.error('Failed to create review:', error);
        return { success: false, error: 'Failed to create review' };
    }
}
