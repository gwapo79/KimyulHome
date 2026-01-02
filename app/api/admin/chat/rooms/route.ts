import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const rooms = await (prisma as any).chatRoom.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                assignedProfessional: true
            }
        });

        const formatted = rooms.map((r: any) => ({
            id: r.id,
            userName: r.user?.name || 'Unknown',
            lastMessage: r.messages[0]?.content || 'No messages',
            lastMessageTime: r.messages[0]?.createdAt ? new Date(r.messages[0].createdAt).toLocaleTimeString() : '',
            unreadCount: 0, // Logic for unread count needed if implementing fully
            assigneeId: r.assignedProfessionalId,
            messages: [] // Detailed messages fetched separately or we load them all if small app
        }));

        return NextResponse.json(formatted);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
