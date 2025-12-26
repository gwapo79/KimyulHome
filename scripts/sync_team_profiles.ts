
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NEW_TEAM = [
    {
        name: '김율',
        role: '변호사',
        position: '대표변호사',
        specialty: '부동산/상속',
        email: 'yul.kim@lawfirm.com',
        description: '냉철한 판단력과 깊이 있는 법률 지식으로 의뢰인의 권리를 지키는 부동산 전문가입니다.',
        imageUrl: '/images/lawyers/kim-yul.png'
    },
    {
        name: '이서준',
        role: '변호사',
        position: '파트너 변호사',
        specialty: '민사/기업법무',
        email: 'seojun.lee@lawfirm.com',
        description: '스마트한 전략과 친근한 소통으로 복잡한 기업 법무를 명쾌하게 해결합니다.',
        imageUrl: '/images/lawyers/lee-seo-jun.png'
    },
    {
        name: '박선영',
        role: '법무사',
        position: '수석 법무사',
        specialty: '부동산 등기',
        email: 'sunyoung.park@lawfirm.com',
        description: '20년 경력의 꼼꼼함으로 단 하나의 실수도 허용하지 않는 등기 전문가입니다.',
        imageUrl: '/images/lawyers/park-sun-young.png'
    },
    {
        name: '최은아',
        role: '법무사',
        position: '법무사',
        specialty: '개인회생/파산',
        email: 'eunah.choi@lawfirm.com',
        description: '따뜻한 마음과 차별화된 실무 노하우로 의뢰인의 새 출발을 돕습니다.',
        imageUrl: '/images/lawyers/choi-eun-ah.png'
    }
];

async function main() {
    console.log('--- SYNCING TEAM PROFILES ---');

    console.log('1. Cleaning up old team data (optional but safer to just insert new ones and re-link)...');
    // We won't delete to avoid foreign key constraints for now, we will create new ones and re-link.

    const newMemberIds: string[] = [];

    // 2. Create/Update New Team Members
    for (const member of NEW_TEAM) {
        // Upsert based on email to avoid duplicates if re-run
        // Note: 'email' is optional in schema? check schema: email String?
        // If email is not unique in schema, upsert might fail on 'where'. 
        // Let's check if email is unique. Schema says: email String? (not unique)
        // So we use findFirst.

        let dbMember = await prisma.teamMember.findFirst({
            where: { name: member.name }
        });

        if (dbMember) {
            console.log(`Updating existing member: ${member.name}`);
            dbMember = await prisma.teamMember.update({
                where: { id: dbMember.id },
                data: {
                    role: member.role,
                    position: member.position,
                    specialty: member.specialty,
                    description: member.description,
                    imageUrl: member.imageUrl,
                    email: member.email
                }
            });
        } else {
            console.log(`Creating new member: ${member.name}`);
            dbMember = await prisma.teamMember.create({
                data: member
            });
        }
        newMemberIds.push(dbMember.id);
    }

    console.log(`Synced 4 Team Members successfully.`);

    // 3. Re-distribute content to these 4 members
    console.log('Re-linking content to new team members...');

    const successCases = await prisma.successCase.findMany();
    for (let i = 0; i < successCases.length; i++) {
        const memberId = newMemberIds[i % newMemberIds.length];
        const member = NEW_TEAM[i % NEW_TEAM.length];
        await prisma.successCase.update({
            where: { id: successCases[i].id },
            data: {
                lawyerId: memberId,
                lawyer: member.name, // Update legacy string field
                lawyerImageUrl: member.imageUrl // Update legacy string field
            }
        });
    }
    console.log(`Updated ${successCases.length} SuccessCases.`);

    const blogs = await prisma.blogPost.findMany();
    for (let i = 0; i < blogs.length; i++) {
        const memberId = newMemberIds[i % newMemberIds.length];
        const member = NEW_TEAM[i % NEW_TEAM.length];
        await prisma.blogPost.update({
            where: { id: blogs[i].id },
            data: {
                authorId: memberId,
                author: member.name // Legacy
            }
        });
    }
    console.log(`Updated ${blogs.length} BlogPosts.`);

    const reviews = await prisma.review.findMany();
    for (let i = 0; i < reviews.length; i++) {
        const memberId = newMemberIds[i % newMemberIds.length];
        await prisma.review.update({
            where: { id: reviews[i].id },
            data: { counselorId: memberId }
        });
    }
    console.log(`Updated ${reviews.length} Reviews.`);

    // Update FAQs
    const faqs = await prisma.fAQ.findMany();
    for (let i = 0; i < faqs.length; i++) {
        const memberId = newMemberIds[i % newMemberIds.length];
        await prisma.fAQ.update({
            where: { id: faqs[i].id },
            data: { authorId: memberId }
        });
    }
    console.log(`Updated ${faqs.length} FAQs.`);

    console.log('--- SYNC COMPLETE ---');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
