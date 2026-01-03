'use client';

import { BlogPost } from '@prisma/client';
import { updateBlogPost, deleteBlogPost } from '@/app/actions/blog';
import { useFormStatus } from 'react-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ImageUploadBox from './ImageUploadBox';
import 'react-quill-new/dist/quill.snow.css';
import { marked } from 'marked';
import { Trash2 } from 'lucide-react';
import AssigneeSelector from './AssigneeSelector';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-[#8a765e] text-white px-6 py-2 rounded-lg hover:bg-[#75644e] transition-colors font-medium disabled:opacity-70 flex items-center gap-2"
        >
            {pending ? '저장 중...' : '저장하기'}
        </button>
    );
}


export default function BlogEditForm({ post }: { post: BlogPost }) {
    const updateAction = updateBlogPost.bind(null, post.id);

    // WYSIWYG State
    const [content, setContent] = useState(post.content || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnailUrl || '');
    const [assignedId, setAssignedId] = useState(post.assignedProfileId || null);

    // Auto-Repair: On mount, check if content is HTML-wrapped Markdown (e.g. <p>### Header</p>)
    // and convert it to proper HTML for the editor.
    useEffect(() => {
        const raw = post.content || '';
        if (!raw) return;

        try {
            // 1. Strip HTML tags to get raw text (handling encoded entities)
            const parser = new DOMParser();
            const doc = parser.parseFromString(raw, 'text/html');
            let text = doc.body.textContent || '';

            // 2. Sanitize NBSP which breaks Markdown parsing
            text = text.replace(/\u00A0/g, ' ').replace(/&nbsp;/g, ' ');

            // 3. FORCE NEWLINES: Detect Markdown headers/bullets buried in single-line text
            // e.g. "Intro ### Header" -> "Intro \n\n### Header"
            text = text.replace(/([^\n])(#{1,6}\s)/g, '$1\n\n$2');
            text = text.replace(/([^\n])(\* \[)/g, '$1\n\n$2'); // Checkboxes
            text = text.replace(/([^\n])(> )/g, '$1\n\n$2');    // Blockquotes
            text = text.replace(/([^\n])(\*\*\s)/g, '$1\n\n$2'); // Possible bold lists? (Be careful)
            text = text.replace(/(---)/g, '\n\n$1\n\n');        // Horizontal rules

            // 4. Check for Markdown indicators and re-parse
            if (/^#|(\n#)/.test(text) || /\*\*/.test(text) || /^>/.test(text)) {
                const newHtml = marked.parse(text) as string;
                setContent(newHtml);
            }
        } catch (e) {
            console.error('Markdown repair failed:', e);
        }
    }, [post.content]);

    // ReactQuill Component (Dynamic)
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), {
        ssr: false,
        loading: () => <div className="h-64 bg-slate-50 flex items-center justify-center text-slate-400">에디터 로딩 중...</div>
    }) as any, []);

    // Ref to access Quill instance
    const quillRef = useRef<any>(null);

    // Image Upload Logic (Reusable from Success Case)
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
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const file = e.dataTransfer.files[0];
                        if (file.type.startsWith('image/')) {
                            await handleImageUpload(file);
                        }
                    }
                };

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
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    return (
        <form action={updateAction} className="space-y-6">
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
            <input type="hidden" name="assignedProfileId" value={assignedId || ''} />
            <input type="hidden" name="author" value={post.author} />

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                        <input
                            name="title"
                            defaultValue={post.title}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8a765e] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
                        <select
                            name="category"
                            defaultValue={post.category}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8a765e] focus:outline-none"
                        >
                            <option value="법률상식">법률상식</option>
                            <option value="성공사례">성공사례</option>
                            <option value="로펌소식">로펌소식</option>
                            <option value="언론보도">언론보도</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <ImageUploadBox
                            label="대표 이미지 (Thumbnail)"
                            initialUrl={thumbnailUrl}
                            onUploadComplete={(url) => setThumbnailUrl(url)}
                            onRemove={() => setThumbnailUrl('')}
                            aspectRatio="aspect-video"
                        />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <AssigneeSelector
                                roleFilter={['LAWYER', 'PROFESSIONAL', 'CEO']}
                                currentAssigneeId={assignedId}
                                onAssign={(id) => setAssignedId(id)}
                                label="작성자 선택 (외부 노출용)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">상태</label>
                            <select
                                name="status"
                                defaultValue={post.status}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8a765e] focus:outline-none"
                            >
                                <option value="PUBLISHED">공개 (PUBLISHED)</option>
                                <option value="DRAFT">초안 (DRAFT)</option>
                                <option value="HIDDEN">숨김 (HIDDEN)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">본문 내용 (Smart Editor)</label>
                    <div className="prose-editor-wrapper">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            className="h-[500px] mb-12"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">요약 (Excerpt)</label>
                    <textarea
                        name="excerpt"
                        defaultValue={post.excerpt}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8a765e] focus:outline-none text-sm"
                        placeholder="목록에 표시될 짧은 요약글입니다."
                    />
                </div>
            </div>

            <div className="flex justify-between items-center gap-3 pb-20">
                <button
                    type="button"
                    onClick={async () => {
                        if (confirm('정말 이 블로그 글을 삭제하시겠습니까? 복구할 수 없습니다.')) {
                            await deleteBlogPost(post.id);
                        }
                    }}
                    className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" /> 삭제
                </button>
                <SubmitButton />
            </div>
        </form>
    );
}
