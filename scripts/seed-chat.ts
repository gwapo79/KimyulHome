
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding chat data...');

    const userEmail = 'test_user@example.com';
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    });

    if (!user) {
        console.error(`User ${userEmail} not found. Chat seeding aborted.`);
        return;
    }

    console.log(`Found user: ${user.name} (${user.id})`);

    // Clean up existing room for this user
    await prisma.chatRoom.deleteMany({
        where: { userId: user.id }
    });

    // Create a new room
    const room = await prisma.chatRoom.create({
        data: {
            userId: user.id,
            title: '전세금 반환 관련 상담',
            status: 'active',
            lawyerId: 'lawyer_001', // Mock Lawyer ID
        }
    });

    console.log(`Created Room: ${room.id}`);

    // Create Messages
    /*
        Scenario:
        1. User asks about deposit return.
        2. Lawyer greets and asks for details.
        3. User provides details (100M KRW).
        4. Lawyer confirms and sets next step.
    */

    // Message 1: User (1 hour ago)
    await prisma.chatMessage.create({
        data: {
            roomId: room.id,
            senderId: user.id,
            content: '안녕하세요, 전세금 반환 소송 관련해서 문의드리고 싶습니다. 집주인이 연락을 안 받아요.',
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            isRead: true
        }
    });

    // Message 2: Lawyer (55 mins ago)
    await prisma.chatMessage.create({
        data: {
            roomId: room.id,
            senderId: 'lawyer_001',
            content: '안녕하세요, 김율 변호사입니다. 현재 상황이 많이 답답하시겠네요. 보증금 규모와 계약 만료일이 언제인지 알려주시겠어요?',
            createdAt: new Date(Date.now() - 3300000), // 55 mins ago
            isRead: true
        }
    });

    // Message 3: User (30 mins ago)
    await prisma.chatMessage.create({
        data: {
            roomId: room.id,
            senderId: user.id,
            content: '보증금은 3억원이고, 만료일은 지난 달 말이었습니다. 내용증명은 보냈는데 반송되었어요.',
            createdAt: new Date(Date.now() - 1800000), // 30 mins ago
            isRead: true
        }
    });

    // Message 4: Lawyer (Just now)
    await prisma.chatMessage.create({
        data: {
            roomId: room.id,
            senderId: 'lawyer_001',
            content: '반송된 내용증명은 소송에서 중요한 증거가 됩니다. 우선 임차권등기명령 신청부터 진행하는 것이 좋겠습니다. 제가 절차를 안내해 드릴까요?',
            createdAt: new Date(), // Now
            isRead: false
        }
    });

    console.log('Chat seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
