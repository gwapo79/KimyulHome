
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Prisma
const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value || cookieStore.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const decoded = await verifyJWT(token);
        if (!decoded) {
            return NextResponse.json({ user: null });
        }

        // Fetch fresh user data including role
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true }
        });

        return NextResponse.json({ user });

    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
