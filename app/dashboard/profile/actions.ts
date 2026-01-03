'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
        const payload = await verifyToken(token);
        // Supports sub, id, or userId claim
        return ((payload?.sub || payload?.id || payload?.userId) as string) || null;
    } catch (e) {
        return null;
    }
}

export async function getUserProfile() {
    const userId = await getUserId();
    if (!userId) return null;

    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatarUrl: true,
        }
    });
}

interface UpdateProfileState {
    success: boolean;
    message: string;
}

export async function updateUserProfile(prevState: any, formData: FormData): Promise<UpdateProfileState> {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const addressDetail = formData.get('addressDetail') as string;
    const email = formData.get('email') as string; // Typically email update requires verification, treating as contact update or ignored if disallowed

    // Combine address if needed or store simply
    const fullAddress = address ? `${address} ${addressDetail || ''}`.trim() : null;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone,
                address: fullAddress,
                // email: email // Email updates usually restricted
            }
        });

        revalidatePath('/dashboard/profile');
        return { success: true, message: '프로필이 성공적으로 업데이트되었습니다.' };
    } catch (error) {
        console.error('Profile update error:', error);
        return { success: false, message: '프로필 업데이트 중 오류가 발생했습니다.' };
    }
}

export async function updateAvatar(url: string | null) {
    const userId = await getUserId();
    if (!userId) throw new Error("User not found");

    await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: url }
    });
    revalidatePath('/dashboard/profile');
}
