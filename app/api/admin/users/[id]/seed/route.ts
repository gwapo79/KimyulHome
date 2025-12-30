
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create 5 dummy consultations
        const consultations = Array.from({ length: 5 }).map((_, i) => ({
            userId: id,
            title: `테스트 상담 신청 ${i + 1}`,
            content: `이것은 테스트를 위해 생성된 상담 신청 내역입니다. #${i + 1}`,
            status: 'PENDING',
            createdAt: new Date(Date.now() - i * 86400000) // 1 day apart
        }));

        await prisma.consultation.createMany({
            data: consultations as any // Type casting if needed depending on exact schema match
        });

        // Create 1 dummy case
        await prisma.case.create({
            data: {
                userId: id,
                title: '테스트 민사 소송 건',
                status: 'OPEN',
                description: '테스트 데이터 생성을 통해 만들어진 민사 소송 건입니다.',
                statusColor: 'blue', // Required field
                createdAt: new Date()
            }
        });

        // Create 1 dummy activity
        await prisma.userActivity.create({
            data: {
                userId: id,
                type: 'TEST_ACTION',
                details: '관리자가 테스트 데이터를 생성했습니다.',
                ipAddress: '127.0.0.1',
                device: 'Admin Tool'
            }
        });

        return NextResponse.json({ success: true, message: 'Test data generated' });

    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
