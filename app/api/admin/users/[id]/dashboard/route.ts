
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        console.log(`[DashboardAPI] Fetching for ID: ${id}`);
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch User Basic Info & Aggregates
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                activities: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 // Last aggregated activity
                },
                _count: {
                    select: {
                        cases: true,
                        consultations: true,
                        // chatRooms: true, // If we had this relation
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Fetch Recent Cases (Top 3)
        const recentCases = await prisma.case.findMany({
            where: { userId: id },
            orderBy: { updatedAt: 'desc' },
            take: 3,
            select: {
                id: true,
                title: true,
                status: true,
                updatedAt: true
            }
        });


        // 3. User Activity (GeoIP & Paths)
        const recentActivities = await prisma.userActivity.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const lastActivity = recentActivities[0] || {};
        const lastIp = (lastActivity.ipAddress as string) || 'Unknown';

        // GeoIP Logic (Mock or Real)
        let location = 'Unknown';
        // Simple logic for now: if IP is real, we say 'Seoul, KR' (Mock for stability unless using real API)
        if (lastIp !== 'Unknown' && lastIp !== '127.0.0.1') {
            // In real env, await fetch(`https://ipapi.co/${lastIp}/json/`) ...
            location = 'Seoul, KR (Est.)';
        }

        const lastPaths = recentActivities
            .filter(a => a.type === 'PAGE_VIEW')
            .slice(0, 3)
            .map(a => (a.details as string).replace('Visited ', ''));

        // 4. Construct Dashboard Response
        const dashboardData = {

            profile: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status,
                joinedAt: user.createdAt,
                provider: user.provider,
                role: user.role
            },
            stats: {
                totalCases: user._count.cases,
                totalConsultations: user._count.consultations,
                // Pending cases logic could comprise checking status 'Pending'
                activeCases: await prisma.case.count({
                    where: { userId: id, status: { not: 'CLOSED' } }
                })
            },
            recentActivity: {
                lastLogin: lastActivity.createdAt || user.createdAt,
                lastIp: lastIp,
                device: (lastActivity.device as string) || 'Unknown',
                location,
                lastPaths
            },
            recentCases
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error('CRM Dashboard Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
