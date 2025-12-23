
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    try {
        const email = 'test';
        const password = '1234';

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ message: 'Test user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Test User',
                phone: '010-0000-0000',
                provider: 'local',
            },
        });

        return NextResponse.json({ message: 'Test user created successfully', user });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
