
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetTitlePart = "대여금 반환 청구 소송 - 1차"; // From queue item 1

    console.log(`Searching for case with title containing: ${targetTitlePart}`);

    const found = await prisma.successCase.findFirst({
        where: {
            title: {
                contains: targetTitlePart
            }
        }
    });

    if (found) {
        console.log(`Found Case: ${found.id} - ${found.title}`);

        // Update it
        const imagePath = "/assets/images/unique/success_982c2437-c357-43ef-9ca1-725899039556.png";
        // Note: Using the filename from the queue even if ID differs, just to be consistent with the file I created.

        await prisma.successCase.update({
            where: { id: found.id },
            data: { imageUrl: imagePath }
        });
        console.log(`Updated successfully with image: ${imagePath}`);
    } else {
        console.error("Case not found by title.");
        // List some candidates?
        const candidates = await prisma.successCase.findMany({
            take: 5,
            where: { category: "민사" }
        });
        console.log("Candidates in '민사':", candidates.map(c => c.title));
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
