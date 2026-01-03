
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        // terms and privacy are required by checkbox 'required' attribute, 
        // but we can also track them if we want strictly controlled inputs.
        // For simplicity, we rely on browser validation for checkboxes + required attribute.
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "password") {
            validatePassword(value);
        }
    };

    const validatePassword = (pwd: string) => {
        const hasLength = pwd.length >= 8;
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        const hasLetter = /[a-zA-Z]/.test(pwd);

        if (!hasLength) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }
        if (!hasNumber || !hasSpecial || !hasLetter) {
            setError("비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword(formData.password)) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    phone: formData.phone,
                    provider: 'local'
                }),
            });

            const data = await res.json();

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("user", JSON.stringify(data.user)); // Persist user
                window.dispatchEvent(new Event("storage"));
                alert("회원가입이 완료되었습니다."); // Or auto-login behavior
                router.push("/dashboard");
            } else {
                setError(data.error || "회원가입에 실패했습니다.");
            }
        } catch (err) {
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleKakaoSignup = async () => {
        // Mock Kakao Signup
        setLoading(true);
        try {
            // Generate a random ID for simulation
            const randomId = Math.floor(Math.random() * 1000000).toString();
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider: 'kakao',
                    kakaoId: randomId,
                    name: `KakaoUser_${randomId}`,
                    // Email might be missing or provided by Kakao. We'll simulate it in backend logic or here.
                }),
            });

            if (res.ok) {
                const data = await res.json(); // API should return user on success
                localStorage.setItem("user", JSON.stringify(data.user));
                window.dispatchEvent(new Event("storage"));
                alert("카카오 계정으로 가입(로그인)되었습니다.");
                router.push("/dashboard");
            } else {
                setError("카카오 가입 실패");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="py-16 lg:py-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Left Content */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl lg:text-5xl font-bold text-[#181d27] mb-6">
                                3분 만에 시작하세요
                            </h1>
                            <p className="text-xl text-[#535861] mb-8">
                                무료 상담과 맞춤 서비스를 이용해보세요
                            </p>
                        </div>
                        {/* Benefits */}
                        <div className="space-y-6 mb-12">
                            <div className="flex items-start">
                                <img src="/assets/images/logo.jpg" alt="서초지율 합동법률사무소" className="h-[72px]" />
                            </div>
                            <p className="text-[#535861] mb-6 max-w-md">
                                부동산 분쟁부터 채무 조정까지, 법률과 금융의 통합 전문성으로
                                고객의 문제를 근본적으로 해결합니다.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center text-[#535861]">
                                    <i className="fas fa-map-marker-alt w-5 mr-3"></i>
                                    서울시 강남구 테헤란로 123, 456빌딩 7층
                                </div>
                                <div className="flex items-center text-[#535861]">
                                    <i className="fas fa-phone w-5 mr-3"></i>
                                    02-0000-0000
                                </div>
                                <div className="flex items-center text-[#535861]">
                                    <i className="fas fa-envelope w-5 mr-3"></i>
                                    info@서초지율.com
                                </div>
                            </div>
                        </div>
                        {/* Quick Links */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-[#181d27] mb-4">빠른 링크</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/company/about">
                                        <span className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">회사소개</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/services/practice_areas">
                                        <span className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">전문분야</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/legal/success-cases">
                                        <span className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">성공사례</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/services/reviews">
                                        <span className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">고객후기</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/resources/faq">
                                        <span className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">FAQ</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-[#e9e9eb] p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-[#181d27]">회원가입</h2>
                                <p className="text-[#535861] mt-2">간단한 정보 입력으로 가입을 완료하세요</p>
                            </div>

                            {/* Kakao Button added here */}
                            <div className="mb-6">
                                <button
                                    type="button"
                                    onClick={handleKakaoSignup}
                                    className="w-full px-[18px] py-3 bg-[#fee500] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-[#d5d6d9] justify-center items-center gap-3 flex overflow-hidden text-[#181d27] font-semibold hover:bg-[#fdd835] focus:bg-[#fdd835] focus:outline-none focus:ring-2 focus:ring-[#fee500] focus:ring-offset-2 transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path
                                            d="M10 3C5.58 3 2 6.03 2 9.75C2 12.08 3.37 14.13 5.39 15.23L4.69 17.96C4.64 18.15 4.86 18.29 5.02 18.18L8.27 16.07C8.84 16.15 9.42 16.19 10 16.19C14.42 16.19 18 13.16 18 9.44C18 5.72 14.42 2.69 10 2.69V3Z"
                                            fill="#181D27"
                                        ></path>
                                    </svg>
                                    카카오로 3초 만에 시작하기
                                </button>
                                <div className="relative mt-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[#e9e9eb]"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-white text-[#535861]">또는 이메일로 가입</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <form id="registerForm" className="space-y-6" onSubmit={handleSignup}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#414651] mb-1.5">
                                        이름 <span className="text-[#8a765e]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-1 focus:ring-[#8a765e] transition-colors"
                                        placeholder="홍길동"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#414651] mb-1.5">
                                        이메일 <span className="text-[#8a765e]">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-1 focus:ring-[#8a765e] transition-colors"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-[#414651] mb-1.5">
                                        휴대전화 <span className="text-[#8a765e]">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-1 focus:ring-[#8a765e] transition-colors"
                                        placeholder="010-1234-5678"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[#414651] mb-1.5">
                                        비밀번호 <span className="text-[#8a765e]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-[#d5d6d9] focus:border-[#8a765e] focus:outline-none focus:ring-1 focus:ring-[#8a765e] transition-colors pr-10"
                                            placeholder="8~20자 영문, 숫자, 특수문자 포함"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#535861]" onClick={() => setShowPassword(!showPassword)}>
                                            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-start">
                                        <input type="checkbox" id="terms" name="terms" required className="mt-1 w-4 h-4 text-[#8a765e] border-[#d5d6d9] rounded focus:ring-[#8a765e]" />
                                        <label htmlFor="terms" className="ml-2 text-sm text-[#535861]">
                                            <Link href="/legal/terms"><span className="text-[#8a765e] hover:underline cursor-pointer">이용약관</span></Link>에 동의합니다 <span className="text-[#8a765e]">*</span>
                                        </label>
                                    </div>
                                    <div className="flex items-start">
                                        <input type="checkbox" id="privacy" name="privacy" required className="mt-1 w-4 h-4 text-[#8a765e] border-[#d5d6d9] rounded focus:ring-[#8a765e]" />
                                        <label htmlFor="privacy" className="ml-2 text-sm text-[#535861]">
                                            <Link href="/legal/privacy"><span className="text-[#8a765e] hover:underline cursor-pointer">개인정보처리방침</span></Link>에 동의합니다 <span className="text-[#8a765e]">*</span>
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full px-6 py-4 bg-[#8a765e] text-white rounded-lg font-semibold hover:bg-[#74634e] transition-colors shadow-sm disabled:opacity-50">
                                    {loading ? "가입 처리중..." : "가입하기"}
                                </button>

                                <div className="text-center text-sm text-[#535861]">
                                    이미 계정이 있으신가요? <Link href="/login"><span className="text-[#8a765e] hover:underline font-medium cursor-pointer">로그인</span></Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
