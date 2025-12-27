'use client';

import { SuccessCase } from '@prisma/client';
import { updateSuccessCase } from '@/app/actions/success';
import { useFormStatus } from 'react-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Trash2 } from 'lucide-react';
import ImageUploadBox from './ImageUploadBox';
import 'react-quill-new/dist/quill.snow.css';

// Helper to load ReactQuill without SSR
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>에디터 로딩 중...</p>
});

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-[#181d27] text-white px-6 py-3 rounded-lg hover:bg-[#2a3241] transition-colors font-medium disabled:opacity-70 flex items-center gap-2 shadow-sm"
        >
            {pending ? '저장 중...' : '변경사항 저장하기'}
        </button>
    );
}

interface KPI {
    label: string;
    value: string;
    description: string;
}

export default function SuccessCaseEditForm({ item }: { item: SuccessCase & { kpiInfo?: any, content: string | null, subTitle: string | null, seoTitle: string | null, seoDescription: string | null, detailImageUrl: string | null, thumbnailUrl: string | null } }) {
    const updateAction = updateSuccessCase.bind(null, item.id);

    // WYSIWYG State
    const [content, setContent] = useState(item.content || item.strategy || ''); // Fallback to strategy if content empty
    const [detailImageUrl, setDetailImageUrl] = useState(item.detailImageUrl || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(item.thumbnailUrl || '');

    // KPI State
    const [kpis, setKpis] = useState<KPI[]>(
        Array.isArray(item.kpiInfo) ? item.kpiInfo :
            // Default seed if empty
            [
                { label: '전액 회수', value: '100%', description: '보증금 전액 회수' },
                { label: '신속 해결', value: '3개월', description: '평균 대비 50% 단축' },
                { label: '추가 손해배상', value: '+α', description: '지연이자 포함' }
            ]
    );

    const addKPI = () => {
        setKpis([...kpis, { label: '', value: '', description: '' }]);
    };

    const removeKPI = (index: number) => {
        setKpis(kpis.filter((_, i) => i !== index));
    };

    const updateKPI = (index: number, field: keyof KPI, val: string) => {
        const newKpis = [...kpis];
        newKpis[index][field] = val;
        setKpis(newKpis);
    };

    // ReactQuill Component (Dynamic)
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), {
        ssr: false,
        loading: () => <div className="h-64 bg-slate-50 flex items-center justify-center text-slate-400">에디터 로딩 중...</div>
    }) as any, []);

    // Ref to access Quill instance
    const quillRef = useRef<any>(null);

    // Image Upload Logic
    const handleImageUpload = async (file: File) => {
        if (!quillRef.current) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Optimistic UI or Loading state could act here
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();

            // Insert Image into Editor
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true); // true = focus if needed
            const index = range ? range.index : editor.getLength();

            editor.insertEmbed(index, 'image', data.url);
            editor.setSelection(index + 1); // Move cursor after image

        } catch (e) {
            console.error('Image upload error:', e);
            alert('이미지 업로드 실패');
        }
    };

    // Toolbar Handler
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                await handleImageUpload(input.files[0]);
            }
        };
    };

    // Drop Handler (Native DOM implementation)
    useEffect(() => {
        const attachDropListener = () => {
            if (quillRef.current) {
                const editor = quillRef.current.getEditor();
                const root = editor.root;

                const handleDrop = async (e: any) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const file = e.dataTransfer.files[0];
                        if (file.type.startsWith('image/')) {
                            await handleImageUpload(file);
                        }
                    }
                };

                // Prevent default drag behaviors
                const handleDragOver = (e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                };

                root.addEventListener('drop', handleDrop);
                root.addEventListener('dragover', handleDragOver);

                return () => {
                    root.removeEventListener('drop', handleDrop);
                    root.removeEventListener('dragover', handleDragOver);
                };
            }
        };

        // Retry attachment if ref is not immediately ready (Standard quirk of dynamic loading)
        // A simple timeout check is usually sufficient for client-side load
        const timer = setTimeout(attachDropListener, 1000);
        return () => clearTimeout(timer);
    }, [quillRef]);

    // Modules Config
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);


    return (
        <form action={updateAction} className="space-y-8 pb-20">
            {/* Hidden Inputs for complex data */}
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="kpiJSON" value={JSON.stringify(kpis)} />

            {/* Section 1: Hero & Meta */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">1. 기본 정보 & 히어로 섹션</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">메인 타이틀 (Title)</label>
                        <input name="title" defaultValue={item.title} required className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">서브 카피 (Subtitle)</label>
                        <input name="subTitle" defaultValue={item.subTitle || item.summary || ''} className="form-input w-full px-3 py-2 border rounded-lg" placeholder="예: 3개월 만에 100% 회수 성공 스토리" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">고객사/의뢰인 (Client)</label>
                        <input name="client" defaultValue={item.client || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">분야 (Category)</label>
                        <input name="category" defaultValue={item.category} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">프로젝트 기간 (Period)</label>
                        <input name="period" defaultValue={item.period || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">담당 변호사</label>
                        <input name="lawyer" defaultValue={item.lawyer || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">결과 (Result Text)</label>
                        <input name="result" defaultValue={item.result || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">금액 (Amount)</label>
                        <input name="amount" defaultValue={item.amount || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        {/* Detail Image URL Hidden Input - to be submitted */}
                        <input type="hidden" name="detailImageUrl" value={detailImageUrl} />

                        {/* New Reusable Component */}
                        <ImageUploadBox
                            label="대표 이미지 (Hero Image)"
                            initialUrl={detailImageUrl}
                            onUploadComplete={(url) => setDetailImageUrl(url)}
                            onRemove={() => setDetailImageUrl('')}
                            aspectRatio="aspect-video"
                        />
                    </div>
                    {/* Thumbnail URL Integration */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div>
                            <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
                            <ImageUploadBox
                                label="썸네일 이미지 (List Thumbnail)"
                                initialUrl={thumbnailUrl}
                                onUploadComplete={(url) => setThumbnailUrl(url)}
                                onRemove={() => setThumbnailUrl('')}
                                aspectRatio="aspect-[4/3]"
                            />
                            <p className="text-xs text-slate-400 mt-1">* 목록 페이지 카드에 표시될 이미지입니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: KPI Dynamic Grid */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-800">2. 성과 요약 (KPI Grid)</h2>
                    <button type="button" onClick={addKPI} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded flex items-center gap-1 transition-colors">
                        <Plus className="w-3 h-3" /> 항목 추가
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {kpis.map((kpi, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 relative group">
                            <button
                                type="button"
                                onClick={() => removeKPI(idx)}
                                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-500">강조 수치 (Value)</label>
                                    <input
                                        value={kpi.value}
                                        onChange={e => updateKPI(idx, 'value', e.target.value)}
                                        className="w-full font-bold text-lg bg-transparent border-b border-slate-200 focus:border-[#8a765e] outline-none"
                                        placeholder="100%"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">라벨 (Label)</label>
                                    <input
                                        value={kpi.label}
                                        onChange={e => updateKPI(idx, 'label', e.target.value)}
                                        className="w-full font-semibold bg-transparent border-b border-slate-200 focus:border-[#8a765e] outline-none"
                                        placeholder="전액 회수"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">설명 (Desc)</label>
                                    <input
                                        value={kpi.description}
                                        onChange={e => updateKPI(idx, 'description', e.target.value)}
                                        className="w-full text-sm text-slate-500 bg-transparent border-b border-slate-200 focus:border-[#8a765e] outline-none"
                                        placeholder="설명 텍스트"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400">* 이 항목들은 상세페이지 중간의 3열 그리드에 표시됩니다.</p>
            </section>

            {/* Section 3: Content Body (WYSIWYG) */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">3. 상세 스토리 (WYSIWYG Editor)</h2>
                <div className="prose-editor-wrapper">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        className="h-[500px] mb-12" // mb-12 for toolbar space
                    />
                </div>
            </section>

            {/* Section 4: SEO Metadata */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">4. SEO 설정</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title (Browser Tab)</label>
                        <input name="seoTitle" defaultValue={item.seoTitle || item.title} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description (Meta)</label>
                        <textarea name="seoDescription" defaultValue={item.seoDescription || item.summary || ''} rows={3} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>
            </section>

            <div className="fixed bottom-6 right-6 z-50">
                <SubmitButton />
            </div>
        </form>
    );
}
