
import Link from "next/link";
export const dynamic = "force-dynamic";
import NotificationSettings from "@/app/components/notifications/NotificationSettings";

export default function NotificationsPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm z-10 relative">
                    <li>
                        <Link href="/dashboard">
                            <span className="text-[#8a765e] hover:text-[#74634e] cursor-pointer">마이페이지</span>
                        </Link>
                    </li>
                    <li className="text-[#d5d6d9]">
                        <i className="fas fa-chevron-right text-xs"></i>
                    </li>
                    <li><span aria-current="page" className="text-[#535861]">알림</span></li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notification List Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-[#181d27]">알림 내역</h2>
                    {/* List Component will go here - Since this is a server component, we need to fetch data */}
                    {/* For now, just a placeholder or fetch */}
                    <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6">
                        <p className="text-gray-500 text-center py-4">알림이 존재하지 않습니다.</p>
                        {/* TODO: Implement Real List Mapping */}
                    </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-[#181d27]">알림 설정</h2>
                    <NotificationSettings />
                </div>
            </div>
        </main>
    );
}
