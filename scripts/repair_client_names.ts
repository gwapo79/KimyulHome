
import { prisma } from '@/lib/prisma';

const NAMES = [
    "김철수", "이영희", "박민수", "최준호", "정수진", "강현우", "조민경", "윤서연", "장동현", "임지훈",
    "한소희", "오상우", "서지원", "신동엽", "권유리", "황광희", "안영미", "송지효", "전소민", "양세찬"
];

async function repairClients() {
    const cases = await prisma.successCase.findMany({
        where: { client: null }
    });

    console.log(`Found ${cases.length} cases with null client.`);

    for (const c of cases) {
        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        await prisma.successCase.update({
            where: { id: c.id },
            data: { client: randomName }
        });
        console.log(`Updated case ${c.id}: ${randomName}`);
    }
}

repairClients()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
