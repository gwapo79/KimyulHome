
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, type, content, ip, device } = body;

        // "PAGE_VIEW" logic
        if (!userId) {
            // If anonymous, we might still want to log if we had a sessionId, 
            // but for now only log for logged-in users or those identifying self.
            return NextResponse.json({ skipped: true });
        }

        const activity = await prisma.userActivity.create({
            data: {
                userId,
                type: type || 'PAGE_VIEW',
                details: content, // Map content -> details
                ipAddress: ip || 'unknown', // Map ip -> ipAddress
                device: device || 'unknown'
            }
        });

        return NextResponse.json(activity);

    } catch (error) {
        console.error("Activity Log Error", error);
        return NextResponse.json({ error: 'Log Failed' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
