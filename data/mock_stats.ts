
export interface MonthlyStats {
    month: string;
    revenue: number; // in KRW
    consultations: number;
    cases: number;
}

export interface MarketingStats {
    channel: string; // e.g., 'Naver Blog', 'Google Ads', 'Referral'
    percentage: number; // 0-100
    count: number;
}

export interface ActivityLog {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string; // e.g., '2 hours ago'
}

export const MOCK_STATS = {
    // KPI Cards
    kpi: {
        revenue: { value: 78500000, label: '이번 달 매출', delta: 12.5, prefix: '₩' },
        consultations: { value: 45, label: '신규 상담 문의', delta: 8.2, prefix: '' },
        activeCases: { value: 28, label: '진행 중인 사건', delta: -2.0, prefix: '' },
        winRate: { value: 94, label: '최근 승소율', delta: 1.5, prefix: '', suffix: '%' },
    },

    // Main Chart Data (Last 6 Months)
    monthlyTrends: [
        { month: '7월', revenue: 45000000, consultations: 30, cases: 12 },
        { month: '8월', revenue: 52000000, consultations: 35, cases: 15 },
        { month: '9월', revenue: 48000000, consultations: 32, cases: 14 },
        { month: '10월', revenue: 61000000, consultations: 40, cases: 20 },
        { month: '11월', revenue: 72000000, consultations: 42, cases: 25 },
        { month: '12월', revenue: 78500000, consultations: 45, cases: 28 },
    ] as MonthlyStats[],

    // Marketing Stats
    marketing: [
        { channel: '네이버 검색/블로그', percentage: 45, count: 120 },
        { channel: '지인 추천', percentage: 25, count: 68 },
        { channel: '구글 검색', percentage: 15, count: 42 },
        { channel: '유튜브', percentage: 10, count: 28 },
        { channel: '기타/미파악', percentage: 5, count: 14 },
    ] as MarketingStats[],

    // Lawyer Performance (Mock)
    lawyerPerformance: [
        { name: '김지율 대표변호사', cases: 15, revenue: 125000000, rating: 4.9 },
        { name: '박변호', cases: 8, revenue: 45000000, rating: 4.7 },
        { name: '강변호', cases: 5, revenue: 28000000, rating: 4.8 },
    ],

    // Recent Activity Log
    recentActivity: [
        { id: 'a1', user: '김지율', action: '상태 변경', target: '강남구 사기 혐의 방어 (수사중 -> 검찰송치)', time: '1시간 전' },
        { id: 'a2', user: '이실장', action: '상담 배정', target: '정상담 (이혼 소송 문의) -> 박변호', time: '2시간 전' },
        { id: 'a3', user: '시스템', action: '결제 완료', target: '이피해 의뢰인 착수금 (3,300,000원)', time: '3시간 전' },
        { id: 'a4', user: '박질문', action: '문의 등록', target: '음주운전 관련 긴급 상담 요청', time: '5시간 전' },
    ] as ActivityLog[]
};
