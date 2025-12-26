
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching Blog Posts...");
    const posts = await prisma.blogPost.findMany({
        select: { id: true, title: true, content: true },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    console.log(JSON.stringify(posts, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
