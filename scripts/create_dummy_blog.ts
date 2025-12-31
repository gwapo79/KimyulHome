import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const post = await prisma.blogPost.create({
        data: {
            title: 'DELETE_TEST_BLOG_REAL',
            content: '<h3>Test Content</h3><p>This is a test post for deletion.</p>',
            excerpt: 'Test Excerpt',
            author: 'Tester',
            category: '법률상식',
            status: 'PUBLISHED',
            thumbnailUrl: '',
        }
    });
    console.log(`Created blog post: ${post.id}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
