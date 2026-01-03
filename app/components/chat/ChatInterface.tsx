
"use client";

import { useEffect, useState, useRef } from 'react';
import { getChatRooms, getMessages, sendMessage } from '@/app/actions/chat';
import { cn } from '@/lib/utils';
import {
    Phone, Video, MoreVertical, Paperclip, Send,
    FileText, Download, Info, CheckCheck, X, Image as ImageIcon, Loader2, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // 1. Fetch User & Rooms
    useEffect(() => {
        const init = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUserId(user.id);
                const fetchedRooms = await getChatRooms(user.id);
                setRooms(fetchedRooms as unknown as ChatRoom[]);

                if (fetchedRooms.length > 0 && window.innerWidth >= 1024) {
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
    }, [messages, activeRoomId]);

    const handleSend = async () => {
        if ((!input.trim() && !selectedFile) || !activeRoomId || !currentUserId || isUploading) return;

        let contentToSend = input;
        setIsUploading(true);

        try {
            // 1. File Upload Logic
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const fileName = `${Date.now()}_${cleanName}`;
                // Using a 'client_uploads' folder or similar to organize, or just ID
                const filePath = `${activeRoomId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('chat_attachments')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('chat_attachments')
                    .getPublicUrl(filePath);

                // If there's text AND file, we might want to send two messages or just one. 
                // For simplicity, if file exists, we send file URL. If text exists too, we send text first?
                // Let's toggle: If file, content is URL. If text also exists, maybe send text separately?
                // For now, assume priority: File > Text. Or send URL.
                contentToSend = publicUrl;
            }

            // Optimistic UI
            const optimisticId = crypto.randomUUID();
            const optimisticMsg: Message = {
                id: optimisticId,
                content: contentToSend,
                senderId: currentUserId,
                roomId: activeRoomId,
                createdAt: new Date()
            };

            setMessages(prev => [...prev, optimisticMsg]);
            setInput("");
            setSelectedFile(null);

            // Server Action
            await sendMessage(activeRoomId, contentToSend, currentUserId);

        } catch (error) {
            console.error(error);
            alert("메시지 전송 실패 (파일 업로드 오류 가능성)");
        } finally {
            setIsUploading(false);
        }
    };

    // --- Message Rendering Helper (ChatBubble equivalent) ---
    const renderMessageContent = (content: string) => {
        if (!content) return "";

        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(content) || (content.includes('supabase') && content.includes('/chat_attachments/') && !content.endsWith('.pdf'));

        if (isImage) {
            return (
                <div onClick={() => window.open(content, '_blank')} className="cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={content} alt="Attachment" className="max-w-[240px] rounded-lg mb-1"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )
        }
        if (content.startsWith('http')) {
            const fileName = content.split('/').pop()?.split('?')[0] || "파일 확인";
            return (
                <a href={content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-blue-100 hover:text-white break-all">
                    <FileText className="w-4 h-4 shrink-0" /> {decodeURIComponent(fileName).substring(0, 20)}...
                </a>
            )
        }
        return content;
    }


    const activeRoom = rooms.find(r => r.id === activeRoomId);

    return (
        <div className="bg-white rounded-2xl border border-[#e9e9eb] h-[calc(100vh-130px)] lg:h-[800px] flex overflow-hidden shadow-sm relative">

            {/* Left Sidebar */}
            <section className={cn("w-full lg:w-80 border-r border-[#e9e9eb] flex flex-col bg-white", activeRoomId ? "hidden lg:flex" : "flex")}>
                <div className="p-4 lg:p-6 border-b border-[#e9e9eb]">
                    <h1 className="text-xl font-semibold text-[#181d27] mb-2">상담 채팅</h1>
                    <p className="text-[#535861] text-sm">이전 대화와 최근 파일을 확인하세요</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2">
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
                            {activeRoomId === room.id && (
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs bg-[#8a765e] text-white px-2 py-1 rounded-full">선택됨</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Right: Chat Window */}
            <div className={cn("flex-1 flex flex-col bg-white h-full", !activeRoomId ? "hidden lg:flex" : "flex")}>
                {activeRoom ? (
                    <>
                        {/* Header */}
                        <div className="p-4 lg:p-6 border-b border-[#e9e9eb] flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-3">
                                <button onClick={() => setActiveRoomId(null)} className="lg:hidden p-1 mr-1 text-[#535861]"><i className="fas fa-arrow-left"></i></button>
                                <div className="relative">
                                    <img src="/assets/images/lawyer_avatar.png" alt="Kim" className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Lawyer'}
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <div className="font-medium text-[#181d27]">김변호사</div>
                                    <div className="text-sm text-[#74634e] truncate max-w-[150px] sm:max-w-xs">{activeRoom.title}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                                <a href="tel:02-6080-3377" className="p-2 text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors"><Phone className="w-5 h-5" /></a>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gray-50/50">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUserId;
                                return (
                                    <div key={msg.id} className={cn("flex items-start space-x-3", isMe ? "justify-end" : "")}>
                                        {!isMe && (
                                            <img src="/assets/images/lawyer_avatar.png" alt="L" className="w-8 h-8 rounded-full object-cover shrink-0"
                                                onError={(e) => (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=L'}
                                            />
                                        )}
                                        <div className={cn("flex-1 max-w-[85%] lg:max-w-lg", isMe ? "text-right" : "")}>
                                            <div className={cn(
                                                "p-3 lg:p-4 inline-block text-left text-sm leading-relaxed shadow-sm break-words",
                                                isMe
                                                    ? "bg-[#8a765e] text-white rounded-2xl rounded-tr-md"
                                                    : "bg-white border border-[#e9e9eb] text-[#181d27] rounded-2xl rounded-tl-md"
                                            )}>
                                                {renderMessageContent(msg.content)}
                                            </div>
                                            <div className={cn("flex items-center space-x-2 mt-1 text-xs text-[#717680]", isMe ? "justify-end" : "")}>
                                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {isMe && <CheckCheck className="w-3 h-3 text-[#8a765e]" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <div className="border-t border-[#e9e9eb] p-4 lg:p-6 bg-white shrink-0 sticky bottom-0">
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf,.doc,.docx,.hwp" onChange={handleFileSelect} />

                                {selectedFile && (
                                    <div className="mb-2 px-3 py-2 bg-[#f8f3ed] rounded-lg flex items-center justify-between border border-[#e5ceb4]">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Paperclip className="w-4 h-4 text-[#74634e] shrink-0" />
                                            <span className="text-sm text-[#74634e] truncate font-medium">{selectedFile.name}</span>
                                        </div>
                                        <button type="button" onClick={() => setSelectedFile(null)} className="ml-2 text-[#74634e] hover:text-[#5e503f] p-1"><X className="w-4 h-4" /></button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 flex-nowrap relative">
                                    <div className="flex-1 relative h-[48px]">
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                            rows={1}
                                            placeholder="메시지 입력..."
                                            disabled={isUploading}
                                            className="w-full h-full px-4 py-[13px] border border-[#d5d6d9] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] placeholder-[#717680] text-base leading-[20px] box-border disabled:opacity-50"
                                        />
                                        {isUploading && <div className="absolute right-3 top-3"><Loader2 className="w-5 h-5 animate-spin text-[#8a765e]" /></div>}
                                    </div>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-[48px] h-[48px] text-[#535861] hover:text-[#74634e] hover:bg-neutral-50 rounded-lg transition-colors flex items-center justify-center shrink-0 box-border">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button type="submit" disabled={(!input.trim() && !selectedFile) || isUploading} className="h-[48px] px-4 lg:px-6 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center box-border">
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
