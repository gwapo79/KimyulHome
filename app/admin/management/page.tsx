"use client";

import RoleGuard from "@/components/auth/RoleGuard";

export default function ManagementPage() {
    return (
        <RoleGuard allowedRoles={['CEO']} redirectPath="/admin">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-800 border-b pb-4">경영 지표 관리 (Sensitive)</h1>
                <div className="p-8 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                    <p className="font-bold">⚠️ CEO 전용 페이지입니다.</p>
                    <p className="mt-2">이곳에서 로펌의 민감한 재무 데이터와 경영 목표를 설정할 수 있습니다.</p>
                    {/* Placeholder for future management tools */}
                </div>
            </div>
        </RoleGuard>
    );
}
