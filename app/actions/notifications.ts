"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotificationSettings(userId: string) {
    try {
        const settings = await prisma.notificationSetting.findUnique({
            where: { userId },
        });

        // Return default values if no record exists
        return settings || {
            caseUpdateEmail: true,
            caseUpdateSms: true,
            scheduleReminder: true,
            marketingAgree: false
        };
    } catch (error) {
        console.error("Failed to fetch notification settings:", error);
        return null;
    }
}

export async function updateNotificationSettings(userId: string, data: {
    caseUpdateEmail?: boolean;
    caseUpdateSms?: boolean;
    scheduleReminder?: boolean;
    marketingAgree?: boolean;
}) {
    try {
        await prisma.notificationSetting.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                caseUpdateEmail: data.caseUpdateEmail ?? true,
                caseUpdateSms: data.caseUpdateSms ?? true,
                scheduleReminder: data.scheduleReminder ?? true,
                marketingAgree: data.marketingAgree ?? false,
            }
        });

        revalidatePath('/dashboard/notifications');
        return { success: true };
    } catch (error) {
        console.error("Failed to update notification settings:", error);
        return { success: false, error: 'UPDATE_FAILED' };
    }
}
