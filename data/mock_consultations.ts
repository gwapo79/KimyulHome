
export type ConsultationStatus = 'PENDING' | 'CONTACTED' | 'SCHEDULED' | 'HIRED' | 'DROPPED';

export interface MockConsultation {
    id: string;
    name: string;
    phone: string;
    category: '이혼/가사' | '형사' | '민사' | '부동산' | '기업';
    content: string;
    status: ConsultationStatus;
    appliedAt: string;
    memo?: string;
    assigneeId?: string;
}

export const MOCK_CONSULTATIONS: MockConsultation[] = [
    {
        id: 'c1',
        name: '김**',
        phone: '010-1***-2***',
        category: '부동산',
        content: '전세금 반환 보증보험 이행 거절 관련 문의드립니다. 집주인이 연락두절 상태입니다.',
        status: 'PENDING',
        appliedAt: '2024-03-27 14:30',
        assigneeId: 't3',
    },
    {
        id: 'c2',
        name: '박**',
        phone: '010-3***-4***',
        category: '형사',
        content: '보이스피싱 수거책 혐의로 경찰 조사 연락을 받았습니다. 급하게 변호사님 상담 원합니다.',
        status: 'CONTACTED',
        appliedAt: '2024-03-27 10:15',
        memo: '1차 통화 완료. 내일 2시 방문 예약.',
    },
    {
        id: 'c3',
        name: '이**',
        phone: '010-5***-6***',
        category: '이혼/가사',
        content: '배우자 외도로 인한 이혼 소송 문의.',
        status: 'HIRED',
        appliedAt: '2024-03-26 18:00',
    },
    {
        id: 'c4',
        name: '최**',
        phone: '010-7***-8***',
        category: '민사',
        content: '대여금 반환 청구 소장 작성을 의뢰하고 싶습니다.',
        status: 'DROPPED',
        appliedAt: '2024-03-25 09:20',
        memo: '비용 부담으로 상담 종료.',
    },
    ...Array.from({ length: 8 }).map((_, i) => ({
        id: `c${i + 5}`,
        name: `User ${i + 5}`,
        phone: `010-0000-${1000 + i}`,
        category: i % 2 === 0 ? '민사' : '형사' as any,
        content: `상담 신청합니다. 내용은... (자동생성 ${i})`,
        status: 'PENDING' as const,
        appliedAt: '2024-03-24 11:00',
    }))
];
