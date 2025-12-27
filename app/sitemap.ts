import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.xn--2i4bq4i58b81e.com';

    // Static Routes
    const staticRoutes = [
        '',
        '/media/blog',
        '/company/about',
        '/legal/practice-areas',
        '/legal/success-cases',
        '/company/reviews',
        '/support/faq',
        '/company/consultation',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog Routes
    const posts = await prisma.blogPost.findMany({
        select: { id: true, updatedAt: true },
    });

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/media/blog/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
}
