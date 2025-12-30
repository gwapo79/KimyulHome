import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// GET: List all users
export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let users;
        try {
            // Attempt 1: Fetch with 'status' field
            users = await prisma.user.findMany({
                where: { role: 'USER' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    provider: true,
                    status: true,
                    createdAt: true,
                }
            });
        } catch (dbError) {
            console.warn("⚠️ Primary Users Query Failed. Attempting Safe Mode (No Status)...", dbError);

            // Attempt 2: Fallback without 'status' field (Safe Mode)
            const unsafeUsers = await prisma.user.findMany({
                where: { role: 'USER' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    provider: true,
                    // status excluded
                    createdAt: true,
                }
            });

            // Polyfill status
            users = unsafeUsers.map(u => ({ ...u, status: 'UNKNOWN' }));
        }

        const formatted = users.map(u => ({
            ...u,
            joinedAt: u.createdAt.toISOString().split('T')[0], // YYYY-MM-DD
            joinPath: u.provider.toUpperCase() // e.g. KAKAO, LOCAL
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error('Users GET Critical Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: (error as Error).message
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// PATCH: Update user status or info
export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status, name, phone } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                status, // 'ACTIVE', 'BLOCKED', 'WITHDRAWN'
                name,
                phone
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Users PATCH Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE: Hard delete user
export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Users DELETE Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
