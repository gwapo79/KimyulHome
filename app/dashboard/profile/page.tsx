
"use client";

import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/dashboard">
                            <span className="text-[#8a765e] hover:text-[#74634e] cursor-pointer">마이페이지</span>
                        </Link>
                    </li>
                    <li><i className="fas fa-chevron-right text-[#d5d6d9] text-xs"></i></li>
                    <li><span aria-current="page" className="text-[#535861]">프로필 설정</span></li>
                </ol>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white rounded-2xl border border-[#e9e9eb] p-4">
                        <div className="space-y-2">
                            <Link href="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-house mr-3"></i>
                                대시보드
                            </Link>
                            <Link href="/dashboard/my_cases" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-briefcase mr-3"></i>
                                내 사건
                            </Link>
                            <Link href="/dashboard/documents" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-file-lines mr-3"></i>
                                문서 관리
                            </Link>
                            <Link href="/dashboard/calendar" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-calendar mr-3"></i>
                                일정 관리
                            </Link>
                            <Link href="/dashboard/chat" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-comments mr-3"></i>
                                상담 채팅
                                <span className="ml-auto bg-[#8a765e] text-white text-xs rounded-full px-2 py-1">2</span>
                            </Link>
                            <Link href="/dashboard/notifications" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-bell mr-3"></i>
                                알림
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                            </Link>
                            <Link href="/dashboard/billing" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-credit-card mr-3"></i>
                                결제 관리
                            </Link>
                            <div className="border-t border-[#e9e9eb] my-4"></div>
                            <Link href="/dashboard/profile" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
                                <i className="fas fa-user mr-3"></i>
                                프로필 설정
                            </Link>
                            <Link href="/dashboard/security" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-shield-halved mr-3"></i>
                                보안 설정
                            </Link>
                        </div>
                    </nav>
                </aside>

                <div className="flex-1">
                    <section id="form" role="region" aria-label="프로필 정보 수정">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb]">
                            <div className="p-6 lg:p-8 border-b border-[#e9e9eb]">
                                <h1 className="text-2xl font-bold text-[#181d27]">내 프로필</h1>
                                <p className="text-[#535861] mt-1">정확한 정보가 빠른 상담에 도움이 됩니다.</p>
                            </div>
                            <form className="space-y-8 p-6 lg:p-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-[#374151]">프로필 이미지</label>
                                        <p className="text-sm text-[#535861]">이 사진이 프로필에 표시됩니다.</p>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden relative">
                                            <Image src="/assets/images/profiles/profile_01.png" alt="현재 프로필 이미지" fill className="object-cover" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button type="button" className="px-4 py-2 text-sm font-medium text-[#414651] bg-white border border-[#d5d6d9] rounded-lg shadow-sm hover:bg-neutral-50">삭제</button>
                                            <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-[#8a765e] border border-transparent rounded-lg shadow-sm hover:bg-[#74634e]">변경</button>
                                        </div>
                                    </div>
                                    <div className="md:col-start-2 md:col-span-2">
                                        <p className="text-xs text-[#717680]">JPG 또는 PNG 형식, 최대 5MB</p>
                                    </div>
                                </div>
                                <hr className="border-t border-[#e9e9eb]" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label htmlFor="name" className="block text-sm font-medium text-[#374151] md:col-span-1">이름 <span className="text-[#8a765e]">*</span></label>
                                    <div className="md:col-span-2">
                                        <input type="text" id="name" placeholder="예) 홍길동" defaultValue="김○○" required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label htmlFor="contact" className="block text-sm font-medium text-[#374151] md:col-span-1">연락처 <span className="text-[#8a765e]">*</span></label>
                                    <div className="md:col-span-2">
                                        <input type="tel" id="contact" placeholder="예) 010-1234-5678 (숫자만 입력 가능)" required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label htmlFor="email" className="block text-sm font-medium text-[#374151] md:col-span-1">이메일</label>
                                    <div className="md:col-span-2">
                                        <input type="email" id="email" placeholder="예) user@myhome.kr" className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                    </div>
                                </div>
                                <hr className="border-t border-[#e9e9eb]" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <label className="block text-sm font-medium text-[#374151] md:col-span-1">주소</label>
                                    <div className="md:col-span-2 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input type="text" id="address1" placeholder="주소 검색을 통해 자동 입력됩니다." readOnly className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] bg-gray-50 flex-1" />
                                            <button type="button" className="px-4 py-2.5 text-sm font-medium text-[#414651] bg-white border border-[#d5d6d9] rounded-lg shadow-sm hover:bg-neutral-50 whitespace-nowrap">주소 검색</button>
                                        </div>
                                        <input type="text" id="address2" placeholder="나머지 주소를 입력하세요." className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-[#e9e9eb] flex justify-end items-center gap-3">
                                    <button type="button" className="px-[18px] py-2.5 bg-white rounded-lg shadow-sm border border-[#d5d6d9] text-[#414651] text-base font-medium hover:bg-neutral-50">취소</button>
                                    <button type="submit" className="px-[18px] py-2.5 bg-[#8a765e] rounded-lg shadow-sm text-white text-base font-medium hover:bg-[#74634e]">저장</button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
