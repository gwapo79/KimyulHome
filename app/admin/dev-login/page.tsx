"use client";

import { useRouter } from 'next/navigation';

export default function DevLoginPage() {
    const router = useRouter();

    const loginAs = (email: string) => {
        // Set cookie manually for testing
        document.cookie = `MOCK_USER_EMAIL=${email}; path=/; max-age=86400;`;
        router.refresh();
        router.push('/admin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">개발자 테스트 로그인</h1>
                <p className="text-slate-500 text-sm mb-6 text-center">
                    테스트할 권한을 선택하세요. <br />
                    (실제 운영 환경에서는 보이지 않아야 합니다)
                </p>

                <div className="space-y-3">
                    <button onClick={() => loginAs('admin@law-firm.com')} className="w-full p-4 rounded-lg border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 text-left transition-colors flex justify-between items-center group">
                        <div>
                            <p className="font-bold text-slate-800">CEO (최고관리자)</p>
                            <p className="text-xs text-slate-500">모든 메뉴 접근, 경영 지표 확인</p>
                        </div>
                        <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">Login &rarr;</span>
                    </button>

                    <button onClick={() => loginAs('lawyer@law-firm.com')} className="w-full p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition-colors flex justify-between items-center group">
                        <div>
                            <p className="font-bold text-slate-800">변호사 (LAWYER)</p>
                            <p className="text-xs text-slate-500">사건 관리, 법률 블로그 작성</p>
                        </div>
                        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Login &rarr;</span>
                    </button>

                    <button onClick={() => loginAs('staff@law-firm.com')} className="w-full p-4 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 text-left transition-colors flex justify-between items-center group">
                        <div>
                            <p className="font-bold text-slate-800">직원 (STAFF)</p>
                            <p className="text-xs text-slate-500">상담 관리, 일정 확인</p>
                        </div>
                        <span className="text-green-600 font-bold group-hover:translate-x-1 transition-transform">Login &rarr;</span>
                    </button>

                    <button onClick={() => loginAs('dev@law-firm.com')} className="w-full p-4 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-left transition-colors flex justify-between items-center group">
                        <div>
                            <p className="font-bold text-slate-800">시스템 관리자 (DEV)</p>
                            <p className="text-xs text-slate-500">시스템 로그, 고급 설정</p>
                        </div>
                        <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Login &rarr;</span>
                    </button>

                    <button onClick={() => {
                        document.cookie = `MOCK_USER_EMAIL=; path=/; max-age=0;`;
                        router.refresh();
                        alert("로그아웃 되었습니다.");
                        window.location.reload();
                    }} className="w-full p-4 rounded-lg border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-center transition-colors mt-6">
                        <span className="text-slate-600 font-bold">로그아웃 (세션 초기화)</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
