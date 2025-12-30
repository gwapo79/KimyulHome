
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const checks = {
        database: { status: 'unknown', message: '', latency: 0 },
        env: {
            supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            jwtSecret: !!process.env.JWT_SECRET,
        },
        timestamp: new Date().toISOString()
    };

    // Check Database
    try {
        const start = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        checks.database.status = 'ok';
        checks.database.latency = Date.now() - start;
        checks.database.message = 'Connected';
    } catch (e) {
        checks.database.status = 'error';
        checks.database.message = (e as Error).message;
    } finally {
        await prisma.$disconnect();
    }

    const allOk = checks.database.status === 'ok' &&
        checks.env.supabaseUrl &&
        checks.env.supabaseKey &&
        checks.env.jwtSecret;

    return NextResponse.json({
        healthy: allOk,
        checks
    });
}
