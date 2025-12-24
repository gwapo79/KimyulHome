
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Find the target user (test_user@example.com)
    const user = await prisma.user.findUnique({
        where: { email: 'test_user@example.com' }
    });

    if (!user) {
        console.error("User 'test_user@example.com' not found. Please ensure the user exists before running this script.");
        process.exit(1);
    }

    console.log(`Found user: ${user.email} (${user.name})`);

    // 2. Clean up existing cases for this user to avoid duplicates
    console.log(`Cleaning up existing cases for ${user.email}...`);
    try {
        await prisma.case.deleteMany({
            where: { userId: user.id }
        });
    } catch (e) {
        console.log("No existing cases to delete or error during delete (ignoring).");
    }

    // 3. Define the cases as requested
    const casesData = [
        {
            caseNumber: "2024가단50823",
            title: "전세보증금 반환 청구의 소",
            status: "서류 보완 요청 (Warning)",
            statusColor: "red",
            description: "임대차 계약 만료 후 전세보증금 미반환에 따른 청구 소송",
            userId: user.id,
            claimAmount: BigInt(250000000),
            courtName: "서울중앙지방법원 제15민사단독",
            judgeInfo: "이정재 판사",
            opponentName: "주식회사 대박임대건설 (대표이사 김갑수)",
            lawyerInCharge: "김지율 대표변호사",
            contractDate: new Date("2023-11-10"),
            caseDescriptionLong: "임대차 계약 만료에도 불구하고 임대인이 정당한 사유 없이 보증금을 반환하지 않아, 이에 대한 반환을 청구하는 민사 소송입니다. 현재 피고 측의 답변서 제출 이후 법원으로부터 추가 입증 서류 제출을 요구받은 상태입니다.",
            timelineJson: [
                { date: "2025-11-10", title: "소장 접수 완료", description: "관할 법원에 소장 접수 및 사건번호 부여" },
                { date: "2025-11-25", title: "피고 소장 부본 송달", description: "피고에게 소장 부본 및 안내서 송달 완료" },
                { date: "2025-12-15", title: "피고 답변서 제출", description: "피고 측 법무법인을 통해 답변서 제출" },
                { date: "2025-12-20", title: "보정명령 등본 송달 (현 시점)", description: "재판부로부터 증거 서류 보완 요청 수령" }
            ]
        },
        {
            caseNumber: "2025개회12345",
            title: "개인회생 신청",
            status: "개시결정 (Success)",
            statusColor: "green",
            description: "과도한 채무로 인한 개인회생 신청 및 개시 결정",
            userId: user.id,
            claimAmount: BigInt(0),
            courtName: "서울회생법원 제3회생단독",
            judgeInfo: "박서준 판사",
            opponentName: "서울회생법원 (채권자 목록 5곳 포함)",
            lawyerInCharge: "박지율 파트너변호사",
            contractDate: new Date("2025-10-01"),
            caseDescriptionLong: "지속적인 소득 활동이 가능하나 현재 지급불능 상태에 빠진 채무자가 채무를 조정받기 위해 법원에 신청한 개인회생 사건입니다. 금지명령 이후 회생위원 면담을 거쳐 개시결정이 내려졌습니다.",
            timelineJson: [
                { date: "2025-10-01", title: "개인회생 신청서 접수", description: "서울회생법원에 개인회생 절차 개시 신청서 접수" },
                { date: "2025-10-15", title: "금지명령 결정 및 송달", description: "채권자들의 강제집행 금지 명령 결정" },
                { date: "2025-11-20", title: "회생위원 면담 완료", description: "담당 회생위원과의 면담 진행 및 소득/재산 소명" },
                { date: "2025-12-24", title: "개시결정 및 채권자집행기일 통지 (현 시점)", description: "개인회생 절차 개시 결정 및 향후 일정 통지" }
            ]
        }
    ];

    // 4. Insert cases
    console.log(`Creating ${casesData.length} cases for user ${user.email}...`);

    for (const caseData of casesData) {
        // 기존에 동일 사건번호가 있으면 스킵하거나 삭제 후 생성 (여기서는 생성만 시도)
        await prisma.case.create({
            data: caseData
        });
        console.log(`Created case: ${caseData.title} (${caseData.caseNumber})`);
    }

    console.log("Successfully seeded realistic cases.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
