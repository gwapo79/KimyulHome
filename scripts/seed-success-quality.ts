
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Image Asset Pools (Valid paths verified from filesystem)
const SUCCESS_IMAGES = [
    '/assets/images/success_cases/realestate.png',
    '/assets/images/success_cases/civil.png',
    '/assets/images/success_cases/family.png',
    '/assets/images/success_cases/corporate.png',
    '/assets/images/success_cases/criminal.png',
    '/assets/images/success_cases/realestate_apt.png',
    '/assets/images/success_cases/civil_court.png'
];

const REVIEW_IMAGES = [
    '/assets/images/profiles/profile_01.png',
    '/assets/images/profiles/profile_02.png',
    '/assets/images/profiles/profile_03.png',
    '/assets/images/profiles/profile_04.png',
    '/assets/images/profiles/profile_05.png',
    '/assets/images/profiles/profile_06.png',
    '/assets/images/profiles/profile_07_v2.png',
    '/assets/images/profiles/profile_08_v2.png',
    '/assets/images/profiles/profile_09_v2.png'
];

const LAWYERS = ['김법무 변호사', '이공정 변호사', '박신뢰 변호사', '최승소 변호사', '정해결 변호사'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomSubset = (arr: any[], count: number) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// --- DATA POOLS ---

// 1. REAL ESTATE POOL
const REAL_ESTATE_POOL = {
    category: '부동산/임대차',
    titles: [
        '전세 사기 피해 보증금 전액 회수 승소', '임대인의 부당한 계약 해지 방어 성공', '상가 권리금 회수 방해 손해배상 청구 승소',
        '명도 소송을 통한 불법 점유자 퇴거 완료', '공인중개사 중개 과실 손해배상 책임 인정', '재개발 조합 현금청산금 증액 성공',
        '불법 건축물 이행강제금 부과 처분 취소', '부동산 매매계약 해제 및 계약금 배액 배상', '임차권 등기 명령 신청 인용 결정',
        '분양권 전매 사기 피해 원상회복 승소'
    ],
    results: ['승소', '전액 회수', '조정 성립', '청구 인용', '방어 성공'],
    strategies: [
        { title: "임대인 재산 가압류", description: "소송 제기 전 임대인의 실거주 자택 및 예금 채권을 가압류하여 심리적 압박과 집행 권원을 동시에 확보함." },
        { title: "금융 거래 내역 정밀 분석", description: "임대인의 자금 흐름을 추적하여 은닉 재산을 발견하고, 사해행위 취소 소송의 가능성을 고지하여 협상을 유도함." },
        { title: "공인중개사 연대 책임 추궁", description: "중개대상물 확인 설명 의무 위반 사항을 입증하여, 자력이 부족한 임대인 대신 공제 조합을 통한 배상을 이끌어냄." },
        { title: "현장 증거 보전", description: "현장 검증 및 감정 신청을 신속히 진행하여, 건물의 하자 및 점유 현황을 객관적 증거로 남김." },
        { title: "내용증명 발송을 통한 압박", description: "법적 조치를 예고하는 강력한 내용증명을 발송하여 소송 전 합의 가능성을 타진하고 유리한 고지를 선점함." },
        { title: "관련 판례 및 법리 검토", description: "유사 사건의 최신 대법원 판례를 분석하여 의뢰인의 상황에 맞는 최적의 법리적 논리를 구성함." }
    ]
};

// 2. FINANCE POOL
const FINANCE_POOL = {
    category: '금융/사기',
    titles: [
        '리딩방 투자 사기 피해금 집단 소송 승소', '보이스피싱 인출책 혐의 무죄 입증 및 계좌 지급정지 해제', '가상화폐 거래소 투자 사기 형사 고소 및 배상',
        '유사수신 업체 대표 형사 고소 및 피해 변제', '주식 투자 리딩방 환불 거부 대응 성공', '대여금 반환 청구 소송 승소 및 강제 집행',
        '물품 대금 미지급 민사 소송 승소', '보험금 지급 거절 대응 승소', '부당이득 반환 청구 소송 승소', '채무부존재 확인 소송 승소'
    ],
    results: ['승소', '피해 회복', '배상 판결', '무죄', '지급 판결'],
    strategies: [
        { title: "계좌 추적 및 지급 정지", description: "사기 범죄 이용 계좌를 즉시 특정하여 지급 정지를 신청하고, 피해금 인출을 막아 회수 가능성을 높임." },
        { title: "디지털 포렌식 증거 확보", description: "삭제된 카카오톡 대화 내용 및 통화 녹음을 복구하여, 기망 행위와 고의성을 입증하는 결정적 증거로 활용함." },
        { title: "형사 고소와 민사 소송 병행", description: "형사 고소를 통해 가해자를 압박하고, 배상 명령 신청을 병행하여 신속한 피해 구제를 도모함." },
        { title: "단순 가담 입증", description: "의뢰인이 범죄 조직에 이용당한 사실과 미필적 고의가 없었음을 입증하여 형사 처벌을 면하고 금융 거래 제한을 풂." },
        { title: "금융감독원 민원 제기", description: "금융 기관의 감독 소홀을 지적하는 민원을 제기하여 협상 테이블을 마련하고 합의를 이끌어냄." },
        { title: "은닉 재산 강제 집행", description: "판결 확정 후 신용 조사를 통해 발견된 채무자의 은닉 재산에 대해 즉각적인 압류 및 추심을 진행함." }
    ]
};

// 3. REHAB POOL
const REHAB_POOL = {
    category: '개인회생/파산',
    titles: [
        '주식 및 코인 투자 실패 20대 개인회생 인가', '자영업 폐업 후 과도한 빚 개인파산 면책', '도박 채무 개인회생 금지명령 및 개시결정',
        '보증 채무 폭탄 개인회생을 통해 해방', '소득 불분명 프리랜서 개인회생 인가 성공', '과소비 및 카드 돌려막기 채무 탕감 결정',
        '배우자 재산 반영 없이 개인회생 인가', '고령자 개인파산 면책 결정', '월 변제금 대폭 하향 조정 성공', '채권자 이의신청 기각 및 회생 인가'
    ],
    results: ['인가 결정', '면책 결정', '금지명령', '개시 결정', '탕감 확정'],
    strategies: [
        { title: "청산가치 재산정", description: "배우자 명의 재산의 기여도를 적극 소명하여 청산가치 반영 비율을 낮추고, 월 변제금을 최소화함." },
        { title: "도박/투기성 채무 소명", description: "최근 발생한 도박 채무에 대해 진심 어린 반성문과 재발 방지 대책을 제출하여 법원의 선처를 구함." },
        { title: "추가 생계비 인정", description: "부양가족의 병원비 및 주거비 등을 상세히 소명하여, 최저생계비 이상의 추가 생계비를 인정받아 변제 수행 가능성을 높임." },
        { title: "금지명령 신속 신청", description: "사건 접수와 동시에 금지명령을 신청하여, 채권자의 독촉과 추심 행위를 즉시 중단시키고 의뢰인의 심리적 안정을 확보함." },
        { title: "사용처 상세 소명", description: "최근 대출금의 사용처를 1원 단위까지 꼼꼼하게 소명하여, 재산 은닉 의심을 해소하고 성실 불운한 채무자임을 입증함." },
        { title: "파산 관재인 대응", description: "파산 관재인의 보정 권고에 신속하고 정확하게 대응하여, 불필요한 절차 지연을 막고 면책 결정을 앞당김." }
    ]
};

// 4. CRIMINAL POOL (NO AMOUNTS)
const CRIMINAL_POOL = {
    category: '형사/기타',
    titles: [
        '강제추행 혐의 CCTV 분석으로 무혐의 처분', '음주운전 2진 아웃 집행유예 선처', '마약류 투약 초범 기소유예 처분',
        '특수상해 쌍방폭행 정당방위 인정 무혐의', '보이스피싱 전달책 사기 방조 무죄 선고', '카메라등이용촬영죄 기소유예 선처',
        '명예훼손 및 모욕죄 고소 사건 불기소', '업무상 횡령 혐의 무죄 입증', '주거침입 혐의 벌금형 선처', '데이트 폭력 접근금지 가처분 방어'
    ],
    results: ['혐의없음', '기소유예', '집행유예', '무죄', '벌금형'],
    strategies: [
        { title: "증거의 신빙성 탄핵", description: "피해자 진술의 모순점을 치밀하게 파고들고, 객관적 증거(CCTV, 통화내역)와 배치되는 부분을 부각하여 진술의 증거 능력을 탄핵함." },
        { title: "법리적 무죄 주장", description: "해당 행위가 법률상 범죄 구성 요건을 충족하지 않음을 치밀한 법리 검토를 통해 논증하여 무죄를 이끌어냄." },
        { title: "양형 자료의 풍부한 제출", description: "반성문, 탄원서, 봉사활동 내역, 재범 방지 교육 이수증 등 유리한 양형 자료를 최대한 수집하여 법원에 제출함." },
        { title: "피해자와의 원만한 합의", description: "변호인이 중재자로 나서 피해자의 감정을 어루만지고 진정성 있는 사과를 전달하여, 처벌 불원서를 받아냄." },
        { title: "수사 단계 동석 조력", description: "경찰 및 검찰 조사 시 변호인이 동석하여, 불리한 유도 신문을 차단하고 방어권을 적극적으로 행사함." },
        { title: "디지털 포렌식 방어", description: "수사 기관의 포렌식 절차에 참관하여 위법 수집 증거를 배제하고, 의뢰인에게 유리한 증거만을 선별적으로 제출함." }
    ]
};


async function main() {
    console.log("--- Starting High Quality Seed ---");

    // Clean up
    await prisma.review.deleteMany({});
    await prisma.successCase.deleteMany({});
    console.log("Tables Truncated.");

    const CASES_DATA = [];

    const generateCategoryCases = (pool: any, targetCount: number, hasAmount: boolean) => {
        for (let i = 0; i < targetCount; i++) {
            const titleBase = pool.titles[i % pool.titles.length];
            // No serial numbers in title, create slight variation if needed by picking from a larger random pool or just repeating nicely.
            // User requested "No serial numbers". So titles need to be robust. 
            // We have ~10 titles per category. For 20 cases, we will repeat titles. 
            // To make them "unique enough", we can append " 승소사례" or nothing randomly, or ensure pool is larger.
            // Let's rely on the strategy mix to make them unique records, titles can repeat slightly or I can swap words.
            // Actually, let's just use the title list. If 20 cases and 10 titles, each title appears twice. 
            // That is acceptable if the strategies are different? Or I can create VARIATIONS.

            const variation = i >= 10 ? " (승소 사례)" : "";
            const title = `${titleBase}${variation}`;

            let amount = null;
            if (hasAmount) {
                const val = getRandomInt(1000, 50000);
                amount = val >= 10000 ? `${Math.floor(val / 10000)}억 ${val % 10000}만원` : `${val.toLocaleString()}만원`;
            }

            const result = getRandom(pool.results);
            const strategies = getRandomSubset(pool.strategies, 3); // Pick 3 unique strategies
            const img = SUCCESS_IMAGES[i % SUCCESS_IMAGES.length];
            const lawyer = getRandom(LAWYERS);

            CASES_DATA.push({
                title,
                category: pool.category,
                caseType: pool.category.split('/')[0],
                summary: `${pool.category} 분야 ${titleBase} 해결.`, // Concise summary
                background: "의뢰인은 이 사건으로 인해 심각한 정신적 스트레스와 경제적 위기에 처해 있었으나, 법무법인 김율의 조력을 받아 해결의 실마리를 찾았습니다.",
                strategy: JSON.stringify(strategies),
                outcomes: JSON.stringify([result, "의뢰인 일상 회복", "신속한 사건 종결"]),
                result,
                amount,
                period: `${getRandomInt(2, 10)}개월`,
                lawyer,
                imageUrl: img
            });
        }
    };

    generateCategoryCases(REAL_ESTATE_POOL, 20, true);
    generateCategoryCases(FINANCE_POOL, 20, true);
    generateCategoryCases(REHAB_POOL, 20, true);
    generateCategoryCases(CRIMINAL_POOL, 20, false);

    console.log(`Generated ${CASES_DATA.length} cases.`);

    for (const c of CASES_DATA) {
        // Create Case
        const created = await prisma.successCase.create({ data: c });

        // Create matching Review
        // "Review content should match case" -> Generic positive feedback referencing the result
        const reviewContent = `처음에는 ${c.caseType} 문제로 정말 막막했는데, ${c.lawyer}님 덕분에 ${c.result}라는 결과를 얻을 수 있었습니다. 특히 ${JSON.parse(c.strategy)[0].title} 전략이 주효했던 것 같습니다.`;
        const revImg = REVIEW_IMAGES[getRandomInt(0, REVIEW_IMAGES.length - 1)];

        await prisma.review.create({
            data: {
                author: `의뢰인 ${String.fromCharCode(65 + Math.random() * 26).substring(0, 1)}**`,
                role: '의뢰인',
                content: reviewContent,
                rating: 5,
                category: c.category,
                date: new Date().toISOString().split('T')[0],
                authorImageUrl: revImg
            }
        });
    }

    console.log("Seeding Complete. Quality upgraded.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
