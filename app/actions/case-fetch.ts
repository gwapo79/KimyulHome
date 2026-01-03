
'use server';

import { prisma } from '@/lib/prisma';

export async function getCaseDetail(caseId: string) {
    try {
        const caseData = await prisma.case.findUnique({
            where: { id: caseId },
            include: {
                user: true, // Client Info
                lawyer: true, // Lawyer Info
                timelines: { orderBy: { date: 'desc' } },
                events: { orderBy: { date: 'asc' } },
                payments: { orderBy: { createdAt: 'desc' } },
                documents: { orderBy: { createdAt: 'desc' } },
                assignedProfessional: true,
                assignedStaff: true
            }
        });

        if (!caseData) {
            console.error("Case C1 not found in DB, returning FALLBACK data.");
            // FAILSAFE: Return Mock Data so the page ALWAYS opens for the demo
            return {
                id: 'c1',
                title: '가상화폐 투자 사기 및 손해배상 청구 (FALLBACK)',
                caseNumber: '2024가합12345',
                status: 'TRIAL_1',
                description: 'DB에서 유효한 데이터를 찾지 못해 표시되는 임시 데이터입니다. 투자리딩방 사기 피해금 회수 건.',
                clientName: '홍길동 (임시)',
                clientPhone: '010-0000-0000',
                lawyerName: '김지율',
                timeline: [],
                payments: [],
                documents: [],
                events: []
            };
        }

        // Transform to match the UI expectation if necessary
        // The UI currently expects:
        // clientName, clientPhone, lawyerName, description, etc.
        // We might need to map it in the component or here.
        // Let's return the raw Prisma object and handle mapping in the component for type safety?
        // Or map it here to match MOCK interface. Mapping here is safer for the transition.

        return {
            ...caseData,
            clientName: caseData.user?.name || 'Unknown',
            clientPhone: caseData.user?.phone || 'Unknown',
            lawyerName: caseData.lawyer?.name || 'Unassigned',
            // Ensure arrays exist
            timeline: caseData.timelines.map(t => ({
                id: t.id,
                date: t.date.toISOString().split('T')[0],
                status: t.status,
                step: t.status, // Map status to step name?
                description: t.description
            })),
            payments: caseData.payments.map(p => ({
                id: p.id,
                title: p.title,
                amount: p.amount,
                date: p.dueDate ? p.dueDate.toISOString().split('T')[0] : '-',
                status: p.status
            })),
            documents: caseData.documents.map(d => ({
                id: d.id,
                name: d.fileName,
                type: d.fileType,
                size: d.fileSize,
                uploadDate: d.createdAt.toISOString().split('T')[0],
                url: d.url
            })),
            events: caseData.events.map(e => ({
                id: e.id,
                date: e.date.toISOString().split('T')[0],
                title: e.title,
                type: e.type,
                location: e.location,
                memo: e.memo
            }))
        };
    } catch (error) {
        console.error("Fetch Case Error:", error);
        return null;
    }
}
