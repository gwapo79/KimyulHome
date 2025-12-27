
export interface MockBlogPost {
    id: string;
    title: string;
    category: '법률상식' | '사무소소식' | '언론보도';
    author: string;
    viewCount: number;
    status: 'PUBLISHED' | 'DRAFT' | 'HIDDEN';
    createdAt: string;
}

export const MOCK_BLOG_POSTS: MockBlogPost[] = [
    {
        id: 'b1',
        title: '전세사기 피해 발생 시 가장 먼저 해야 할 3가지',
        category: '법률상식',
        author: '김지율 대표변호사',
        viewCount: 1250,
        status: 'PUBLISHED',
        createdAt: '2024-03-15',
    },
    {
        id: 'b2',
        title: '2024년 개인회생 절차 개편 안내',
        category: '사무소소식',
        author: '박변호',
        viewCount: 890,
        status: 'PUBLISHED',
        createdAt: '2024-03-10',
    },
    {
        id: 'b3',
        title: '[인터뷰] 서초지율, 부동산 소송 전문 로펌으로 도약',
        category: '언론보도',
        author: '홍보팀',
        viewCount: 3200,
        status: 'PUBLISHED',
        createdAt: '2024-03-01',
    },
    {
        id: 'b4',
        title: '이혼 소송 재산분할 핵심 가이드 (작성중)',
        category: '법률상식',
        author: '강변호',
        viewCount: 0,
        status: 'DRAFT',
        createdAt: '2024-03-20',
    },
    ...Array.from({ length: 10 }).map((_, i) => ({
        id: `b${i + 5}`,
        title: `법률 상식 가이드 시리즈 Vol.${i + 1}`,
        category: i % 2 === 0 ? '법률상식' : '사무소소식' as any,
        author: '김지율 대표변호사',
        viewCount: Math.floor(Math.random() * 1000),
        status: i % 5 === 0 ? 'HIDDEN' : 'PUBLISHED' as any,
        createdAt: '2024-02-28',
    }))
];
