
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = ['부동산법률', '금융솔루션', '개인회생', '기타 법률'];
const names = ['김현', '이호', '박준', '정민', '최성', '강인', '조영', '윤서', '장우', '임수', '한재', '오경', '서윤', '권혁', '황진', '송미', '전호', '고은', '문기', '양철'];
const emotions = ['감사합니다', '정말 다행입니다', '큰 도움이 되었습니다', '추천합니다', '속이 시원하네요', '친절해서 좋았어요', '전문성이 느껴집니다', '믿고 맡길 수 있었습니다', '빠른 해결 감사합니다', '기대 이상이었습니다'];
const comments_short = [
    "막막했는데 큰 도움이 되었습니다.",
    "친절하고 상세한 상담 감사드립니다.",
    "덕분에 잘 해결되었습니다.",
    "전문가님의 조언이 결정적이었습니다.",
    "신속하게 처리해주셔서 감사합니다.",
    "처음엔 걱정했는데 결과가 너무 좋네요.",
    "주변에 적극 추천하고 싶습니다.",
    "비용이 아깝지 않은 서비스였습니다.",
    "다시 문제가 생기면 꼭 찾겠습니다.",
    "정말 훌륭한 법률 서비스입니다."
];
const comments_long = [
    "처음 겪는 일이라 어떻게 해야 할지 몰라 당황스러웠는데, 변호사님께서 차근차근 설명해주시고 제 입장에서 최선의 방안을 찾아주셨습니다. 덕분에 생각보다 훨씬 좋은 결과로 마무리할 수 있었네요. 정말 감사합니다.",
    "복잡한 법률 용어 때문에 이해하기 힘들었는데, 눈높이에 맞춰 쉽게 설명해주셔서 좋았습니다. 진행 과정도 투명하게 공유해주시고 불안하지 않게 잘 이끌어주셨어요. 결과도 만족스럽습니다.",
    "다른 곳에서도 상담을 받아봤지만 여기만큼 진정성 있게 상담해주는 곳은 없었습니다. 단순히 사건을 수임하려는 게 아니라 정말 제 문제를 해결해주시려는 마음이 느껴졌습니다. 적극 추천합니다.",
    "금전적인 문제로 마음고생이 심했는데, 현실적인 솔루션을 제시해주셔서 희망을 가질 수 있었습니다. 혼자 끙끙 앓던 시간이 아까울 정도네요. 진작 찾아올 걸 그랬습니다. 감사합니다.",
    "상담부터 사건 종결까지 빈틈없이 챙겨주시는 모습에 감동받았습니다. 사소한 질문에도 성실하게 답변해주시고, 의뢰인을 배려해주시는 태도가 인상 깊었습니다. 덕분에 마음 편히 일상으로 돌아갈 수 있게 되었습니다."
];

function getRandomItem(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    console.log('Start seeding reviews...');

    const reviews = [];

    // Generate 100 reviews
    for (let i = 0; i < 100; i++) {
        // 10-15% chance of 4 stars, else 5 stars
        const isFiveStar = Math.random() > 0.15;
        const rating = isFiveStar ? 5 : 4;

        // Mix of short and long comments
        const isLongComment = Math.random() > 0.3; // 70% long, 30% short for better content
        const baseContent = isLongComment ? getRandomItem(comments_long) : getRandomItem(comments_short);

        // Add some random emotion text to make it unique
        const uniqueContent = `${baseContent} ${getRandomItem(emotions)}`;

        reviews.push({
            author: getRandomItem(names) + (Math.random() > 0.5 ? ' 님' : ''), // Randomly add polite suffix
            rating: rating,
            content: uniqueContent,
            category: getRandomItem(categories),
            createdAt: getRandomDate(new Date(2024, 0, 1), new Date()), // Random date since Jan 2024
        });
    }

    // Batch insert
    await prisma.review.createMany({
        data: reviews,
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
