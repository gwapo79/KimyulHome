const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    await prisma.successCase.create({
        data: {
            title: '전세금 4억 전액 회수 (3개월 소요)',
            category: '부동산 법률',
            summary: '전세보증금을 돌려받지 못한 의뢰인을 소송을 통해 전액 회수에 성공한 사례입니다. 체계적인 법적 대응과 신속한 집행을 통해 단기간 내 문제를 해결했습니다.',
            client: '김OO',
            caseType: '전세금 반환 청구',
            amount: '4억원',
            period: '3개월',
            lawyer: '김법무 변호사',
            result: '전액 회수 성공',
            background: `의뢰인은 서울시 강남구 소재 아파트에 전세금 4억원으로 거주하던 중, 임대인이 계약 만료 후 보증금 반환을 거부하며 연락을 두절하는 상황에 직면했습니다.
임대인의 재산 상태가 불투명한 상황에서 신속한 법적 대응이 필요한 상황이었습니다.`,
            strategy: `가압류 선제 집행
임대인의 부동산과 금융자산에 대한 신속한 가압류를 통해 채권 보전을 우선 확보했습니다. 이를 통해 임대인이 재산을 은닉하거나 처분하는 것을 방지할 수 있었습니다.

임대인 재산 조사
법원을 통한 재산조회와 금융기관 조회를 병행하여 임대인의 실질적인 재산 현황을 파악했습니다. 숨겨진 부동산과 예금계좌를 발견하여 회수 가능성을 높였습니다.

병행 소송 전략
보증금 반환 소송과 동시에 임대차보증금 반환보증보험 및 전세금 안전장치를 활용한 다각적 접근을 통해 회수 확률을 극대화했습니다.`,
            outcomes: `보증금 4억원 전액 회수 완료
지연이자 및 손해배상금 추가 확보
3개월 내 판결 확정 및 집행 완료
소송비용 및 변호사 수임료 상대방 부담`
        },
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
