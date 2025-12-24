'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitConsultation } from '@/app/actions/submit-consultation';

const initialState = {
    success: false,
    error: '',
    message: '',
};

export default function HeroConsultationForm() {
    const [state, formAction, isPending] = useActionState(submitConsultation, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            alert(state.message || '상담 신청이 완료되었습니다.');
            formRef.current?.reset();
        } else if (state.error) {
            alert(state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            <div>
                <label htmlFor="hero-name" className="block text-sm font-medium text-[#414651] mb-1">성함</label>
                <input
                    type="text"
                    id="hero-name"
                    name="name"
                    required
                    placeholder="성함을 입력해주세요"
                    className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none"
                />
            </div>
            <div>
                <label htmlFor="hero-phone" className="block text-sm font-medium text-[#414651] mb-1">연락처</label>
                <input
                    type="tel"
                    id="hero-phone"
                    name="phone"
                    required
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none"
                />
            </div>
            <div>
                <label htmlFor="hero-category" className="block text-sm font-medium text-[#414651] mb-1">상담 분야</label>
                <select
                    id="hero-category"
                    name="category"
                    defaultValue="전세사기"
                    className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none bg-white"
                >
                    <option value="전세사기">전세사기</option>
                    <option value="부동산 분쟁">부동산 분쟁</option>
                    <option value="경매">경매</option>
                    <option value="채무조정">채무조정</option>
                    <option value="개인회생">개인회생</option>
                    <option value="형사소송">형사소송</option>
                    <option value="기타">기타</option>
                </select>
            </div>
            <input type="hidden" name="message" value="메인 페이지 히어로 섹션에서 간편 신청" />
            <button
                type="submit"
                disabled={isPending}
                className="w-full px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors disabled:opacity-70"
            >
                {isPending ? '신청 중...' : '무료 상담 신청'}
            </button>
        </form>
    );
}
