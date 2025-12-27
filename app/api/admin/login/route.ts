
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // MOCK API: No DB check, always success for development

        const mockUser = {
            id: 'mock-admin-id',
            email: 'admin@system.local',
            name: 'System Administrator',
            role: 'SUPER_ADMIN'
        };

        const mockToken = 'mock_admin_token_bypass';

        const response = NextResponse.json({
            message: 'Admin Access Granted (Mock Mode)',
            user: mockUser,
        });

        // Set 'admin_token' cookie
        response.cookies.set('admin_token', mockToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Also set 'auth_token' for compatibility with shared components if needed
        response.cookies.set('auth_token', mockToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
