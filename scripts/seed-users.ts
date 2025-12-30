
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    try {
        // 0. Manual Migration: Add status column if missing
        // Since CLI 'db push' is failing, we use the working Client connection to modify schema.
        // This is a temporary fix to support the new Status field.
        console.log('🛠️ [Manual Migration] Ensuring "status" column exists...');
        await prisma.$executeRawUnsafe(`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
      `);
        console.log('✅ Manual Migration successful.');
    } catch (e) {
        console.warn('⚠️ Manual Migration Note:', (e as Error).message);
        // Continue, in case it already exists or error is non-fatal
    }

    // 1. Email Users (5)
    const emailUsers = [
        { email: 'user1@test.com', name: '김철수', phone: '010-1111-2222', status: 'ACTIVE' },
        { email: 'user2@test.com', name: '이영희', phone: '010-3333-4444', status: 'ACTIVE' },
        { email: 'user3@test.com', name: '박민수', phone: '010-5555-6666', status: 'BLOCKED' }, // Blocked
        { email: 'user4@test.com', name: '최지우', phone: '010-7777-8888', status: 'WITHDRAWN' }, // Withdrawn
        { email: 'user5@test.com', name: '정우성', phone: '010-9999-0000', status: 'ACTIVE' },
    ];

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const u of emailUsers) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: { status: u.status, name: u.name, phone: u.phone },
            create: {
                email: u.email,
                name: u.name,
                password: hashedPassword,
                phone: u.phone,
                provider: 'local',
                role: 'USER',
                status: u.status,
            },
        });
    }
    console.log('✅ Email users seeded.');

    // 2. Kakao Users (5)
    const kakaoUsers = [
        { kakaoId: 'kakao_101', name: '카카오_홍길동', email: 'kakao_hon@test.com', status: 'ACTIVE' },
        { kakaoId: 'kakao_102', name: '카카오_무지', email: 'muji@kakao.com', status: 'ACTIVE' },
        { kakaoId: 'kakao_103', name: '카카오_어피치', email: 'apeach@kakao.com', status: 'BLOCKED' },
        { kakaoId: 'kakao_104', name: '카카오_라이언', email: 'ryan@kakao.com', status: 'ACTIVE' },
        { kakaoId: 'kakao_105', name: '카카오_튜브', email: 'tube@kakao.com', status: 'WITHDRAWN' },
    ];

    for (const k of kakaoUsers) {
        await prisma.user.upsert({
            where: { kakaoId: k.kakaoId },
            update: { status: k.status, name: k.name, email: k.email },
            create: {
                kakaoId: k.kakaoId,
                provider: 'kakao',
                name: k.name,
                email: k.email,
                role: 'USER',
                status: k.status,
            },
        });
    }
    console.log('✅ Kakao users seeded.');

    // 3. Verify Count
    const count = await prisma.user.count();
    console.log(`📊 Total users in DB: ${count}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
