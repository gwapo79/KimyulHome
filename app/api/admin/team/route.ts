import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth-utils';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET: List all team members
export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const members = await prisma.teamMember.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { assignedCases: true }
                }
            }
        });

        // Transform for UI if needed, or send as is
        const formatted = members.map(m => ({
            ...m,
            assignedCases: m._count.assignedCases
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Team GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// POST: Add new team member
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, role, position, department, password } = body;
        // Note: 'department' isn't in TeamMember schema shown earlier, 
        // checking schema: name, role, position, specialty, imageUrl, email, description.
        // I will map 'department' to 'specialty' or just omit if not strictly mapped, 
        // but 'specialty' seems appropriate or I'll just check what the UI expects.
        // The mock UI showed 'department'. I'll map it to 'specialty' for now or just ignore if not in schema.
        // Looking at schema again: `specialty String?`. I'll use that.

        if (!name || !role || !position || !email) { // Email is required for sync
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create TeamMember
        const newMember = await prisma.teamMember.create({
            data: {
                name,
                email,
                role, // e.g., 'LAWYER', 'STAFF'
                position,
                specialty: department || null, // Map UI 'department' to schema 'specialty'
            }
        });

        // 2. Sync with User (Upsert) for Auth
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.upsert({
                where: { email },
                update: {
                    password: hashedPassword,
                    role: role === 'ADMIN' ? 'SUPER_ADMIN' : 'USER', // Simple role mapping
                    name: name
                },
                create: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role === 'ADMIN' ? 'SUPER_ADMIN' : 'USER'
                }
            });
            console.log(`[API] Synced User password for ${email}`);
        } else {
            console.log(`[API] No password provided for ${email}, skipping User sync.`);
        }

        return NextResponse.json(newMember);

    } catch (error) {
        console.error('Team POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// PATCH: Update team member
export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !(await verifyJWT(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, email, role, position, department, password } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // 1. Update TeamMember
        const updatedMember = await prisma.teamMember.update({
            where: { id },
            data: {
                name,
                email,
                role,
                position,
                specialty: department || null,
            }
        });

        // 2. Sync with User (if password provided)
        if (password && email) {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Verify if User exists first to avoid error if they don't? Upsert handles it.
            await prisma.user.upsert({
                where: { email },
                update: {
                    password: hashedPassword,
                    role: role === 'ADMIN' ? 'SUPER_ADMIN' : 'USER',
                    name: name
                },
                create: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role === 'ADMIN' ? 'SUPER_ADMIN' : 'USER'
                }
            });
            console.log(`[API] Updated User password for ${email}`);
        }

        return NextResponse.json(updatedMember);

    } catch (error) {
        console.error('Team PATCH Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
