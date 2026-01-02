'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function assignConsultation(id: string, assignedProfileId: string | null) {
    if (!id) return;

    await prisma.consultation.update({
        where: { id },
        data: {
            assignedProfileId: assignedProfileId || null
        }
    });

    revalidatePath('/admin/consultations');
}

export async function updateConsultationStatus(id: string, status: string) {
    await prisma.consultation.update({
        where: { id },
        data: { status }
    });

    revalidatePath('/admin/consultations');
}
