import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lawyers = [
    { name: '김현우 변호사', image: '/images/lawyers/lawyer_male_1_1766624442586.png' },
    { name: '박서준 변호사', image: '/images/lawyers/lawyer_male_2_1766624460497.png' },
    { name: '이지은 변호사', image: '/images/lawyers/lawyer_female_1_1766624476690.png' },
    { name: '최수진 변호사', image: '/images/lawyers/lawyer_female_2_1766624493029.png' },
];

const caseImages = [
    '/images/cases/case_batch1_1_1766624522462.png',
    '/images/cases/case_batch1_2_1766624541189.png',
    '/images/cases/case_batch1_3_1766624568545.png',
    '/images/cases/case_batch1_4_1766624592120.png',
    '/images/cases/case_batch1_5_1766624618918.png',
];

async function main() {
    console.log('Fetching success cases...');
    // Get first 5 cases to update
    const cases = await prisma.successCase.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }, // Just taking top 5
    });

    console.log(`Found ${cases.length} cases to update.`);

    for (let i = 0; i < cases.length; i++) {
        const caseItem = cases[i];
        const lawyer = lawyers[Math.floor(Math.random() * lawyers.length)];
        const caseImage = caseImages[i % caseImages.length]; // Cycle through the 5 images

        console.log(`Updating Case ${caseItem.id} with Lawyer ${lawyer.name} and Image ${caseImage}...`);

        await prisma.successCase.update({
            where: { id: caseItem.id },
            data: {
                lawyer: lawyer.name,
                lawyerImageUrl: lawyer.image, // Make sure filenames are correct!
                imageUrl: caseImage,
                detailImageUrl: caseImage, // Using same for detail for now
            },
        });
    }

    console.log('Batch 1 Update Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
