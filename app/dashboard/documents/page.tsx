"use client";

import Link from "next/link";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { getDocuments, uploadDocument, deleteDocument } from "@/app/actions/documents";
import { Card } from "@/app/components/ui/card";
import { FileText, FileImage, File, Trash2, Download, Upload, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
    id: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    category?: string | null;
    url: string;
    createdAt: Date;
    case?: { title: string } | null;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const result = await getDocuments(user.id);
                if (result.success && result.documents) {
                    setDocuments(result.documents);
                }
            }
            setLoading(false);
        };
        fetchDocs();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('category', '기타'); // Default to 기타 for quick upload

        const result = await uploadDocument(null, formData);

        if (result.success && result.document) {
            setDocuments(prev => [result.document as any, ...prev]);
        } else {
            alert('업로드 실패');
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: string) => {
        if (!confirm('삭제하시겠습니까?')) return;
        const result = await deleteDocument(id);
        if (result.success) {
            setDocuments(prev => prev.filter(d => d.id !== id));
        }
    };

    const filteredDocs = documents.filter(doc => {
        const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
        const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getFileIcon = (type: string) => {
        if (['jpg', 'png', 'jpeg'].includes(type)) return <FileImage className="w-5 h-5 text-blue-500" />;
        if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/dashboard">
                            <span className="text-[#8a765e] hover:text-[#74634e] cursor-pointer">마이페이지</span>
                        </Link>
                    </li>
                    <li className="text-[#d5d6d9]">
                        <i className="fas fa-chevron-right text-xs"></i>
                    </li>
                    <li><span aria-current="page" className="text-[#535861]">문서함</span></li>
                </ol>
            </nav>

            <div className="flex flex-col space-y-6">
                {/* Header & Upload */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#181d27]">내 문서함</h1>
                        <p className="text-[#535861] mt-1">계약서, 증거자료 등 중요 문서를 안전하게 관리하세요.</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center px-4 py-2 bg-[#8a765e] text-white rounded-lg hover:bg-[#74634e] transition-colors"
                        disabled={isUploading}
                    >
                        {isUploading ? "업로드 중..." : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                문서 업로드
                            </>
                        )}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-[#e9e9eb]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="파일명 검색..."
                            className="w-full pl-9 pr-4 py-2 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {['all', '계약서', '증거자료', '법률문서', '기타'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors",
                                    filterCategory === cat
                                        ? "bg-[#8a765e] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {cat === 'all' ? '전체' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Document List */}
                <div className="bg-white rounded-xl border border-[#e9e9eb] overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8a765e]"></div>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <File className="w-12 h-12 mb-2 opacity-20" />
                            <p>문서가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b border-[#e9e9eb]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">파일명</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관련 사건</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업로드 날짜</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#e9e9eb]">
                                    {filteredDocs.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                                                        {getFileIcon(doc.fileType)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{doc.fileName}</div>
                                                        <div className="text-xs text-gray-500">{doc.fileSize}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {doc.category || '기타'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {doc.case?.title || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <a
                                                        href={doc.url}
                                                        download
                                                        className="text-gray-400 hover:text-[#8a765e] p-1 rounded-md hover:bg-gray-100"
                                                        title="다운로드"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
