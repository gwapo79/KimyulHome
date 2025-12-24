
"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getChatRooms(userId: string) {
    try {
        const rooms = await prisma.chatRoom.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return rooms;
    } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
        return [];
    }
}

export async function getMessages(roomId: string) {
    try {
        const messages = await prisma.chatMessage.findMany({
            where: { roomId },
            orderBy: { createdAt: 'asc' }
        });
        return messages;
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return [];
    }
}

export async function sendMessage(roomId: string, content: string, senderId: string) {
    try {
        const message = await prisma.chatMessage.create({
            data: {
                roomId,
                content,
                senderId
            }
        });

        await prisma.chatRoom.update({
            where: { id: roomId },
            data: { updatedAt: new Date() }
        });

        revalidatePath('/dashboard/chat');
        return message;
    } catch (error) {
        console.error("Failed to send message:", error);
        return null; // Or throw error
    }
}
