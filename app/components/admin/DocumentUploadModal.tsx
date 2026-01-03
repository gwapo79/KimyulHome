
"use client";

import { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, FileText, Lock, Shield } from 'lucide-react';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, category: string, isPrivate: boolean) => Promise<void>;
}

export default function DocumentUploadModal({ isOpen, onClose, onUpload }: DocumentUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('소송서류');
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("파일을 선택해주세요.");
            return;
        }
        setLoading(true);
        try {
            await onUpload(file, category, isPrivate);
            onClose();
            // Reset
            setFile(null);
            setCategory('소송서류');
            setIsPrivate(false);
        } catch (error) {
            console.error(error);
            alert("업로드 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#8a765e]" />
                            문서 업로드
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            파일을 선택하고 분류를 지정하여 업로드하세요.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* File Drop Zone */}
                    <div
                        ref={dropZoneRef}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-[#8a765e] bg-[#fcfbf9]' : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                            }`}
                    >
                        {file ? (
                            <div className="flex flex-col items-center">
                                <FileText className="w-12 h-12 text-[#8a765e] mb-3" />
                                <p className="font-bold text-slate-800 mb-1">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                <button
                                    onClick={() => setFile(null)}
                                    className="mt-3 text-xs text-red-500 font-bold hover:underline"
                                >
                                    삭제 후 다시 선택
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-10 h-10 text-slate-300 mb-3" />
                                <p className="font-bold text-slate-600 mb-1">파일을 드래그하거나 클릭하세요</p>
                                <p className="text-xs text-slate-400">PDF, Word, HWP, 이미지만 허용</p>
                                <label className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                                    파일 선택
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Metadata Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">문서 카테고리 <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-2">
                                {['소송서류', '증거자료', '참고자료', '기초서류'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`py-2 px-3 text-sm rounded-lg border font-medium transition-all ${category === cat
                                                ? 'bg-[#8a765e] text-white border-[#8a765e]'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#8a765e] hover:text-[#8a765e]'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={e => setIsPrivate(e.target.checked)}
                                    className="w-5 h-5 accent-[#8a765e]"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-slate-500" /> 비공개 (관리자 전용)
                                    </p>
                                    <p className="text-xs text-slate-500">체크 시 의뢰인에게는 노출되지 않습니다.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className="flex-[2] py-3 text-sm font-bold text-white bg-[#181d27] rounded-lg hover:bg-[#2a3241] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                        {loading ? '업로드 중...' : '문서 등록'} <Shield className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
