
"use client";

import Link from "next/link";

export default function SecurityPage() {
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
                    <li><span aria-current="page" className="text-[#535861]">보안 설정</span></li>
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
                            <Link href="/dashboard/profile" className="flex items-center px-4 py-3 rounded-lg hover:bg-neutral-50 text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">
                                <i className="fas fa-user mr-3"></i>
                                프로필 설정
                            </Link>
                            <Link href="/dashboard/security" className="flex items-center px-4 py-3 rounded-lg bg-[#8a765e] text-white font-medium cursor-pointer">
                                <i className="fas fa-shield-halved mr-3"></i>
                                보안 설정
                            </Link>
                        </div>
                    </nav>
                </aside>

                <div className="flex-1 space-y-8">
                    <section id="password" role="region" aria-label="비밀번호 변경">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb]">
                            <div className="p-6 lg:p-8 border-b border-[#e9e9eb]">
                                <h1 className="text-2xl font-bold text-[#181d27]">비밀번호 변경</h1>
                                <p className="text-[#535861] mt-1">계정 보안을 위해 정기적으로 비밀번호를 변경해주세요.</p>
                            </div>
                            <form className="space-y-6 p-6 lg:p-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label htmlFor="current-password" className="block text-sm font-medium text-[#374151] md:col-span-1">현재 비밀번호 <span className="text-[#8a765e]">*</span></label>
                                    <div className="md:col-span-2">
                                        <input type="password" id="current-password" placeholder="현재 비밀번호를 입력하세요" required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <label htmlFor="new-password" className="block text-sm font-medium text-[#374151] md:col-span-1">새 비밀번호 <span className="text-[#8a765e]">*</span></label>
                                    <div className="md:col-span-2">
                                        <input type="password" id="new-password" placeholder="새 비밀번호를 입력하세요" required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                        <div className="text-sm text-[#535861] mt-2">
                                            <p className="mb-2">강한 비밀번호 권장사항:</p>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                <li>8-20자 길이</li>
                                                <li>대문자와 소문자 포함</li>
                                                <li>숫자 포함</li>
                                                <li>특수문자 포함 권장</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-[#374151] md:col-span-1">새 비밀번호 확인 <span className="text-[#8a765e]">*</span></label>
                                    <div className="md:col-span-2">
                                        <input type="password" id="confirm-password" placeholder="새 비밀번호를 다시 입력하세요" required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-[#e9e9eb] flex justify-end">
                                    <button type="submit" className="px-[18px] py-2.5 bg-[#8a765e] rounded-lg shadow-sm text-white text-base font-medium hover:bg-[#74634e]">변경하기</button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section id="2fa" role="region" aria-label="2단계 인증 설정">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb]">
                            <div className="p-6 lg:p-8 border-b border-[#e9e9eb]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#181d27]">2단계 인증 설정</h2>
                                        <p className="text-[#535861] mt-1">인증 앱으로 QR을 스캔하세요</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-[#535861] mr-3">비활성</span>
                                        <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 lg:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <div className="w-48 h-48 bg-neutral-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                                            <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-col">
                                                <i className="fas fa-qrcode text-4xl text-gray-400 mb-2"></i>
                                                <p className="text-sm text-gray-500">QR 코드</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#535861]">Google Authenticator 또는 Authy 앱으로 QR 코드를 스캔하세요</p>
                                    </div>
                                    <div>
                                        <p className="text-[#535861] mb-4">6자리 코드를 입력하면 설정이 완료됩니다.</p>
                                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                            <div>
                                                <label htmlFor="auth-code" className="block text-sm font-medium text-[#374151] mb-1">인증 코드 <span className="text-[#8a765e]">*</span></label>
                                                <input type="text" id="auth-code" placeholder="123456" maxLength={6} pattern="[0-9]{6}" className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                                                <p className="text-xs text-[#717680] mt-1">인증 앱에서 생성된 6자리 코드를 입력하세요</p>
                                            </div>
                                            <button type="submit" className="w-full px-[18px] py-2.5 bg-[#8a765e] rounded-lg shadow-sm text-white text-base font-medium hover:bg-[#74634e]">설정 완료</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-triangle-exclamation text-amber-600 mt-1 mr-3"></i>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-amber-800 mb-2">백업 코드 발급</h3>
                                            <p className="text-sm text-amber-700 mb-3">휴대폰을 분실하거나 인증 앱에 접근할 수 없을 때를 대비해 백업 코드를 안전한 곳에 보관하세요.</p>
                                            <ul className="text-sm text-amber-700 mb-4 space-y-1">
                                                <li>• 각 코드는 한 번만 사용 가능합니다</li>
                                                <li>• 안전한 곳에 보관하세요</li>
                                                <li>• 필요시 새로운 코드를 발급받을 수 있습니다</li>
                                            </ul>
                                            <button type="button" className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 font-medium">백업 코드 저장</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="devices" role="region" aria-label="로그인된 기기 관리">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb]">
                            <div className="p-6 lg:p-8 border-b border-[#e9e9eb]">
                                <h2 className="text-xl font-bold text-[#181d27]">로그인된 기기</h2>
                                <p className="text-[#535861] mt-1">의심스러운 기기는 로그아웃하세요</p>
                            </div>
                            <div className="p-6 lg:p-8">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between p-4 border border-[#e9e9eb] rounded-lg bg-green-50">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-desktop text-green-600"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-[#181d27]">현재 기기</h3>
                                                <p className="text-sm text-[#535861]">Windows 10 • Chrome 118</p>
                                                <p className="text-xs text-[#717680] mt-1">서울, 대한민국 • 방금 전</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">활성</span>
                                    </div>
                                    <div className="flex items-start justify-between p-4 border border-[#e9e9eb] rounded-lg hover:bg-neutral-50">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-mobile-screen-button text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-[#181d27]">iPhone 14</h3>
                                                <p className="text-sm text-[#535861]">iOS 17.1 • Safari</p>
                                                <p className="text-xs text-[#717680] mt-1">서울, 대한민국 • 2시간 전</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">로그아웃</button>
                                    </div>
                                    <div className="flex items-start justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-mobile-screen-button text-orange-600"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-[#181d27] flex items-center">
                                                    Galaxy S23
                                                    <i className="fas fa-triangle-exclamation text-orange-600 ml-2 text-sm"></i>
                                                </h3>
                                                <p className="text-sm text-[#535861]">Android 14 • Chrome Mobile</p>
                                                <p className="text-xs text-[#717680] mt-1">부산, 대한민국 • 3일 전</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">로그아웃</button>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-[#e9e9eb]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-[#181d27]">모든 기기에서 로그아웃</h3>
                                            <p className="text-sm text-[#535861] mt-1">현재 기기를 제외한 모든 기기에서 로그아웃됩니다</p>
                                        </div>
                                        <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">모든 기기 로그아웃</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
