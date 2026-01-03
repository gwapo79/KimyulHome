
"use client";

import { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';

interface PaymentRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string; amount: number; dueDate: string; memo: string }) => Promise<void>;
    caseTitle: string;
    clientName: string;
}

export default function PaymentRequestModal({ isOpen, onClose, onSave, caseTitle, clientName }: PaymentRequestModalProps) {
    const [step, setStep] = useState<'INPUT' | 'PREVIEW'>('INPUT');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        itemType: '착수금',
        customItem: '',
        amount: '',
        dueDate: new Date().toISOString().split('T')[0], // Default today
        memo: ''
    });

    if (!isOpen) return null;

    // Formatting helpers
    const formatCurrency = (val: string) => {
        const num = val.replace(/\D/g, '');
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/,/g, '');
        if (!/^\d*$/.test(val)) return; // Only numbers
        setFormData({ ...formData, amount: formatCurrency(val) });
        setError(null);
    };

    const getFinalTitle = () => {
        return formData.itemType === '직접입력' ? formData.customItem : formData.itemType;
    };

    const handleNext = () => {
        setError(null);
        if (!formData.amount || parseInt(formData.amount.replace(/,/g, '')) <= 0) {
            setError("유효한 청구 금액을 입력해주세요.");
            return;
        }
        if (formData.itemType === '직접입력' && !formData.customItem) {
            setError("청구 항목명을 입력해주세요.");
            return;
        }
        setStep('PREVIEW');
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await onSave({
                title: getFinalTitle(),
                amount: parseInt(formData.amount.replace(/,/g, '')),
                dueDate: formData.dueDate,
                memo: formData.memo
            });
            onClose();
            // Reset
            setStep('INPUT');
            setFormData({ itemType: '착수금', customItem: '', amount: '', dueDate: new Date().toISOString().split('T')[0], memo: '' });
        } catch (error) {
            console.error(error);
            setError("요청 처리 중 서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#8a765e]" />
                            {step === 'INPUT' ? '결제 요청서 작성' : '청구서 미리보기'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {step === 'INPUT' ? '고객에게 발송할 청구 정보를 입력하세요.' : '발송 전 내용을 최종 확인해주세요.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {step === 'INPUT' ? (
                        <div className="space-y-5">
                            {/* Item Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">청구 항목 <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {['착수금', '성공보수', '인지대/송달료', '자문료'].map(item => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, itemType: item })}
                                            className={`py-2 px-3 text-sm rounded-lg border font-medium transition-all ${formData.itemType === item
                                                ? 'bg-[#8a765e] text-white border-[#8a765e]'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#8a765e] hover:text-[#8a765e]'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="custom"
                                        checked={formData.itemType === '직접입력'}
                                        onChange={() => setFormData({ ...formData, itemType: '직접입력' })}
                                        className="accent-[#8a765e]"
                                    />
                                    <label htmlFor="custom" className="text-sm text-slate-700 cursor-pointer">직접 입력</label>
                                </div>
                                {formData.itemType === '직접입력' && (
                                    <input
                                        type="text"
                                        className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#8a765e] animate-in fade-in slide-in-from-top-1"
                                        placeholder="항목명 입력 (예: 출장비)"
                                        value={formData.customItem}
                                        onChange={e => setFormData({ ...formData, customItem: e.target.value })}
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">청구 금액 (VAT 포함) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-3 pr-10 py-3 border border-slate-200 rounded-lg text-lg font-bold text-slate-900 focus:outline-none focus:border-[#8a765e]"
                                        placeholder="0"
                                        value={formData.amount}
                                        onChange={handleAmountChange}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">원</span>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">지급 기한 <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#8a765e]"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    onFocus={() => setError(null)}
                                />
                            </div>

                            {/* Memo */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">비고 (고객 전달 메시지)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#8a765e] resize-none h-20"
                                    placeholder="입금 계좌: 국민은행 000-00-0000 (예금주: 서초지율)"
                                    value={formData.memo}
                                    onChange={e => setFormData({ ...formData, memo: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        // PREVIEW STEP
                        <div className="space-y-6">
                            <div className="bg-[#fcfbf9] border border-[#e5dfd5] p-6 rounded-lg text-center shadow-sm">
                                <p className="text-xs text-[#8a765e] font-bold uppercase tracking-widest mb-2">INVOICE</p>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{getFinalTitle()}</h2>
                                <p className="text-4xl font-extrabold text-[#181d27] my-4">
                                    {formData.amount} <span className="text-xl font-medium text-slate-500">원</span>
                                </p>
                                <div className="text-sm text-slate-500">
                                    지급 기한: <span className="font-bold text-slate-800">{formData.dueDate}</span> 까지
                                </div>
                            </div>

                            <div className="space-y-3 px-2">
                                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500">수신인 (의뢰인)</span>
                                    <span className="font-bold text-slate-800">{clientName}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500">관련 사건</span>
                                    <span className="font-bold text-slate-800 text-right max-w-[200px] truncate">{caseTitle}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500">발신인</span>
                                    <span className="font-bold text-slate-800">서초지율 합동법률사무소</span>
                                </div>
                            </div>

                            {formData.memo && (
                                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-100">
                                    <span className="block text-xs font-bold text-slate-400 mb-1">메모</span>
                                    {formData.memo}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                    {step === 'INPUT' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-[2] py-3 text-sm font-bold text-white bg-[#181d27] rounded-lg hover:bg-[#2a3241] transition-colors flex items-center justify-center gap-2"
                            >
                                다음 (미리보기) <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('INPUT')}
                                className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> 수정하기
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-[2] py-3 text-sm font-bold text-white bg-[#8a765e] rounded-lg hover:bg-[#75644e] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                            >
                                {loading ? '처리 중...' : '결제 요청서 발송'} <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
