
"use client";

import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents } from '@/app/actions/calendar';
import '@/app/components/calendar/calendar.css';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import koLocale from '@fullcalendar/core/locales/ko';

interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    extendedProps: {
        description: string;
        category: string;
    }
}

export default function CalendarComponent() {
    const [events, setEvents] = useState<Event[]>([]);
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mobile Detection
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile && calendarRef.current) {
                // Optional: Force day view on resize if needed, but let's stick to initial or user selection
                // calendarRef.current.getApi().changeView('timeGridDay');
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Set initial view based on mobile
    useEffect(() => {
        if (calendarRef.current && isMobile) {
            calendarRef.current.getApi().changeView('timeGridDay');
            setCurrentView('timeGridDay');
        }
    }, [isMobile]);

    useEffect(() => {
        const fetchEvents = async () => {
            const userStr = localStorage.getItem('user');
            console.log('Fetching events for user:', userStr); // DEBUG
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    const fetchedEvents = await getEvents(user.id);
                    console.log('Fetched Events:', fetchedEvents); // DEBUG
                    setEvents(fetchedEvents as Event[]);
                } catch (e) {
                    console.error("Error fetching events in component:", e);
                }
            } else {
                console.warn("No user found in localStorage");
            }
        };
        fetchEvents();
    }, []);

    const handlePrev = () => {
        if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            api.prev();
            updateTitle(api);
        }
    };

    const handleNext = () => {
        if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            api.next();
            updateTitle(api);
        }
    };

    const handleToday = () => {
        if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            api.today();
            updateTitle(api);
        }
    };

    const handleViewChange = (view: string) => {
        if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            api.changeView(view);
            setCurrentView(view);
            updateTitle(api);
        }
    };

    const handleDateClick = (arg: any) => {
        if (isMobile) {
            setSelectedDate(arg.date);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedDate(null), 300); // Clear after animation
    };

    const getEventsForSelectedDate = () => {
        if (!selectedDate) return [];
        const dateStr = selectedDate.toISOString().split('T')[0];
        return events.filter(e => e.start.startsWith(dateStr));
    };

    const updateTitle = (api: any) => {
        if (api.view.type === 'timeGridWeek') {
            const start = api.view.currentStart;
            const end = new Date(api.view.currentEnd);
            end.setDate(end.getDate() - 1); // FullCalendar end date is exclusive

            const startYear = start.getFullYear();
            const startMonth = start.getMonth() + 1;
            const startDate = start.getDate();

            const endYear = end.getFullYear();
            const endMonth = end.getMonth() + 1;
            const endDate = end.getDate();

            if (startYear === endYear) {
                setCurrentTitle(`${startYear}년 ${startMonth}월 ${startDate}일 – ${endMonth}월 ${endDate}일`);
            } else {
                // User requested to omit year in the second part even for cross-year dates
                setCurrentTitle(`${startYear}년 ${startMonth}월 ${startDate}일 – ${endMonth}월 ${endDate}일`);
            }
        } else {
            setCurrentTitle(api.view.title);
        }
    };

    // Initial Title Set
    useEffect(() => {
        if (calendarRef.current) {
            updateTitle(calendarRef.current.getApi());
        }
    }, [events]);

    const renderEventContent = (eventInfo: any) => {
        const category = eventInfo.event.extendedProps.category;
        const colorClass = category?.includes('법원')
            ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
            : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';

        return (
            <div className={cn(
                "w-full px-2 py-1 rounded-md border border-l-4 shadow-sm transition-all duration-200 overflow-hidden",
                colorClass,
                category?.includes('법원') ? 'border-l-rose-500' : 'border-l-blue-500'
            )}>
                <div className="font-semibold text-xs truncate">{eventInfo.event.title}</div>
                <div className="text-[10px] opacity-80 truncate">{eventInfo.timeText}</div>
            </div>
        );
    };

    const todayEvents = events.filter(e => {
        const today = new Date().toISOString().split('T')[0];
        return e.start.startsWith(today);
    });

    const upcomingEvents = events
        .filter(e => new Date(e.start) > new Date())
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        .slice(0, 3);

    return (
        <div className="relative flex flex-col lg:flex-row gap-6 h-auto lg:h-full lg:min-h-[800px]">
            {/* Main Calendar Area */}
            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col relative z-0 h-[75vh] lg:h-auto min-h-[500px]">
                {/* Custom Header */}
                <div className="border-b border-neutral-100 px-6 py-4">
                    {/* MOBILE LAYOUT (< 1024px) */}
                    <div className="lg:hidden flex flex-col gap-4">
                        {/* Row 1: Navigation [Prev] [Title] [Next] */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrev}
                                className="p-2 hover:bg-neutral-50 rounded-lg text-gray-600 transition-colors border border-transparent hover:border-neutral-200"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-bold text-gray-900">{currentTitle}</h2>
                            <button
                                onClick={handleNext}
                                className="p-2 hover:bg-neutral-50 rounded-lg text-gray-600 transition-colors border border-transparent hover:border-neutral-200"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Row 2: 4-Column Grid [Today | Month | Week | Day] */}
                        <div className="grid grid-cols-4 gap-2 w-full">
                            <button
                                onClick={handleToday}
                                className="flex items-center justify-center py-2.5 text-sm font-medium text-gray-700 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-100"
                            >
                                오늘
                            </button>
                            {['dayGridMonth', 'timeGridWeek', 'timeGridDay'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => handleViewChange(view)}
                                    className={cn(
                                        "flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-colors border",
                                        currentView === view
                                            ? "bg-[#8a765e] text-white border-[#8a765e]"
                                            : "bg-white text-gray-500 border-neutral-200 hover:bg-neutral-50 hover:text-gray-900"
                                    )}
                                >
                                    {view === 'dayGridMonth' ? '월' : view === 'timeGridWeek' ? '주' : '일'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DESKTOP LAYOUT (>= 1024px) - Original Preserved */}
                    <div className="hidden lg:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-900">{currentTitle}</h2>
                            <div className="flex items-center bg-neutral-100 rounded-lg p-1">
                                <button
                                    onClick={handlePrev}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleToday}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
                                >
                                    오늘
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center bg-neutral-100 rounded-lg p-1">
                            {['dayGridMonth', 'timeGridWeek', 'timeGridDay'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => handleViewChange(view)}
                                    className={cn(
                                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                        currentView === view
                                            ? "bg-white text-[#8a765e] shadow-sm"
                                            : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    {view === 'dayGridMonth' ? '월' : view === 'timeGridWeek' ? '주' : '일'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 p-4 calendar-custom-theme overflow-y-auto">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={false}
                        locale={koLocale}
                        events={events}
                        height="100%"
                        eventContent={renderEventContent}
                        dayMaxEventRows={3}
                        dateClick={handleDateClick}
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'short'
                        }}
                    />
                </div>
            </div>

            {/* Side Panel (Visible on Mobile now) */}
            <div className="flex w-full lg:w-[300px] flex-col gap-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-rose-50 rounded-lg">
                            <CalendarIcon className="w-5 h-5 text-rose-500" />
                        </div>
                        <h3 className="font-bold text-gray-900">오늘의 일정</h3>
                    </div>

                    {todayEvents.length > 0 ? (
                        <div className="space-y-3">
                            {todayEvents.map(evt => (
                                <div key={evt.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="font-semibold text-sm text-gray-900 mb-1 leading-tight">{evt.title}</div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(evt.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 py-4 text-center leading-tight">오늘 예정된 일정이 없습니다.</p>
                    )}
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 lg:flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h3 className="font-bold text-gray-900">다가오는 일정</h3>
                    </div>

                    <div className="space-y-4">
                        {upcomingEvents.map(evt => (
                            <div key={evt.id} className="group cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center min-w-[3rem] bg-neutral-50 rounded-lg p-2 border border-neutral-100">
                                        <span className="text-xs font-bold text-gray-400">
                                            {new Date(evt.start).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {new Date(evt.start).getDate()}
                                        </span>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="font-semibold text-sm text-gray-900 group-hover:text-[#8a765e] transition-colors leading-tight">
                                            {evt.title}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                                evt.extendedProps.category?.includes('법원') ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {evt.extendedProps.category}
                                            </span>
                                            <span>
                                                {new Date(evt.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2 text-sm text-[#8a765e] hover:bg-[#8a765e]/5 rounded-lg transition-colors font-medium border border-[#8a765e]/20">
                        전체 일정 보기
                    </button>
                </div>
            </div>

            {/* Mobile Slide-up Modal */}
            {isMobile && (
                <>
                    {/* Backdrop */}
                    <div
                        className={cn(
                            "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
                            isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}
                        onClick={closeModal}
                    ></div>

                    {/* Drawer */}
                    <div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] p-6 shadow-xl transform transition-transform duration-300 ease-in-out pb-safe",
                            isModalOpen ? "translate-y-0" : "translate-y-full"
                        )}
                        style={{ maxHeight: '80vh', overflowY: 'auto' }}
                    >
                        <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6"></div>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {selectedDate?.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                            </h3>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {getEventsForSelectedDate().length > 0 ? (
                                getEventsForSelectedDate().map(evt => (
                                    <div key={evt.id} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <div className={cn(
                                            "min-w-1 h-full rounded-full self-stretch",
                                            evt.extendedProps.category?.includes('법원') ? "bg-rose-500" : "bg-blue-500"
                                        )}></div>
                                        <div>
                                            <div className="font-bold text-gray-900">{evt.title}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {new Date(evt.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                {evt.extendedProps.description && ` • ${evt.extendedProps.description}`}
                                            </div>
                                            <div className="mt-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-medium",
                                                    evt.extendedProps.category?.includes('법원') ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {evt.extendedProps.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="mb-2 text-2xl">📅</div>
                                    <p>등록된 일정이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        <button className="w-full py-3.5 bg-[#8a765e] text-white rounded-xl font-bold shadow-sm hover:bg-[#74634e] transition-colors">
                            새 일정 등록하기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
