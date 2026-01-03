
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const total = await prisma.blogPost.count();
    const nullAssigned = await prisma.blogPost.count({
        where: { assignedProfileId: null }
    });

    const authors = await prisma.blogPost.groupBy({
        by: ['author'],
        _count: {
            author: true
        }
    });

    console.log(`Total Posts: ${total}`);
    console.log(`Null Assigned: ${nullAssigned}`);
    console.log("Authors:");
    authors.forEach(a => {
        console.log(`- ${a.author}: ${a._count.author}`);
    });
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
