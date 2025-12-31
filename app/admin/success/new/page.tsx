import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SuccessCaseEditForm from '@/app/components/admin/SuccessCaseEditForm';

export const dynamic = 'force-dynamic';

const DEFAULT_TEMPLATE = `
<h2>1. 사건 개요</h2>
<p>사건의 배경과 의뢰인이 처한 상황을 간략히 기술하세요.</p>
<ul>
    <li><strong>사건 유형:</strong> [입력]</li>
    <li><strong>핵심 쟁점:</strong> [입력]</li>
</ul>

<h2>2. 변호인의 조력 (해결 전략)</h2>
<p>본 법무법인이 수립한 구체적인 전략과 실행 내용을 서술하세요.</p>
<ol>
    <li><strong>증거 확보:</strong> [상세 내용]</li>
    <li><strong>법리적 주장:</strong> [상세 내용]</li>
    <li><strong>협상 및 조정:</strong> [상세 내용]</li>
</ol>

<h2>3. 최종 결과</h2>
<p>법원의 판결 내용 또는 합의 결과를 명시하세요.</p>
<blockquote>
    <p><strong>[판결 요지]</strong> 피고는 원고에게 금 OOO원을 지급하라.</p>
</blockquote>
`;

export default function NewSuccessCasePage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/success" className="text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">새 성공사례 등록</h1>
            </div>

            <SuccessCaseEditForm defaultContent={DEFAULT_TEMPLATE} />
        </div>
    );
}
