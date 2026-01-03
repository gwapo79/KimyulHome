
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addCaseSchedule(caseId: string, data: {
    title: string;
    date: Date | string;
    type: string;
    location?: string;
    memo?: string;
}) {
    try {
        await prisma.caseEvent.create({
            data: {
                caseId,
                title: data.title,
                date: new Date(data.date),
                type: data.type,
                location: data.location || '',
                memo: data.memo || ''
            }
        });
        revalidatePath(`/admin/cases/${caseId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add schedule:", error);
        return { success: false, error: 'Database Error' };
    }
}

export async function createCasePayment(caseId: string, data: {
    title: string;
    amount: number;
    dueDate?: Date | string;
}) {
    try {
        await prisma.casePayment.create({
            data: {
                caseId,
                title: data.title,
                amount: data.amount,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                status: 'PENDING'
            }
        });
        revalidatePath(`/admin/cases/${caseId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to create payment:", error);
        return { success: false, error: 'Database Error' };
    }
}

export async function saveCaseDocument(caseId: string, data: {
    fileName: string;
    fileSize: string;
    fileType: string;
    url: string;
    category: string;
    isPrivate: boolean;
}) {
    try {
        // 1. Get Case Owner to associate document
        const caseRecord = await prisma.case.findUnique({
            where: { id: caseId },
            select: { userId: true }
        });

        if (!caseRecord) throw new Error("Case not found");

        // 2. Create Document Record
        await prisma.document.create({
            data: {
                caseId,
                userId: caseRecord.userId,
                fileName: data.fileName,
                fileSize: data.fileSize,
                fileType: data.fileType,
                url: data.url,
                category: data.category,
                isPrivate: data.isPrivate
            }
        });

        revalidatePath(`/admin/cases/${caseId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to save document:", error);
        return { success: false, error: 'Database Error' };
    }
}
