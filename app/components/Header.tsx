'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
    // Basic client-side auth state check
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check local storage on mount
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));

        // Listen for login events
        const handleStorage = () => {
            const updated = localStorage.getItem("user");
            if (updated) setUser(JSON.parse(updated));
            else setUser(null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <header id="header" className="sticky top-0 z-50 bg-white border-b border-[#e9e9eb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    <Link href="/" className="flex items-center">
                        <img src="/assets/images/logo.jpg" alt="서초지율 합동법률사무소" className="h-[72px]" />
                    </Link>
                    <nav className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">홈</Link>
                        <Link href="/company/about" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">회사소개</Link>
                        <div className="relative group">
                            <button className="text-[#535861] hover:text-[#74634e] transition-colors flex items-center">
                                전문분야
                                <i className="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#e9e9eb] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="p-2">
                                    <Link href="/legal/practice-areas" className="block px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] cursor-pointer">부동산 분쟁</Link>
                                    <Link href="/legal/practice-areas" className="block px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] cursor-pointer">채무 조정</Link>
                                    <Link href="/legal/practice-areas" className="block px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] cursor-pointer">개인회생/파산</Link>
                                </div>
                            </div>
                        </div>
                        <Link href="/legal/success-cases" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">성공사례</Link>
                        <Link href="/company/reviews" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">고객후기</Link>
                        <Link href="/support/faq" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">FAQ</Link>
                        <Link href="/media/blog" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">블로그</Link>
                    </nav>
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className="text-[#535861] hover:text-[#74634e] font-medium">{user.name}님</Link>
                                <button onClick={handleLogout} className="px-4 py-2 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">로그아웃</button>
                            </div>
                        ) : (
                            <Link href="/login" className="px-4 py-2 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">로그인</Link>
                        )}
                        <Link href="/company/consultation" className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium cursor-pointer">무료 상담 신청</Link>
                    </div>
                    <button className="lg:hidden p-2 text-[#535861] hover:text-[#74634e]">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
