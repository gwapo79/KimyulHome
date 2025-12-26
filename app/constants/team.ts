export const TEAM_MEMBERS = [
    {
        id: 'kim-yul',
        name: '김율',
        role: '변호사',
        position: '대표변호사',
        specialty: '부동산/상속',
        email: 'yul.kim@lawfirm.com',
        description: '냉철한 판단력과 깊이 있는 법률 지식으로 의뢰인의 권리를 지키는 부동산 전문가입니다.',
        imageUrl: '/images/lawyers/kim-yul.png'
    },
    {
        id: 'lee-seo-jun',
        name: '이서준',
        role: '변호사',
        position: '파트너 변호사',
        specialty: '민사/기업법무',
        email: 'seojun.lee@lawfirm.com',
        description: '스마트한 전략과 친근한 소통으로 복잡한 기업 법무를 명쾌하게 해결합니다.',
        imageUrl: '/images/lawyers/lee-seo-jun.png'
    },
    {
        id: 'park-sun-young',
        name: '박선영',
        role: '법무사',
        position: '수석 법무사',
        specialty: '부동산 등기',
        email: 'sunyoung.park@lawfirm.com',
        description: '20년 경력의 꼼꼼함으로 단 하나의 실수도 허용하지 않는 등기 전문가입니다.',
        imageUrl: '/images/lawyers/park-sun-young.png'
    },
    {
        id: 'choi-eun-ah',
        name: '최은아',
        role: '법무사',
        position: '법무사',
        specialty: '개인회생/파산',
        email: 'eunah.choi@lawfirm.com',
        description: '따뜻한 마음과 차별화된 실무 노하우로 의뢰인의 새 출발을 돕습니다.',
        imageUrl: '/images/lawyers/choi-eun-ah.png'
    }
];

export function getTeamMemberByName(name: string) {
    return TEAM_MEMBERS.find(m => m.name === name) || TEAM_MEMBERS[0];
}
