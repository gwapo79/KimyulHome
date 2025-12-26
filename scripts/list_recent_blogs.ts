
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    console.log(`Listing ${posts.length} recent posts:`);
    posts.forEach(p => {
        console.log(`[${p.id}] ${p.title}`);
        console.log(`Current Image: ${p.thumbnailUrl}`);
        console.log('---');
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
