'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploadBoxProps {
    label?: string;
    initialUrl?: string; // Existing image URL
    onUploadComplete: (url: string) => void;
    onRemove: () => void;
    aspectRatio?: string; // e.g. "aspect-video", "aspect-square"
}

export default function ImageUploadBox({
    label = "대표 이미지",
    initialUrl,
    onUploadComplete,
    onRemove,
    aspectRatio = "aspect-video"
}: ImageUploadBoxProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();

            setPreviewUrl(data.url);
            onUploadComplete(data.url);
        } catch (error) {
            console.error(error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onRemove();
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>

            {previewUrl ? (
                <div className={`relative ${aspectRatio} w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group`}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/90 text-slate-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-white"
                        >
                            교체
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-500/90 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-600"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`relative ${aspectRatio} w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-2 text-slate-400`}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin text-[#8a765e]" />
                            <span className="text-sm">업로드 중...</span>
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-sm font-medium">이미지 업로드</span>
                            <span className="text-xs">클릭하여 파일을 선택하세요</span>
                        </>
                    )}
                </button>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
