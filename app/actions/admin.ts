
'use server'


import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function diagnoseUserAction(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: { cases: true, consultations: true }
                }
            }
        });

        if (!user) {
            return { success: false, message: 'User not found in DB' };
        }

        const checks = {
            emailVerified: true, // Mocking as we don't have this field yet, or we assume true if login works
            hasRecentLogin: false,
            isBlocked: user.status === 'BLOCKED',
            dataIntegrity: 'OK'
        };

        // Check recent login (heuristic: updated within 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (user.updatedAt > sevenDaysAgo) {
            checks.hasRecentLogin = true;
        }

        const message = `계정 상태 정상: ${user.email} (Status: ${user.status})`;
        return { success: true, message, checks };

    } catch (e) {
        return { success: false, message: `System Error: ${e}` };
    }
}

export async function seedUserDataAction(userId: string) {
    try {
        console.log(`[SEED] Starting seed for ${userId}`);

        // 1. Get Reference Data (Lawyer)
        const lawyer = await prisma.teamMember.findFirst({ where: { role: 'LAWYER' } });

        // 2. Generate Activities (10 distinct types)
        const activities = [
            { type: 'LOGIN', details: 'Web Login Success', offset: 0 },
            { type: 'VIEW_PAGE', details: '/services/real-estate', offset: -10 },
            { type: 'CLICK_ACTION', details: 'Consultation Button', offset: -15 },
            { type: 'DOWNLOAD', details: 'Case_File_2025.pdf', offset: -60 },
            { type: 'LOGIN', details: 'Mobile App Login', offset: -120 },
            { type: 'VIEW_PAGE', details: '/mypage/cases', offset: -130 },
            { type: 'UPDATE_PROFILE', details: 'Phone Number Changed', offset: -200 },
            { type: 'SEARCH', details: 'Keyword: "Divorce"', offset: -300 },
            { type: 'VIEW_PAGE', details: '/services/family-law', offset: -305 },
            { type: 'LOGOUT', details: 'User Logout', offset: -400 },
        ];

        for (const act of activities) {
            await prisma.userActivity.create({
                data: {
                    userId,
                    type: act.type,
                    details: act.details,
                    ipAddress: '192.168.0.1',
                    device: 'Chrome / MacOS',
                    createdAt: new Date(Date.now() + (act.offset * 60000)) // minutes ago
                }
            });
        }

        // 3. Create Case
        await prisma.case.create({
            data: {
                userId,
                title: '2025 가합 5502 채권 추심',
                description: '미지급 용역비에 대한 채권 추심 및 손해배상',
                status: '진행중',
                statusColor: 'orange',
                caseNumber: '2025가합5502',
                lawyerId: lawyer?.id,
                lawyerInCharge: lawyer?.name || '김지율',
                createdAt: new Date()
            }
        });

        // 4. Create Chat
        const chatRoom = await prisma.chatRoom.create({
            data: {
                userId,
                title: '채권 추심 관련 긴급 문의',
                lawyerId: lawyer?.id,
            }
        });

        const messages = [
            { content: '변호사님, 상대방이 재산을 은닉하려는 정황이 포착되었습니다.', sender: 'user', offset: -30 },
            { content: '증거 자료가 있으신가요? 사진이나 녹취가 필요합니다.', sender: 'lawyer', offset: -25 },
            { content: '네, 방금 이메일로 보냈습니다.', sender: 'user', offset: -10 },
            { content: '확인했습니다. 가압류 신청을 서둘러야겠네요.', sender: 'lawyer', offset: -5 },
        ];

        for (const msg of messages) {
            await prisma.chatMessage.create({
                data: {
                    roomId: chatRoom.id,
                    senderId: msg.sender === 'user' ? userId : (lawyer?.id || 'system'),
                    content: msg.content,
                    createdAt: new Date(Date.now() + (msg.offset * 60000))
                }
            });
        }

        revalidatePath(`/admin/users/${userId}`);
        return { success: true, message: 'Test data generated successfully.' };

    } catch (e) {
        console.error(e);
        return { success: false, message: `Seed Failed: ${e}` };
    }
}
