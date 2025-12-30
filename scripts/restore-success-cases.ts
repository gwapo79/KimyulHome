
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Restoring Original Success Case Images...");

    // Read the backup JSON
    const data = JSON.parse(fs.readFileSync('success_cases.json', 'utf-8'));

    let count = 0;
    for (const caseData of data) {
        // We only update the imageUrl to restore it
        if (caseData.imageUrl) {
            await prisma.successCase.update({
                where: { id: caseData.id },
                data: { imageUrl: caseData.imageUrl }
            });
            count++;
        }
    }

    console.log(`Restored ${count} cases.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
