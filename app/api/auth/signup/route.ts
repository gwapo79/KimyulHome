
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, phone, provider, kakaoId } = body;

        if (!email && !kakaoId) {
            return NextResponse.json(
                { error: 'Email or Kakao ID required' },
                { status: 400 }
            );
        }

        // Check if user exists
        let existingUser;
        if (provider === 'kakao' && kakaoId) {
            existingUser = await prisma.user.findUnique({ where: { kakaoId } });
        } else {
            existingUser = await prisma.user.findUnique({ where: { email } });
        }

        if (existingUser) {
            // For Kakao, if user exists, just return success (login)
            if (provider === 'kakao') {
                return NextResponse.json({ message: 'User logged in successfully', user: existingUser });
            }
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password if local
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email || `kakao_${kakaoId}@example.com`, // Fallback for kakao if no email
                password: hashedPassword,
                name,
                phone,
                provider: provider || 'local',
                kakaoId,
            },
        });

        return NextResponse.json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
