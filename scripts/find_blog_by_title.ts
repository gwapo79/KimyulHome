
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const term = process.argv[2];
    if (!term) {
        console.log("Usage: npx tsx scripts/find_blog_by_title.ts <search_term>");
        return;
    }
    console.log(`Scanning BlogPost table for title containing: "${term}"...`);

    const posts = await prisma.blogPost.findMany({
        where: {
            title: {
                contains: term
            }
        },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true
        }
    });

    console.log(`Found ${posts.length} matches:`);
    posts.forEach(p => {
        console.log(`[${p.id}] ${p.title}`);
        console.log(`Current Image: ${p.thumbnailUrl}`);
        console.log('---');
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
