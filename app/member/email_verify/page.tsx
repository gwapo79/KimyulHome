
"use client";

import Link from "next/link";
import { useState } from "react";

export default function EmailVerifyPage() {
    return (
        <main className="min-h-screen flex items-center justify-center py-16 px-4 bg-neutral-50">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e9e9eb]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#8a765e] rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-envelope text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-4">이메일 인증</h1>
                        <p className="text-[#535861] leading-relaxed">
                            메일로 받은 6자리 코드를 입력하세요
                        </p>
                        <p className="text-sm text-[#717680] mt-2">
                            <span id="email-address">user@example.com</span>으로 인증 코드를 발송했습니다
                        </p>
                    </div>
                    <form id="otp-form" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-[#414651]">
                                인증 코드 <span className="text-[#8a765e]">*</span>
                            </label>
                            <div className="flex justify-center space-x-3">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        inputMode="numeric"
                                        pattern="[0-9]"
                                        className="w-10 h-10 lg:w-12 lg:h-12 text-center border border-[#d5d6d9] rounded-lg focus:border-[#8a765e] focus:outline-none focus:ring-2 focus:ring-[#8a765e]/20 transition-colors text-xl font-semibold"
                                    />
                                ))}
                            </div>
                            <div id="otp-error" role="alert" aria-live="polite" className="text-sm text-red-600 hidden">
                                인증 시간이 만료되었습니다. 코드를 재전송해주세요.
                            </div>
                        </div>
                        <div className="text-center">
                            <div id="timer-container" className="mb-4">
                                <span className="text-sm text-[#535861]">남은 시간: </span>
                                <span id="timer" role="status" aria-live="polite" className="text-sm font-medium text-[#8a765e]">
                                    04:54
                                </span>
                            </div>
                            <button
                                type="button"
                                id="resend-btn"
                                className="text-sm text-[#8a765e] hover:text-[#74634e] transition-colors font-medium"
                            >
                                <i className="fas fa-arrow-rotate-right mr-2"></i>코드 재전송
                            </button>
                        </div>
                        <button
                            type="submit"
                            id="verify-btn"
                            className="w-full px-6 py-3 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors"
                        >
                            인증하기
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#717680]">
                            메일을 받지 못하셨나요?{" "}
                            <span className="text-[#8a765e] hover:text-[#74634e] transition-colors cursor-pointer font-medium">
                                스팸함을 확인해보세요
                            </span>
                        </p>
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/login">
                            <span className="inline-flex items-center text-sm text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-arrow-left mr-2"></i>
                                로그인으로 돌아가기
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
