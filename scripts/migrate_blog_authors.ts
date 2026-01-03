
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const representativeId = '0a87a7a6-c967-4ce4-9961-95159f471eaf'; // Kim Jiyul

    console.log("Starting migration of blog authors...");

    // 1. Update posts with 'STAFF' author or null displayAuthorId
    // Note: We use updateMany if possible, but raw query might be safer if schema mismatch in types
    // Using findMany + update loop for safety and logging

    const postsToUpdate = await prisma.blogPost.findMany({
        where: {
            OR: [
                { assignedProfileId: null },
                { author: { in: ['STAFF', '스태프', '관리자'] } }
            ]
        }
    });

    console.log(`Found ${postsToUpdate.length} blog posts to migrate.`);

    let updatedCount = 0;
    for (const post of postsToUpdate) {
        console.log(`Migrating post: ${post.title} (ID: ${post.id})`);

        // Update to set representative lawyer as display author
        try {
            await prisma.blogPost.update({
                where: { id: post.id },
                data: {
                    assignedProfileId: representativeId
                }
            });
            updatedCount++;
        } catch (e) {
            console.error(`Failed to update post ${post.id}:`, e);
        }
    }

    console.log(`Migration complete. Updated ${updatedCount} posts.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
