import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const consultations = await (prisma as any).consultation.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                assignedProfile: true // fetch assignee details
            }
        });

        // Map to simpler format if needed by frontend, or just return raw
        // Frontend expects: id, name, phone, category, content, status, appliedAt(formatted), assigneeId
        const formatted = consultations.map((c: any) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            category: c.category,
            content: c.content,
            status: c.status,
            appliedAt: new Date(c.createdAt).toLocaleDateString(),
            assigneeId: c.assignedProfileId
        }));

        return NextResponse.json(formatted);
    } catch (e) {
        console.error("Consultation API CRASH:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
