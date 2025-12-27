'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        setMessage('설정이 저장되었습니다.');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">환경 설정</h1>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">기본 정보 설정</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">사이트 이름</label>
                        <input
                            type="text"
                            defaultValue="서초지율 합동법률사무소"
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">대표 번호</label>
                        <input
                            type="text"
                            defaultValue="02-6080-3377"
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                        <input
                            type="text"
                            defaultValue="서울시 서초구 서초중앙로24길 3 4층"
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <h2 className="text-lg font-semibold mt-8 mb-4 border-b pb-2">SEO 설정 (메타 태그)</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">메인 타이틀 (Main Title)</label>
                        <input
                            type="text"
                            defaultValue="서초지율 - 법률과 금융의 통합 솔루션"
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">메타 설명 (Description)</label>
                        <textarea
                            defaultValue="부동산 분쟁부터 채무 조정까지, 서초지율이 함께합니다."
                            rows={3}
                            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors ${isSaving ? 'opacity-70' : ''}`}
                    >
                        {isSaving ? '저장 중...' : '저장하기'}
                    </button>

                    {message && (
                        <span className="text-green-600 font-medium animate-fade-in">
                            ✅ {message}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
