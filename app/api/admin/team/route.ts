import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: List all team members
export async function GET() {
    try {
        const members = await (prisma as any).profile.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Transform for UI
        const formatted = members.map((m: any) => ({
            id: m.id,
            name: m.name || 'No Name',
            email: m.email,
            role: m.role,
            position: m.position || 'Member',
            specialty: m.specialty || '-',
            // Force 0 for now to avoid P2022 error since _count relation might be missing in client
            assignedCases: 0
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Team API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// POST: Create new team member
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, role, position, specialty } = body;

        // Check for existing profile
        const existing = await (prisma as any).profile.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json({ error: 'Already exists' }, { status: 400 });
        }

        // Create new Profile
        const newMember = await (prisma as any).profile.create({
            data: {
                name,
                email,
                role: role || 'USER',
                position,
                specialty,
                // Cast to any to assume empty connections are fine or handled by default
                assignedCasesStaff: { connect: [] },
                assignedCasesProfessional: { connect: [] }
            }
        });

        return NextResponse.json(newMember);

    } catch (error) {
        console.error('Error creating member:', error);
        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// PATCH: Update team member
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, role, position, specialty, name } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updated = await (prisma as any).profile.update({
            where: { id },
            data: {
                role,
                position,
                specialty,
                name
            }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
