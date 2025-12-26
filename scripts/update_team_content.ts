
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NAMES = [
    '김서윤', '박준혁', '이민호', '최은지'
];

async function main() {
    console.log('🔄 Standardizing Content Authors...');

    // 1. Success Cases
    const cases = await prisma.successCase.findMany();
    console.log(`Updating ${cases.length} Success Cases...`);
    for (let i = 0; i < cases.length; i++) {
        const c = cases[i];
        // Lawyers only? (Kim, Park)
        const name = NAMES[i % 2];
        await prisma.successCase.update({
            where: { id: c.id },
            data: {
                lawyer: name,
                lawyerImageUrl: `/assets/images/profiles/profile_0${i % 2 === 0 ? '5' : '1'}.png` // Mock map
            }
        });
    }

    // 2. Blog Posts
    const posts = await prisma.blogPost.findMany();
    console.log(`Updating ${posts.length} Blog Posts...`);
    for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        const name = NAMES[i % 4];
        await prisma.blogPost.update({
            where: { id: p.id },
            data: {
                author: name
            }
        });
    }

    // 3. active Cases (Case model)
    const activeCases = await prisma.case.findMany();
    console.log(`Updating ${activeCases.length} Active Cases...`);
    for (let i = 0; i < activeCases.length; i++) {
        const ac = activeCases[i];
        const name = NAMES[i % 4];
        await prisma.case.update({
            where: { id: ac.id },
            data: {
                lawyerInCharge: name
            }
        });
    }

    console.log('✅ Content Strings Standardized.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
