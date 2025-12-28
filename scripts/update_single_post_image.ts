
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function updatePost(id: string, imagePath: string) {
    try {
        await prisma.blogPost.update({
            where: { id: id },
            data: { thumbnailUrl: imagePath }
        });
        console.log(`Updated post ${id} with image ${imagePath}`);
    } catch (error) {
        console.error("Error updating DB:", error);
    } finally {
        await prisma.$disconnect();
    }
}

const args = process.argv.slice(2);
const id = args[0];
const path = args[1];

if (id && path) {
    updatePost(id, path);
} else {
    console.error("Usage: tsx update_single_post_image.ts <id> <path>");
}
