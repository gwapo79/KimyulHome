
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const cases = await prisma.case.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const serializedCases = cases.map(c => ({
            ...c,
            claimAmount: c.claimAmount ? c.claimAmount.toString() : null,
            // Convert other BigInts if any
        }));

        return NextResponse.json({ cases: serializedCases });
    } catch (error) {
        console.error('Failed to fetch cases - route.ts:', error);
        // @ts-ignore
        const errorMessage = error?.message || 'Unknown error';
        return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
    }
}
