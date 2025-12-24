
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding calendar events...');

    const userEmail = 'test_user@example.com';
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    });

    if (!user) {
        console.error(`User ${userEmail} not found. Calendar seeding aborted.`);
        return;
    }

    console.log(`Found user: ${user.name} (${user.id})`);

    // Clean up existing events
    await prisma.calendarEvent.deleteMany({
        where: { userId: user.id }
    });

    // 1. [법원 기일] Tomorrow 2:00 PM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(16, 0, 0, 0);

    await prisma.calendarEvent.create({
        data: {
            userId: user.id,
            title: '[법원 기일] 전세금 반환 소송 1차 변론',
            description: '서울중앙지법 402호',
            startTime: tomorrow,
            endTime: tomorrowEnd,
            category: '법원 기일',
            color: '#3b82f6', // blue-500
        }
    });

    // 2. [고객 상담] This Friday 10:00 AM
    const nextFriday = new Date();
    const day = nextFriday.getDay();
    const diff = (5 - day + 7) % 7; // Calculate days until Friday
    nextFriday.setDate(nextFriday.getDate() + diff);
    nextFriday.setHours(10, 0, 0, 0);
    const nextFridayEnd = new Date(nextFriday);
    nextFridayEnd.setHours(11, 0, 0, 0);

    await prisma.calendarEvent.create({
        data: {
            userId: user.id,
            title: '[고객 상담] 개인회생 관련 서류 검토 미팅',
            description: '화상 상담 (Google Meet)',
            startTime: nextFriday,
            endTime: nextFridayEnd,
            category: '고객 상담',
            color: '#22c55e', // green-500
        }
    });

    console.log('Calendar seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
