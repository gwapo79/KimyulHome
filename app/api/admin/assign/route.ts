
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { type, id, assigneeId } = await request.json();

        if (!id || !assigneeId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (type === 'CASE') {
            await prisma.case.update({
                where: { id },
                data: { lawyerId: assigneeId }
            });
        } else if (type === 'CONSULTATION') {
            await prisma.consultation.update({
                where: { id },
                data: {
                    assigneeId: assigneeId,
                    status: '담당자지정'
                }
            });
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Assignment API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
