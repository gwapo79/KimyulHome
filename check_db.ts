
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            author: true
        }
    });
    console.log(JSON.stringify(posts, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
