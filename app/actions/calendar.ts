
"use server";


import { prisma } from '@/lib/prisma';

export async function getEvents(userId: string) {
    try {
        const events = await prisma.calendarEvent.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                description: true,
                startTime: true,
                endTime: true,
                color: true,
                category: true,
            }
        });

        // Transform for FullCalendar
        // FullCalendar expects: { id, title, start, end, backgroundColor, extendedProps }
        return events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.startTime.toISOString(),
            end: event.endTime.toISOString(),
            backgroundColor: event.color,
            borderColor: event.color,
            extendedProps: {
                description: event.description,
                category: event.category
            }
        }));
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}
