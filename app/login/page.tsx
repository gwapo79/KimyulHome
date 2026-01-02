
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password.length < 1) {
            setError("비밀번호를 입력해주세요.");
            return;
        }
        // Minimal logic check before network request
        if (password.length < 4) {
            setError("비밀번호가 너무 짧습니다.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("user", JSON.stringify(data.user)); // Persist user
                window.dispatchEvent(new Event("storage")); // Notify other components
                router.push("/dashboard");
            } else {
                const data = await res.json();
                setError(data.error || "로그인에 실패했습니다.");
                if (data.debug_email) console.log("Debug Info:", data);
            }
        } catch (err) {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleKakaoLogin = async () => {
        setLoading(true);
        try {
            await signIn("kakao", { callbackUrl: "/dashboard" });
        } catch (e) {
            console.error(e);
            setError("로그인 처리 중 오류가 발생했습니다.");
            setLoading(false);
        }
        // Redirect happens automatically, so no need to set loading fasle unless error
    };

    return (
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <section id="form" className="bg-white rounded-2xl shadow-sm border border-[#e9e9eb] p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-[#8a765e] rounded-2xl flex items-center justify-center">
                                <i className="fas fa-scale-balanced text-white text-2xl"></i>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-[#181d27] mb-2">로그인</h1>
                        <p className="text-[#535861] text-lg">계정에 로그인하고 사건을 확인하세요</p>
                    </div>
                    <form id="loginForm" noValidate className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#414651] mb-1.5">
                                아이디 <span aria-label="필수 입력" className="text-[#8a765e]">*</span>
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                required
                                aria-describedby="email-error"
                                placeholder="아이디를 입력해주세요"
                                className="w-full px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-1 focus:ring-[#8a765e] transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div id="email-error" role="alert" aria-live="polite" className="mt-1 text-sm text-red-600 hidden"></div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#414651] mb-1.5">
                                비밀번호 <span aria-label="필수 입력" className="text-[#8a765e]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    aria-describedby="password-error"
                                    placeholder="비밀번호를 입력해주세요"
                                    className="w-full px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-1 focus:ring-[#8a765e] transition-colors pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    id="togglePassword"
                                    aria-label="비밀번호 보기/숨기기"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#535861] hover:text-[#8a765e] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                            <div id="password-error" role="alert" aria-live="polite" className="mt-1 text-sm text-red-600 hidden"></div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                className="w-4 h-4 text-[#8a765e] border-[#d5d6d9] rounded focus:ring-[#8a765e] focus:ring-1"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-[#535861]">
                                로그인 상태 유지
                            </label>
                        </div>
                        {error && (
                            <div id="general-error" role="alert" aria-live="assertive" className="p-3 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex">
                                    <i className="fas fa-triangle-exclamation text-red-500 mr-2 mt-0.5"></i>
                                    <span className="text-sm text-red-700">{error}</span>
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            id="loginButton"
                            disabled={loading}
                            className="w-full px-[18px] py-3 bg-[#8a765e] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden text-white font-semibold hover:bg-[#74634e] focus:bg-[#74634e] focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span id="buttonText">{loading ? "로그인 중..." : "로그인"}</span>
                            {loading && <i id="loadingIcon" className="ml-2 fas fa-spinner fa-spin"></i>}
                        </button>
                        <div className="text-center">
                            <Link href="/member/find_password">
                                <span className="text-sm text-[#8a765e] hover:text-[#74634e] transition-colors font-medium cursor-pointer">
                                    비밀번호 찾기
                                </span>
                            </Link>
                        </div>
                    </form>
                </section>
                <section id="social" className="bg-white rounded-2xl shadow-sm border border-[#e9e9eb] p-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#e9e9eb]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-[#535861]">또는</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        id="kakaoLogin"
                        onClick={handleKakaoLogin}
                        aria-label="카카오로 간편 로그인"
                        className="w-full px-[18px] py-3 bg-[#fee500] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-[#d5d6d9] justify-center items-center gap-3 flex overflow-hidden text-[#181d27] font-semibold hover:bg-[#fdd835] focus:bg-[#fdd835] focus:outline-none focus:ring-2 focus:ring-[#fee500] focus:ring-offset-2 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path
                                d="M10 3C5.58 3 2 6.03 2 9.75C2 12.08 3.37 14.13 5.39 15.23L4.69 17.96C4.64 18.15 4.86 18.29 5.02 18.18L8.27 16.07C8.84 16.15 9.42 16.19 10 16.19C14.42 16.19 18 13.16 18 9.44C18 5.72 14.42 2.69 10 2.69V3Z"
                                fill="#181D27"
                            ></path>
                        </svg>
                        카카오로 로그인
                    </button>
                    <p className="mt-4 text-xs text-[#717680] text-center">
                        간편 로그인 시{" "}
                        <Link href="/legal/terms">
                            <span className="text-[#8a765e] hover:text-[#74634e] underline cursor-pointer">이용약관</span>
                        </Link>{" "}
                        및{" "}
                        <Link href="/legal/privacy">
                            <span className="text-[#8a765e] hover:text-[#74634e] underline cursor-pointer">개인정보처리방침</span>
                        </Link>
                        에 동의한 것으로 간주됩니다.
                    </p>
                </section>
                <div className="text-center">
                    <p className="text-[#535861]">
                        계정이 없으신가요?{" "}
                        <Link href="/signup">
                            <span className="text-[#8a765e] hover:text-[#74634e] transition-colors font-medium cursor-pointer">
                                회원가입
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
