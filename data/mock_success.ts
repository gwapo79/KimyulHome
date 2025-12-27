
export interface MockSuccessCase {
    id: string;
    title: string;
    field: '성범죄' | '사기/경제' | '이혼/가사' | '부동산' | '민사';
    result: '승소' | '무혐의' | '기소유예' | '화해' | '기각';
    lawyer: string;
    date: string;
}

export const MOCK_SUCCESS_CASES: MockSuccessCase[] = [
    {
        id: 's1',
        title: '특수준강간 혐의 무죄 판결 이끌어내',
        field: '성범죄',
        result: '무혐의',
        lawyer: '김지율 대표변호사',
        date: '2024-03-12',
    },
    {
        id: 's2',
        title: '30억 원 대 전세사기 피해금 전액 회수 성공',
        field: '부동산',
        result: '승소',
        lawyer: '박변호',
        date: '2024-03-05',
    },
    {
        id: 's3',
        title: '보이스피싱 현금 수거책 집행유예 방어',
        field: '사기/경제',
        result: '승소',
        lawyer: '강변호',
        date: '2024-02-28',
    },
    {
        id: 's4',
        title: '상간녀 위자료 청구 소송 3,000만원 인용',
        field: '이혼/가사',
        result: '승소',
        lawyer: '김지율 대표변호사',
        date: '2024-02-15',
    },
    {
        id: 's5',
        title: '대여금 반환 청구 소송 방어 성공 (원고 기각)',
        field: '민사',
        result: '기각',
        lawyer: '박변호',
        date: '2024-01-30',
    },
    ...Array.from({ length: 10 }).map((_, i) => ({
        id: `s${i + 6}`,
        title: `성공사례 예시 타이틀 ${i + 1}`,
        field: i % 2 === 0 ? '형사' : '민사' as any, // Simple fallback types
        result: i % 3 === 0 ? '승소' : '화해' as any,
        lawyer: '담당변호사',
        date: '2024-01-15',
    }))
];
