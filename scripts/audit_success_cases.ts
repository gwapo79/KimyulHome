
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DRUG_CASE_ID = '7f625219-dd32-4fc9-94b8-083b45a67cd7';

// Professional, legally accurate content for the drug case
const FIXED_DRUG_CASE = {
    title: '마약류 관리법 위반(대마) 기소유예 성공 사례',
    category: '형사',
    caseType: '마약류 관리법 위반 (단순 투약)',
    summary: '초범 및 재범 방지 의지 입증을 통한 기소유예 처분',
    amount: null, // Critical fix: Remove amount
    period: '2개월',
    lawyer: '김법무 변호사',
    result: '기소유예 (불기소 처분)',
    background: `의뢰인은 호기심에 대마를 접한 후 단순 투약 혐의로 수사 기관의 조사를 받게 되었습니다. 
의뢰인은 별다른 전과가 없는 초범이었으나, 마약류 범죄의 특성상 엄중한 처벌이 예상되는 상황이었습니다. 
특히 수사 초기 단계에서의 대응 미흡으로 자칫 구속 수사로 전환될 우려마저 있었습니다.`,
    strategy: JSON.stringify([
        {
            title: "신속한 초기 대응 및 자수서 제출",
            description: "수사 초기 단계부터 변호인이 동석하여 진술을 조력하고, 수사에 적극 협조하며 반성하는 태도를 보임으로써 구속 수사의 필요성이 없음을 적극 소명함."
        },
        {
            title: "양형 자료의 체계적 수집 및 제출",
            description: "의뢰인이 초범임과 동시에 사회적 유대관계가 분명함을 입증하는 자료, 정기적인 약물 치료 및 재범 방지 교육 이수 계획서 등을 제출하여 재범의 우려가 없음을 강력히 주장함."
        },
        {
            title: "법리적 검토 및 변호인 의견서 개진",
            description: "단순 투약으로 인한 사회적 해악이 비교적 적다는 점과 동종 전력이 없다는 점을 들어, 형사 처벌보다는 치료와 교화의 기회를 부여하는 것이 타당함을 법리적으로 논증함."
        }
    ]),
    outcomes: JSON.stringify([
        "교육조건부 기소유예 처분 도출",
        "형사 재판 진행 없이 사건 조기 종결",
        "신원 조회 시 전과 기록 남지 않음"
    ])
};

async function main() {
    console.log("--- Starting Success Case Audit & Fix ---");

    // 1. Fix the urgent Drug Case
    console.log(`Fixing Urgent Drug Case (ID: ${DRUG_CASE_ID})...`);

    // First verify it exists
    const drugCase = await prisma.successCase.findUnique({ where: { id: DRUG_CASE_ID } });

    if (drugCase) {
        await prisma.successCase.update({
            where: { id: DRUG_CASE_ID },
            data: FIXED_DRUG_CASE
        });
        console.log("Drug Case fixed successfully.");
        console.log("Updated Title:", FIXED_DRUG_CASE.title);
        console.log("Updated Result:", FIXED_DRUG_CASE.result);
        console.log("Updated Amount:", FIXED_DRUG_CASE.amount); // Should be null
    } else {
        console.error("Drug Case not found! Please verify the ID.");
    }

    // 2. Placeholder for full audit logic (future step)
    // Here we would loop through all cases and apply category-specific rules.
    // e.g. if category === '형사' set amount = null.

    console.log("--- Audit Complete ---");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
