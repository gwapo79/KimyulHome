
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const id = "34af265e-df4c-4f21-970a-a2b4d1bb6510";
    const post = await prisma.blogPost.findUnique({
        where: { id: id },
        select: { id: true, title: true, thumbnailUrl: true }
    });
    console.log("Current Post State:", post);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
