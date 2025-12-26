
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_REVIEWS = [
    {
        name: '김철수',
        category: '부동산 분쟁',
        content: '전세 사기로 막막했는데, 변호사님의 꼼꼼한 권리 분석 덕분에 보증금을 무사히 돌려받을 수 있었습니다. 정말 감사합니다.',
        rating: 5
    },
    {
        name: '이영희',
        category: '채무 조정',
        content: '개인회생 절차가 너무 복잡해서 포기하려다가 상담을 받았는데, 친절하게 설명해주시고 기각 없이 인가결정까지 받았습니다.',
        rating: 5
    },
    {
        name: '박민준',
        category: '부동산 분쟁',
        content: '상가 권리금 회수 문제로 건물주와 갈등이 심했는데, 내용증명 한 번으로 상황이 정리되었습니다. 전문가의 도움은 역시 다르네요.',
        rating: 5
    },
    {
        name: '최지우',
        category: '형사 소송',
        content: '억울하게 성범죄 무고를 당해 인생이 끝난 것 같았는데, CCTV 증거 확보와 치밀한 변론으로 무혐의 처분을 받아냈습니다. 생명의 은인입니다.',
        rating: 5
    },
    {
        name: '정우성',
        category: '채무 조정',
        content: '불법 추심 때문에 하루하루가 지옥 같았는데, 채무자 대리인 제도를 통해 추심 전화를 막아주셔서 이제야 숨 좀 쉬고 삽니다.',
        rating: 5
    },
    {
        name: '강수진',
        category: '이혼 소송',
        content: '남편의 외도로 인한 이혼 소송에서 위자료와 재산분할 모두 만족스러운 결과를 얻었습니다. 아이 양육권도 지켜주셔서 감사합니다.',
        rating: 5
    }
];

async function main() {
    console.log("Updating reviews with realistic data...");

    // Get existing reviews
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6
    });

    if (reviews.length === 0) {
        console.log("No reviews found to update.");
        return;
    }

    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        // Cycle through mock data if more reviews than data
        const newData = REAL_REVIEWS[i % REAL_REVIEWS.length];

        await prisma.review.update({
            where: { id: review.id },
            data: {
                author: newData.name,
                content: newData.content,
                category: newData.category,
                rating: newData.rating
            }
        });
        console.log(`Updated Review ${review.id} -> ${newData.name}: "${newData.content.substring(0, 10)}..."`);
    }

    console.log("Update Complete.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
