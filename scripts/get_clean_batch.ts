
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            id: true,
            title: true,
            thumbnailUrl: true
        }
    });

    console.log(JSON.stringify(posts, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
