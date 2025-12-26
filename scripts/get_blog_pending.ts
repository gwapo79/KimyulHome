
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching ALL Blog Posts...");
    const posts = await prisma.blogPost.findMany({
        select: { id: true, title: true, content: true, thumbnailUrl: true },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    // Filter out those that already have a 'unique' image
    const pending = posts.filter(p => !p.thumbnailUrl || !p.thumbnailUrl.includes('unique'));

    console.log(`Found ${pending.length} pending posts out of ${posts.length} fetched.`);
    fs.writeFileSync('blog_pending.json', JSON.stringify(pending.slice(0, 10), null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
