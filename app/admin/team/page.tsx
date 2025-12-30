"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreVertical, Shield, Briefcase, UserCog, Eye, EyeOff, Loader2, Edit, Trash2 } from 'lucide-react';

// Define Interface matching API response
interface TeamMember {
    id: string;
    name: string;
    email: string | null;
    role: string;
    position: string;
    specialty: string | null; // Mapped from department
    assignedCases: number;
    // isPublic: boolean; // Not in schema, removing for now or handling locally if needed, assuming true
}

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        alert(`Delete ${id} (API integration pending)`);
        setActiveMenuId(null);
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        role: 'STAFF',
        department: '', // Will map to specialty
        password: '' // New password field
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/admin/team');
            if (res.ok) {
                const data = await res.json();
                setTeam(data);
            }
        } catch (error) {
            console.error("Failed to fetch team", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (member: TeamMember) => {
        setFormData({
            name: member.name,
            email: member.email || '',
            position: member.position,
            role: member.role,
            department: member.specialty || '',
            password: '' // Don't show existing hash, allow overwrite
        });
        setEditingId(member.id);
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = '/api/admin/team';
            const method = editingId ? 'PATCH' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', email: '', position: '', role: 'STAFF', department: '', password: '' });
                setEditingId(null);
                fetchTeam();
            } else {
                const errorData = await res.json();
                alert(`Failed to save member: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error saving member");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddModal = () => {
        setFormData({ name: '', email: '', position: '', role: 'STAFF', department: '', password: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
            case 'SUPER_ADMIN':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Shield className="w-3 h-3" /> Admin</span>;
            case 'LAWYER':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Briefcase className="w-3 h-3" /> Lawyer</span>;
            case 'STAFF':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><UserCog className="w-3 h-3" /> Staff</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">구성원 관리 (Team)</h2>
                    <p className="text-slate-500 text-sm mt-1">변호사 및 스태프 권한 관리</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-[#181d27] text-white px-4 py-2 rounded-lg hover:bg-[#2a3241] transition-colors text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> 구성원 추가
                </button>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">프로필 / 직책</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">전문분야(Department)</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">권한 (Role)</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">담당 사건</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading team members...</td></tr>
                        ) : team.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No members found. Add one above.</td></tr>
                        ) : (
                            team.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                    {/* ... cols 1-4 ... */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                                                {member.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{member.name} {member.position}</p>
                                                <p className="text-xs text-slate-500">{member.email || 'No Email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {member.specialty || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(member.role)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                        {member.assignedCases || 0} 건
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        {/* Dropdown Container */}
                                        <div className="relative inline-block text-left">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === member.id ? null : member.id);
                                                }}
                                                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {activeMenuId === member.id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 pointer-events-auto"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ minWidth: '150px' }}
                                                >
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button
                                                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                            onClick={() => handleEdit(member)}
                                                        >
                                                            <Edit className="mr-3 h-4 w-4 text-gray-400" />
                                                            수정
                                                        </button>
                                                        <button
                                                            className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
                                                            onClick={() => handleDelete(member.id)}
                                                        >
                                                            <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId ? '구성원 수정' : '구성원 추가'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder="홍길동"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">직책 (Position)</label>
                                <input
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder="수석 변호사"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">전문분야 (Department)</label>
                                <input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder="형사/민사"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">이메일 (로그인 ID)</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    비밀번호
                                    {editingId && <span className="text-slate-400 font-normal ml-1">(변경 시에만 입력)</span>}
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingId} // Required only for new members
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder={editingId ? "비밀번호 변경 시에만 입력하세요" : "초기 비밀번호를 입력하세요"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">권한 (Role)</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                >
                                    <option value="STAFF">STAFF</option>
                                    <option value="LAWYER">LAWYER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-[#181d27] text-white rounded-lg text-sm font-medium hover:bg-[#2a3241] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingId ? '수정하기' : '추가하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
