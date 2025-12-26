
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 STARTING DASHBOARD DATA SEEDING 🌱");

    // 1. Create or Find Test User
    const TEST_EMAIL = "test@lawfirm.com";
    console.log(`👤 creating/finding user: ${TEST_EMAIL}`);

    let user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: TEST_EMAIL,
                name: "홍길동",
                phone: "010-1234-5678",
                password: "hashed_password_placeholder", // In real app, hash this
                provider: "local"
            }
        });
        console.log("   ✅ Created new test user.");
    } else {
        console.log("   ℹ️  Found existing test user.");
    }
    const userId = user.id;

    // 2. Clear existing dashboard data for this user to avoid duplicates
    console.log("🗑️  Cleaning up old dashboard data for user...");
    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.document.deleteMany({ where: { userId } });
    await prisma.calendarEvent.deleteMany({ where: { userId } });
    await prisma.chatMessage.deleteMany({ where: { room: { userId } } });
    await prisma.chatRoom.deleteMany({ where: { userId } });
    await prisma.case.deleteMany({ where: { userId } });

    // 3. Seed Cases
    console.log("  Seeding Cases...");
    await prisma.case.create({
        data: {
            userId,
            title: "전세보증금 반환 청구",
            status: "진행중",
            statusColor: "blue", // Frontend can map this
            caseNumber: "2024가합12345",
            description: "서울시 서초구 반포동 아파트 전세보증금 반환 건",
        }
    });
    await prisma.case.create({
        data: {
            userId,
            title: "개인회생 신청",
            status: "접수완료",
            statusColor: "green",
            caseNumber: "2024개회56789",
            description: "서울회생법원 개인회생 절차 진행 중",
        }
    });
    const closedCase = await prisma.case.create({
        data: {
            userId,
            title: "임대차 계약금 반환",
            status: "종결",
            statusColor: "gray",
            caseNumber: "2023가소98765",
            description: "계약 파기로 인한 계약금 배액 배상 건",
        }
    });

    // 4. Seed Documents
    console.log("📄 Seeding Documents...");
    await prisma.document.createMany({
        data: [
            { userId, caseId: closedCase.id, fileName: "소장_전세보증금반환.pdf", fileType: "PDF", fileSize: "2.4MB", url: "#", category: "소송서류" },
            { userId, caseId: closedCase.id, fileName: "내용증명_발송본.pdf", fileType: "PDF", fileSize: "1.1MB", url: "#", category: "증거자료" },
            { userId, fileName: "개인회생_개시결정문.pdf", fileType: "PDF", fileSize: "3.5MB", url: "#", category: "법원문서" }
        ]
    });

    // 5. Seed Schedule (CalendarEvents)
    console.log("📅 Seeding Schedule...");
    const today = new Date();
    await prisma.calendarEvent.createMany({
        data: [
            {
                userId,
                title: "1차 변론기일",
                startTime: new Date(today.getTime() + 86400000 * 2), // +2 days
                endTime: new Date(today.getTime() + 86400000 * 2 + 3600000),
                category: "재판",
                color: "red"
            },
            {
                userId,
                title: "변호사 미팅 (전화)",
                startTime: new Date(today.getTime() + 86400000 * 5), // +5 days
                endTime: new Date(today.getTime() + 86400000 * 5 + 1800000),
                category: "상담",
                color: "green"
            }
        ]
    });

    // 6. Seed Chat
    console.log("💬 Seeding Chat...");
    const room = await prisma.chatRoom.create({
        data: {
            userId,
            title: "김변호사님 상담방",
            lawyerId: "lawyer_01",
            status: "active"
        }
    });
    await prisma.chatMessage.createMany({
        data: [
            { roomId: room.id, senderId: "lawyer_01", content: "안녕하세요. 보내주신 서류 잘 확인했습니다.", isRead: true, createdAt: new Date(Date.now() - 1000000) },
            { roomId: room.id, senderId: userId, content: "네, 추가로 필요한 게 있을까요?", isRead: true, createdAt: new Date(Date.now() - 900000) },
            { roomId: room.id, senderId: "lawyer_01", content: "등기부등본 최신본이 필요합니다. 발급 부탁드려요.", isRead: false, createdAt: new Date(Date.now() - 50000) }
        ]
    });

    // 7. Seed Notifications
    console.log("🔔 Seeding Notifications...");
    await prisma.notification.createMany({
        data: [
            { userId, title: "서류 제출 요청", message: "전세보증금 반환 소송 관련 증거자료를 제출해주세요.", type: "warning", isRead: false },
            { userId, title: "상담 예약 확정", message: "4월 20일 오후 2시 방문 상담이 예약되었습니다.", type: "success", isRead: true },
            { userId, title: "새로운 메시지", message: "김변호사님으로부터 새 메시지가 도착했습니다.", type: "info", isRead: false }
        ]
    });

    console.log("✅ DASHBOARD SEEDING COMPLETE");
    console.log(`👉 Test User ID: ${userId}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
