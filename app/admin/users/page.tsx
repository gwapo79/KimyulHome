"use client";

import { useState, useEffect } from 'react';
import { Search, Users, ShieldAlert, KeyRound, Edit, Trash2, Loader2, RefreshCw, Eye, Edit2, RotateCcw, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchHangul } from '@/lib/hangul';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    provider: string;
    status: string;
    joinedAt: string;
    joinPath: string;
    isOnline?: boolean;
    hasWaiting?: boolean;
}

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'WAITING' | 'ONLINE' | 'ACTIVE' | 'BLOCKED'>('ALL');
    const [refreshing, setRefreshing] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '' });
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/users', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                console.error("Failed to fetch users:", res.status, res.statusText);
                setError(res.status === 401 ? "인증 세션이 만료되었습니다." : "서버 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("네트워크 오류가 발생했습니다.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (!confirm(`회원 상태를 ${newStatus}(으)로 변경하시겠습니까?`)) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchUsers();
            else alert("상태 변경 실패");
        } catch (error) {
            console.error(error);
            alert("오류 발생");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
            else alert("삭제 실패");
        } catch (error) {
            console.error(error);
            alert("오류 발생");
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setEditForm({ name: user.name || '', phone: user.phone || '' });
        setIsModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingUser.id,
                    name: editForm.name,
                    phone: editForm.phone
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingUser(null);
                fetchUsers();
            } else alert("수정 실패");
        } catch (error) {
            alert("수정 중 오류 발생");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            searchHangul(user.name, searchQuery) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (statusFilter === 'ALL') return true;
        if (statusFilter === 'WAITING') return user.hasWaiting;
        if (statusFilter === 'ONLINE') return user.isOnline;
        if (statusFilter === 'ACTIVE') return user.status === 'ACTIVE' && !user.hasWaiting;
        if (statusFilter === 'BLOCKED') return user.status === 'BLOCKED';

        return true;
    });

    const getStatusBadge = (status: string) => {
        if (status === 'ACTIVE') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">정상</span>;
        if (status === 'BLOCKED') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">차단</span>;
        if (status === 'WITHDRAWN') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">탈퇴</span>;
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    };

    const getPathBadge = (path: string) => {
        switch (path) {
            case 'KAKAO': return <span className="text-[10px] font-bold text-[#181d27] bg-[#fee500] px-1.5 py-0.5 rounded">K</span>;
            case 'NAVER': return <span className="text-[10px] font-bold text-white bg-[#03C75A] px-1.5 py-0.5 rounded">N</span>;
            case 'GOOGLE': return <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">G</span>;
            default: return <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">직접</span>;
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">회원 관리</h1>
                <button
                    onClick={handleRefresh}
                    className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm ${refreshing ? 'opacity-70 cursor-wait' : ''}`}
                    disabled={refreshing}
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    새로고침
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-xs">
                    <input
                        type="text"
                        placeholder="이름(초성), 이메일 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-transparent text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
                    <button onClick={() => setStatusFilter('ALL')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${statusFilter === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>전체</button>
                    <button onClick={() => setStatusFilter('WAITING')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${statusFilter === 'WAITING' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 상담대기</button>
                    <button onClick={() => setStatusFilter('ONLINE')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${statusFilter === 'ONLINE' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 접속중</button>
                    <button onClick={() => setStatusFilter('ACTIVE')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${statusFilter === 'ACTIVE' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>정상회원</button>
                    <button onClick={() => setStatusFilter('BLOCKED')} className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${statusFilter === 'BLOCKED' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>차단/탈퇴</button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">회원 정보</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">가입 경로</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">가입일</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#8a765e]" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan={5} className="p-12 text-center text-red-500">{error}</td></tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} onClick={() => router.push(`/admin/users/${user.id}`)} className={`hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 ${user.hasWaiting ? 'bg-orange-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 relative">
                                                <Users className="w-5 h-5" />
                                                {user.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                    {user.hasWaiting && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full animate-pulse">상담대기</span>}
                                                </div>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-2">{getPathBadge(user.joinPath)}<span className="text-xs text-slate-600">{user.joinPath}</span></div></td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{user.joinedAt}</td>
                                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}><Edit className="w-4 h-4" /></button>
                                            <button className="p-2 text-slate-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">검색 결과가 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">회원 정보 수정</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 mb-1">이름</label><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                            <div><label className="block text-sm font-medium text-slate-700 mb-1">전화번호</label><input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                            <div className="flex gap-3 mt-6 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg">취소</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-[#8a765e] text-white rounded-lg">저장하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
