
import { prisma } from '@/lib/prisma';
import BlogListClient from './BlogListClient';

export const dynamic = 'force-dynamic'; // Ensure real-time data

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Pass data to Client Component
    return <BlogListClient initialPosts={posts} />;
}
