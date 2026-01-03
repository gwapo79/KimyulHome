
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log("🌱 Starting Dashboard Seeding...");

    // 1. Ensure a dummy user exists for assigning these records
    let user = await prisma.user.findFirst({ where: { email: 'demo@lawfirm.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@lawfirm.com',
                name: '시연용 계정',
                password: 'demo', // Not used really
                role: 'USER',
                provider: 'local'
            }
        });
        console.log("Created demo user:", user.id);
    } else {
        console.log("Using existing demo user:", user.id);
    }

    const userId = user.id;
    const now = new Date();

    // 2. Generate Payments (BillingHistory) - Target ~20M KRW
    console.log("Creating Payments...");
    const paymentItems = [
        { name: '이혼 소송 착수금', amount: 3300000 },
        { name: '부동산 법률 자문', amount: 550000 },
        { name: '형사 변호 선임비', amount: 5500000 },
        { name: '기업 계약 검토', amount: 1100000 },
        { name: '내용증명 발송 대행', amount: 220000 }
    ];

    let totalRevenue = 0;
    const payments = [];

    // Create about 15-20 payments distributed over last 30 days
    for (let i = 0; i < 20; i++) {
        const item = paymentItems[Math.floor(Math.random() * paymentItems.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const paidAt = new Date(now);
        paidAt.setDate(paidAt.getDate() - daysAgo);

        payments.push({
            userId,
            itemName: item.name,
            amount: item.amount,
            status: 'PAID',
            paymentMethod: 'CARD',
            paidAt: paidAt,
            createdAt: paidAt
        });
        totalRevenue += item.amount;
    }

    if (payments.length > 0) {
        await prisma.billingHistory.createMany({ data: payments });
    }
    console.log(`✅ Created ${payments.length} payment records (Total: ₩${totalRevenue.toLocaleString()})`);

    // 3. Generate Inquiries (Consultations) - 150 records
    console.log("Creating Consultations...");
    const categories = ['이혼/가사', '형사/성범죄', '부동산/건설', '기업법무', '보이스피싱', '교통사고', '기타'];
    const consultations = [];

    for (let i = 0; i < 150; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now);
        createdAt.setDate(createdAt.getDate() - daysAgo);

        consultations.push({
            name: `의뢰인${i + 1}`,
            phone: `010-0000-${String(i).padStart(4, '0')}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            content: '상담 요청합니다.',
            status: Math.random() > 0.7 ? '완료' : '접수',
            createdAt: createdAt,
            updatedAt: createdAt,
            userId: userId // Optional linkage
        });
    }

    await prisma.consultation.createMany({ data: consultations });
    console.log(`✅ Created ${consultations.length} consultation records`);


    // 4. Generate Visit/Marketing Logs (UserActivity)
    console.log("Creating Marketing Logs...");
    const sources = ['네이버 검색광고', '네이버 블로그', '인스타그램', '지인 추천', '유튜브'];
    const activities = [];

    // 150 Consults implies maybe 1500 visits for a 10% rate, or higher/lower. 
    // Let's add ~500 VIEW_PAGE and ~200 VISIT_SOURCE
    for (let i = 0; i < 500; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now);
        createdAt.setDate(createdAt.getDate() - daysAgo);

        // Page View
        activities.push({
            userId,
            type: 'VIEW_PAGE',
            path: '/',
            createdAt
        });

        // Source Attribution (for some)
        if (Math.random() > 0.6) {
            activities.push({
                userId,
                type: 'VISIT_SOURCE',
                details: sources[Math.floor(Math.random() * sources.length)],
                createdAt
            });
        }
    }

    await prisma.userActivity.createMany({ data: activities });
    console.log(`✅ Created User Activities`);

    console.log("🎉 Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
