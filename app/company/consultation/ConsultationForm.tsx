'use client';

import { useActionState } from 'react';
import { submitConsultation } from '@/app/actions/submit-consultation';

const initialState = {
    success: false,
    error: '',
    message: '',
};

export default function ConsultationForm() {
    const [state, formAction, isPending] = useActionState(submitConsultation, initialState);

    if (state.success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-[#f0fdf4] rounded-full">
                    <i className="fas fa-check text-3xl text-[#15803d]"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#181d27] mb-4">상담 신청이 접수되었습니다</h3>
                <p className="text-[#535861] mb-8">
                    담당 변호사가 내용 확인 후<br />
                    30분 이내에 기재해주신 연락처로 연락드리겠습니다.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors"
                >
                    추가 상담 신청하기
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#181d27] mb-4">상담 신청서</h2>
                <p className="text-xl text-[#535861]">
                    간단한 정보만 입력하시면 전문가가 빠르게 연락드리겠습니다
                </p>
            </div>
            <form action={formAction} noValidate className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#181d27] mb-1">
                        이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="이름을 입력해주세요"
                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:ring-[#8a765e] focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#181d27] mb-1">
                        연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="예: 010-1234-5678"
                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:ring-[#8a765e] focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[#181d27] mb-1">
                        상담 분야
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:ring-[#8a765e] focus:outline-none bg-white"
                        defaultValue="일반상담"
                    >
                        <option value="일반상담">선택해주세요 (기본: 일반상담)</option>
                        <option value="부동산 분쟁">부동산 분쟁 (전세사기/명도)</option>
                        <option value="채무조정">채무조정 (개인회생/파산)</option>
                        <option value="형사소송">형사소송</option>
                        <option value="민사소송">민사소송</option>
                        <option value="기업법무">기업법무</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#181d27] mb-1">
                        상담 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="부동산·채무·회생 등 상담이 필요한 내용을 적어주세요."
                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:ring-[#8a765e] focus:outline-none"
                    ></textarea>
                </div>

                {state?.error && (
                    <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                        <i className="fas fa-exclamation-circle mr-2"></i> {state.error}
                    </div>
                )}

                <div className="flex items-start">
                    <input
                        id="privacy-agreement"
                        name="privacy-agreement"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-[#8a765e] border-[#d5d6d9] rounded focus:ring-[#8a765e] mt-0.5"
                    />
                    <label htmlFor="privacy-agreement" className="ml-3 block text-sm text-[#535861]">
                        본인은 입력한 개인정보가 상담 목적에 한해 수집·이용되는 것에 동의합니다.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-6 py-4 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isPending ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i> 전송 중...
                        </>
                    ) : (
                        '무료 상담 신청하기'
                    )}
                </button>
            </form>
        </div>
    );
}
