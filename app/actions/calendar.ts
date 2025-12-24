
"use server";

import { prisma } from "@/lib/prisma"; // Assuming prisma client is exported from here or similar. If not, initializing new client.
import { PrismaClient } from "@prisma/client";

// Ensure we have a PrismaClient instance if not imported
const db = new PrismaClient();

export async function getEvents(userId: string) {
    try {
        const events = await db.calendarEvent.findMany({
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
