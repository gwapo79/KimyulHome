import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTeamMemberByName } from '@/app/constants/team';
import AdminBlogDetailClient from './AdminBlogDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
            assignedProfile: true // Include assigned profile for display author
        }
    });

    if (!post) {
        notFound();
    }

    // Logic to determine display author (same as public page)
    const authorName = post.assignedProfile?.name || post.author || "서초지율 법률팀";

    // Map Role for Admin Display (Simplified)
    const mapRole = (role?: string) => {
        if (role === 'CEO') return '대표 변호사';
        if (role === 'PROFESSIONAL' || role === 'LAWYER') return '담당 변호사';
        if (role === 'STAFF') return '법률 스태프';
        return '법률 전문가';
    };
    const authorRole = mapRole(post.assignedProfile?.role as string);

    // Image Priority: Assigned Profile -> Team Member Const -> Default
    const authorImage = post.assignedProfile?.avatarUrl || getTeamMemberByName(post.author || '').imageUrl;

    return (
        <AdminBlogDetailClient
            post={post}
            authorName={authorName}
            authorRole={authorRole}
            authorImage={authorImage}
        />
    );
}
