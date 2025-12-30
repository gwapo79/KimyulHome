import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth-utils';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. 관리자 로그인 페이지 접근 시: 이미 로그인되어 있다면 대시보드로 리다이렉트
    if (pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value;
        if (token) {
            const payload = await verifyJWT(token);
            if (payload) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }
        return NextResponse.next();
    }

    // 2. 그 외 /admin 하위 경로 접근 시: 인증 체크
    if (pathname.startsWith('/admin')) {
        // 쿠키에서 토큰 확인
        const token = request.cookies.get('admin_token')?.value;

        // 토큰이 없으면 리다이렉트
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // 토큰 유효성 검증 (Real JWT Verify)
        const payload = await verifyJWT(token);
        if (!payload) {
            // 유효하지 않은 토큰(만료, 위조)일 경우 리다이렉트 및 쿠키 삭제
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }

        // (선택) 권한 체크 로직 추가 가능
        // if (payload.role !== 'SUPER_ADMIN' ...)
    }

    // 3. 나머지 모든 페이지는 통과
    return NextResponse.next();
}

export const config = {
    // 미들웨어가 동작할 경로 범위 설정
    matcher: ['/admin/:path*'],
};
