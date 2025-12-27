
export type CaseStatus = 'INVESTIGATION' | 'PROSECUTION' | 'TRIAL_1' | 'TRIAL_2' | 'JUDGMENT' | 'CLOSED';

export interface TimelineEvent {
    id: string;
    step: string;
    date: string;
    status: 'DONE' | 'CURRENT' | 'PENDING';
    description?: string;
}

export interface CaseDocument {
    id: string;
    name: string;
    type: 'PDF' | 'DOC' | 'IMG' | 'ZIP';
    size: string;
    uploadDate: string;
}

export interface CaseEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    memo?: string;
    type: 'TRIAL' | 'INVESTIGATION' | 'MEETING';
}

export interface CasePayment {
    id: string;
    title: string;
    amount: number;
    date: string;
    status: 'PENDING' | 'PAID';
    type: 'RETAINER' | 'SUCCESS_FEE' | 'EXPENSE';
}

export interface MockCase {
    id: string;
    caseNumber: string;
    title: string;
    clientName: string;
    clientPhone: string;
    lawyerName: string;
    lawyerImage?: string;
    status: CaseStatus;
    statusLabel: string;
    description: string;
    registeredAt: string;
    updatedAt: string;
    timeline: TimelineEvent[];
    documents: CaseDocument[];
    assigneeId?: string;
    events: CaseEvent[];
    payments: CasePayment[];
}

export const MOCK_CASES: MockCase[] = [
    {
        id: 'c1',
        caseNumber: '2024형제12345',
        title: '강남구 투자 사기 혐의 방어',
        clientName: '최의뢰',
        clientPhone: '010-1111-2222',
        lawyerName: '김지율 대표변호사',
        assigneeId: 't1',
        status: 'INVESTIGATION',
        statusLabel: '경찰조사',
        description: '투자금 반환 불이행으로 인한 사기 고소 건. 편취 고의 없음 입증 주력.',
        registeredAt: '2024-01-10',
        updatedAt: '2024-02-15',
        timeline: [
            { id: 't1', step: '고소장 접수/확인', date: '2024-01-10', status: 'DONE', description: '강남경찰서 경제팀 접수 확인' },
            { id: 't2', step: '경찰 출석 조사', date: '2024-02-20', status: 'CURRENT', description: '피의자 신문 예정 (변호인 동석)' },
            { id: 't3', step: '검찰 송치 결정', date: '', status: 'PENDING' },
            { id: 't4', step: '최종 처분', date: '', status: 'PENDING' },
        ],
        documents: [
            { id: 'd1', name: '고소장_사본.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2024-01-15' },
            { id: 'd2', name: '입출금거래내역서.xlsx', type: 'DOC', size: '150 KB', uploadDate: '2024-01-20' },
        ],
        events: [
            { id: 'e1', title: '1차 경찰 조사', date: '2024-02-20', location: '강남경찰서', type: 'INVESTIGATION', memo: '진술 내용 사전 점검 필요' }
        ],
        payments: [
            { id: 'p1', title: '착수금', amount: 5500000, date: '2024-01-12', status: 'PAID', type: 'RETAINER' }
        ]
    },
    {
        id: 'c2',
        caseNumber: '2023가합9876',
        title: '이혼 및 재산분할 청구 소송',
        clientName: '이피해',
        clientPhone: '010-5555-6666',
        lawyerName: '박변호',
        status: 'TRIAL_1',
        statusLabel: '1심 재판',
        description: '배우자의 부정행위로 인한 이혼 소송. 위자료 5천만원 및 재산분할 50% 청구.',
        registeredAt: '2023-11-05',
        updatedAt: '2024-03-01',
        timeline: [
            { id: 't1', step: '소장 접수', date: '2023-11-05', status: 'DONE' },
            { id: 't2', step: '상대방 답변서 수령', date: '2023-12-10', status: 'DONE', description: '유책 사유 일부 부인' },
            { id: 't3', step: '조정 기일', date: '2024-01-15', status: 'DONE', description: '조정 결렬' },
            { id: 't4', step: '1차 변론 기일', date: '2024-03-10', status: 'CURRENT', description: '서울가정법원 제3호 법정' },
            { id: 't5', step: '판결 선고', date: '', status: 'PENDING' },
        ],
        documents: [
            { id: 'd1', name: '소장.pdf', type: 'PDF', size: '5.1 MB', uploadDate: '2023-11-05' },
            { id: 'd2', name: '증거목록_사진.zip', type: 'ZIP', size: '12 MB', uploadDate: '2023-11-05' },
            { id: 'd3', name: '답변서.pdf', type: 'PDF', size: '1.2 MB', uploadDate: '2023-12-10' },
        ],
        events: [
            { id: 'e1', title: '1차 변론기일', date: '2024-03-10', location: '서울가정법원 302호', type: 'TRIAL', memo: '주요 증거 제출 및 변론' }
        ],
        payments: [
            { id: 'p1', title: '착수금', amount: 3300000, date: '2023-11-01', status: 'PAID', type: 'RETAINER' },
            { id: 'p2', title: '성공보수(예치금)', amount: 2200000, date: '2024-03-01', status: 'PENDING', type: 'SUCCESS_FEE' }
        ]
    },
    {
        id: 'c3',
        caseNumber: '2024형제5678',
        title: '음주운전 도로교통법 위반',
        clientName: '박질문',
        clientPhone: '010-7777-8888',
        lawyerName: '강변호',
        status: 'PROSECUTION',
        statusLabel: '검찰 송치',
        description: '혈중알코올농도 0.08% 단순 음주. 초범 강조 양형 자료 제출.',
        registeredAt: '2024-02-01',
        updatedAt: '2024-02-28',
        timeline: [
            { id: 't1', step: '경찰 조사', date: '2024-02-10', status: 'DONE' },
            { id: 't2', step: '검찰 송치', date: '2024-02-25', status: 'CURRENT', description: '약식기소 예상' },
            { id: 't3', step: '법원 처분', date: '', status: 'PENDING' },
        ],
        documents: [
            { id: 'd1', name: '반성문.docx', type: 'DOC', size: '45 KB', uploadDate: '2024-02-12' },
        ],
        events: [],
        payments: []
    },
    {
        id: 'c4',
        caseNumber: '2023나1234',
        title: '대여금 반환 청구 항소심',
        clientName: '정상담',
        clientPhone: '010-3333-7777',
        lawyerName: '김지율 대표변호사',
        status: 'JUDGMENT',
        statusLabel: '판결 선고',
        description: '1심 일부 패소 후 항소 진행 건. 차용증 효력 다툼.',
        registeredAt: '2023-05-20',
        updatedAt: '2024-03-05',
        timeline: [
            { id: 't1', step: '항소장 제출', date: '2023-06-01', status: 'DONE' },
            { id: 't2', step: '변론 준비', date: '2023-08-15', status: 'DONE' },
            { id: 't3', step: '2심 변론 종결', date: '2024-02-20', status: 'DONE' },
            { id: 't4', step: '판결 선고', date: '2024-03-15', status: 'CURRENT', description: '오후 2시 선고 예정' },
        ],
        documents: [],
        events: [
            { id: 'e1', title: '판결 선고기일', date: '2024-03-15', location: '서울고등법원', type: 'TRIAL' }
        ],
        payments: [
            { id: 'p1', title: '항소심 착수금', amount: 4400000, date: '2023-05-25', status: 'PAID', type: 'RETAINER' }
        ]
    }
];
