"use client";

import RoleGuard from "@/components/auth/RoleGuard";

export default function DevSystemPage() {
    return (
        <RoleGuard allowedRoles={['DEV']} redirectPath="/admin">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-800 border-b pb-4">시스템 관리 (DEV)</h1>
                <div className="p-8 bg-slate-900 text-green-400 font-mono rounded-lg">
                    <p className="font-bold">> System Logs...</p>
                    <p className="mt-2 text-sm opacity-80">> Loading recent server activities...</p>
                </div>
            </div>
        </RoleGuard>
    );
}
