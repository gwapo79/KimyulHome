
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true
        }
    });

    const lines = posts.map(p => `[${p.id}] ${p.title} (Img: ${p.thumbnailUrl})`);
    fs.writeFileSync('all_blog_posts_dump.txt', lines.join('\n'));
    console.log(`Dumped ${posts.length} posts to all_blog_posts_dump.txt`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
