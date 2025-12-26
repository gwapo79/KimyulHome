
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    const id = args[0];
    const imagePath = args[1];
    const type = args[2] || 'SUCCESS_CASE';

    if (!id || !imagePath) {
        console.error("Usage: npx tsx update_db_manual.ts <ID> <IMAGE_PATH_RELATIVE> [TYPE]");
        process.exit(1);
    }

    console.log(`Updating ${type} ID: ${id} with image: ${imagePath}`);

    try {
        if (type === 'SUCCESS_CASE') {
            await prisma.successCase.update({
                where: { id: id },
                data: { imageUrl: imagePath }
            });
        }
        // Add others if needed
        console.log("DB Update Success");
    } catch (e: any) {
        console.error("DB Update Failed:", e.message);
        process.exit(1);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
