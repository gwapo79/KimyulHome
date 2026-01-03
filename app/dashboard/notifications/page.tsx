
import Link from "next/link";
export const dynamic = "force-dynamic";
import NotificationSettings from "@/app/components/notifications/NotificationSettings";

import { getAllNotifications } from "@/app/dashboard/actions";

export default async function NotificationsPage() {
    const notifications = await getAllNotifications();

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
                    <div className="bg-white rounded-2xl border border-[#e9e9eb] overflow-hidden">
                        {notifications.length === 0 ? (
                            <p className="text-[#535861] text-center py-12">알림이 존재하지 않습니다.</p>
                        ) : (
                            <div className="divide-y divide-[#e9e9eb]">
                                {notifications.map((notification: any) => (
                                    <div key={notification.id} className={`p-4 hover:bg-neutral-50 transition-colors ${!notification.isRead ? 'bg-[#fffcf9]' : ''}`}>
                                        <div className="flex items-start">
                                            <div className={`mt-1 w-2 h-2 rounded-full mr-3 ${notification.type === 'alert' ? 'bg-red-500' : 'bg-[#8a765e]'}`}></div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-[#181d27] mb-1">{notification.title}</h3>
                                                <p className="text-sm text-[#535861] mb-2">{notification.message}</p>
                                                <span className="text-xs text-[#717680]">{new Date(notification.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
