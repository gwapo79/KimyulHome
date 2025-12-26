
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return NextResponse.json(
                {
                    error: '아이디 또는 비밀번호가 일치하지 않습니다.',
                },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                {
                    error: '아이디 또는 비밀번호가 일치하지 않습니다.',
                },
                { status: 401 }
            );
        }

        // In a real app, you'd set a session cookie here.
        // For this task, we return success so frontend can redirect.
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
