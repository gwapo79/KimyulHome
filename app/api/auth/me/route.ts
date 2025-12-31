
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Prisma
const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const mockEmail = cookieStore.get('MOCK_USER_EMAIL')?.value;

        // Default to admin if no cookie (for initial access), or use the cookie value
        const targetEmail = mockEmail || 'admin@law-firm.com';

        const user = await prisma.user.findFirst({
            where: { email: targetEmail }
        });

        if (user) {
            return NextResponse.json({
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            });
        }

        return NextResponse.json({ role: 'USER' }, { status: 401 });

    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
