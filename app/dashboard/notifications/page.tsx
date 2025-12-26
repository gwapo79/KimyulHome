
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
                    <li><span aria-current="page" className="text-[#535861]">알림 설정</span></li>
                </ol>
            </nav>

            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-[#181d27] mb-6">알림 설정</h1>
                <NotificationSettings />
            </div>
        </main>
    );
}
