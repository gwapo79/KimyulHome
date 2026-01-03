
"use client";

import { use, useState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, User, Phone, Briefcase, FileText, CheckCircle2, Circle, Clock, Upload, Shield, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import AssigneeSelector from '@/app/components/admin/AssigneeSelector';
import { getCaseDetail } from '@/app/actions/case-fetch';
import { addCaseSchedule, createCasePayment, saveCaseDocument } from '@/app/actions/case-actions';
import ScheduleModal from '@/app/components/admin/ScheduleModal';
import PaymentRequestModal from '@/app/components/admin/PaymentRequestModal';
import DocumentUploadModal from '@/app/components/admin/DocumentUploadModal';
import { supabase } from '@/lib/supabase';
import { Toaster, toast } from 'sonner';

export default function CaseDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [caseData, setCaseData] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'TIMELINE' | 'CALENDAR' | 'PAYMENTS' | 'DOCUMENTS'>('TIMELINE');
    const [loading, setLoading] = useState(true);

    // Modal & Upload States
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Data
    const loadCaseData = async () => {
        setLoading(true);
        try {
            const data = await getCaseDetail(params.id);
            if (data) {
                setCaseData(data);
            } else {
                console.warn("Case not found in DB - Using Client Fallback");
                setCaseData({
                    id: params.id,
                    title: '가상화폐 투자 사기 및 손해배상 청구 (복구모드)',
                    caseNumber: '2024가합12345',
                    status: 'TRIAL_1',
                    clientName: '홍길동 (복구)',
                    clientPhone: '010-0000-0000',
                    lawyerName: '김지율',
                    description: '시스템 복구 중 강제 로드된 데이터입니다. DB 연결을 확인하세요.',
                    timeline: [],
                    events: [],
                    payments: [],
                    documents: []
                });
            }
        } catch (error) {
            console.error(error);
            setCaseData({
                id: params.id,
                title: '시스템 에러 - 안전 모드',
                caseNumber: 'ERROR-001',
                status: 'ERROR',
                clientName: '관리자 확인 필요',
                description: '데이터 로드 중 에러가 발생했습니다. 안전 모드로 진입합니다.',
                timeline: [],
                events: [],
                payments: [],
                documents: []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCaseData();
    }, [params.id]);


    // Handlers
    const handleScheduleSave = async (data: any) => {
        const res = await addCaseSchedule(params.id, data);
        if (res.success) {
            toast.success('일정이 등록되었습니다.');
            loadCaseData();
        } else {
            toast.error('일정 등록 실패: ' + res.error);
        }
    };

    const handlePaymentCreate = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSave = async (data: any) => {
        const res = await createCasePayment(params.id, data);
        if (res.success) {
            toast.success('결제 요청이 생성되었습니다.');
            loadCaseData();
        } else {
            toast.error('결제 요청 생성 실패');
        }
    };

    const handleFileUploadRequest = () => {
        setIsDocModalOpen(true);
    };

    const handleFileChange = async (file: File, category: string, isPrivate: boolean) => {
        setIsUploading(true);
        try {
            // 1. Upload to Supabase Storage
            const fileName = `${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(`cases/${params.id}/${fileName}`, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(`cases/${params.id}/${fileName}`);

            // 3. Save to DB
            const res = await saveCaseDocument(params.id, {
                fileName: file.name,
                fileSize: (file.size / 1024).toFixed(1) + ' KB',
                fileType: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                url: publicUrl,
                category,
                isPrivate
            });

            if (res.success) {
                toast.success('파일이 업로드되었습니다.');
                loadCaseData();
            } else {
                throw new Error(res.error);
            }

        } catch (error: any) {
            console.error("Upload failed:", error);
            toast.error('파일 업로드 중 오류가 발생했습니다: ' + (error.message || 'Unknown Error'));
        } finally {
            setIsUploading(false);
        }
    };


    if (loading) return <div className="p-8">Loading case details...</div>;
    if (!caseData) return <div className="p-8">Case not found.</div>;

    const getTimelineIcon = (status: string) => {
        if (status === 'DONE') return <CheckCircle2 className="w-6 h-6 text-green-600 bg-white" />;
        if (status === 'CURRENT') return <Circle className="w-6 h-6 text-[#181d27] fill-[#181d27] border-4 border-white shadow-sm" />;
        return <Circle className="w-5 h-5 text-slate-300 bg-white" />;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSave={handleScheduleSave}
            />
            <PaymentRequestModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSave={handlePaymentSave}
                caseTitle={caseData.title}
                clientName={caseData.clientName}
            />

            <DocumentUploadModal
                isOpen={isDocModalOpen}
                onClose={() => setIsDocModalOpen(false)}
                onUpload={(file, category, isPrivate) => handleFileChange(file, category, isPrivate)}
            />

            {/* Header */}
            <div>
                <Link href="/admin/cases" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-3 ml-1">
                    <ChevronLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-[#8a765e] text-white text-xs font-mono rounded">
                                {caseData.caseNumber || 'NO-NUMBER'}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-bold rounded">
                                {caseData.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{caseData.title}</h1>
                    </div>
                    <button className="bg-[#181d27] text-white px-5 py-2.5 rounded-lg hover:bg-[#2a3241] transition-colors text-sm font-medium shadow-sm">
                        상태 변경 / 업데이트
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Info Card */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <AssigneeSelector
                            label="담당 전문가 배정"
                            roleFilter={['LAWYER']}
                            currentAssigneeId={caseData.assignedProfessionalId || caseData.lawyerId}
                            onAssign={(id) => {
                                toast.info("담당자 배정 기능은 업데이트 준비 중입니다.");
                            }}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-slate-500" /> 의뢰인 정보
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-400 uppercase">성명</p>
                                <p className="text-sm font-medium text-slate-900">{caseData.clientName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase">연락처</p>
                                <p className="text-sm font-medium text-slate-900">{caseData.clientPhone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-slate-500" /> 담당 변호팀
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                {(caseData.lawyerName || '미정')[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{caseData.lawyerName}</p>
                                <p className="text-xs text-slate-500">법무팀</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#fcfbf9] p-6 rounded-xl border border-[#e5dfd5]">
                        <h3 className="text-lg font-bold text-[#8a765e] mb-2 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" /> 사건 개요
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {caseData.description}
                        </p>
                    </div>
                </div>

                {/* Center: Tabs & Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200">
                        {['TIMELINE', 'CALENDAR', 'PAYMENTS', 'DOCUMENTS'].map((tab) => {
                            const active = activeTab === tab;
                            const labels = { TIMELINE: '타임라인', CALENDAR: '일정 관리', PAYMENTS: '결제 관리', DOCUMENTS: '문서 관리' };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${active ? 'border-[#8a765e] text-[#8a765e]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    {(labels as any)[tab]}
                                </button>
                            );
                        })}
                    </div>

                    {/* TIMELINE TAB */}
                    {activeTab === 'TIMELINE' && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-slate-500" /> 사건 진행 타임라인
                            </h3>
                            <div className="relative pl-4">
                                <div className="absolute left-[31px] top-4 bottom-8 w-0.5 bg-slate-200 pointer-events-none"></div>
                                <div className="space-y-8">
                                    {(caseData.timeline || []).map((event: any, idx: number) => (
                                        <div key={idx} className="relative flex items-start gap-6 group">
                                            <div className="relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full">
                                                {getTimelineIcon(event.status)}
                                            </div>
                                            <div className="flex-1 p-4 rounded-lg border bg-slate-50 border-slate-100">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-700">{event.step}</h4>
                                                    <span className="text-xs font-mono py-1 px-2 rounded bg-slate-200 text-slate-500">{event.date}</span>
                                                </div>
                                                {event.description && <p className="text-sm text-slate-600 mt-2">{event.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CALENDAR TAB */}
                    {activeTab === 'CALENDAR' && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-slate-500" /> 재판/조사 일정
                                </h3>
                                <button
                                    onClick={() => setIsScheduleModalOpen(true)}
                                    className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700 font-medium"
                                >
                                    + 일정 등록
                                </button>
                            </div>

                            {caseData.events && caseData.events.length > 0 ? (
                                <div className="space-y-3">
                                    {caseData.events.map((event: any) => (
                                        <div key={event.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm transition-all text-sm">
                                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-lg shadow-sm flex-shrink-0">
                                                <span className="text-xs text-slate-500 font-bold uppercase">{event.date.split('-')[1]}월</span>
                                                <span className="text-lg font-extrabold text-[#8a765e]">{event.date.split('-')[2]}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${event.type === 'TRIAL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {event.type}
                                                    </span>
                                                    <h4 className="font-bold text-slate-800">{event.title}</h4>
                                                </div>
                                                <p className="text-slate-600 truncate">{event.location} {event.memo && `• ${event.memo}`}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-sm bg-slate-50 rounded-lg">
                                    등록된 일정이 없습니다.
                                </div>
                            )}
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === 'PAYMENTS' && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-slate-500" /> 결제/수임료 관리
                                </h3>
                                <button
                                    onClick={handlePaymentCreate}
                                    className="text-xs bg-[#8a765e] text-white px-3 py-1.5 rounded hover:bg-[#75644e] font-medium flex items-center gap-1 shadow-sm"
                                >
                                    + 결제 요청 생성
                                </button>
                            </div>

                            <div className="overflow-hidden border border-slate-200 rounded-lg">
                                <table className="w-full text-left bg-white text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold text-slate-500">항목</th>
                                            <th className="px-5 py-3 font-semibold text-slate-500">금액</th>
                                            <th className="px-5 py-3 font-semibold text-slate-500">청구일</th>
                                            <th className="px-5 py-3 font-semibold text-slate-500">상태</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {caseData.payments && caseData.payments.length > 0 ? (
                                            caseData.payments.map((pay: any) => (
                                                <tr key={pay.id} className="hover:bg-slate-50">
                                                    <td className="px-5 py-4 font-medium text-slate-900">{pay.title}</td>
                                                    <td className="px-5 py-4 font-mono text-slate-600">{(pay.amount || 0).toLocaleString()}원</td>
                                                    <td className="px-5 py-4 text-slate-500">{pay.date}</td>
                                                    <td className="px-5 py-4">
                                                        {pay.status === 'PAID' ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                                                                <CheckCircle2 className="w-3 h-3" /> 결제완료
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold">
                                                                <Circle className="w-3 h-3" /> 미납
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                                                    결제 내역이 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* DOCUMENTS TAB */}
                    {activeTab === 'DOCUMENTS' && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-500" /> 관련 문서
                                </h3>
                                <button
                                    onClick={handleFileUploadRequest}
                                    disabled={isUploading}
                                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800 border px-2 py-1 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    {isUploading ? <Circle className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                    {isUploading ? '업로드 중...' : '파일 업로드'}
                                </button>
                            </div>

                            {/* Category Filter Tabs */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {['ALL', '소송서류', '증거자료', '참고자료', '기초서류'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setDocCategoryFilter(cat)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors whitespace-nowrap ${docCategoryFilter === cat
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                            }`}
                                    >
                                        {cat === 'ALL' ? '전체' : cat}
                                    </button>
                                ))}
                            </div>

                            {caseData.documents && caseData.documents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {caseData.documents
                                        .filter((d: any) => docCategoryFilter === 'ALL' || d.category === docCategoryFilter)
                                        .map((doc: any) => (
                                            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-[#8a765e] hover:bg-[#fffdfa] transition-all cursor-pointer group relative">
                                                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded flex items-center justify-center font-bold text-xs">
                                                    {doc.type}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-[#8a765e]">{doc.name}</p>
                                                        {doc.isPrivate && <Lock className="w-3 h-3 text-slate-400" />}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">
                                                            {doc.category || '미분류'}
                                                        </span>
                                                        <p className="text-xs text-slate-400">{doc.size} • {doc.uploadDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg">등록된 문서가 없습니다.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
