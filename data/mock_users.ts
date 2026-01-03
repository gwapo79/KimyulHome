
export type UserRole = 'SUPER_ADMIN' | 'LAWYER' | 'STAFF' | 'USER' | 'PROFESSIONAL' | 'CEO';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'WITHDRAWN';

export interface MockClient {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinPath: 'NAVER' | 'GOOGLE' | 'DIRECT';
    status: UserStatus;
    joinedAt: string;
    avatarUrl?: string;
}

export interface MockTeamMember {
    id: string;
    name: string;
    paramName: string; // for url slug if needed
    email: string;
    phone: string;
    role: 'SUPER_ADMIN' | 'LAWYER' | 'STAFF';
    roleBadge: 'ADMIN' | 'LAWYER' | 'STAFF'; // UI display
    department: '법무팀' | '송무팀' | '경영지원팀' | '대표변호사';
    position: string; // e.g. "대표변호사", "소속변호사", "대리"
    assignedCases: number;
    isPublic: boolean; // Homepage exposure
    joinedAt: string;
    avatarUrl?: string;
}

export const MOCK_CLIENTS: MockClient[] = [
    { id: 'c1', name: '최의뢰', email: 'client.choi@naver.com', phone: '010-1111-2222', joinPath: 'NAVER', status: 'ACTIVE', joinedAt: '2024-01-05' },
    { id: 'c2', name: '정상담', email: 'consult.jung@daum.net', phone: '010-3333-7777', joinPath: 'DIRECT', status: 'ACTIVE', joinedAt: '2024-02-20' },
    { id: 'c3', name: '이피해', email: 'victim.lee@gmail.com', phone: '010-5555-6666', joinPath: 'GOOGLE', status: 'ACTIVE', joinedAt: '2024-03-10' },
    { id: 'c4', name: '박질문', email: 'ask.park@nate.com', phone: '010-7777-8888', joinPath: 'NAVER', status: 'BLOCKED', joinedAt: '2024-04-12' },
    ...Array.from({ length: 11 }).map((_, i) => ({
        id: `c${i + 5}`,
        name: `Client ${i + 5}`,
        email: `client${i + 5}@example.com`,
        phone: `010-1234-${1000 + i}`,
        joinPath: i % 3 === 0 ? 'NAVER' : (i % 3 === 1 ? 'GOOGLE' : 'DIRECT') as any,
        status: i % 10 === 0 ? 'WITHDRAWN' : 'ACTIVE' as UserStatus,
        joinedAt: '2024-05-01',
    }))
];

export const MOCK_TEAM: MockTeamMember[] = [
    {
        id: 't1',
        name: '김지율',
        paramName: 'kim-jiyul',
        email: 'bizgguya@gmail.com',
        phone: '010-1234-5678',
        role: 'SUPER_ADMIN',
        roleBadge: 'ADMIN',
        department: '대표변호사',
        position: '대표변호사',
        assignedCases: 15,
        isPublic: true,
        joinedAt: '2023-01-01',
    },
    {
        id: 't2',
        name: '박변호',
        paramName: 'park-lawyer',
        email: 'lawyer.park@lawfirm.com',
        phone: '010-9876-5432',
        role: 'LAWYER',
        roleBadge: 'LAWYER',
        department: '법무팀',
        position: '소속변호사',
        assignedCases: 8,
        isPublic: true,
        joinedAt: '2023-03-15',
    },
    {
        id: 't3',
        name: '이실장',
        paramName: 'lee-manager',
        email: 'staff.lee@lawfirm.com',
        phone: '010-5555-4444',
        role: 'STAFF',
        roleBadge: 'STAFF',
        department: '송무팀',
        position: '실장',
        assignedCases: 24,
        isPublic: false,
        joinedAt: '2023-02-10',
    },
    {
        id: 't4',
        name: '강변호',
        paramName: 'kang-lawyer',
        email: 'lawyer.kang@lawfirm.com',
        phone: '010-7777-8888',
        role: 'LAWYER',
        roleBadge: 'LAWYER',
        department: '법무팀',
        position: '소속변호사',
        assignedCases: 5,
        isPublic: true,
        joinedAt: '2023-06-01',
    },
    {
        id: 't5',
        name: '홍스탭',
        paramName: 'hong-staff',
        email: 'staff.hong@lawfirm.com',
        phone: '010-4444-9999',
        role: 'STAFF',
        roleBadge: 'STAFF',
        department: '경영지원팀',
        position: '대리',
        assignedCases: 0,
        isPublic: false,
        joinedAt: '2023-08-15',
    },
];
