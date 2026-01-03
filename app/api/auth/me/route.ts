import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value || cookieStore.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ user: null });
        }

        // Fetch fresh user data including role
        const user = await prisma.user.findUnique({
            where: { id: (decoded.sub || decoded.id || decoded.userId) as string },
            select: { id: true, name: true, email: true, role: true }
        });
        console.log("[API/Auth/Me] Fetched User:", user?.email, "Role:", user?.role);

        return NextResponse.json({ user });

    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
