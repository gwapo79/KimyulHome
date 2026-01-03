'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
    // Basic client-side auth state check
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Initial fetch from server
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                    // Update localStorage to keep it in sync for other components
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    // Check local storage as fallback or clear it if server says no user
                    const stored = localStorage.getItem("user");
                    if (stored) setUser(JSON.parse(stored));
                }
            })
            .catch(() => {
                // Fallback to local storage
                const stored = localStorage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            });

        // Listen for login events
        const handleStorage = () => {
            const updated = localStorage.getItem("user");
            if (updated) setUser(JSON.parse(updated));
            else setUser(null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header id="header" className="sticky top-0 z-50 bg-white border-b border-[#e9e9eb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20 relative">
                    {/* 1. Left: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center" onClick={closeMenu}>
                            <img src="/assets/images/logo.jpg" alt="서초지율 합동법률사무소" className="h-[48px] lg:h-[72px]" />
                        </Link>
                    </div>

                    {/* 2. Center: Main Navigation (Absolute Center for perfect balance or Flex Center) */}
                    {/* Using absolute centering to ensure it stays in the middle regardless of left/right width differences */}
                    <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6">
                        <Link href="/" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">홈</Link>
                        <Link href="/company/about" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">회사소개</Link>
                        <Link href="/legal/practice-areas" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">전문분야</Link>
                        <Link href="/legal/success-cases" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">성공사례</Link>
                        <Link href="/company/reviews" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">고객후기</Link>
                        <Link href="/support/faq" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">FAQ</Link>
                        <Link href="/media/blog" className="text-[#181d27] font-semibold hover:text-[#74634e] transition-colors cursor-pointer text-[15px]">블로그</Link>
                    </nav>

                    {/* 3. Right: User Actions & CTA */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* User Menu Group */}
                        <div className="flex items-center space-x-3 text-sm text-gray-500 relative">
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="hover:text-[#74634e] transition-colors flex items-center">
                                        <i className="fas fa-user-circle mr-1.5 text-lg"></i>
                                        {user.name}님
                                    </Link>
                                    <span className="w-px h-3 bg-gray-300 mx-2"></span>
                                    <button onClick={handleLogout} className="hover:text-[#74634e] transition-colors">로그아웃</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="hover:text-[#74634e] transition-colors">로그인</Link>
                                    <span className="w-px h-3 bg-gray-300 mx-2"></span>
                                    <Link href="/signup" className="hover:text-[#74634e] transition-colors">회원가입</Link>
                                </>
                            )}
                        </div>

                        {/* CTA Button */}
                        <Link href="/company/consultation" className="px-6 py-2.5 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium text-base shadow-sm">
                            무료 상담 신청
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Visible on mobile only) */}
                    <div className="flex items-center lg:hidden space-x-4">
                        {/* Mobile CTA (Optional: Keep it if space allows, usually better for conversion) */}
                        <Link href="/company/consultation" className="px-3 py-2 bg-[#8a765e] text-white text-xs rounded-md font-medium">
                            무료 상담
                        </Link>

                        <button
                            className="p-2 text-[#535861] hover:text-[#74634e] z-50 relative focus:outline-none"
                            onClick={toggleMenu}
                            aria-label="메뉴 열기"
                        >
                            {isMenuOpen ? (
                                <i className="fas fa-times text-2xl"></i>
                            ) : (
                                <i className="fas fa-bars text-2xl"></i>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`
                fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out lg:hidden
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `} style={{ top: '0', paddingTop: '80px' }}>
                <div className="flex flex-col h-full px-6 pb-6 overflow-y-auto">
                    <nav className="flex flex-col space-y-4 text-lg font-medium text-[#181d27]">
                        <Link href="/" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            홈 <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                        <Link href="/company/about" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            회사소개 <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                        <Link href="/legal/practice-areas" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            전문분야 <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                        <Link href="/legal/success-cases" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            성공사례 <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                        <Link href="/company/reviews" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            고객후기 <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                        <Link href="/support/faq" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            FAQ <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                        <Link href="/media/blog" onClick={closeMenu} className="border-b border-gray-100 py-3 flex justify-between items-center">
                            블로그 <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                        </Link>
                    </nav>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        {user ? (
                            <div className="bg-neutral-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-medium text-[#181d27]">{user.name}님</span>
                                    <Link href="/dashboard" onClick={closeMenu} className="text-xs text-[#8a765e] font-semibold">
                                        대시보드 이동
                                    </Link>
                                </div>
                                <button onClick={handleLogout} className="w-full py-2 bg-white border border-[#d5d6d9] rounded-lg text-[#535861] text-sm font-medium">
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/login" onClick={closeMenu} className="flex justify-center items-center py-3 border border-[#d5d6d9] rounded-lg text-[#535861] font-medium">
                                    로그인
                                </Link>
                                <Link href="/signup" onClick={closeMenu} className="flex justify-center items-center py-3 border border-[#d5d6d9] rounded-lg text-[#535861] font-medium">
                                    회원가입
                                </Link>
                            </div>
                        )}
                        <Link href="/company/consultation" onClick={closeMenu} className="mt-4 block w-full text-center py-3.5 bg-[#8a765e] text-white rounded-lg font-bold shadow-sm">
                            무료 상담 신청
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
