'use client';

import { SuccessCase } from '@prisma/client';
import { updateSuccessCase, createSuccessCase, deleteSuccessCase } from '@/app/actions/success';
import { useFormStatus } from 'react-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Trash2, Eye } from 'lucide-react';
import ImageUploadBox from './ImageUploadBox';
import AssigneeSelector from './AssigneeSelector';
import 'react-quill-new/dist/quill.snow.css';

// Helper to load ReactQuill without SSR
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>에디터 로딩 중...</p>
});

// Strict CSS to match frontend 'prose-lg' and global styles
const editorStyles = `
  .ql-editor {
    font-family: "Pretendard GOV", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
    font-size: 1.125rem !important; /* 18px (prose-lg) */
    line-height: 1.75 !important;   /* 1.75 (prose-lg) */
    letter-spacing: -0.02em !important;
    color: #535861 !important;
    padding: 2rem !important; /* Mimic section padding */ 
  }
  .ql-editor p {
    margin-bottom: 1.25em !important;
  }
  .ql-editor h1, .ql-editor h2, .ql-editor h3 {
    color: #181d27 !important;
    font-weight: 700 !important;
    margin-top: 1.5em !important;
    margin-bottom: 0.8em !important;
  }
  .ql-editor strong {
    color: #181d27 !important;
    font-weight: 600 !important;
  }
  .ql-container {
    font-family: inherit !important;
    font-size: inherit !important;
  }
`;

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-[#181d27] text-white px-6 py-3 rounded-lg hover:bg-[#2a3241] transition-colors font-medium disabled:opacity-70 flex items-center gap-2 shadow-sm"
        >
            {pending ? '저장 중...' : (isEdit ? '변경사항 저장하기' : '성공사례 등록하기')}
        </button>
    );
}

interface KPI {
    label: string;
    value: string;
    description: string;
}

interface Props {
    item?: SuccessCase & { kpiInfo?: any, content: string | null, subTitle: string | null, seoTitle: string | null, seoDescription: string | null, detailImageUrl: string | null, thumbnailUrl: string | null, assignedProfileId: string | null };
    defaultContent?: string;
}

export default function SuccessCaseEditForm({ item, defaultContent }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const isEdit = !!item;
    const updateAction = isEdit ? updateSuccessCase.bind(null, item.id) : createSuccessCase;

    // WYSIWYG State
    const [content, setContent] = useState(item?.content || item?.strategy || defaultContent || '');
    const [detailImageUrl, setDetailImageUrl] = useState(item?.detailImageUrl || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnailUrl || '');

    // KPI State
    const [kpis, setKpis] = useState<KPI[]>(
        (item?.kpiInfo && Array.isArray(item.kpiInfo)) ? item.kpiInfo :
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

    const quillRef = useRef<any>(null);

    // Image Upload Logic
    const handleImageUpload = async (file: File) => {
        if (!quillRef.current) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();

            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true);
            const index = range ? range.index : editor.getLength();

            editor.insertEmbed(index, 'image', data.url);
            editor.setSelection(index + 1);
        } catch (e) {
            console.error('Image upload error:', e);
            alert('이미지 업로드 실패');
        }
    };

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

    // Drop Handler
    useEffect(() => {
        const attachDropListener = () => {
            if (quillRef.current) {
                const editor = quillRef.current.getEditor();
                const root = editor.root;
                const handleDrop = async (e: any) => {
                    e.preventDefault(); e.stopPropagation();
                    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const file = e.dataTransfer.files[0];
                        if (file.type.startsWith('image/')) {
                            await handleImageUpload(file);
                        }
                    }
                };
                const handleDragOver = (e: any) => { e.preventDefault(); e.stopPropagation(); };
                root.addEventListener('drop', handleDrop);
                root.addEventListener('dragover', handleDragOver);
                return () => {
                    root.removeEventListener('drop', handleDrop);
                    root.removeEventListener('dragover', handleDragOver);
                };
            }
        };
        const timer = setTimeout(attachDropListener, 1000);
        return () => clearTimeout(timer);
    }, [quillRef]);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: { image: imageHandler }
        }
    }), []);

    const handlePreview = () => {
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const data: any = Object.fromEntries(formData.entries());

        // Manual inclusions for non-input state
        data.content = content;
        data.kpiInfo = kpis;
        data.detailImageUrl = detailImageUrl;
        data.thumbnailUrl = thumbnailUrl;

        // Save to local storage for the preview page to pick up
        localStorage.setItem('admin_preview_data', JSON.stringify(data));

        // Open preview page
        window.open('/admin/success/preview', '_blank');
    };

    return (
        <form ref={formRef} action={updateAction} className="space-y-8 pb-20">
            <style>{editorStyles}</style>

            {/* Hidden Inputs for complex data */}
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="kpiJSON" value={JSON.stringify(kpis)} />

            {/* Section 1: Hero & Meta */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">1. 기본 정보 & 히어로 섹션</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">메인 타이틀 (Title)</label>
                        <input name="title" defaultValue={item?.title} required className="form-input w-full px-3 py-2 border rounded-lg" placeholder="예: 강남구 전세사기 보증금 전액 반환 성공" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">서브 카피 (Subtitle)</label>
                        <input name="subTitle" defaultValue={item?.subTitle || item?.summary || ''} className="form-input w-full px-3 py-2 border rounded-lg" placeholder="예: 3개월 만에 100% 회수 성공 스토리" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">고객사/의뢰인 (Client)</label>
                        <input name="client" defaultValue={item?.client || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">분야 (Category)</label>
                        <input name="category" defaultValue={item?.category} className="form-input w-full px-3 py-2 border rounded-lg" list="category-options" />
                        <datalist id="category-options">
                            <option value="부동산 분쟁" />
                            <option value="채무 조정" />
                            <option value="개인회생/파산" />
                            <option value="형사" />
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">프로젝트 기간 (Period)</label>
                        <input name="period" defaultValue={item?.period || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <input type="hidden" name="assignedProfileId" value={item?.assignedProfileId || ''} id="assignedProfileIdHidden" />
                        <AssigneeSelector
                            label="담당 변호사 (Lawyer)"
                            roleFilter={['LAWYER', 'PROFESSIONAL'] as any}
                            currentAssigneeId={item?.assignedProfileId || null}
                            onAssign={(id) => {
                                const el = document.getElementById('assignedProfileIdHidden') as HTMLInputElement;
                                if (el) el.value = id || '';
                            }}
                        />
                        {/* Legacy String Field Backup (Hidden or Readonly) */}
                        <input type="hidden" name="lawyer" defaultValue={item?.lawyer || ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">결과 (Result Text)</label>
                        <input name="result" defaultValue={item?.result || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">금액 (Amount)</label>
                        <input name="amount" defaultValue={item?.amount || ''} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <input type="hidden" name="detailImageUrl" value={detailImageUrl} />
                        <ImageUploadBox
                            label="대표 이미지 (Hero Image)"
                            initialUrl={detailImageUrl}
                            onUploadComplete={(url) => setDetailImageUrl(url)}
                            onRemove={() => setDetailImageUrl('')}
                            aspectRatio="aspect-video"
                        />
                    </div>
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
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-800">3. 상세 스토리 (WYSIWYG Editor)</h2>
                    <span className="text-xs text-[#8a765e] font-medium bg-[#f8f3ed] px-2 py-1 rounded">Front Screen Style Applied</span>
                </div>

                {/* Editor Wrapper mimicking Public Page Prose */}
                <div className="bg-stone-50 rounded-2xl border border-stone-100 p-8 flex justify-center">
                    <div className="w-full max-w-4xl bg-white shadow-sm rounded-xl overflow-hidden relative">
                        {/* We remove padding from here and let .ql-editor handle it effectively */}
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            className="h-full min-h-[600px]"
                            placeholder="이곳에 상세 내용을 작성하세요. 실제 화면과 유사한 너비(Max 896px)와 스타일로 표시됩니다."
                        />
                    </div>
                </div>
            </section>

            {/* Section 4: SEO Metadata */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">4. SEO 설정</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title (Browser Tab)</label>
                        <input name="seoTitle" defaultValue={item?.seoTitle || item?.title} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description (Meta)</label>
                        <textarea name="seoDescription" defaultValue={item?.seoDescription || item?.summary || ''} rows={3} className="form-input w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>
            </section>

            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
                {isEdit && (
                    <button
                        type="button"
                        onClick={async () => {
                            if (confirm('정말 이 성공사례를 삭제하시겠습니까? 복구할 수 없습니다.')) {
                                await deleteSuccessCase(item!.id);
                            }
                        }}
                        className="bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2 shadow-sm mr-auto"
                    >
                        <Trash2 className="w-4 h-4" /> 삭제
                    </button>
                )}
                <button
                    type="button"
                    onClick={handlePreview}
                    className="bg-white text-slate-700 border border-slate-300 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 shadow-sm"
                >
                    <Eye className="w-4 h-4" /> 미리보기
                </button>
                <SubmitButton isEdit={isEdit} />
            </div>
        </form>
    );
}
