
'use client';

import { useState, useRef, useTransition } from 'react';
import { Upload, X, FileText, Download, Trash2, File, FileImage, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { uploadDocument, deleteDocument } from '@/app/actions/documents';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Document {
    id: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    url: string;
    createdAt: Date;
}

interface DocumentManagerProps {
    caseId: string;
    initialDocuments: Document[];
}

export default function DocumentManager({ caseId, initialDocuments }: DocumentManagerProps) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [isDragging, setIsDragging] = useState(false);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        startTransition(async () => {
            const result = await uploadDocument(caseId, formData);
            if (result.success && result.document) {
                // Convert Date strings to Date objects if needed, though Server Actions usually match
                // Force TS cast or ensure type match. Server returns JSON object, createdAt might be string.
                const newDoc = {
                    ...result.document,
                    createdAt: new Date(result.document.createdAt)
                };
                setDocuments(prev => [newDoc, ...prev]);
            } else {
                alert('파일 업로드 실패: ' + result.error);
            }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 파일을 삭제하시겠습니까?')) return;

        startTransition(async () => {
            const result = await deleteDocument(id);
            if (result.success) {
                setDocuments(prev => prev.filter(doc => doc.id !== id));
            } else {
                alert('삭제 실패: ' + result.error);
            }
        });
    };

    const getFileIcon = (fileType: string) => {
        const type = fileType.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return <FileImage className="w-5 h-5 text-blue-500" />;
        if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    return (
        <section id="docs" role="region" aria-label="관련 문서">
            <div className="bg-white rounded-2xl border border-[#e9e9eb] p-6 lg:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#181d27]">관련 문서</h2>
                    <span className="text-xs text-gray-400">Drag & Drop supported</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Area */}
                    <div
                        className={cn(
                            "group relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer",
                            isDragging
                                ? "border-[#8a765e] bg-[#8a765e]/5"
                                : "border-[#d5d6d9] bg-neutral-50 hover:border-[#8a765e] hover:bg-neutral-100"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <div className="w-12 h-12 bg-[#8a765e] rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            {isPending ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <Upload className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div className="font-medium text-[#181d27] mb-1">
                            {isPending ? "업로드 중..." : "추가 서류 업로드"}
                        </div>
                        <div className="text-sm text-[#535861]">
                            클릭하거나 파일을 드래그하세요
                        </div>
                    </div>

                    {/* File List */}
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="relative flex items-center justify-between p-4 border border-[#e9e9eb] rounded-lg hover:border-[#8a765e] transition-all bg-white shadow-sm"
                        >
                            <div className="flex items-center min-w-0">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mr-3 shrink-0">
                                    {getFileIcon(doc.fileType)}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-[#181d27] truncate pr-2" title={doc.fileName}>
                                        {doc.fileName}
                                    </div>
                                    <div className="text-sm text-[#535861]">
                                        {doc.fileSize} • {new Date(doc.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 shrink-0">
                                <Link
                                    href={doc.url}
                                    target="_blank"
                                    className="p-2 text-gray-400 hover:text-[#8a765e] hover:bg-gray-50 rounded-lg transition-colors"
                                    title="다운로드"
                                    download // Attribute to prompt download
                                >
                                    <Download className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="삭제"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State placeholder if no docs */}
                    {documents.length === 0 && (
                        <div className="hidden md:flex flex-col items-center justify-center p-8 text-center border border-[#e9e9eb] rounded-lg bg-gray-50/50">
                            <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-400">등록된 문서가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
