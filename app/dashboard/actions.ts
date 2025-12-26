'use server';

import { prisma } from '@/lib/prisma';

// Use a fixed test user ID if no auth session is present, or for testing.
// In a real app, you'd get this from the session.
const TEST_USER_EMAIL = 'test@lawfirm.com';

async function getUserId() {
    // TODO: Replace with actual session logic
    try {
        const user = await prisma.user.findUnique({
            where: { email: TEST_USER_EMAIL },
        });
        return user?.id;
    } catch (error) {
        console.error("Failed to getUserId:", error);
        return null;
    }
}

export async function getDashboardData() {
    const userId = await getUserId();
    if (!userId) return null;

    try {
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

        return { activeCasesCount, upcomingEventsCount, userName: user?.name || '고객' };
    } catch (error) {
        console.error("Failed to getDashboardData:", error);
        return null;
    }
}

export async function getMyCases() {
    const userId = await getUserId();
    if (!userId) return [];

    try {
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
    } catch (error) {
        console.error("Failed to getMyCases:", error);
        return [];
    }
}

export async function getUpcomingSchedule() {
    const userId = await getUserId();
    if (!userId) return [];

    try {
        const today = new Date();
        return await prisma.calendarEvent.findMany({
            where: {
                userId,
                startTime: { gte: today },
            },
            orderBy: { startTime: 'asc' },
            take: 3,
        });
    } catch (error) {
        console.error("Failed to getUpcomingSchedule:", error);
        return [];
    }
}

export async function getRecentDocuments() {
    const userId = await getUserId();
    if (!userId) return [];

    try {
        return await prisma.document.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 4,
        });
    } catch (error) {
        console.error("Failed to getRecentDocuments:", error);
        return [];
    }
}

export async function getRecentChat() {
    const userId = await getUserId();
    if (!userId) return null;

    try {
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
    } catch (error) {
        console.error("Failed to getRecentChat:", error);
        return null;
    }
}

export async function getNotifications() {
    const userId = await getUserId();
    if (!userId) return { unreadCount: 0, list: [] };

    try {
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
    } catch (error) {
        console.error("Failed to getNotifications:", error);
        return { unreadCount: 0, list: [] };
    }
}
