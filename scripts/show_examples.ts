
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- Success Case Examples ---");

    const categories = ['부동산/임대차', '금융/사기', '개인회생/파산', '형사/기타'];

    for (const cat of categories) {
        // Find one case
        const c = await prisma.successCase.findFirst({
            where: { category: cat },
            skip: Math.floor(Math.random() * 5) // Random skip to pick variation
        });

        if (c) {
            console.log(`\n[${cat}]`);
            console.log(`Title: ${c.title}`);
            console.log(`Summary: ${c.summary}`);
            console.log(`Amount: ${c.amount}`);
            console.log(`Result: ${c.result}`);
            console.log(`Strategies:`);
            const strats = JSON.parse(c.strategy || '[]') as any[];
            strats.forEach((s: any, idx: number) => {
                console.log(`  ${idx + 1}. ${s.title}: ${s.description}`);
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
