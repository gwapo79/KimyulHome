
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Admin Restoration...");

    const email = "admin@law-firm.com";
    const password = "admin1234";
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Restore Admin User
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'CEO', // Explicitly requested CEO or SUPER_ADMIN
            provider: 'credentials',
            status: 'ACTIVE'
        },
        create: {
            email,
            password: hashedPassword,
            name: "최고 관리자 (CEO)",
            role: 'CEO',
            provider: 'credentials',
            status: 'ACTIVE'
        }
    });

    console.log(`[SUCCESS] Restored Admin: ${user.email}, Role: ${user.role}`);

    // 2. Ensure Profile exists (for consistency)
    const profile = await prisma.profile.upsert({
        where: { email },
        update: {
            role: 'CEO'
        },
        create: {
            email,
            name: "최고 관리자",
            role: 'CEO',
            description: "System Administrator"
        }
    });
    console.log(`[SUCCESS] Restored Profile: ${profile.email}`);

    // 3. Ensure Case C1 (Requested to inject C1 too)
    // We link it to a client usually, but if the admin needs to see it, they can via permissions.
    // Let's ensure C1 exists.
    const caseTitle = "가상화폐 투자 사기 및 손해배상 청구";
    const c1 = await prisma.case.upsert({
        where: { id: 'c1' },
        update: {},
        create: {
            id: 'c1',
            userId: user.id, // Assign to admin just for test, or user_c1 if we want strict logic. 
            // Prompt said "로그인 후 이동할 c1 사건 데이터도 함께 밀어 넣어라".
            // Let's assign to user_c1 if exists, or fallback to admin.
            title: caseTitle,
            status: "TRIAL_1",
            statusColor: "red",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    console.log(`[SUCCESS] Ensured Case C1: ${c1.title}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
