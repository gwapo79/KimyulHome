
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'bizgguya@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { cases: true }
    });

    if (!user) {
        console.log('User not found. Cannot check cases.');
        return;
    }

    if (user.cases.length > 0) {
        console.log(`User ${email} has ${user.cases.length} cases.`);
        return;
    }

    console.log(`User ${email} has no cases. Seeding now...`);

    // Define realistic cases (copied from seed-for-latest-user.ts)
    const cases = [
        {
            title: '전세보증금 반환 소송',
            caseNumber: '2024가합12345',
            status: '소장 접수',
            statusColor: 'blue',
            description: '임대인의 계약 만료 후 보증금 미반환으로 인한 반환 청구 소송',
            courtName: '서울중앙지방법원',
            judgeInfo: '제4민사부 (나) 이공정 판사',
            opponentName: '박임대',
            lawyerInCharge: '김변호사',
            claimAmount: BigInt(350000000),
            contractDate: new Date('2024-01-15'),
            caseDescriptionLong: '본 사건은 임대차 계약 종료 후에도 정당한 사유 없이 전세보증금을 반환하지 않는 임대인을 상대로 하는 반환 청구 소송입니다.',
            timelineJson: [
                { date: '2024-03-20', title: '소장 접수 완료', description: '서울중앙지방법원에 소장 접수 (사건번호 부여)' }
            ]
        },
        {
            title: '개인회생 신청',
            caseNumber: '2024개회56789',
            status: '개시결정',
            statusColor: 'green',
            description: '채무 조정을 위한 개인회생 절차 진행 중',
            courtName: '서울회생법원',
            judgeInfo: '제12회생단독 박회생 판사',
            opponentName: '신한카드 외 4',
            lawyerInCharge: '이변호사',
            claimAmount: BigInt(85000000),
            contractDate: new Date('2024-02-10'),
            caseDescriptionLong: '과도한 채무로 인한 지급 불능 상태에서 신청한 개인회생 사건입니다.',
            timelineJson: [
                { date: '2024-04-15', title: '개시결정', description: '법원으로부터 개시결정 통지 수령' }
            ]
        }
    ];

    for (const c of cases) {
        await prisma.case.create({
            data: {
                userId: user.id,
                ...c
            }
        });
    }
    console.log('Seeded 2 cases.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
