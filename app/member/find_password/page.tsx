
"use client";

import Link from "next/link";
import { useState } from "react";

export default function FindPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email Input, 2: Verification Code, 3: Success

    return (
        <main className="py-16 lg:py-24 bg-neutral-50 min-h-screen">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">

                {/* Step 1: Email Input */}
                <section id="step1" className={`bg-white rounded-2xl p-8 shadow-sm ${step === 1 ? 'block' : 'hidden'}`}>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-key text-white text-2xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-[#181d27] mb-4">비밀번호 재설정</h1>
                        <p className="text-[#535861] text-lg">가입하신 이메일을 입력하시면 재설정 링크를 보내드립니다</p>
                    </div>
                    <form id="emailForm" aria-label="이메일 입력 폼" className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#414651] mb-2">
                                이메일 주소 <span className="text-[#8a765e]">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                aria-describedby="email-error email-hint"
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors"
                            />
                            <div id="email-hint" className="text-sm text-[#535861] mt-1">
                                가입 시 사용한 이메일 주소를 정확히 입력해주세요
                            </div>
                            <div id="email-error" role="alert" aria-live="polite" className="text-sm text-red-600 mt-1 hidden">
                                등록되지 않은 이메일입니다. 다시 확인해주세요.
                            </div>
                        </div>
                        <button
                            type="submit"
                            id="sendEmailBtn"
                            className="w-full px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors disabled:bg-[#d5d6d9] disabled:cursor-not-allowed"
                        >
                            재설정 메일 보내기
                        </button>
                        <div className="text-center">
                            <Link href="/login">
                                <span className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors cursor-pointer">
                                    로그인으로 돌아가기
                                </span>
                            </Link>
                        </div>
                    </form>
                </section>

                {/* Step 2: Verification Code */}
                <section id="step2" className={`bg-white rounded-2xl p-8 shadow-sm ${step === 2 ? 'block' : 'hidden'}`}>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-shield-halved text-white text-2xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-[#181d27] mb-4">인증 코드 확인</h1>
                        <p className="text-[#535861] text-lg">
                            이메일로 발송된 6자리 인증 코드를 입력하고<br />
                            새로운 비밀번호를 설정해주세요
                        </p>
                        <div className="mt-4 p-3 bg-[#f8f3ed] rounded-lg">
                            <p className="text-sm text-[#74634e]">
                                <i className="fas fa-envelope mr-2"></i>
                                <span id="sentEmail">example@email.com</span>으로 인증 코드를 발송했습니다
                            </p>
                        </div>
                    </div>
                    <form id="resetForm" aria-label="비밀번호 재설정 폼" className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                        <div>
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-[#414651] mb-2">
                                인증 코드 <span className="text-[#8a765e]">*</span>
                            </label>
                            <input
                                type="text"
                                id="verificationCode"
                                name="verificationCode"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                                aria-describedby="code-error code-hint"
                                placeholder="000000"
                                className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors text-center text-2xl font-mono tracking-widest"
                            />
                            <div id="code-hint" className="text-sm text-[#535861] mt-1">
                                이메일로 받은 6자리 숫자를 입력해주세요
                            </div>
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-[#414651] mb-2">
                                새 비밀번호 <span className="text-[#8a765e]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    minLength={8}
                                    placeholder="새 비밀번호를 입력하세요"
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors"
                                />
                            </div>
                            <div id="password-hint" className="text-sm text-[#535861] mt-2">
                                • 8자 이상<br />
                                • 영문 대소문자, 숫자, 특수문자 중 3종류 이상 포함
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#414651] mb-2">
                                비밀번호 확인 <span className="text-[#8a765e]">*</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                placeholder="비밀번호를 다시 입력하세요"
                                className="w-full px-4 py-3 pr-12 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                id="cancelBtn"
                                onClick={() => setStep(1)}
                                className="flex-1 px-6 py-3 bg-white text-[#535861] rounded-lg font-semibold border border-[#d5d6d9] hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                id="changePasswordBtn"
                                className="flex-1 px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors"
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#535861] mb-2">인증 코드를 받지 못하셨나요?</p>
                        <button type="button" className="text-[#8a765e] hover:text-[#74634e] font-medium transition-colors">
                            재발송 (60초)
                        </button>
                    </div>
                </section>

                {/* Step 3: Success Message */}
                <section id="successMessage" className={`bg-white rounded-2xl p-8 shadow-sm text-center ${step === 3 ? 'block' : 'hidden'}`}>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-check text-green-600 text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#181d27] mb-4">비밀번호가 성공적으로 변경되었습니다</h2>
                    <p className="text-[#535861] mb-8">새로운 비밀번호로 로그인해주세요</p>
                    <Link href="/login">
                        <span className="inline-block px-8 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors cursor-pointer">
                            로그인하기
                        </span>
                    </Link>
                </section>
            </div>
        </main>
    );
}
