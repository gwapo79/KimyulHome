
export interface MockReview {
    id: string;
    authorName: string;
    rating: number;
    content: string;
    date: string;
    status: 'VISIBLE' | 'HIDDEN';
    isBest: boolean;
    source: 'NAVER_BLOG' | 'HOMEPAGE' | 'INSTAGRAM';
}

export const MOCK_REVIEWS: MockReview[] = [
    {
        id: 'r1',
        authorName: '김**',
        rating: 5,
        content: '처음 겪는 송사라 너무 막막했는데 김지율 변호사님 덕분에 잘 해결되었습니다. 친절한 상담 감사합니다.',
        date: '2024-03-20',
        status: 'VISIBLE',
        isBest: true,
        source: 'HOMEPAGE',
    },
    {
        id: 'r2',
        authorName: '이**',
        rating: 5,
        content: '다른 곳에서는 어렵다고 했던 사건을 맡아주셔서 결국 승소까지 이끌어주셨습니다. 정말 실력 있는 곳입니다.',
        date: '2024-03-18',
        status: 'VISIBLE',
        isBest: true,
        source: 'NAVER_BLOG',
    },
    {
        id: 'r3',
        authorName: '박**',
        rating: 4,
        content: '상담 예약 잡기가 조금 힘들었지만 상담 내용은 매우 만족스러웠습니다.',
        date: '2024-03-15',
        status: 'VISIBLE',
        isBest: false,
        source: 'HOMEPAGE',
    },
    {
        id: 'r4',
        authorName: '최**',
        rating: 1,
        content: '광고성 글입니다. (관리자에 의해 숨김 처리됨)',
        date: '2024-03-10',
        status: 'HIDDEN',
        isBest: false,
        source: 'INSTAGRAM',
    },
    ...Array.from({ length: 8 }).map((_, i) => ({
        id: `r${i + 5}`,
        authorName: `User ${i + 5}`,
        rating: 5,
        content: `정말 감사합니다. 추천합니다. (자동 생성된 후기 ${i + 1})`,
        date: '2024-02-28',
        status: 'VISIBLE' as const,
        isBest: false,
        source: 'HOMEPAGE' as const,
    }))
];
