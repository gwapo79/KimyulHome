
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_ID = 'b6c8de28-ff60-45da-807b-c4efc7d544d5';

const FIX_DATA = {
    strategy: JSON.stringify([
        {
            title: "채권자 이의신청에 대한 적극 대응",
            description: "채권자의 무리한 이의신청에 대해 법리적으로 반박하며, 채무 증대 경위가 사기 피해로 인한 것임을 입증하여 기각 결정을 이끌어냄."
        },
        {
            title: "청산가치 보장을 위한 변제계획 수정",
            description: "보유 재산(임차보증금 등)의 가치를 정확히 산정하고, 이를 상회하는 변제계획안을 수립하여 법원의 인가 요건을 충족시킴."
        },
        {
            title: "생계비 확보를 위한 추가 소명",
            description: "의뢰인의 부양가족 및 질병 치료비 등을 소명하여 최저생계비 이상의 추가 생계비를 인정받아 실질적인 변제 수행 가능성을 높임."
        }
    ]),
    outcomes: JSON.stringify([
        "법원, 변제계획안 인가 결정",
        "채권자 이의신청 기각 및 절차 진행",
        "총 채무의 65% 탕감 효과 달성"
    ])
};

async function main() {
    console.log(`Fixing Violation Case ID: ${TARGET_ID}...`);

    await prisma.successCase.update({
        where: { id: TARGET_ID },
        data: FIX_DATA
    });

    console.log("Violation fixed (Strategy/Outcomes updated).");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
