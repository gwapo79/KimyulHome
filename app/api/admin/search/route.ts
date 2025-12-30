
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const query = url.searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        // Parallel Search: Users & Cases
        const [users, cases] = await Promise.all([
            prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                        { phone: { contains: query, mode: 'insensitive' } },
                        { kakaoId: { contains: query, mode: 'insensitive' } }
                    ],
                    role: 'USER'
                },
                take: 5,
                select: { id: true, name: true, email: true, phone: true }
            }),
            prisma.case.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { caseNumber: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    caseNumber: true,
                    userId: true,
                    user: { select: { name: true } }
                }
            })
        ]);

        const results = [
            ...users.map(u => ({
                type: 'USER',
                id: u.id,
                label: u.name || 'Unknown User',
                subLabel: u.email || u.phone || 'No Contact Info',
                link: `/admin/users/${u.id}`
            })),
            ...cases.map(c => ({
                type: 'CASE',
                id: c.userId, // Link to User Dashboard (since we don't have standalone Case Detail ready yet in this plan)
                // Note: If we had direct Case Detail page, link there. For CRM context, going to User Dash is safer.
                label: `[사건] ${c.title}`,
                subLabel: `${c.caseNumber || 'No No.'} - ${c.user.name}`,
                link: `/admin/users/${c.userId}`
            }))
        ];

        return NextResponse.json(results);

    } catch (error) {
        console.error('Search Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
