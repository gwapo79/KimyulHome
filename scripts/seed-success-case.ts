
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Success Case...');

    const strategy = [
        {
            step: 1,
            title: "가압류 선제 집행",
            description: "임대인의 부동산과 금융자산에 대한 신속한 가압류를 통해 채권 보전을 우선 확보했습니다. 이를 통해 임대인이 재산을 은닉하거나 처분하는 것을 방지할 수 있었습니다."
        },
        {
            step: 2,
            title: "임대인 재산 조사",
            description: "법원을 통한 재산조회와 금융기관 조회를 병행하여 임대인의 실질적인 재산 현황을 파악했습니다. 숨겨진 부동산과 예금계좌를 발견하여 회수 가능성을 높였습니다."
        },
        {
            step: 3,
            title: "병행 소송 전략",
            description: "보증금 반환 소송과 동시에 임대차보증금 반환보증보험 및 전세금 안전장치를 활용한 다각적 접근을 통해 회수 확률을 극대화했습니다."
        }
    ];

    const outcomes = [
        "보증금 4억원 전액 회수 완료",
        "지연이자 및 손해배상금 추가 확보",
        "3개월 내 판결 확정 및 집행 완료",
        "소송비용 및 변호사 수임료 상대방 부담"
    ];

    // Clear existing to avoid duplicates if re-run
    await prisma.successCase.deleteMany();

    // 1. The original "old" case (Already defined above as successCase)
    // We will clean up and use an array logic for all cases now.

    const allCases = [
        {
            title: "전세금 4억 전액 회수 (3개월 소요)",
            category: "부동산 법률",
            summary: "전세보증금을 돌려받지 못한 의뢰인을 소송을 통해 전액 회수에 성공한 사례입니다. 체계적인 법적 대응과 신속한 집행을 통해 단기간 내 문제를 해결했습니다.",
            client: "김OO",
            caseType: "전세금 반환 청구",
            amount: "4억원",
            period: "3개월",
            lawyer: "김법무 변호사",
            result: "전액 회수 성공",
            background: "의뢰인은 서울시 강남구 소재 아파트에 전세금 4억원으로 거주하던 중...",
            strategy: JSON.stringify(strategy),
            outcomes: JSON.stringify(outcomes),
            imageUrl: "/assets/images/success/case1.jpg"
        },
        // RESTORED CASE 2
        {
            title: "전세보증금 반환 소송 승소",
            category: "부동산 법률",
            summary: "임대인의 부당한 보증금 반환 거부에 맞서 소송을 통해 100% 회수하고 지연이자까지 받아낸 사례",
            client: "이OO",
            caseType: "보증금 반환",
            amount: "2억 5천만원",
            period: "4개월",
            lawyer: "박전세 변호사",
            result: "승소 및 집행 완료",
            imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/fee7fea59e-34d4fd1500c79fe7ded2.png"
        },
        // RESTORED CASE 3
        {
            title: "개인회생 인가 결정 (탕감율 65%)",
            category: "개인회생/파산",
            summary: "감당할 수 없는 채무로 고통받던 의뢰인의 채무를 65% 탕감받고 새로운 출발을 도운 사례",
            client: "박OO",
            caseType: "개인회생",
            amount: "1억 2천만원",
            period: "6개월",
            lawyer: "최회생 변호사",
            result: "인가 결정",
            imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/4311026046-60829871032d847849e7.png"
        },
        // RESTORED CASE 4
        {
            title: "상가 임대차 권리금 회수",
            category: "부동산 법률",
            summary: "임대인의 방해로 회수하지 못할 뻔한 상가 권리금을 법적 대응을 통해 받아낸 사례",
            client: "정OO",
            caseType: "권리금 소송",
            amount: "8천만원",
            period: "5개월",
            lawyer: "김상가 변호사",
            result: "조정 성립",
            imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/1959725514-0466395567b57b960a56.png"
        },
        // RESTORED CASE 5
        {
            title: "불법 추심 대응 및 채무 부존재",
            category: "채무/금융",
            summary: "불법적인 추심 행위를 중단시키고 소멸시효가 완성된 채무임을 입증하여 채무 고통에서 벗어난 사례",
            client: "최OO",
            caseType: "채무부존재확인",
            amount: "5천만원",
            period: "3개월",
            lawyer: "이금융 변호사",
            result: "승소",
            imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2b36340410-e7f017ad65330a10813d.png"
        },
        // RESTORED CASE 6
        {
            title: "상속 분쟁 해결 사례",
            category: "기타 법률",
            summary: "복잡한 상속 분쟁을 법적 중재로 원만히 해결하고 가족 간 화해에 성공한 사례",
            client: "강OO",
            caseType: "상속 재산 분할",
            amount: "15억원",
            period: "8개월",
            lawyer: "한상속 변호사",
            result: "조정 성립",
            imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/0ed1c78dc7-c96b0e2f302cb3b67539.png"
        },
        // RESTORED CASE 7
        {
            title: "임대차 계약 분쟁 해결",
            category: "부동산 법률",
            summary: "계약 갱신 거절 상황에서 임차인의 권리를 지켜낸 임대차 분쟁 해결 사례",
            client: "조OO",
            caseType: "계약 갱신 청구",
            amount: "전세권 방어",
            period: "2개월",
            lawyer: "이임대 법무사",
            result: "갱신 성공",
            imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/fee7fea59e-34d4fd1500c79fe7ded2.png"
        }
    ];

    console.log(`Seeding ${allCases.length} cases...`);

    for (const c of allCases) {
        await prisma.successCase.create({
            data: {
                title: c.title,
                category: c.category,
                summary: c.summary,
                client: c.client,
                caseType: c.caseType,
                amount: c.amount,
                period: c.period,
                lawyer: c.lawyer,
                result: c.result,
                imageUrl: c.imageUrl,
                // Defaulting detail fields only if missing
                background: (c as any).background || "상세 내용 업데이트 예정",
                strategy: (c as any).strategy || JSON.stringify([{ step: 1, title: "법률 검토", description: "초기 상담 및 법리 분석" }]),
                outcomes: (c as any).outcomes || JSON.stringify(["성공적인 해결"])
            }
        });
    }

    console.log('Created Success Case with ID:', successCase.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
