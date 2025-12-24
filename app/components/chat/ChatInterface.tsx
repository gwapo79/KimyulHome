
"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getChatRooms, getMessages, sendMessage } from '@/app/actions/chat';
import { cn } from '@/lib/utils';
import {
    Phone, Video, MoreVertical, Paperclip, Send,
    FileText, Download, Info, CheckCheck
} from 'lucide-react';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChatRoom {
    id: string;
    title: string;
    status: string;
    updatedAt: Date;
    messages: { content: string, createdAt: Date }[];
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    roomId: string;
}

export default function ChatInterface() {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 1. Fetch User & Rooms
    useEffect(() => {
        const init = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUserId(user.id);
                const fetchedRooms = await getChatRooms(user.id);
                setRooms(fetchedRooms as unknown as ChatRoom[]);

                if (fetchedRooms.length > 0) {
                    setActiveRoomId(fetchedRooms[0].id);
                }
            }
        };
        init();
    }, []);

    // 2. Fetch Messages & Subscribe
    useEffect(() => {
        if (!activeRoomId) return;

        const loadMessages = async () => {
            const msgs = await getMessages(activeRoomId);
            setMessages(msgs);
        };
        loadMessages();

        const channel = supabase
            .channel(`room:${activeRoomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ChatMessage',
                filter: `roomId=eq.${activeRoomId}`
            }, (payload) => {
                const newMessage = payload.new as Message;
                setMessages((prev) => {
                    // Prevent duplicates (Optimistic UI might have added it)
                    if (prev.some(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeRoomId]);

    // 3. Auto-scroll
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !activeRoomId || !currentUserId) return;

        const content = input;
        setInput(""); // Clear immediately

        // Optimistic UI Update
        const optimisticId = crypto.randomUUID();
        const optimisticMsg: Message = {
            id: optimisticId,
            content: content,
            senderId: currentUserId,
            roomId: activeRoomId,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, optimisticMsg]);

        // Server Action
        const serverMsg = await sendMessage(activeRoomId, content, currentUserId);

        // If server returns, we could replace the optimistic one, but Realtime might arrive faster.
        // For simple implementations, we assume success or handle error.
        if (!serverMsg) {
            // Rollback on failure (simplified)
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
            alert("Failed to send message");
        }
    };

    const activeRoom = rooms.find(r => r.id === activeRoomId);

    return (
        <div className="bg-white rounded-2xl border border-[#e9e9eb] h-[800px] flex overflow-hidden shadow-sm">
            {/* Left Sidebar: Threads */}
            <section id="threads" className="w-80 border-r border-[#e9e9eb] flex flex-col bg-white">
                <div className="p-6 border-b border-[#e9e9eb]">
                    <h1 className="text-xl font-semibold text-[#181d27] mb-2">상담 채팅</h1>
                    <p className="text-[#535861] text-sm">이전 대화와 최근 파일을 확인하세요</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                        {rooms.map(room => (
                            <button
                                key={room.id}
                                onClick={() => setActiveRoomId(room.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-lg transition-colors",
                                    activeRoomId === room.id
                                        ? "bg-[#f8f3ed] border border-[#e5ceb4]"
                                        : "hover:bg-neutral-50 border border-transparent"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                                            <img src="/assets/images/lawyer_avatar.png" alt="Lawyer" className="w-full h-full object-cover"
                                                onError={(e) => (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Lawyer'}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[#181d27] text-sm">김변호사</div>
                                            <div className="text-xs text-[#74634e]">온라인</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-[#74634e]">
                                        {room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '방금 전'}
                                    </div>
                                </div>
                                <div className="text-sm text-[#535861] mb-2 font-medium">{room.title}</div>
                                <div className="text-sm text-[#535861] truncate opacity-80">
                                    {room.messages[0]?.content || "대화 내용 없음"}
                                </div>
                                {activeRoomId === room.id && (
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs bg-[#8a765e] text-white px-2 py-1 rounded-full">선택됨</span>
                                        <div className="w-2 h-2 bg-[#8a765e] rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Right: Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {activeRoom ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-[#e9e9eb] flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img src="/assets/images/lawyer_avatar.png" alt="Kim" className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Lawyer'}
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <div className="font-medium text-[#181d27]">김변호사</div>
                                    <div className="text-sm text-[#74634e]">온라인 • {activeRoom.title}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
                        >
                            {/* Date Separator (Mock) */}
                            <div className="flex justify-center">
                                <span className="px-3 py-1 bg-neutral-100 text-[#717680] text-xs rounded-full">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUserId;
                                return (
                                    <div key={msg.id} className={cn("flex items-start space-x-3", isMe ? "justify-end" : "")}>
                                        {!isMe && (
                                            <img src="/assets/images/lawyer_avatar.png" alt="Lawyer" className="w-8 h-8 rounded-full object-cover"
                                                onError={(e) => (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=L'}
                                            />
                                        )}
                                        <div className={cn("flex-1 max-w-lg", isMe ? "text-right" : "")}>
                                            <div className={cn(
                                                "p-4 inline-block text-left text-sm leading-relaxed",
                                                isMe
                                                    ? "bg-[#8a765e] text-white rounded-2xl rounded-tr-md"
                                                    : "bg-white border border-[#e9e9eb] text-[#181d27] rounded-2xl rounded-tl-md"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <div className={cn("flex items-center space-x-2 mt-1 text-xs text-[#717680]", isMe ? "justify-end" : "")}>
                                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {isMe && <CheckCheck className="w-3 h-3 text-[#8a765e]" />}
                                            </div>
                                        </div>
                                        {isMe && (
                                            <img src="/assets/images/profiles/profile_01.png" alt="Me" className="w-8 h-8 rounded-full object-cover"
                                                onError={(e) => (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Me'}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-[#e9e9eb] p-6 bg-white">
                            <form
                                className="space-y-4"
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            >
                                <div className="flex items-end space-x-3">
                                    <button type="button" className="p-3 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            rows={1}
                                            placeholder="상담 내용을 입력하세요"
                                            className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] placeholder-[#717680]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="px-6 py-3 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Info className="w-12 h-12 mb-4 opacity-20" />
                        <p>상담 방을 선택해주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
