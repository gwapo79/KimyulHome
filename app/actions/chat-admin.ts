'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function assignChatRoom(id: string, assignedProfileId: string | null) {
    if (!id) return;

    await prisma.chatRoom.update({
        where: { id },
        data: {
            assignedProfessionalId: assignedProfileId || null
        }
    });

    revalidatePath('/admin/chat');
}

export async function sendAdminMessage(roomId: string, content: string, senderId: string) {
    if (!roomId || !content) return;

    await prisma.chatMessage.create({
        data: {
            roomId,
            senderId, // 'ADMIN' or specific user UUID if available. Schema expects String.
            content,
            isRead: false
        }
    });

    revalidatePath('/admin/chat');
}
