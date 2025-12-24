
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const consultation = await prisma.consultation.findFirst({
        where: { name: '성공 테스트' },
        orderBy: { createdAt: 'desc' },
    });

    if (consultation) {
        console.log('Verification Success: Record found.');
        console.log(consultation);
    } else {
        console.error('Verification Failed: Record not found.');
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
