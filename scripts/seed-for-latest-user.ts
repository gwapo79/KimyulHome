
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Find the most recently created user
        const user = await prisma.user.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!user) {
            console.log('No users found. Please sign up first.');
            return;
        }

        console.log(`Found latest user: ${user.email} (${user.name})`);

        // Define realistic cases
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
                claimAmount: BigInt(350000000), // Ensure BigInt
                contractDate: new Date('2024-01-15'),
                caseDescriptionLong: '본 사건은 임대차 계약 종료 후에도 정당한 사유 없이 전세보증금을 반환하지 않는 임대인을 상대로 하는 반환 청구 소송입니다. 현재 내용증명 발송 완료 후 소장이 접수된 상태이며, 임차권 등기 명령 신청이 병행되고 있습니다. 의뢰인은 이사 갈 집 계약금 문제로 시급한 해결을 요하고 있습니다.',
                timelineJson: [
                    { date: '2024-03-20', title: '소장 접수 완료', description: '서울중앙지방법원에 소장 접수 (사건번호 부여)' },
                    { date: '2024-03-10', title: '내용증명 도달', description: '임대인에게 계약 해지 및 반환 촉구 내용증명 도달 확인' },
                    { date: '2024-03-01', title: '내용증명 발송', description: '우체국을 통한 내용증명 발송' }
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
                caseDescriptionLong: '과도한 채무로 인한 지급 불능 상태에서 신청한 개인회생 사건입니다. 금지명령이 인용되어 채권자들의 독촉이 중단되었으며, 현재 보정권고에 대한 서류 제출 후 개시결정을 기다리고 있습니다. 변제계획안은 원금의 45%를 36개월간 분할 상환하는 내용으로 제출되었습니다.',
                timelineJson: [
                    { date: '2024-04-15', title: '개시결정', description: '법원으로부터 개시결정 통지 수령' },
                    { date: '2024-04-01', title: '보정서 제출', description: '최근 대출 사용처 소명 자료 제출 완료' },
                    { date: '2024-03-15', title: '금지명령 인용', description: '채권자들의 강제집행 금지 명령 결정' },
                    { date: '2024-03-05', title: '개인회생 신청서 접수', description: '서울회생법원에 신청서 접수' }
                ]
            },
            {
                title: '부당이득금 반환 청구',
                caseNumber: '2023가단99887',
                status: '변론기일 지정',
                statusColor: 'yellow',
                description: '부동산 중개 수수료 과다 청구에 대한 반환 소송',
                courtName: '서울남부지방법원',
                judgeInfo: '제2민사 단독 김정의 판사',
                opponentName: '최중개',
                lawyerInCharge: '박변호사',
                claimAmount: BigInt(5500000),
                contractDate: new Date('2023-11-20'),
                caseDescriptionLong: '공인중개사가 법정 수수료율을 초과하여 수취한 중개보수에 대해 부당이득금 반환을 청구하는 사건입니다. 피고 측은 합의된 금액이라 주장하나, 강행규정 위반임을 입증하여 반환을 청구하고 있습니다.',
                timelineJson: [
                    { date: '2024-05-10', title: '2차 변론기일 예정', description: '오전 10:30 제305호 법정' },
                    { date: '2024-04-20', title: '준비서면 제출', description: '피고 답변서에 대한 반박 서면 제출' },
                    { date: '2024-03-25', title: '1차 변론기일', description: '원고 청구 취지 진술 및 증거 제출' }
                ]
            }
        ];

        // Create cases
        for (const c of cases) {
            await prisma.case.create({
                data: {
                    userId: user.id,
                    ...c
                }
            });
        }

        console.log(`Successfully created ${cases.length} cases for user: ${user.email}`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
