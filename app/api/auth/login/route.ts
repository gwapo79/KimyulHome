
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, provider, kakaoId, name, phone } = body;

        // --- Kakao Login Flow ---
        if (provider === 'kakao') {
            if (!kakaoId) {
                return NextResponse.json({ error: 'Kakao ID is required' }, { status: 400 });
            }

            // Find or Create User for Kakao
            // Actually, usually signup handles creation, login handles auth.
            // But "Login with Kakao" often implies automatic signup.
            // Let's check if user exists.
            let user = await prisma.user.findUnique({ where: { kakaoId } });

            if (!user) {
                // Return 404/Register needed OR auto-register if we have enough info.
                // Assuming we want auto-register if name/email are provided, or return specific code.
                // For this request "Kakao로 시작하기", let's Auto-Signup if possible or error.
                if (name) { // If name provided, try create
                    user = await prisma.user.create({
                        data: {
                            kakaoId,
                            provider: 'kakao',
                            name: name || `Kakao User`,
                            email: email || `kakao_${kakaoId}@example.com`, // Fallback
                            status: 'ACTIVE'
                        }
                    });
                } else {
                    return NextResponse.json({ error: 'User not found, please sign up', code: 'USER_NOT_FOUND' }, { status: 404 });
                }
            }

            if (user.status === 'BLOCKED') {
                return NextResponse.json({ error: 'Blocked account' }, { status: 403 });
            }

            const token = await signToken({
                userId: user.id,
                email: user.email,
                name: user.name || 'User',
                role: (user as any).role || 'USER'
            });
            await setAuthCookie(token);

            const { password: _, ...userWithoutPassword } = user;
            return NextResponse.json({ message: 'Login successful', user: userWithoutPassword });
        }

        // --- Email Login Flow ---
        if (!email || !password) {
            return NextResponse.json(
                { error: '이메일과 비밀번호를 입력해주세요.' },
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

        // Check Status
        if ((user as any).status === 'BLOCKED') { // Type cast for safety if type gen failed
            return NextResponse.json({ error: 'This account has been blocked.' }, { status: 403 });
        }

        // Generate JWT
        const token = await signToken({
            sub: user.id,
            id: user.id,
            userId: user.id,
            email: user.email,
            name: user.name || 'User',
            role: (user as any).role || 'USER'
        });

        // Set Cookie
        await setAuthCookie(token);

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
