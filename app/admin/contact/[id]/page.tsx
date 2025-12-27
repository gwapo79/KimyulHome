'use client';

import { useState, useEffect, use } from 'react';
import { getContact, updateContactStatus } from '@/app/actions/contact';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [contact, setContact] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchContact = async () => {
            const result = await getContact(id);
            if (result.success && result.contact) {
                setContact(result.contact);
                setStatus(result.contact.status);
            }
            setLoading(false);
        };
        fetchContact();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm('상태를 변경하시겠습니까?')) return;

        setStatus(newStatus);
        const result = await updateContactStatus(id, newStatus);

        if (result.success) {
            alert('상태가 변경되었습니다.');
            router.refresh();
        } else {
            alert('상태 변경 실패');
            setStatus(contact.status); // Revert on fail
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!contact) return <div className="p-8">Contact not found</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link href="/admin/contact" className="text-gray-500 hover:text-gray-900">
                    &larr; 목록으로 돌아가기
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">상태 변경:</span>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 bg-white text-sm"
                    >
                        <option value="PENDING">접수 대기</option>
                        <option value="IN_PROGRESS">진행중</option>
                        <option value="COMPLETED">완료</option>
                        <option value="REJECTED">거절/스팸</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h1 className="text-xl font-bold text-gray-900">문의 상세</h1>
                    <span className="text-sm text-gray-500">{new Date(contact.createdAt).toLocaleString()}</span>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">이름</label>
                            <div className="text-lg text-gray-900">{contact.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">연락처</label>
                            <div className="text-lg text-gray-900">{contact.phone}</div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 mb-1">이메일</label>
                            <div className="text-lg text-gray-900">{contact.email}</div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">문의 내용</label>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap min-h-[200px] border border-gray-200">
                            {contact.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
