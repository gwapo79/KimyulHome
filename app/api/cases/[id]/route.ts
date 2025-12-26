
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
    }

    try {
        console.log(`API Fetching case with ID: ${id}`);
        const caseDetail = await prisma.case.findUnique({
            where: {
                id: id,
            },
            include: {
                documents: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        console.log('Case Detail Fetched:', caseDetail ? 'Found' : 'Null');

        if (!caseDetail) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        // Debug BigInt
        console.log('Original claimAmount:', caseDetail.claimAmount, 'Type:', typeof caseDetail.claimAmount);

        const serializedCase = {
            ...caseDetail,
            claimAmount: (caseDetail.claimAmount !== null && caseDetail.claimAmount !== undefined) ? caseDetail.claimAmount.toString() : null
        };

        console.log("Serialized successfully.");

        return NextResponse.json({ case: serializedCase });
    } catch (error) {
        console.error('Failed to fetch case detail:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
