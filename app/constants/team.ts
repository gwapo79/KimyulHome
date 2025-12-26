export const TEAM_MEMBERS = [
    {
        id: 'kim-seoyun',
        name: '김서윤',
        role: '변호사',
        position: '대표변호사',
        specialty: '부동산/상속',
        email: 'seoyun.kim@lawfirm.com',
        description: '지적이고 온화한 이미지의 부동산/상속 전문 변호사입니다.',
        imageUrl: '/images/lawyers/lawyer_female_1_1766624476690.png'
    },
    {
        id: 'park-junhyeok',
        name: '박준혁',
        role: '변호사',
        position: '파트너 변호사',
        specialty: '민사/채무조정',
        email: 'junhyeok.park@lawfirm.com',
        description: '날카롭고 신뢰감 있는 민사/채무조정 해결사입니다.',
        imageUrl: '/images/lawyers/lawyer_male_1_1766624442586.png'
    },
    {
        id: 'lee-minho',
        name: '이민호',
        role: '법무사',
        position: '수석 법무사',
        specialty: '등기/행정',
        email: 'minho.lee@lawfirm.com',
        description: '정갈하고 꼼꼼한 등기/행정 전문가입니다.',
        imageUrl: '/images/lawyers/lawyer_male_2_1766624460497.png'
    },
    {
        id: 'choi-eunji',
        name: '최은지',
        role: '법무사',
        position: '법무사',
        specialty: '개인회생/파산',
        email: 'eunji.choi@lawfirm.com',
        description: '친절하고 세심한 개인회생/파산 케어 전문가입니다.',
        imageUrl: '/images/lawyers/lawyer_female_2_1766624493029.png'
    }
];

export function getTeamMemberByName(name: string) {
    return TEAM_MEMBERS.find(m => m.name === name) || TEAM_MEMBERS[0];
}
