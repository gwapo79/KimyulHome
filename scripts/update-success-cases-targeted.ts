import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Lawyer profiles (fixed)
const lawyers = [
    // We need to fetch the exact filenames from the directory or assume they are constant if we don't change them.
    // For now, I'll assume the filenames I used in Batch 1 are the ones to use.
    // Ideally, this script should find them.
    { name: '김현우 변호사', gender: 'male1' },
    { name: '박서준 변호사', gender: 'male2' },
    { name: '이지은 변호사', gender: 'female1' },
    { name: '최수진 변호사', gender: 'female2' },
];

async function getLawyerImage(gender: string): Promise<string> {
    const dir = path.join(process.cwd(), 'public/images/lawyers');
    const files = fs.readdirSync(dir);
    const match = files.find(f => f.includes(`lawyer_${gender.replace(/\d/, '')}_${gender.slice(-1)}`));
    return match ? `/images/lawyers/${match}` : '';
}

async function main() {
    const args = process.argv.slice(2);
    const skipArg = args.find(a => a.startsWith('--skip='));
    const batchNameArg = args.find(a => a.startsWith('--batch=')); // e.g., case_batch2

    if (!skipArg || !batchNameArg) {
        console.error('Usage: npx tsx scripts/update-success-cases-targeted.ts --skip=N --batch=case_batchN');
        process.exit(1);
    }

    const skip = parseInt(skipArg.split('=')[1]);
    const batchName = batchNameArg.split('=')[1];

    console.log(`Processing Batch: ${batchName}, Skip: ${skip}`);

    // Find images for this batch
    const casesDir = path.join(process.cwd(), 'public/images/cases');
    const allFiles = fs.readdirSync(casesDir);
    // Filter files that start with the batch name (e.g. "case_batch2_")
    const batchImages = allFiles
        .filter(f => f.startsWith(`${batchName}_`))
        .sort(); // Ensure 1, 2, 3... order if named correctly.

    if (batchImages.length === 0) {
        console.error(`No images found for batch ${batchName}`);
        process.exit(1);
    }

    console.log(`Found ${batchImages.length} images:`, batchImages);

    const cases = await prisma.successCase.findMany({
        take: batchImages.length,
        skip: skip,
        orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${cases.length} cases to update.`);

    for (let i = 0; i < cases.length; i++) {
        const caseItem = cases[i];
        const imageFile = batchImages[i % batchImages.length];
        const imagePath = `/images/cases/${imageFile}`;

        // Pick random lawyer
        const lawyerInfo = lawyers[Math.floor(Math.random() * lawyers.length)];
        const lawyerImgPath = await getLawyerImage(lawyerInfo.gender);

        console.log(`Updating Case ${caseItem.id} -> Img: ${imageFile}, Lawyer: ${lawyerInfo.name}`);

        await prisma.successCase.update({
            where: { id: caseItem.id },
            data: {
                lawyer: lawyerInfo.name,
                lawyerImageUrl: lawyerImgPath,
                imageUrl: imagePath,
                detailImageUrl: imagePath,
            },
        });
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
