
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function getOrCreateUser(email, password, role) {
    console.log(`Processing user: ${email} (${role})...`);

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create or Update User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role,
                status: 'ACTIVE'
            },
            create: {
                email,
                password: hashedPassword,
                name: email.split('@')[0],
                role,
                provider: 'local',
                status: 'ACTIVE'
            }
        });

        // Also Sync to Profile
        await prisma.profile.upsert({
            where: { email },
            update: {
                role,
                name: user.name
            },
            create: {
                email,
                name: user.name,
                role,
                description: role === 'SUPER_ADMIN' ? '관리자 계정' : '일반 유저 계정'
            }
        });

        console.log(`User ${email} seeded. ID: ${user.id}`);
        return user.id;
    } catch (e) {
        console.error(`Failed to seed user ${email}:`, e);
        return null;
    }
}

async function seed() {
    let adminId, userId;

    try {
        // 1. Setup Users
        adminId = await getOrCreateUser('admin@petkage.com', 'admin1234', 'SUPER_ADMIN');
        userId = await getOrCreateUser('user@petkage.com', 'test1234', 'USER');

        if (!userId || !adminId) {
            console.error("Critical: Failed to create users. Check DB connection.");
            return;
        }

        // 2. Success Cases
        try {
            await prisma.successCase.createMany({
                data: [
                    {
                        title: '[손해배상] 반려견 물림 사고, 과실 0% 입증 사례',
                        background: '반려견 물림 사고 발생',
                        result: '과실 0% 입증 및 전액 보상',
                        summary: '상대방 과실 입증하여 전액 보상 완료.',
                        category: '손해배상',
                        createdAt: new Date(),
                    },
                    {
                        title: '[의료소송] 수술 중 의료사고, 병원 과실 인정 합의',
                        summary: 'CCTV 증거 확보를 통해 합의 성공.',
                        category: '의료소송',
                        createdAt: new Date(Date.now() - 86400000),
                    },
                    {
                        title: '[보험분쟁] 펫보험 지급 거절 대응 성공',
                        summary: '약관 해석 대응으로 보험금 수령.',
                        category: '보험분쟁',
                        createdAt: new Date(Date.now() - 172800000),
                    },
                    {
                        title: '[형사고소] 책임비 사기 분양업자 검거 및 환불',
                        summary: '조직적 사기 입증하여 피해금 회수.',
                        category: '형사고소',
                        createdAt: new Date(Date.now() - 259200000),
                    },
                    {
                        title: '[분쟁조정] 층간소음/짖음 이웃 갈등 해결',
                        summary: '법적 중재를 통해 원만한 합의 도출.',
                        category: '분쟁조정',
                        createdAt: new Date(Date.now() - 345600000),
                    }
                ]
            });
            console.log("Success Cases planted.");
        } catch (e) {
            console.error("Skipping Success Cases:", e.message);
        }

        // 3. MyPage Data for User
        let case1Id = null;

        // Cases
        try {
            const case1 = await prisma.case.create({
                data: {
                    userId: userId,
                    title: '반려견 놀이터 물림 사고 손해배상',
                    status: '진행중',
                    statusColor: 'blue',
                    description: '손해배상',
                    createdAt: new Date(),
                    caseNumber: '2024-가합-10293'
                }
            });
            case1Id = case1.id;

            await prisma.case.create({
                data: {
                    userId: userId,
                    title: '동물병원 수술비 과다 청구 분쟁',
                    status: '접수완료',
                    statusColor: 'green',
                    description: '의료분쟁',
                    createdAt: new Date(Date.now() - 172800000),
                    caseNumber: '2024-나-55112'
                }
            });
            console.log("User Cases planted.");
        } catch (e) {
            console.error("Skipping Cases:", e.message);
        }

        // Documents (Linked to Case 1)
        if (case1Id) {
            try {
                const docs = [
                    { fileName: '소장.pdf', fileSize: '2.4MB', fileType: 'pdf', url: '/uploads/sample1.pdf', category: '소송서류' },
                    { fileName: '증거자료_목록.xlsx', fileSize: '15KB', fileType: 'xlsx', url: '/uploads/sample2.xlsx', category: '증거' },
                    { fileName: '내용증명.jpg', fileSize: '450KB', fileType: 'jpg', url: '/uploads/sample3.jpg', category: '기타' },
                ];

                for (const doc of docs) {
                    const docId = crypto.randomUUID();
                    await prisma.$executeRaw`
                        INSERT INTO "Document" ("id", "userId", "caseId", "fileName", "fileSize", "fileType", "url", "category", "createdAt")
                        VALUES (${docId}, ${userId}, ${case1Id}, ${doc.fileName}, ${doc.fileSize}, ${doc.fileType}, ${doc.url}, ${doc.category}, NOW())
                    `;
                }
                console.log('✅ Documents seeded (via Raw SQL)');
            } catch (e) {
                // @ts-ignore
                console.error("Skipping Documents (Raw SQL Failed):", e.message);
            }
        }

        // Schedules (CalendarEvents)
        try {
            await prisma.calendarEvent.createMany({
                data: [
                    {
                        userId: userId,
                        title: '변호사 1차 자문 미팅',
                        startTime: new Date(Date.now() + 172800000),
                        endTime: new Date(Date.now() + 172800000 + 3600000),
                        category: 'MEETING',
                        color: 'blue',
                        description: '사건 경위 파악 및 대응 전략 논의'
                    },
                    {
                        userId: userId,
                        title: '조정 기일 참석',
                        startTime: new Date(Date.now() + 1209600000),
                        endTime: new Date(Date.now() + 1209600000 + 7200000),
                        category: 'COURT',
                        color: 'red',
                        description: '조정위원 참석 하에 합의 시도 @서울중앙지법'
                    }
                ]
            });
            console.log("Schedules planted.");
        } catch (e) {
            console.error("Skipping Schedules:", e.message);
        }

        // Chat
        try {
            const chatRoom = await prisma.chatRoom.create({
                data: {
                    userId: userId,
                    title: '법률 상담 (1:1)',
                    status: 'active'
                }
            });

            await prisma.chatMessage.createMany({
                data: [
                    {
                        roomId: chatRoom.id,
                        senderId: userId,
                        content: '안녕하세요, 진단서 업로드했습니다. 확인 부탁드려요.',
                        createdAt: new Date(Date.now() - 3600000),
                        isRead: true
                    },
                    {
                        roomId: chatRoom.id,
                        senderId: adminId,
                        content: '네, 확인했습니다. 내용 검토 후 연락드리겠습니다.',
                        createdAt: new Date(Date.now() - 1800000),
                        isRead: false
                    }
                ]
            });
            console.log("Chat planted.");
        } catch (e) {
            console.error("Skipping Chat:", e.message);
        }

        // Payments (BillingHistory)
        try {
            await prisma.billingHistory.createMany({
                data: [
                    {
                        userId: userId,
                        itemName: '기본 법률 자문 서비스',
                        amount: 55000,
                        status: 'paid',
                        paymentMethod: 'card',
                        paidAt: new Date(Date.now() - 432000000)
                    },
                    {
                        userId: userId,
                        itemName: '소장 작성 대행 프리미엄',
                        amount: 330000,
                        status: 'paid',
                        paymentMethod: 'card',
                        paidAt: new Date(Date.now() - 86400000)
                    }
                ]
            });
            console.log("Payments planted.");
        } catch (e) {
            console.error("Skipping Payments:", e.message);
        }

        // Notifications
        try {
            await prisma.notification.createMany({
                data: [
                    {
                        userId: userId,
                        title: '문서 확인 완료',
                        message: '담당자가 귀하의 증거 문서를 확인하였습니다.',
                        isRead: true,
                        createdAt: new Date(Date.now() - 86400000),
                        type: 'info'
                    },
                    {
                        userId: userId,
                        title: '일정 알림',
                        message: '2일 뒤 변호사 자문 미팅이 예정되어 있습니다.',
                        isRead: false,
                        createdAt: new Date(),
                        type: 'alert'
                    }
                ]
            });
            console.log("Notifications planted.");
        } catch (e) {
            console.error("Skipping Notifications:", e.message);
        }

        console.log("\n✅ QA Data Seeded Successfully (Partial failures logged if any)!");
        console.log("Test Accounts (Local Auth):");
        console.log("- User: user@petkage.com / test1234");
        console.log("- Admin: admin@petkage.com / admin1234");
        console.log("\nPlease login at localhost:3000/login to verify.");

    } catch (e) {
        console.error("General Seeding Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
