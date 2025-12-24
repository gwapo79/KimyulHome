
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

    useEffect(() => {
        const fetchEvents = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const fetchedEvents = await getEvents(user.id);
                setEvents(fetchedEvents as Event[]);
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
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[800px]">
            {/* Main Calendar Area */}
            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                {/* Custom Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
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

                {/* Calendar Grid */}
                <div className="flex-1 p-4 calendar-custom-theme">
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
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'short'
                        }}
                    />
                </div>
            </div>

            {/* Side Panel */}
            <div className="w-full lg:w-[300px] flex flex-col gap-6">
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
                                    <div className="font-semibold text-sm text-gray-900 mb-1">{evt.title}</div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(evt.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 py-4 text-center">오늘 예정된 일정이 없습니다.</p>
                    )}
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex-1">
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
                                        <div className="font-semibold text-sm text-gray-900 group-hover:text-[#8a765e] transition-colors">
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
        </div>
    );
}
