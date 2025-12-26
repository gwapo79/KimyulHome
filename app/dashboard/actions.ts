'use server';

import { prisma } from '@/lib/prisma';

// Use a fixed test user ID if no auth session is present, or for testing.
// In a real app, you'd get this from the session.
const TEST_USER_EMAIL = 'test@lawfirm.com';

async function getUserId() {
    // TODO: Replace with actual session logic
    const user = await prisma.user.findUnique({
        where: { email: TEST_USER_EMAIL },
    });
    return user?.id;
}

export async function getDashboardData() {
    const userId = await getUserId();
    if (!userId) return null;

    const [activeCasesCount, upcomingEventsCount] = await Promise.all([
        prisma.case.count({
            where: { userId, status: { not: '종결' } },
        }),
        prisma.calendarEvent.count({
            where: {
                userId,
                startTime: { gte: new Date() },
            },
        }),
    ]);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true }
    });

    return { activeCasesCount, upcomingEventsCount, userName: user?.name || '고객' }; // Name should ideally come from user record
}

export async function getMyCases() {
    const userId = await getUserId();
    if (!userId) return [];

    return await prisma.case.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
            id: true,
            title: true,
            status: true,
            statusColor: true,
            description: true,
        }
    });
}

export async function getUpcomingSchedule() {
    const userId = await getUserId();
    if (!userId) return [];

    const today = new Date();
    return await prisma.calendarEvent.findMany({
        where: {
            userId,
            startTime: { gte: today },
        },
        orderBy: { startTime: 'asc' },
        take: 3,
    });
}

export async function getRecentDocuments() {
    const userId = await getUserId();
    if (!userId) return [];

    return await prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 4,
    });
}

export async function getRecentChat() {
    const userId = await getUserId();
    if (!userId) return null;

    // Get the most recent active chat room
    const room = await prisma.chatRoom.findFirst({
        where: { userId, status: 'active' },
        orderBy: { updatedAt: 'desc' },
        include: {
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    return room;
}

export async function getNotifications() {
    const userId = await getUserId();
    if (!userId) return { unreadCount: 0, list: [] };

    const [unreadCount, list] = await Promise.all([
        prisma.notification.count({
            where: { userId, isRead: false },
        }),
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 4,
        }),
    ]);

    return { unreadCount, list };
}
