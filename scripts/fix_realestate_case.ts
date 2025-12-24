
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_CASE_ID = '3fbebf3f-1fea-48fa-ac79-7044dd82406e';

const FIXED_CONTENT = {
    title: '공인중개사의 과실 비율에 따른 손해배상 책임 인정 사례',
    category: '부동산/임대차',
    caseType: '전세 사기 / 중개 과실 손해배상',
    summary: '깡통전세 중개 과실 입증을 통한 중개사 및 협회 연대 배상 판결 도출',
    amount: '8,000만원 회수', // Example amount, can be adjusted
    period: '8개월',
    lawyer: '김법무 변호사',
    result: '손해배상 청구 승소',
    background: `의뢰인은 공인중개사의 설명만 믿고 시세보다 높은 가격에 전세 계약을 체결하였으나, 이후 임대인의 세금 체납 등으로 건물이 경매에 넘어가 보증금을 전액 반환받지 못할 위기에 처했습니다. 
보증금 미반환 위험성이 높음에도 불구하고 중개인이 이에 대한 설명 의무를 소홀히 한 점이 명백한 '깡통전세' 피해 사례였습니다.`,
    strategy: JSON.stringify([
        {
            title: "중개대상물 확인 및 설명 의무 위반 입증",
            description: "계약 당시 중개인이 임대인의 국세 체납 여부와 선순위 권리 관계에 대해 정확히 고지하지 않았음을 입증하는 녹취록과 계약서 특약 사항을 정밀 분석하여 법원에 제출함."
        },
        {
            title: "중개 과실과 손해 발생 사이의 인과관계 규명",
            description: "부동산 전문 변호사의 노하우를 바탕으로, 중개인의 고지 의무 위반이 없었다면 의뢰인이 계약을 체결하지 않았을 것임을 논리적으로 증명하여 손해배상 책임을 명확히 함."
        },
        {
            title: "한국공인중개사협회 공제금 청구 병행",
            description: "중개인 개인의 자력 부족에 대비하여, 협회를 공동 피고로 하여 공제금 지급을 청구함으로써 실질적인 피해 회수 가능성을 확보함."
        }
    ]),
    outcomes: JSON.stringify([
        "법원, 공인중개사 과실 비율 60% 인정",
        "중개사 및 협회 연대하여 8,000만원 배상 판결",
        "유사 깡통전세 피해 구제의 선례 확보"
    ])
};

async function main() {
    console.log(`Fixing Case ID: ${TARGET_CASE_ID}...`);

    await prisma.successCase.update({
        where: { id: TARGET_CASE_ID },
        data: FIXED_CONTENT
    });

    console.log("Case fixed successfully.");
    console.log("Title:", FIXED_CONTENT.title);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
