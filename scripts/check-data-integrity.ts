
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting Data Integrity Audit ---");
    const cases = await prisma.successCase.findMany();

    // Define forbidden/allowed words per category
    const RULES: Record<string, { forbidden: string[] }> = {
        '부동산': { forbidden: ['재산분할', '기소유예', '집행유예', '양육권', '무죄'] },
        '임대차': { forbidden: ['재산분할', '기소유예', '집행유예', '양육권'] },
        '금융': { forbidden: ['기소유예', '집행유예', '양육권'] }, // Finance might mention debt forgiveness, but not criminal terms usually
        '회생': { forbidden: ['기소유예', '집행유예', '양육권', '형사'] },
        // Add more as needed
    };

    let violationCount = 0;

    for (const c of cases) {
        const cat = c.category || '';
        let forbidden: string[] = [];

        // Determine rules for this category
        if (cat.includes('부동산') || cat.includes('임대차')) {
            forbidden = RULES['부동산'].forbidden;
        } else if (cat.includes('금융')) {
            forbidden = RULES['금융'].forbidden;
        } else if (cat.includes('회생') || cat.includes('파산')) {
            forbidden = RULES['회생'].forbidden;
        }

        if (forbidden.length > 0) {
            const content = `${c.title} ${c.summary} ${c.background} ${c.strategy} ${c.outcomes}`;
            const foundViolations = forbidden.filter(word => content.includes(word));

            if (foundViolations.length > 0) {
                console.log(`[VIOLATION] ID: ${c.id}`);
                console.log(`Category: ${c.category} | Title: ${c.title}`);
                console.log(`Forbidden words found: ${foundViolations.join(', ')}`);
                console.log('---');
                violationCount++;
            }
        }
    }

    console.log(`Audit Complete. Found ${violationCount} cases with violations.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
