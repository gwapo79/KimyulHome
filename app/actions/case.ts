'use server';

import { prisma } from '@/lib/prisma';
import { Case } from '@prisma/client';

export interface AdminCaseListParams {
    status?: string | 'ALL';
    search?: string;
    page?: number;
}

export async function getAdminCases({ status = 'ALL', search = '', page = 1 }: AdminCaseListParams) {
    try {
        const where: any = {};

        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { caseNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        const cases = await prisma.case.findMany({
            where,
            include: {
                user: true, // For client name
                lawyer: true, // For assignee name
                assignedProfessional: true
            },
            orderBy: { updatedAt: 'desc' },
            take: 20,
            skip: (page - 1) * 20
        });

        // Map to UI friendly format
        const mappedCases = cases.map(c => ({
            id: c.id,
            caseNumber: c.caseNumber || '사건번호 없음',
            title: c.title,
            clientName: c.user?.name || '알 수 없음',
            lawyerName: c.assignedProfessional?.name || c.lawyer?.name || '미배정',
            status: c.status,
            statusLabel: c.status, // You might want to map this to Korean labels
            updatedAt: new Date(c.updatedAt).toLocaleDateString()
        }));

        return { success: true, data: mappedCases };

    } catch (error) {
        console.error('getAdminCases Error:', error);
        return { success: false, error: 'Database Error' };
    }
}
