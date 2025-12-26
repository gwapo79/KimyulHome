
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEAM_MEMBERS = [
    {
        name: '김서윤',
        role: '변호사',
        position: '대표변호사',
        specialty: '부동산/상속',
        email: 'seoyun.kim@lawfirm.com',
        description: '지적이고 온화한 이미지의 부동산/상속 전문 변호사입니다.',
        imageUrl: '/assets/images/profiles/kim_seoyun.jpg' // Placeholder path
    },
    {
        name: '박준혁',
        role: '변호사',
        position: '파트너 변호사',
        specialty: '민사/채무조정',
        email: 'junhyeok.park@lawfirm.com',
        description: '날카롭고 신뢰감 있는 민사/채무조정 해결사입니다.',
        imageUrl: '/assets/images/profiles/park_junhyeok.jpg'
    },
    {
        name: '이민호',
        role: '법무사',
        position: '수석 법무사',
        specialty: '등기/행정',
        email: 'minho.lee@lawfirm.com',
        description: '정갈하고 꼼꼼한 등기/행정 전문가입니다.',
        imageUrl: '/assets/images/profiles/lee_minho.jpg'
    },
    {
        name: '최은지',
        role: '법무사',
        position: '법무사',
        specialty: '개인회생/파산',
        email: 'eunji.choi@lawfirm.com',
        description: '친절하고 세심한 개인회생/파산 케어 전문가입니다.',
        imageUrl: '/assets/images/profiles/choi_eunji.jpg'
    }
];

async function main() {
    console.log('🌱 Change Team Members...');

    // 1. Clean up existing (optional, but requested to "unify")
    try {
        // Note: If other tables reference this, deleteMany might fail if logic isn't set to Cascade or SetNull.
        // Since we just created the table, it's empty or safe.
        await prisma.teamMember.deleteMany({});
    } catch (e) {
        console.warn('Cleanup warning (might be empty):', e);
    }

    // 2. Create Members
    const createdMembers = [];
    for (const member of TEAM_MEMBERS) {
        const created = await prisma.teamMember.create({
            data: member
        });
        createdMembers.push(created);
        console.log(`Created: ${created.name} (${created.id})`);
    }

    // 3. Update Existing Content (SuccessCase, BlogPost, Review, FAQ)
    // We will distribute them Round-Robin or by Logic

    // 3.1 SuccessCases
    const successCases = await prisma.successCase.findMany();
    console.log(`Updating ${successCases.length} Success Cases...`);

    for (let i = 0; i < successCases.length; i++) {
        const caseItem = successCases[i];
        // Assign Lawyer A or B (only lawyers handle cases usually?)
        // Let's use A and B for cases primarily.
        const lawyer = createdMembers[i % 2]; // 0 or 1 (Kim or Park)

        await prisma.successCase.update({
            where: { id: caseItem.id },
            data: {
                lawyerId: lawyer.id,
                lawyer: lawyer.name, // Sync legacy field
                lawyerImageUrl: lawyer.imageUrl,
                lawyerComment: caseItem.lawyerComment || `${lawyer.name} 변호사의 코멘트: 의뢰인의 이익을 최우선으로 해결했습니다.`
            }
        });
    }

    // 3.2 BlogPosts
    const blogPosts = await prisma.blogPost.findMany();
    console.log(`Updating ${blogPosts.length} Blog Posts...`);
    for (let i = 0; i < blogPosts.length; i++) {
        const post = blogPosts[i];
        // All 4 can write blogs
        const author = createdMembers[i % 4];
        await prisma.blogPost.update({
            where: { id: post.id },
            data: {
                authorId: author.id,
                author: author.name
            }
        });
    }

    // 3.3 Reviews
    const reviews = await prisma.review.findMany();
    console.log(`Updating ${reviews.length} Reviews...`);
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        // Assign any
        const counselor = createdMembers[i % 4];
        await prisma.review.update({
            where: { id: review.id },
            data: {
                counselorId: counselor.id,
                // Review model doesn't have legacy 'counselorName' string, just relation now.
            }
        });
    }

    // 3.4 FAQs
    const faqs = await prisma.fAQ.findMany();
    console.log(`Updating ${faqs.length} FAQs...`);
    for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        const author = createdMembers[i % 4];
        await prisma.fAQ.update({
            where: { id: faq.id },
            data: {
                authorId: author.id
            }
        });
    }

    // 3.5 ChatRooms (If any exist)
    // Maybe update active ones to Lawyer A or B
    // Skipping for now unless requested.

    console.log('✅ Team Standardization Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
