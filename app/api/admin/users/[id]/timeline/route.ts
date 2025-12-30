
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Helper to standardise timeline items
type TimelineItem = {
    id: string;
    type: 'CASE' | 'CHAT' | 'CONSULTATION' | 'ACTIVITY';
    title: string;
    description: string;
    createdAt: Date;
    metadata?: any;
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // 1. Fetch from Multiple Sources (Simple "Fetch All" strategy for now, then sort & slice in memory)
        // Optimization: For production with huge data, we would need a Union View or separate paginated queries.
        // Given current scale, fetching last 50 of each and merging is sufficient.

        // A. Cases (Status Updates or Creation)
        const cases = await prisma.case.findMany({
            where: { userId: id },
            take: 50,
            orderBy: { createdAt: 'desc' }
        });

        // B. Consultations (Linked)
        const consultations = await prisma.consultation.findMany({
            where: { userId: id },
            take: 50,
            orderBy: { createdAt: 'desc' }
        });

        // C. Activities
        const activities = await prisma.userActivity.findMany({
            where: { userId: id },
            take: 50,
            orderBy: { createdAt: 'desc' }
        });

        // D. Chats (Optional - requires finding ChatRooms first)
        // For simplicity, we just fetch ChatRooms updates for now
        // const chatRooms = await prisma.chatRoom.findMany...


        // 2. Transform to Timeline Items
        const timelineItems: TimelineItem[] = [];

        cases.forEach(c => {
            timelineItems.push({
                id: c.id,
                type: 'CASE',
                title: `[사건] ${c.title}`,
                description: `Status: ${c.status}`,
                createdAt: c.createdAt,
                metadata: { status: c.status }
            });
        });

        consultations.forEach(c => {
            timelineItems.push({
                id: c.id,
                type: 'CONSULTATION',
                title: `[상담신청] ${c.category}`,
                description: c.content.substring(0, 100) + '...',
                createdAt: c.createdAt,
                metadata: { status: c.status }
            });
        });

        activities.forEach(a => {
            timelineItems.push({
                id: a.id,
                type: 'ACTIVITY',
                title: `[활동] ${a.type}`,
                description: a.details || a.path || '',
                createdAt: a.createdAt,
                metadata: { ip: a.ipAddress, device: a.device }
            });
        });

        // 3. Sort & Paginate
        timelineItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const paginatedItems = timelineItems.slice(skip, skip + limit);

        return NextResponse.json({
            data: paginatedItems,
            meta: {
                total: timelineItems.length,
                page,
                hasMore: skip + limit < timelineItems.length
            }
        });

    } catch (error) {
        console.error('CRM Timeline Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
