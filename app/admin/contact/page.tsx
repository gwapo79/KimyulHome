'use client';

import { useState, useEffect } from 'react';
import { getContacts } from '@/app/actions/contact';
import Link from 'next/link';

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    createdAt: Date;
}

export default function ContactListPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            const result = await getContacts();
            if (result.success && result.contacts) {
                setContacts(result.contacts);
            }
            setLoading(false);
        };
        fetchContacts();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">접수 대기</span>;
            case 'IN_PROGRESS': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">진행중</span>;
            case 'COMPLETED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">완료</span>;
            case 'REJECTED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">거절/스팸</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">문의 관리 (CRM)</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">접수일</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{contact.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{contact.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(contact.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/contact/${contact.id}`} className="text-blue-600 hover:text-blue-900">
                                        상세보기
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
