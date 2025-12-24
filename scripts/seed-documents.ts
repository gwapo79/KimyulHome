
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding documents...');

    const userEmail = 'test_user@example.com';
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { cases: true }
    });

    if (!user) {
        console.error(`User ${userEmail} not found. Document seeding aborted.`);
        return;
    }

    console.log(`Found user: ${user.name} (${user.id})`);

    // Clean up existing documents for test user
    await prisma.document.deleteMany({
        where: { userId: user.id }
    });
    console.log('Cleaned up existing documents.');

    const case1 = user.cases.find(c => c.title.includes("전세"));
    const case2 = user.cases.find(c => c.title.includes("회생"));

    // 1. 임대차계약서 사본 (계약서) -> Linked to Jeonse Case if exists
    await prisma.document.create({
        data: {
            userId: user.id,
            caseId: case1?.id, // Optional
            fileName: '임대차계약서_사본.pdf',
            fileSize: '2.5 MB',
            fileType: 'pdf',
            category: '계약서',
            url: '/uploads/dummy_contract.pdf', // Mock URL
            createdAt: new Date('2025-03-12')
        }
    });

    // 2. 내용증명 발송본 (증거자료) -> Linked to Jeonse Case if exists
    await prisma.document.create({
        data: {
            userId: user.id,
            caseId: case1?.id,
            fileName: '내용증명_발송본.pdf',
            fileSize: '1.1 MB',
            fileType: 'pdf',
            category: '증거자료',
            url: '/uploads/dummy_cert.pdf',
            createdAt: new Date('2025-03-20')
        }
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
