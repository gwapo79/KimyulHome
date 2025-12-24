'use server';

import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

interface SubmitState {
    success?: boolean;
    error?: string;
    message?: string;
}

export async function submitConsultation(prevState: SubmitState, formData: FormData): Promise<SubmitState> {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const content = formData.get('message') as string; // 'message' in name attribute
    const category = (formData.get('category') as string) || '일반상담';

    if (!name || !phone || !content) {
        return { success: false, error: '모든 필수 항목을 입력해주세요.' };
    }

    try {
        // 1. Save to DB
        const consultation = await prisma.consultation.create({
            data: {
                name,
                phone,
                category,
                content,
                status: '접수',
            },
        });

        // 2. Send Email
        // 2. Send Email (Non-blocking)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !process.env.EMAIL_USER.includes('your-email')) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: 'bizgguya@gmail.com',
                    subject: `[서초지율] 새로운 상담 신청이 접수되었습니다 - ${name}님`,
                    html: `
            <h2>새로운 상담 신청</h2>
            <p><strong>고객명:</strong> ${name}</p>
            <p><strong>연락처:</strong> ${phone}</p>
            <p><strong>상담분야:</strong> ${category}</p>
            <p><strong>상담내용:</strong></p>
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${content}</pre>
            <p><small>접수일시: ${consultation.createdAt.toLocaleString()}</small></p>
          `,
                };

                await transporter.sendMail(mailOptions);
            } else {
                console.warn('EMAIL_USER or EMAIL_PASS not set or placeholder. Email skipped.');
            }
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Non-blocking
        }

        return { success: true, message: '상담 신청이 성공적으로 접수되었습니다.' };
    } catch (error) {
        console.error('Failed to submit consultation:', error);
        return { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
    }
}
