'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="footer" className="bg-white border-t border-[#e9e9eb] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <img src="/assets/images/logo.jpg" alt="서초지율 합동법률사무소" className="h-[72px]" />
                        </div>
                        <p className="text-[#535861] mb-6 max-w-md">
                            부동산 분쟁부터 채무 조정까지, 법률과 금융의 통합 전문성으로 고객의 문제를 근본적으로 해결합니다.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center text-[#535861]"><i className="fas fa-location-dot w-5 mr-3"></i> 서울시 서초구 서초중앙로24길 3 4층</div>
                            <div className="flex items-center text-[#535861]"><i className="fas fa-phone w-5 mr-3"></i> 02-6080-3377</div>
                            <div className="flex items-center text-[#535861]"><i className="fas fa-envelope w-5 mr-3"></i> sjlaw14@naver.com</div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#181d27] mb-4">빠른 링크</h3>
                        <ul className="space-y-3">
                            <li><Link href="/company/about" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">회사소개</Link></li>
                            <li><Link href="/legal/practice-areas" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">전문분야</Link></li>
                            <li><Link href="/legal/success-cases" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">성공사례</Link></li>
                            <li><Link href="/company/reviews" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">고객후기</Link></li>
                            <li><Link href="/support/faq" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">FAQ</Link></li>
                            <li><Link href="/media/blog" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">블로그</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#181d27] mb-4">고객지원</h3>
                        <ul className="space-y-3">
                            <li><Link href="/company/consultation" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">무료 상담</Link></li>
                            <li><Link href="/dashboard" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">마이페이지</Link></li>
                            <li><Link href="/legal/terms" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">이용약관</Link></li>
                            <li><Link href="/legal/privacy" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">개인정보처리방침</Link></li>
                            <li><Link href="/legal/cookie" className="text-[#535861] hover:text-[#74634e] transition-colors cursor-pointer">쿠키정책</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#e9e9eb] pt-8 flex flex-col lg:flex-row justify-between items-center">
                    <div className="text-[#717680] text-sm mb-4 lg:mb-0">© 2025 서초지율 합동법률사무소. All rights reserved.</div>
                    <div className="text-[#717680] text-sm text-center lg:text-right">
                        <p className="mb-1">본 사이트의 사례는 참고용이며, 개별 사건의 결과를 보장하지 않습니다.</p>
                        <p id="iudme1">법무법인 등록번호: 123-45-67890</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
