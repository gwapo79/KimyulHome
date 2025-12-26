
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    const id = args[0];
    const itemType = args[1]; // 'BLOG'
    const imagePath = args[2];

    if (!id || !imagePath) {
        console.error("Usage: npx tsx update_db_generic.ts <ID> <TYPE> <PATH>");
        process.exit(1);
    }

    console.log(`Updating ${itemType} ID: ${id} with image: ${imagePath}`);

    try {
        if (itemType === 'BLOG') {
            await prisma.blogPost.update({
                where: { id: id },
                data: { thumbnailUrl: imagePath }
            });
        }
        console.log("DB Update Success");
    } catch (e: any) {
        console.error("DB Update Failed:", e.message);
        process.exit(1);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
