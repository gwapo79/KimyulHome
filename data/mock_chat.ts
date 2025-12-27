
export interface ChatMessage {
    id: string;
    sender: 'USER' | 'ADMIN'; // ADMIN = Me
    text: string;
    timestamp: string;
}

export interface ChatRoom {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    status: 'ACTIVE' | 'ARCHIVED';
    messages: ChatMessage[];
    assigneeId?: string;
}

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
    {
        id: 'chat1',
        userId: 'u123',
        userName: '김철수 의뢰인',
        lastMessage: '변호사님, 혹시 소장은 접수 되었나요?',
        assigneeId: 't2',
        lastMessageTime: '10분 전',
        unreadCount: 2,
        status: 'ACTIVE',
        messages: [
            { id: 'm1', sender: 'ADMIN', text: '안녕하세요, 김철수님. 서초지율입니다.', timestamp: '어제 14:00' },
            { id: 'm2', sender: 'USER', text: '네 안녕하세요. 사건 진행 상황이 궁금해서요.', timestamp: '어제 14:05' },
            { id: 'm3', sender: 'ADMIN', text: '현재 소장 초안 작성 중이며, 내일 중으로 보내드릴 예정입니다.', timestamp: '어제 14:10' },
            { id: 'm4', sender: 'USER', text: '아 네 알겠습니다. 감사합니다.', timestamp: '어제 14:11' },
            { id: 'm5', sender: 'USER', text: '변호사님, 혹시 소장은 접수 되었나요?', timestamp: '오늘 10:30' },
        ]
    },
    {
        id: 'chat2',
        userId: 'u124',
        userName: '이영희 의뢰인',
        lastMessage: '네 확인했습니다. 감사합니다.',
        lastMessageTime: '1시간 전',
        unreadCount: 0,
        status: 'ACTIVE',
        messages: [
            { id: 'm1', sender: 'ADMIN', text: '요청하신 증거 자료 목록 송부드립니다.', timestamp: '오늘 09:00' },
            { id: 'm2', sender: 'USER', text: '네 확인했습니다. 감사합니다.', timestamp: '오늘 09:30' },
        ]
    },
    {
        id: 'chat3',
        userId: 'u125',
        userName: '박민수',
        lastMessage: '상담 예약을 변경하고 싶습니다.',
        lastMessageTime: '어제',
        unreadCount: 5,
        status: 'ACTIVE',
        messages: [
            { id: 'm1', sender: 'USER', text: '저기요', timestamp: '어제 18:00' },
            { id: 'm2', sender: 'USER', text: '상담 예약을 변경하고 싶습니다.', timestamp: '어제 18:01' },
        ]
    }
];
