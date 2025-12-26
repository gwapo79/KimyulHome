
import { PrismaClient } from '@prisma/client';
import { REAL_ESTATE_DATA, FINANCIAL_DATA, REHAB_DATA, CRIMINAL_DATA, SuccessCaseData } from './seed-success-80-strict';
import { BLOG_POSTS, generateBulkData } from './seed_blog_massive';

const prisma = new PrismaClient();

// --- FAQ DATA (Augmented to 15) ---
const BASE_FAQS = [
    {
        question: "수임료 분납이 가능한가요?",
        answer: "네, 의뢰인의 경제적 사정을 고려하여 최대 3~6개월까지 분납이 가능합니다. 신용카드 무이자 할부도 지원하고 있습니다.",
        category: "비용",
        order: 1
    },
    {
        question: "지방에 사는데 방문하지 않고 처리가 가능한가요?",
        answer: "네, 가능합니다. 전자소송 시스템을 통해 전국 어느 법원이든 동일하게 진행됩니다. 카카오톡과 전화로 소통하며 완벽하게 처리해 드립니다.",
        category: "절차",
        order: 2
    },
    {
        question: "상담 기록이 남아서 불이익을 당하나요?",
        answer: "절대 그렇지 않습니다. 변호사법상 비밀유지 의무가 철저하게 지켜지며, 상담 기록은 외부에 유출되지 않습니다. 안심하셔도 됩니다.",
        category: "비밀보장",
        order: 3
    },
    {
        question: "소송 기간은 보통 얼마나 걸리나요?",
        answer: "사건의 난이도에 따라 다르지만, 일반적으로 지급명령은 1개월, 민사 1심은 6개월 정도 소요됩니다. 최대한 신속하게 끝내도록 노력합니다.",
        category: "절차",
        order: 4
    },
    {
        question: "패소하면 상대방 변호사 비용도 물어줘야 하나요?",
        answer: "원칙적으로는 그렇습니다. 하지만 승소 가능성을 면밀히 검토하여 무리한 소송은 권하지 않습니다. 부분 승소 시에는 비율에 따라 분담합니다.",
        category: "비용",
        order: 5
    },
    {
        question: "주말이나 공휴일에도 상담이 가능한가요?",
        answer: "네, 사전 예약제로 365일 24시간 긴급 상담을 운영하고 있습니다. 홈페이지 예약 메뉴를 이용해 주세요.",
        category: "운영",
        order: 6
    },
    {
        question: "개인회생 신청하면 회사에서 알게 되나요?",
        answer: "법원에서 회사로 연락하지 않으며, 우편물도 대리인 사무실로 송달받으므로 회사나 가족이 알 수 없습니다.",
        category: "회생",
        order: 7
    },
    {
        question: "증거가 없는데 소송이 가능할까요?",
        answer: "직접적인 물증이 없더라도 정황 증거, 증인 진술, 사실 조회를 통해 입증이 가능할 수 있습니다. 포기하지 말고 전문가 진단을 받아보세요.",
        category: "증거",
        order: 8
    },
    // New FAQs to reach 15
    { question: "이혼 소송 시 양육비 산정 기준은 무엇인가요?", answer: "서울가정법원 양육비 산정 기준표를 따르며, 부모의 합산 소득과 자녀의 나이를 고려합니다.", category: "가사", order: 9 },
    { question: "형사 고소를 당했는데 경찰 조사 시 변호사 동석이 필수인가요?", answer: "필수는 아니지만, 초기 진술이 재판 결과를 좌우하므로 동석을 강력히 권장합니다.", category: "형사", order: 10 },
    { question: "내용증명은 어떤 법적 효력이 있나요?", answer: "그 자체로 강제력은 없으나, 시효 중단과 의사 표시의 명확한 증거로 활용됩니다.", category: "민사", order: 11 },
    { question: "가압류와 가처분의 차이는 무엇인가요?", answer: "가압류는 금전 채권을 위해 재산을 묶는 것이고, 가처분은 권리 관계를 임시로 정하거나 다툼의 대상을 묶는 것입니다.", category: "용어", order: 12 },
    { question: "상속 포기와 한정승인의 차이는?", answer: "상속 포기는 빚과 재산 모두 포기하는 것이고, 한정승인은 받은 재산 범위 내에서만 빚을 갚는 것입니다.", category: "상속", order: 13 },
    { question: "무료 법률 구조 대상자는 누구인가요?", answer: "기초생활수급자, 장애인, 국가유공자 등 사회적 약자는 대한법률구조공단을 통해 무료 지원이 가능합니다.", category: "공익", order: 14 },
    { question: "변호사 선임료 외에 추가 비용이 드나요?", answer: "인지대, 송달료 등 법원 납부 비용은 별도이며, 이는 실비로 정산됩니다.", category: "비용", order: 15 },
];

// --- Review Generation Helpers ---
const SUCCESS_IMAGES = [
    '/assets/images/success_cases/realestate.png', '/assets/images/success_cases/civil.png', '/assets/images/success_cases/family.png',
    '/assets/images/success_cases/corporate.png', '/assets/images/success_cases/criminal.png'
];
const REVIEW_IMAGES = [
    '/assets/images/profiles/profile_01.png', '/assets/images/profiles/profile_02.png', '/assets/images/profiles/profile_03.png',
    '/assets/images/profiles/profile_04.png', '/assets/images/profiles/profile_05.png', '/assets/images/profiles/profile_06.png',
    '/assets/images/profiles/profile_07_v2.png', '/assets/images/profiles/profile_08_v2.png', '/assets/images/profiles/profile_09_v2.png'
];
const LAWYERS = ['김법무 변호사', '이공정 변호사', '박신뢰 변호사', '최승소 변호사', '정해결 변호사'];
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
    console.log("🔥 STARTING FULL DATABASE RESET & SEEDING 🔥");

    // 1. DELETE ALL DATA
    console.log("🗑️  Deleting existing data...");
    try {
        await prisma.review.deleteMany({});
        await prisma.successCase.deleteMany({});
        await prisma.blogPost.deleteMany({});
        await prisma.fAQ.deleteMany({});
        console.log("✅ Data cleared locally (and on Supabase if connected).");
    } catch (e) {
        console.error("Warning during delete (tables might not exist yet):", e);
    }

    // 2. SEED BLOGS (100 Items)
    console.log("📝 Seeding 100 Blog Posts...");
    try {
        const blogData = [...BLOG_POSTS, ...generateBulkData()];
        while (blogData.length < 100) {
            // Ensure no ID is carried over
            const { id, ...rest } = blogData[0];
            blogData.push({ ...rest, title: rest.title + " (Copy " + blogData.length + ")" });
        }
        const finalBlogs = blogData.slice(0, 100).map(p => {
            const { id, ...rest } = p as any; // Strip ID from all
            return {
                ...rest,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        await prisma.blogPost.createMany({ data: finalBlogs, skipDuplicates: true });
        console.log(`✅ Seeded ${finalBlogs.length} Blog Posts.`);
    } catch (e: any) {
        console.error("❌ Failed to seed Blog Posts:", e.message || e);
    }

    // 3. SEED SUCCESS CASES (80 Items)
    console.log("🏆 Seeding 80 Success Cases...");
    const ALL_CASES = [
        ...REAL_ESTATE_DATA.map(c => ({ ...c, category: '부동산/임대차' })),
        ...FINANCIAL_DATA.map(c => ({ ...c, category: '금융/사기' })),
        ...REHAB_DATA.map(c => ({ ...c, category: '개인회생/파산' })),
        ...CRIMINAL_DATA.map(c => ({ ...c, category: '형사/기타' }))
    ];

    let caseCount = 0;
    for (const c of ALL_CASES) {
        const img = SUCCESS_IMAGES[caseCount % SUCCESS_IMAGES.length];

        await prisma.successCase.create({
            data: {
                title: c.title,
                category: c.category,
                caseType: c.category.split('/')[0],
                summary: c.summary,
                background: c.background,
                strategy: c.strategy,
                result: c.result,
                amount: c.amount || null,
                period: c.period || "3개월",
                lawyer: getRandom(LAWYERS),
                lawyerComment: c.lawyerComment,
                imageUrl: img,
                outcomes: JSON.stringify(["승소", "만족", "해결"]),
            }
        });
        caseCount++;
    }
    console.log(`✅ Seeded ${caseCount} Success Cases.`);

    // 4. SEED REVIEWS (80 Items - matched to cases count)
    console.log("⭐ Seeding 80 Reviews...");
    const generatedReviews = [];
    for (let i = 0; i < 80; i++) {
        const revImg = REVIEW_IMAGES[i % REVIEW_IMAGES.length];
        const category = ['민사', '형사', '가사', '부동산', '기업'][i % 5];
        generatedReviews.push({
            author: `의뢰인 ${String.fromCharCode(65 + (i % 26))}${i}`,
            role: '일반 의뢰인',
            category: category,
            content: `변호사님 덕분에 ${category} 사건이 원활하게 해결되었습니다. ${i % 2 === 0 ? '정말 감사합니다.' : '새로운 희망을 얻었습니다.'}`,
            rating: 5,
            date: new Date().toISOString(),
            authorImageUrl: revImg
        });
    }
    await prisma.review.createMany({ data: generatedReviews });
    console.log(`✅ Seeded ${generatedReviews.length} Reviews.`);

    // 5. SEED FAQS (15 Items)
    console.log("❓ Seeding 15 FAQs...");
    await prisma.fAQ.createMany({ data: BASE_FAQS });
    console.log(`✅ Seeded ${BASE_FAQS.length} FAQs.`);

    console.log("🎉 DATABASE SYNC COMPLETE! (Connected to Supabase)");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
