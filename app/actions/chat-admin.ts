
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
            senderId,
            content,
            isRead: false // User hasn't read it yet
        }
    });

    // Update Room timestamp to move it to top
    await prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() }
    });

    revalidatePath('/admin/chat');
}

export async function markMessagesAsRead(roomId: string) {
    if (!roomId) return;

    await prisma.chatMessage.updateMany({
        where: {
            roomId,
            isRead: false,
            NOT: {
                senderId: 'ADMIN' // Only mark user messages as read
            }
        },
        data: {
            isRead: true
        }
    });

    revalidatePath('/admin/chat');
}
