import Link from 'next/link';
import { getDashboardData, getMyCases, getUpcomingSchedule, getRecentChat, getRecentDocuments, getNotifications } from './actions';

export default async function Dashboard() {
    // Fetch data in parallel
    const [
        dashboardData,
        myCases,
        schedule,
        recentChat,
        documents,
        notifications
    ] = await Promise.all([
        getDashboardData(),
        getMyCases(),
        getUpcomingSchedule(),
        getRecentChat(),
        getRecentDocuments(),
        getNotifications()
    ]);

    const userName = dashboardData?.userName || "고객";
    const activeCasesCount = dashboardData?.activeCasesCount || 0;
    const upcomingEventsCount = dashboardData?.upcomingEventsCount || 0;

    return (
        <>
            <section id="welcome" role="region" aria-label="환영 메시지" className="mb-8">
                <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-[#181d27] mb-2">안녕하세요, {userName}님</h1>
                            <p className="text-[#535861] text-lg">오늘 처리할 일부터 시작해 보세요</p>
                        </div>
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#8a765e]">{activeCasesCount}</div>
                                <div className="text-sm text-[#535861]">진행 중 사건</div>
                            </div>
                            <div className="w-px h-12 bg-[#e9e9eb]"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#8a765e]">{upcomingEventsCount}</div>
                                <div className="text-sm text-[#535861]">다가오는 일정</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-neutral-50 rounded-xl">
                            <div className="text-xl font-bold text-[#8a765e]">{activeCasesCount}</div>
                            <div className="text-sm text-[#535861]">진행 중 사건</div>
                        </div>
                        <div className="text-center p-4 bg-neutral-50 rounded-xl">
                            <div className="text-xl font-bold text-[#8a765e]">{upcomingEventsCount}</div>
                            <div className="text-sm text-[#535861]">다가오는 일정</div>
                        </div>
                    </div>
                    <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
                </div>
            </section>

            <section id="widgets" role="region" aria-label="주요 정보 위젯" className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <section id="cases" role="region" aria-label="최근 사건">
                            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-[#181d27]">최근 사건</h2>
                                    <Link href="/dashboard/my_cases" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                        전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {myCases.length > 0 ? (
                                        myCases.map((c) => (
                                            <div key={c.id} className="flex items-center justify-between p-4 border border-[#e9e9eb] rounded-lg hover:border-[#8a765e] transition-colors cursor-pointer">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-3 bg-${c.statusColor === 'red' ? 'red-500' : c.statusColor === 'green' ? 'green-500' : c.statusColor === 'blue' ? 'blue-500' : 'gray-400'}`}></div>
                                                    <div>
                                                        <div className="font-medium text-[#181d27]">{c.title}</div>
                                                        <div className="text-sm text-[#535861]">{c.description}</div>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${c.statusColor === 'red' ? 'red' : c.statusColor === 'green' ? 'green' : 'blue'}-100 text-${c.statusColor === 'red' ? 'red' : c.statusColor === 'green' ? 'green' : 'blue'}-700`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[#535861] text-sm text-center py-4">진행 중인 사건이 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section id="schedule" role="region" aria-label="다가오는 일정">
                            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-[#181d27]">다가오는 일정</h2>
                                    <Link href="/dashboard/calendar" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                        전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {schedule.length > 0 ? (
                                        schedule.map((evt) => {
                                            const eventDate = new Date(evt.startTime);
                                            const today = new Date();
                                            const diffTime = Math.abs(eventDate.getTime() - today.getTime());
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            const isUrgent = diffDays <= 7;

                                            return (
                                                <div key={evt.id} className={`flex items-center p-3 border-l-4 ${evt.color === 'red' ? 'border-red-500 bg-red-50' : evt.color === 'green' ? 'border-green-500 bg-green-50' : 'border-[#8a765e] bg-neutral-50'} rounded-r-lg`}>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-[#181d27]">{evt.title}</div>
                                                        <div className="text-sm text-[#535861]">{evt.category}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-[#181d27]">
                                                            {eventDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                                                        </div>
                                                        {isUrgent && (
                                                            <div className="text-xs text-red-600">D-{diffDays}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-[#535861] text-sm text-center py-4">예정된 일정이 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27]">최근 메시지</h2>
                                <Link href="/dashboard/chat" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                    전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentChat && recentChat.messages && recentChat.messages.length > 0 ? (
                                    <div className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                                        <img src="/assets/images/profiles/profile_03.png" alt="변호사" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-[#181d27]">{recentChat.title}</span>
                                                <span className="text-xs text-[#717680]">
                                                    {new Date(recentChat.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#535861] truncate">
                                                {recentChat.messages[0].content}
                                            </p>
                                        </div>
                                        {!recentChat.messages[0].isRead && (
                                            <div className="w-2 h-2 bg-[#8a765e] rounded-full"></div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-[#535861] text-sm text-center py-4">최근 대화 내역이 없습니다.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27]">최근 문서</h2>
                                <Link href="/dashboard/documents" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                    전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <div key={doc.id} className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer">
                                            <div className="flex-1">
                                                <div className="font-medium text-[#181d27]">{doc.fileName}</div>
                                                <div className="text-sm text-[#535861]">{doc.category} • {doc.fileSize}</div>
                                            </div>
                                            <span className="text-xs text-[#717680]">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[#535861] text-sm text-center py-4">최근 업로드된 문서가 없습니다.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#181d27]">최근 알림</h2>
                                <Link href="/dashboard/notifications" className="text-[#8a765e] hover:text-[#74634e] transition-colors text-sm font-medium">
                                    전체보기 <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {notifications && notifications.list && notifications.list.length > 0 ? (
                                    notifications.list.map((notif: any) => (
                                        <div key={notif.id} className={`flex items-start space-x-3 p-3 ${!notif.isRead ? 'bg-orange-50 border border-orange-200' : 'hover:bg-neutral-50'} rounded-lg transition-colors`}>
                                            <div className="flex-1">
                                                <div className="font-medium text-[#181d27]">{notif.title}</div>
                                                <div className="text-sm text-[#535861]">{notif.message}</div>
                                            </div>
                                            {!notif.isRead && <span className="text-xs text-orange-600 font-medium">New</span>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[#535861] text-sm text-center py-4">새로운 알림이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
