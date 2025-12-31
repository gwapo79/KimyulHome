
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const caseId = process.argv[2];
    const imagePath = process.argv[3]; // e.g. "/images/success_cases/item1.png"

    if (!caseId || !imagePath) {
        console.error("Usage: npx ts-node scripts/update_success_image.ts <caseId> <imagePath>");
        process.exit(1);
    }

    console.log(`Updating Case ${caseId} with image ${imagePath}...`);

    const updated = await prisma.successCase.update({
        where: { id: caseId },
        data: {
            thumbnailUrl: imagePath, // Update thumbnail
            imageUrl: imagePath      // Update main image too for consistency
        }
    });

    console.log(`Success! Updated case: ${updated.title}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
