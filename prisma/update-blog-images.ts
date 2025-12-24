
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting Blog Image Update...');

    const categoryImageMap: Record<string, string> = {
        'real-estate': '/images/blog/real-estate.svg',
        'debt': '/images/blog/debt.svg',
        'rehab': '/images/blog/rehab.svg',
        'case-law': '/images/blog/case-law.svg',
        'guide': '/images/blog/case-law.svg', // Fallback
    };

    // Get all posts
    const posts = await prisma.blogPost.findMany();
    console.log(`Found ${posts.length} posts to update.`);

    let updatedCount = 0;

    for (const post of posts) {
        const newImage = categoryImageMap[post.category] || '/images/blog/real-estate.svg';

        // Update only if different to save db writes in future runs, but for now we force update
        await prisma.blogPost.update({
            where: { id: post.id },
            data: { thumbnailUrl: newImage }
        });
        updatedCount++;
    }

    console.log(`✅ Successfully updated ${updatedCount} Blog Posts with new high-quality SVG thumbnails.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
