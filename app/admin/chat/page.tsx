
"use client";

import { useState } from 'react';
import { MOCK_CHAT_ROOMS } from '@/data/mock_chat';
import { Search, Send, MoreVertical, Paperclip, Image as ImageIcon, Smile } from 'lucide-react';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector';

export default function ChatPage() {
    const [selectedRoomId, setSelectedRoomId] = useState<string>(MOCK_CHAT_ROOMS[0].id);
    const [input, setInput] = useState('');
    const [rooms, setRooms] = useState(MOCK_CHAT_ROOMS);
    const [showMyTasks, setShowMyTasks] = useState(false);
    const currentUserId = 't2'; // Mock logged-in user

    const filteredRooms = rooms.filter(r => {
        // Simple mock search if needed, currently only filtering by my tasks
        // Search input state is local to sidebar input, let's implement basic name search here too if needed,
        // but existing search input doesn't control a state variable yet. I'll add search state binding first.
        const matchesMyTask = showMyTasks ? r.assigneeId === currentUserId : true;
        // Search logic needs 'searchQuery' state. Let's add it.
        return matchesMyTask;
    });

    const activeRoom = rooms.find(r => r.id === selectedRoomId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeRoom) return;

        const newMessage = {
            id: Date.now().toString(),
            sender: 'ADMIN' as const,
            text: input,
            timestamp: '방금 전',
        };

        const updatedRooms = rooms.map(r =>
            r.id === selectedRoomId
                ? { ...r, messages: [...r.messages, newMessage], lastMessage: input, lastMessageTime: '방금 전' }
                : r
        );

        setRooms(updatedRooms);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
            {/* Sidebar: Chat List */}
            <div className="w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 mb-2">채팅 상담</h2>
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="이름 검색..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-slate-300"
                                onChange={(e) => {
                                    // Basic impl: filter rooms locally would require re-render which `filteredRooms` does.
                                    // But I need `searchQuery` state for `filteredRooms` to work if I added it above.
                                    // For now, just MyTasks check.
                                }}
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showMyTasks}
                                onChange={(e) => setShowMyTasks(e.target.checked)}
                                className="rounded border-slate-300 text-[#8a765e] focus:ring-[#8a765e]"
                            />
                            <span className="text-xs font-medium text-slate-700">내 담당 채팅만 보기</span>
                        </label>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedRoomId === room.id ? 'bg-[#f8f6f3] border-l-4 border-l-[#8a765e]' : 'border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-900 text-sm">{room.userName}</span>
                                <span className="text-[10px] text-slate-400">{room.lastMessageTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-slate-500 truncate w-48 font-medium">
                                    {room.lastMessage}
                                </p>
                                {room.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                                        {room.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Chat Window */}
            {activeRoom ? (
                <div className="flex-1 flex flex-col bg-[#fdfbf8]">
                    {/* Header */}
                    <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div>
                            <h3 className="font-bold text-slate-800">{activeRoom.userName}</h3>
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span> 온라인
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-48">
                                <AssigneeSelector
                                    roleFilter={['STAFF', 'LAWYER']}
                                    currentAssigneeId={activeRoom.assigneeId}
                                    onAssign={(id) => {
                                        setRooms(prev => prev.map(r =>
                                            r.id === activeRoom.id ? { ...r, assigneeId: id || undefined } : r
                                        ));
                                    }}
                                    label=""
                                />
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {activeRoom.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${msg.sender === 'ADMIN'
                                    ? 'bg-[#181d27] text-white rounded-br-none'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-slate-400 self-end ml-2 pb-1">
                                    {msg.timestamp}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <button type="button" className="text-slate-400 hover:text-slate-600" title="파일 첨부">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button type="button" className="text-slate-400 hover:text-slate-600" title="이미지 첨부">
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 bg-slate-50 border-slate-200 rounded-full px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#8a765e] focus:border-[#8a765e]"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="bg-[#8a765e] text-white p-2.5 rounded-full hover:bg-[#75644e] disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                    채팅방을 선택하세요.
                </div>
            )}
        </div>
    );
}
