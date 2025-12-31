import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const now = new Date();
        // --- Zone 1: Finance (Mock Injection) ---
        const dailyRevenue = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getMonth() + 1}월 ${d.getDate()}일`;
            // Mock random revenue between 1.5M and 5.0M
            const mockRev = Math.floor(1500000 + Math.random() * 3500000);
            const mockPrev = Math.floor(mockRev * (0.8 + Math.random() * 0.4));

            dailyRevenue.push({
                date: dateStr,
                revenue: mockRev,
                prevRevenue: mockPrev
            });
        }

        let arAgingVal = [
            { id: 'm1', client: '홍길동 (부당해고)', lawyer: '김지율', amount: 3000000, daysOverdue: 95, status: 'CRITICAL', date: '2025-09-15' },
            { id: 'm2', client: '이순신 (저작권)', lawyer: '박서연', amount: 5500000, daysOverdue: 62, status: 'WARNING', date: '2025-10-20' },
            { id: 'm3', client: '강감찬 (토지)', lawyer: '최민수', amount: 1200000, daysOverdue: 15, status: 'NORMAL', date: '2025-12-10' },
            { id: 'm4', client: '(주)대박건설', lawyer: '김지율', amount: 15000000, daysOverdue: 120, status: 'CRITICAL', date: '2025-08-30' },
        ];

        // --- Zone 3: Ops (Mock Injection) ---
        const workload = [
            { id: 'w1', name: '김지율 대표', position: '변호사', count: 12, score: 95 },
            { id: 'w2', name: '박서연', position: '수석변호사', count: 8, score: 75 },
            { id: 'w3', name: '최민수', position: '변호사', count: 3, score: 30 },
            { id: 'w4', name: '정하나', position: '실장', count: 15, score: 88 },
        ];

        const risks = {
            schedule: [
                { id: 'r1', title: '서울중앙지법 2025가합1234', case: '부동산 명도 소송', date: new Date(now.getTime() + 86400000).toISOString() },
                { id: 'r2', title: '증거제출기한 마감', case: '손해배상(기)', date: new Date(now.getTime() + 172800000).toISOString() }
            ],
            unassigned: [
                { id: 'u1', title: '보이스피싱 피해 구제 신청', status: '접수', createdAt: new Date().toISOString() },
                { id: 'u2', title: '이혼 소송 비용 안내', status: '대기', createdAt: new Date().toISOString() }
            ]
        };

        // --- Zone 2: Marketing ---
        const marketing = {
            metrics: { visits: 1250, consults: 18, conversion: "1.4" },
            freshness: { hours: 4, lastTitle: "2026년 달라지는 부동산 세법 완전정복" },
            attribution: [
                { title: "음주운전 구제 성공사례", conversion: 15 },
                { title: "이혼 소송 비용 안내", conversion: 12 },
                { title: "기업 법률 자문 혜택", conversion: 8 }
            ],
            analytics: {
                sources: [
                    { name: '네이버 검색광고', value: 40, fill: '#03C75A' },
                    { name: '네이버 블로그/View', value: 25, fill: '#00C300' },
                    { name: '지인 추천/직접', value: 15, fill: '#546E7A' },
                    { name: '인스타/유튜브', value: 10, fill: '#E1306C' },
                    { name: '기타', value: 10, fill: '#CFD8DC' }
                ],
                funnel: [
                    { stage: '전체 방문', value: 1250, fill: '#94A3B8' },
                    { stage: '콘텐츠 열람', value: 800, fill: '#64748B' },
                    { stage: '상담 페이지', value: 150, fill: '#475569' },
                    { stage: '최종 문의', value: 38, fill: '#10B981' }
                ],
                topContent: [
                    { rank: 1, title: '[성공사례] 보이스피싱 무죄 판결', time: '4분 30초', category: 'Case' },
                    { rank: 2, title: '[블로그] 이혼 소송 시 재산분할 꿀팁', time: '3분 10초', category: 'Blog' },
                    { rank: 3, title: '[변호사 소개] 김지율 대표 변호사 프로필', time: '2분 40초', category: 'Info' },
                    { rank: 4, title: '[성공사례] 전세보증금 반환 승소', time: '5분 12초', category: 'Case' },
                    { rank: 5, title: '[블로그] 음주운전 면허취소 구제', time: '3분 05초', category: 'Blog' }
                ],
                keywords: [
                    { keyword: '전세사기', count: 85 },
                    { keyword: '음주운전', count: 62 },
                    { keyword: '성범죄', count: 45 },
                    { keyword: '계약금 반환', count: 30 },
                    { keyword: '명예훼손', count: 20 }
                ]
            }
        };

        // --- Zone 5: System ---
        const logs = [
            {
                id: 'log1',
                time: '14:45',
                level: 'SUCCESS',
                message: '시스템 정기 백업이 완료되었습니다.',
                raw: 'BACKUP_COMPLETE: /vol/data/daily_20250101.tar.gz (size: 45GB)',
                user: 'System'
            },
            {
                id: 'log2',
                time: '14:32',
                level: 'WARNING',
                message: '비정상적인 로그인 시도가 감지되었습니다.',
                raw: 'AUTH_FAILr: IP 192.168.0.14 - Multiple Failures (5)',
                user: 'Unknown'
            },
            {
                id: 'log3',
                time: '14:15',
                level: 'INFO',
                message: '새로운 보안 패치가 적용되었습니다.',
                raw: 'PATCH_APPLIED: Security-Hotfix-KB40912',
                user: 'Admin'
            },
            {
                id: 'log4',
                time: '13:50',
                level: 'CRITICAL',
                message: '외부 데이터베이스 연결이 일시 중단되었습니다.',
                raw: 'DB_CONN_TIMEOUT: 54.32.12.11 - Retrying...',
                user: 'System'
            },
            {
                id: 'log5',
                time: '13:00',
                level: 'INFO',
                message: 'Law-OS 시스템이 정상 부팅되었습니다.',
                raw: 'BOOT_SEQ_INIT: Kernel v2.0.4 loaded successfully',
                user: 'System'
            }
        ];

        return NextResponse.json({
            finance: {
                revenue: {
                    today: dailyRevenue[6].revenue,
                    yesterday: dailyRevenue[5].revenue,
                    thisMonth: 125000000,
                    lastMonth: 98000000,
                    nextMonthPipeline: 52000000
                },
                chart: dailyRevenue,
                arAging: arAgingVal,
                profit: {
                    revenue: dailyRevenue[6].revenue,
                    expenses: Math.floor(dailyRevenue[6].revenue * 0.4),
                    net: Math.floor(dailyRevenue[6].revenue * 0.6),
                    bepRate: "120.5"
                }
            },
            marketing,
            ops: {
                risks,
                workload
            },
            live: {
                consultStats: { "접수": 5, "진행": 12, "완료": 8, "승소": 3 },
                systemLogs: logs,
                systemProgress: 100
            }
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
