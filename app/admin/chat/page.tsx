
"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Paperclip, Image as ImageIcon, Smile, FileText, Download, X, Trash, User, Loader2, AlertCircle } from 'lucide-react';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector';
import { assignChatRoom, sendAdminMessage, markMessagesAsRead } from '@/app/actions/chat-admin';
import { getMessages } from '@/app/actions/chat';
import { supabase } from '@/lib/supabase';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date | string;
    roomId: string;
    isRead: boolean;
}

export default function ChatPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    // Inputs
    const [input, setInput] = useState('');
    const [showMyTasks, setShowMyTasks] = useState(false);

    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Mock progress 0-100

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Rooms
    const fetchRooms = () => {
        fetch('/api/admin/chat/rooms')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRooms(data);
                }
            })
            .catch(err => console.error("Failed to load rooms", err));
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 10000);
        return () => clearInterval(interval);
    }, []);

    // 2. Select Room & Sub
    useEffect(() => {
        if (!selectedRoomId) return;

        const loadHistory = async () => {
            const msgs = await getMessages(selectedRoomId);
            setMessages(msgs as unknown as Message[]);
            await markMessagesAsRead(selectedRoomId);
            fetchRooms();
        };
        loadHistory();

        const channel = supabase
            .channel(`room-admin:${selectedRoomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ChatMessage',
                filter: `roomId=eq.${selectedRoomId}`
            }, (payload) => {
                const newMsg = payload.new as Message;
                setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
                if (newMsg.senderId !== 'ADMIN') {
                    markMessagesAsRead(selectedRoomId);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedRoomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedRoomId]);


    const activeRoom = rooms.find(r => r.id === selectedRoomId);

    // 3. Handlers
    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || !selectedRoomId) return;

        const text = input;
        setInput('');

        // Optimistic
        const tempId = crypto.randomUUID();
        const optimisticMsg: Message = {
            id: tempId,
            content: text,
            senderId: 'ADMIN',
            roomId: selectedRoomId,
            createdAt: new Date().toISOString(),
            isRead: false
        };
        setMessages(prev => [...prev, optimisticMsg]);

        await sendAdminMessage(selectedRoomId, text, 'ADMIN');
    };

    // Robust File Upload
    const handleFileUpload = async (file: File) => {
        if (!selectedRoomId) return;

        setIsUploading(true);
        setUploadProgress(10); // Start

        try {
            // Validate Logic? (Optional size check)
            if (file.size > 10 * 1024 * 1024) {
                alert("파일 용량은 10MB를 초과할 수 없습니다.");
                setIsUploading(false);
                return;
            }

            const fileExt = file.name.split('.').pop();
            // Sanitize filename
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const fileName = `${Date.now()}_${cleanName}`;
            const filePath = `${selectedRoomId}/${fileName}`;

            setUploadProgress(30);

            // Upload
            const { error } = await supabase.storage
                .from('chat_attachments')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                // Determine error type
                console.error("Storage Upload Error:", error);
                if ((error as any).statusCode === '413') {
                    alert("업로드 실패: 용량 제한 초과");
                } else if ((error as any).message?.includes("security")) {
                    alert("업로드 실패: 권한 또는 네트워크 설정 문제 (RLS Policy)");
                } else {
                    alert(`업로드 실패: ${(error as any).message}`);
                }
                throw error;
            }

            setUploadProgress(80);

            const { data: { publicUrl } } = supabase.storage
                .from('chat_attachments')
                .getPublicUrl(filePath);

            // Send
            await sendAdminMessage(selectedRoomId, publicUrl, 'ADMIN');
            setUploadProgress(100);

        } catch (error) {
            console.error('Final Upload Handler Error:', error);
        } finally {
            setIsUploading(false);
            setIsDragging(false);
            setUploadProgress(0);
        }
    };

    const handleAssign = async (id: string, profileId: string | null) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, assigneeId: profileId } : r));
        await assignChatRoom(id, profileId);
    };

    // --- Drag n Drop Wrappers ---
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); if (selectedRoomId) setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (selectedRoomId && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
    };


    const renderMessageContent = (content: string) => {
        if (!content) return "";

        // Image Detection
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(content) || (content.includes('supabase') && content.includes('/chat_attachments/') && !content.endsWith('.pdf'));

        if (isImage) {
            return (
                <div onClick={() => window.open(content, '_blank')} className="cursor-pointer group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={content} alt="전송된 이미지" className="max-w-[280px] rounded-lg border border-white/20 transition-transform group-hover:scale-[1.01]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xs text-red-400 flex items-center gap-1"><AlertCircle class="w-3 h-3"/> 이미지 로드 실패</span>';
                        }}
                    />
                </div>
            )
        }
        if (content.startsWith('http')) {
            const fileName = content.split('/').pop()?.split('?')[0] || "파일 다운로드";
            return (
                <a href={content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-blue-100 hover:text-white break-all">
                    <FileText className="w-4 h-4 shrink-0" /> {decodeURIComponent(fileName).substring(0, 30)}...
                </a>
            )
        }
        return content;
    }

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 mb-2">채팅 상담</h2>
                    <div className="relative mb-2">
                        <input type="text" placeholder="이름 검색..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm" />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${selectedRoomId === room.id ? 'bg-[#f8f6f3] border-l-4 border-l-[#8a765e]' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-900 text-sm">{room.userName}</span>
                                <span className="text-[10px] text-slate-400">{room.lastMessageTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-slate-500 truncate w-48 font-medium">{room.lastMessage}</p>
                                {room.unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{room.unreadCount}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {activeRoom ? (
                <div
                    className="flex-1 flex flex-col bg-[#fdfbf8] relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Drag Overlay */}
                    {isDragging && (
                        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center border-4 border-dashed border-[#8a765e] m-4 rounded-xl backdrop-blur-sm transition-all duration-300">
                            <div className="text-center text-[#8a765e] font-bold animate-in zoom-in-95">
                                <Download className="w-12 h-12 mx-auto mb-2 animate-bounce" /> 여기에 파일을 놓으세요
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        <div>
                            <h3 className="font-bold text-slate-800">{activeRoom.userName}</h3>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div> 온라인
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <AssigneeSelector
                                roleFilter={['STAFF', 'LAWYER', 'PROFESSIONAL'] as any}
                                currentAssigneeId={activeRoom.assigneeId}
                                onAssign={(id) => handleAssign(activeRoom.id, id)}
                                label=""
                            />
                            <div className="relative">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MoreVertical className="w-5 h-5" /></button>
                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-lg z-20 overflow-hidden">
                                            <button className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-2"><User className="w-4 h-4" /> 의뢰인 정보</button>
                                            <button className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-2" onClick={() => (window.alert('준비 중인 기능입니다.'))}><Download className="w-4 h-4" /> 로그 다운로드</button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold" onClick={() => (window.confirm('상담을 종료하시겠습니까?'))}><Trash className="w-4 h-4" /> 상담 종료</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="text-center text-xs text-slate-400 pb-4">상담이 시작되었습니다.</div>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderId === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${msg.senderId === 'ADMIN'
                                        ? 'bg-[#181d27] text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                    }`}>
                                    {renderMessageContent(msg.content)}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                        {/* Progress Bar */}
                        {isUploading && (
                            <div className="absolute bottom-full left-0 right-0 h-1 bg-slate-100">
                                <div className="h-full bg-[#8a765e] transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />

                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-slate-600 relative">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-slate-600">
                                <ImageIcon className="w-5 h-5" />
                            </button>

                            <div className="flex-1 relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={
                                        isUploading
                                            ? `업로드 중... ${uploadProgress}%`
                                            : "메시지 입력... (Drag & Drop 가능)"
                                    }
                                    disabled={isUploading}
                                    className="w-full bg-slate-50 border-slate-200 rounded-full px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#8a765e] disabled:opacity-70 disabled:cursor-progress"
                                />
                                {isUploading && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-[#8a765e] animate-spin" />}
                            </div>

                            <button type="submit" disabled={!input.trim() || isUploading} className="bg-[#8a765e] text-white p-2.5 rounded-full hover:bg-[#74634e] disabled:opacity-50 transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">채팅방을 선택해주세요.</div>
            )}
        </div>
    );
}
