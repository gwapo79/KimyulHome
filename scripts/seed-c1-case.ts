
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Case C1...");

    // 1. Ensure a Client User exists
    const clientEmail = "client_c1@test.com";
    let client = await prisma.user.findUnique({ where: { email: clientEmail } });
    if (!client) {
        client = await prisma.user.create({
            data: {
                id: "user_c1",
                email: clientEmail,
                name: "홍길동 (의뢰인)",
                phone: "010-1234-5678",
                role: "USER"
            }
        });
        console.log("Created Client:", client.name);
    } else {
        console.log("Found Client:", client.name);
    }

    // 2. Ensure a Lawyer TeamMember exists (optional link)
    // We can skip or assume ID exists. Let's just create Case C1.

    // 3. Upsert Case C1
    const caseC1 = await prisma.case.upsert({
        where: { id: "c1" },
        update: {},
        create: {
            id: "c1",
            userId: client.id,
            title: "가상화폐 투자 사기 및 손해배상 청구",
            description: "투자 리딩방 사기로 인한 피해금 회수 및 형사 고소 진행 건",
            status: "TRIAL_1",
            statusColor: "red",
            caseNumber: "2024가합12345",
            courtName: "서울중앙지방법원",
            lawyerInCharge: "김지율",
            claimAmount: 50000000,
            contractDate: new Date(),
        }
    });

    console.log("Seeded Case C1:", caseC1.title);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
