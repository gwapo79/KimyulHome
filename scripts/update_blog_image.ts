
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    const id = args[0];
    const url = args[1];

    if (!id || !url) {
        console.error('Usage: tsx update_blog_image.ts <ID> <URL>');
        process.exit(1);
    }

    const result = await prisma.blogPost.update({
        where: { id },
        data: { thumbnailUrl: url },
    });

    console.log(`Updated post ${result.id} with url ${result.thumbnailUrl}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
