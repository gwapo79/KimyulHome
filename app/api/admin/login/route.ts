import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth-utils';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 1. Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // 2. Find User
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 3. Verify Password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 4. Verify Role
        const allowedRoles = ['SUPER_ADMIN', 'LAWYER', 'STAFF'];
        if (!allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { error: 'Unauthorized access level' },
                { status: 403 }
            );
        }

        // 5. Generate Real JWT
        const token = await signJWT({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        }, '24h');

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
        });

        // 6. Set Secure Cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Clean up legacy/compat mock token if exists
        response.cookies.delete('auth_token');

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
