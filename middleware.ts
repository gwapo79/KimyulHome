import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. 관리자 로그인 페이지 접근 시: 무조건 통과 (검사 안 함)
    if (pathname.startsWith('/admin/login')) {
        return NextResponse.next();
    }

    // 2. 그 외 /admin 하위 경로 접근 시: 인증 체크
    if (pathname.startsWith('/admin')) {
        // 쿠키에서 토큰 확인 (Mock 토큰 or 실제 토큰)
        const token = request.cookies.get('admin_token') || request.cookies.get('auth_token');

        // 토큰이 없으면 -> 일반 로그인이 아니라 '관리자 로그인'으로 보냄
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 3. 나머지 모든 페이지는 통과
    return NextResponse.next();
}

export const config = {
    // 미들웨어가 동작할 경로 범위 설정
    matcher: ['/admin/:path*'],
};
