
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- VERIFYING IMAGE DATA ---');

    console.log('\n1. TeamMember Table:');
    const members = await prisma.teamMember.findMany();
    for (const m of members) {
        console.log(`[${m.name}] Image: ${m.imageUrl}`);
    }

    console.log('\n2. SuccessCase Table (Sample 5):');
    const cases = await prisma.successCase.findMany({ take: 5, include: { teamMember: true } });
    for (const c of cases) {
        console.log(`Case: ${c.title.substring(0, 20)}...`);
        console.log(`  - Legacy Lawyer: ${c.lawyer}`);
        console.log(`  - Legacy Image:  ${c.lawyerImageUrl}`);
        console.log(`  - Rel. Member:   ${c.teamMember?.name}`);
        console.log(`  - Rel. Image:    ${c.teamMember?.imageUrl}`);

        if (c.lawyerImageUrl !== c.teamMember?.imageUrl) {
            console.log('  WARNING: Legacy Image URL mismatch with Relation Image URL');
        }
    }

    console.log('\n3. BlogPost Table (Sample 5):');
    const blogs = await prisma.blogPost.findMany({ take: 5, include: { authorMember: true } });
    for (const b of blogs) {
        console.log(`Blog: ${b.title.substring(0, 20)}...`);
        console.log(`  - Legacy Author: ${b.author}`);
        console.log(`  - Rel. Member:   ${b.authorMember?.name}`);
        console.log(`  - Rel. Image:    ${b.authorMember?.imageUrl}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
