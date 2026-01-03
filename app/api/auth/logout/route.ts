import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    // Clear all potential auth-related cookies
    // 1. Main Auth Token (User)
    cookieStore.delete('auth_token');

    // 2. Admin Token (if separate) or legacy leftovers
    cookieStore.delete('admin_token');

    // 3. Refresh Token (if used)
    cookieStore.delete('refresh_token');

    // 4. Any other session-like cookies
    cookieStore.delete('kakao_access_token'); // Just in case

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
