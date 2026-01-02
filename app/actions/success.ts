'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateSuccessCase(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const result = formData.get('result') as string;
    const lawyer = formData.get('lawyer') as string;
    const summary = formData.get('summary') as string;
    const strategy = formData.get('strategy') as string;
    const outcomes = formData.get('outcomes') as string;

    // Additional Existing Fields
    const client = formData.get('client') as string;
    const amount = formData.get('amount') as string;
    const period = formData.get('period') as string;
    const caseType = formData.get('caseType') as string;
    const detailImageUrl = formData.get('detailImageUrl') as string;

    // New Fields
    const subTitle = formData.get('subTitle') as string;
    const content = formData.get('content') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const kpiInfoString = formData.get('kpiJSON') as string; // Receive as JSON string

    let kpiInfo = [];
    try {
        if (kpiInfoString) kpiInfo = JSON.parse(kpiInfoString);
    } catch (e) {
        console.error('Failed to parse KPI JSON', e);
    }

    await prisma.successCase.update({
        where: { id },
        data: {
            title,
            category,
            result,
            lawyer,
            summary,
            strategy,
            outcomes,
            client,
            amount,
            period,
            caseType,
            detailImageUrl,
            subTitle,
            content,
            seoTitle,
            seoDescription,
            kpiInfo
        }
    });

    revalidatePath('/admin/success');
    revalidatePath(`/admin/success/${id}`);
    redirect(`/admin/success/${id}`);
}

export async function createSuccessCase(formData: FormData) {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const result = formData.get('result') as string;
    const lawyer = formData.get('lawyer') as string;
    const summary = formData.get('summary') as string;
    const strategy = formData.get('strategy') as string;
    const outcomes = formData.get('outcomes') as string;

    // Additional Existing Fields
    const client = formData.get('client') as string;
    const amount = formData.get('amount') as string;
    const period = formData.get('period') as string;
    const caseType = formData.get('caseType') as string;
    const detailImageUrl = formData.get('detailImageUrl') as string;
    const thumbnailUrl = formData.get('thumbnailUrl') as string;

    // New Fields
    const subTitle = formData.get('subTitle') as string;
    const content = formData.get('content') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const kpiInfoString = formData.get('kpiJSON') as string;
    const assignedProfileId = formData.get('assignedProfileId') as string;

    let kpiInfo = [];
    try {
        if (kpiInfoString) kpiInfo = JSON.parse(kpiInfoString);
    } catch (e) {
        console.error('Failed to parse KPI JSON', e);
    }

    const newCase = await prisma.successCase.create({
        data: {
            title,
            category,
            result,
            lawyer,
            summary,
            strategy,
            outcomes,
            client,
            amount,
            period,
            caseType,
            detailImageUrl,
            thumbnailUrl,
            subTitle,
            content,
            seoTitle,
            seoDescription,
            kpiInfo,
            assignedProfileId: assignedProfileId || null
        }
    });

    revalidatePath('/admin/success');
    redirect(`/admin/success/${newCase.id}`);
}

export async function deleteSuccessCase(id: string) {
    await prisma.successCase.delete({
        where: { id }
    });
    revalidatePath('/admin/success');
    redirect('/admin/success');
}
