import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const personas = [
    { list: '/assets/images/personas/persona_1_list.png', detail: '/assets/images/personas/persona_1_detail.png' }, // Male Suit
    { list: '/assets/images/personas/persona_2_list.png', detail: '/assets/images/personas/persona_2_detail.png' }, // Female Business
    { list: '/assets/images/personas/persona_3_list.png', detail: '/assets/images/personas/persona_3_detail.png' }, // Male Casual
    { list: '/assets/images/personas/persona_4_list.png', detail: '/assets/images/personas/persona_4_detail.png' }, // Female Casual
];

const categories = [
    "부동산 법률",
    "금융 솔루션",
    "개인회생",
    "기타 법률"
];

// Helper to get cyclical persona
const getPersona = (index: number) => personas[index % personas.length];

const realEstateCases = [
    {
        title: "전세보증금 4억 5천만원 전액 회수",
        summary: "임대인의 고의적인 반환 지연을 가압류와 소송으로 해결한 사례",
        client: "김민준",
        amount: "4.5억원",
        period: "4개월",
        lawyer: "김법무 변호사",
        result: "전액 회수 및 이자 지급",
        caseType: "전세금 반환 청구",
        background: "의뢰인은 전세 계약 만료 3개월 전부터 해지 통보를 하였으나, 임대인은 다음 세입자를 구하지 못했다며 보증금 반환을 차일피일 미루었습니다. 급기야 연락이 두절되는 상황에 이르러 법적 조치가 시급했습니다.",
        strategy: [
            { step: 1, title: "법적 압박 및 보전 처분", description: "내용증명 발송으로 계약 해지 의사를 명확히 하고, 임대인 소유 부동산에 가압류를 신청하여 재산 처분을 막았습니다." },
            { step: 2, title: "지급명령 및 소송 제기", description: "신속한 집행권원 확보를 위해 지급명령을 신청하였으나 이의신청으로 본안 소송으로 진행, 승소 판결을 이끌어냈습니다." },
            { step: 3, title: "강제집행 예고 및 협상", description: "경매 신청 예고를 통해 심리적 압박을 가하여, 임대인이 대출을 통해 보증금을 마련하도록 유도했습니다." }
        ],
        outcomes: ["전세보증금 4억 5천만원 전액 회수", "지연이자 5% 및 소송비용 청구 성공", "의뢰인 이사 일정 차질 없이 진행"]
    },
    {
        title: "상가 권리금 회수 방해 손해배상 청구",
        summary: "임대인의 부당한 계약 거절로 인한 권리금 손해를 배상받은 사례",
        client: "이서연",
        amount: "8,000만원",
        period: "6개월",
        lawyer: "박지율 변호사",
        result: "손해배상금 8,000만원 지급 판결",
        caseType: "상가임대차보호법 위반",
        background: "오랫동안 운영해온 카페를 양도하려 했으나, 임대인이 신규 임차인에게 과도한 임대료 인상을 요구하며 계약을 거절하여 권리금 회수 기회를 잃게 되었습니다.",
        strategy: [
            { step: 1, title: "증거 확보", description: "임대인의 무리한 임대료 인상 요구와 계약 거절 발언이 담긴 통화 녹음 및 문자 메시지를 확보했습니다." },
            { step: 2, title: "손해액 산정", description: "감정평가를 통해 적정 권리금을 산정하고, 임대인의 방해 행위로 인한 구체적인 손해액을 입증했습니다." },
            { step: 3, title: "손해배상 청구 소송", description: "상가임대차보호법상 권리금 회수 기회 보호 규정을 근거로 적극적인 변론을 펼쳤습니다." }
        ],
        outcomes: ["감정평가액 상당의 손해배상 8,000만원 인정", "임대인의 방해 행위 위법성 확인", "소송 비용 피고 부담 판결"]
    },
    {
        title: "공사대금 2억원 미지급 분쟁 승소",
        summary: "하도급 업체의 부당한 공사대금 미지급을 해결한 사례",
        client: "최준호",
        amount: "2억원",
        period: "5개월",
        lawyer: "정의석 변호사",
        result: "공사대금 및 지연손해금 지급",
        caseType: "공사대금 청구",
        background: "인테리어 공사를 완공했음에도 발주처가 사소한 하자를 핑계로 잔금 지급을 거부하며 부당하게 감액을 요구한 사건입니다.",
        strategy: [
            { step: 1, title: "현장 검증 및 감정", description: "법원 감정을 통해 시공 상태가 양호하며 주장이 과장된 하자임을 입증했습니다." },
            { step: 2, title: "계약서 및 작업일지 분석", description: "추가 공사 지시 내역과 작업 일지를 근거로 당초 계약보다 늘어난 공사 범위를 주장했습니다." },
            { step: 3, title: "조정 성립 유도", description: "판결 전 조정 절차에서 유리한 감정 결과를 바탕으로 원만한 합의를 이끌어냈습니다." }
        ],
        outcomes: ["미지급 공사대금 2억원 전액 회수", "추가 공사비 일부 인정", "소송 장기화 방지 및 조기 종결"]
    },
    {
        title: "부동산 매매계약 해제 및 계약금 반환",
        summary: "중도금 지급 전 매도인의 일방적 계약 파기를 방어한 사례",
        client: "박지현",
        amount: "1억 2천만원",
        period: "3개월",
        lawyer: "김법무 변호사",
        result: "배액 배상 2억 4천만원 수령",
        caseType: "매매계약 분쟁",
        background: "아파트 매매 계약 체결 후 시세가 급등하자 매도인이 계약금의 일부만 돌려주며 일방적으로 계약 해제를 통보해왔습니다.",
        strategy: [
            { step: 1, title: "계좌 폐쇄 대응", description: "매도인이 중도금 수령을 거부하기 위해 계좌를 폐쇄하자 법원에 변제 공탁을 진행했습니다." },
            { step: 2, title: "처분금지 가처분", description: "부동산을 제3자에게 매도하지 못하도록 신속하게 처분금지 가처분을 신청했습니다." },
            { step: 3, title: "이행 청구 및 손해배상", description: "소유권 이전 등기 청구 소송을 제기하여 매도인을 압박, 결국 배액 배상을 받아냈습니다." }
        ],
        outcomes: ["계약금의 2배인 2억 4천만원 수령", "매도인의 일방적 파기 시도 무력화", "부동산 시장 변동성 리스크 방어"]
    },
    {
        title: "기획부동산 사기 피해 회복",
        summary: "개발 가능성이 없는 임야를 속여 판 기획부동산 일당을 상대로 승소",
        client: "정우성",
        amount: "5,000만원",
        period: "8개월",
        lawyer: "이소연 변호사",
        result: "매매대금 반환 및 피해보상",
        caseType: "사기/손해배상",
        background: "은퇴 자금으로 투자를 권유받아 임야를 매수했으나, 사실상 개발이 불가능한 맹지였으며 공유 지분 쪼개기 수법에 당한 것을 알게 되었습니다.",
        strategy: [
            { step: 1, title: "형사 고소 병행", description: "사기죄로 형사 고소를 진행하여 가해자들을 압박하고 수사 기록을 민사 소송 증거로 활용했습니다." },
            { step: 2, title: "부당이득 반환 청구", description: "기망에 의한 계약 취소를 주장하며 매매대금 반환을 청구했습니다." },
            { step: 3, title: "채권 가압류", description: "기획부동산 법인 계좌를 가압류하여 피해 회복 재원을 확보했습니다." }
        ],
        outcomes: ["투자금 5,000만원 전액 환불", "형사 합의금 추가 수령", "유사 피해자 집단 소송 연계"]
    },
    {
        title: "명의신탁 부동산 소유권 회복",
        summary: "친척 명의로 등기한 부동산의 소유권을 되찾은 사례",
        client: "강수진",
        amount: "10억원 상당",
        period: "1년",
        lawyer: "박지율 변호사",
        result: "소유권 이전 등기 완료",
        caseType: "부동산 실명법",
        background: "과거 사정상 친척 명의로 아파트를 매수하였으나, 친척이 사망한 후 상속인들이 소유권을 주장하며 반환을 거부한 사건입니다.",
        strategy: [
            { step: 1, title: "자금 출처 입증", description: "매수 당시 자금이 의뢰인의 계좌에서 출금된 내역과 세금 납부 기록을 철저히 분석했습니다." },
            { step: 2, title: "점유 사실 입증", description: "실질적으로 의뢰인이 해당 부동산을 관리하고 임대 수익을 수취해온 사실을 증명했습니다." },
            { step: 3, title: "부당이득 반환 법리", description: "명의신탁 무효 법리에 따라 소유권 이전이 아닌 부당이득 반환으로 접근하여 승소했습니다." }
        ],
        outcomes: ["10억원 상당 아파트 소유권 회복", "가족 간 분쟁 최소화 해결", "상속인들과의 원만한 합의 유도"]
    },
    {
        title: "임대주택 분양전환 분쟁 승소",
        summary: "임대 사업자의 과도한 분양가 산정에 맞서 적정 가격 분양을 이끌어냄",
        client: "한지민",
        amount: "세대당 5,000만원 절감",
        period: "10개월",
        lawyer: "김법무 변호사",
        result: "부당이득금 반환 판결",
        caseType: "나홀로 소송 지원",
        background: "공공임대주택 10년 거주 후 분양 전환 시점이 도래했으나, 건설사가 주변 시세보다 높은 감정가를 적용하여 분양을 강요했습니다.",
        strategy: [
            { step: 1, title: "집단 소송 구성", description: "입주민 비상대책위원회를 구성하고 법률 자문을 제공하여 조직적으로 대응했습니다." },
            { step: 2, title: "감정가 오류 지적", description: "건설사 측 감정평가의 비교 사례 선정 오류 및 시점 보정 문제를 전문가와 분석하여 반박했습니다." },
            { step: 3, title: "지자체 조정 신청", description: "지자체 분쟁조정위원회에 조정을 신청하여 행정적인 압박을 가했습니다." }
        ],
        outcomes: ["세대당 5,000만원 분양가 인하", "부당한 분양 조건 철회", "안정적인 주거권 확보"]
    },
    {
        title: "도로 통행권 방해 금지 가처분",
        summary: "이웃의 담장 설치로 막힌 진입로를 확보한 사례",
        client: "오영수",
        amount: "통행권 확보",
        period: "2개월",
        lawyer: "정의석 변호사",
        result: "방해물 철거 및 통행 보장",
        caseType: "주위토지통행권",
        background: "오랫동안 사용해온 유일한 진입로에 이웃이 사유지임을 주장하며 펜스를 설치해 차량 통행이 불가능해졌습니다.",
        strategy: [
            { step: 1, title: "현황 측량", description: "해당 도로가 유일한 통행로임을 입증하기 위해 지적 측량과 현장 사진을 확보했습니다." },
            { step: 2, title: "통행 방해 금지 가처분", description: "본안 소송 전 긴급성을 소명하여 펜스 철거를 구하는 단행 가처분을 신청했습니다." },
            { step: 3, title: "주위토지통행권 법리", description: "민법상 주위토지통행권 요건을 충족함을 판례를 들어 강력히 주장했습니다." }
        ],
        outcomes: ["신속한 펜스 철거 결정", "차량 통행 재개", "이웃과의 경계 분쟁 종식"]
    },
    {
        title: "조상 땅 찾기 소송 승소",
        summary: "일제강점기 유실된 조상의 토지 3,000평 소유권 확인",
        client: "김철수",
        amount: "토지 3,000평",
        period: "1년 6개월",
        lawyer: "박지율 변호사",
        result: "소유권 보존 등기 말소 및 이전",
        caseType: "소유권 확인",
        background: "할아버지 명의의 땅이 있었으나 6.25 전쟁 등으로 등기가 소실되고, 제3자 명의로 불법 이전된 사실을 뒤늦게 알게 되었습니다.",
        strategy: [
            { step: 1, title: "구토지대장 분석", description: "국가기록원을 통해 일제강점기 토지조사부와 구토지대장을 발굴하여 원소유자를 확인했습니다." },
            { step: 2, title: "제적등본 추적", description: "상속인 관계를 증명하기 위해 방대한 양의 제적등본을 추적하여 가계도를 입증했습니다." },
            { step: 3, title: "원인 무효 등기 입증", description: "현재 명의자의 등기 취득 과정에 적법한 원인이 없음을 밝혀 말소를 청구했습니다." }
        ],
        outcomes: ["시가 30억원 상당 토지 회수", "후손들의 상속 권리 회복", "역사적 정의 실현"]
    },
    {
        title: "입주 지연에 따른 계약 해제",
        summary: "오피스텔 준공 지연으로 인한 계약금 및 위약금 반환",
        client: "이유리",
        amount: "계약금 환불",
        period: "3개월",
        lawyer: "이소연 변호사",
        result: "전액 환불 및 이자 지급",
        caseType: "분양 계약 분쟁",
        background: "오피스텔 입주 예정일이 6개월 이상 지났음에도 공사가 완료되지 않아 임시 거처를 전전해야 하는 상황이었습니다.",
        strategy: [
            { step: 1, title: "해제 통보", description: "입주 지연이 3개월을 초과하면 계약 해제가 가능하다는 약관을 근거로 내용증명을 발송했습니다." },
            { step: 2, title: "신탁사 압박", description: "분양 대금 관리 신탁사를 상대로 반환 의무를 다투며 자금 동결을 요청했습니다." },
            { step: 3, title: "소송 제기", description: "시행사의 자금난을 고려하여 신속하게 소장을 접수하고 재산 명시를 신청했습니다." }
        ],
        outcomes: ["계약금 및 중도금 전액 반환", "위약금 10% 추가 수령", "중도금 대출 이자 시행사 부담 확정"]
    }
];

const financialCases = [
    {
        title: "불법 사금융 채무 탕감 및 형사 고소",
        summary: "연 1,000%가 넘는 살인적인 고금리 사채 빚을 청산한 사례",
        client: "박OO",
        amount: "3,000만원",
        period: "2개월",
        lawyer: "이소연 변호사",
        result: "이자 전액 무효 및 원금 일부 상환 종결",
        caseType: "불법 사금융 대응",
        background: "생활비로 300만원을 빌렸으나 '꺾기' 수법으로 빚이 순식간에 3,000만원으로 불어났고, 가족에게 알리겠다는 협박에 시달렸습니다.",
        strategy: [
            { step: 1, title: "채무 부존재 확인", description: "법정 최고이자율 20%를 초과한 이자 약정은 무효임을 주장하고 초과 지급된 이자의 원금 충당을 계산했습니다." },
            { step: 2, title: "채권추심 금지", description: "대리인 선임 통지로 채무자에게 직접 연락하는 것을 차단하고 불법 추심 증거를 수집했습니다." },
            { step: 3, title: "형사 고소", description: "대부업법 위반 및 채권추심법 위반으로 경찰에 고소하여 형사처벌을 경고하며 합의를 유도했습니다." }
        ],
        outcomes: ["불법 이자 전액 삭감", "잔여 채무 0원 확정", "불법 추심으로부터 해방"]
    },
    {
        title: "보이스피싱 피해금 반환 소송",
        summary: "대포통장 명의자를 상대로 부당이득 반환 청구 승소",
        client: "최OO",
        amount: "2,500만원",
        period: "5개월",
        lawyer: "정의석 변호사",
        result: "피해금 70% 회수",
        caseType: "금융 사기 피해",
        background: "검찰 사칭 보이스피싱에 속아 자금을 이체했으나, 범인은 잡히지 않고 대포통장 계좌주만 특정된 상황이었습니다.",
        strategy: [
            { step: 1, title: "계좌 지급 정지", description: "사건 발생 직후 은행에 지급 정지를 요청하여 피해금이 인출되지 않도록 막았습니다." },
            { step: 2, title: "부당이득 반환 청구", description: "계좌주가 법률상 원인 없이 돈을 이체받았으므로 이를 반환해야 한다는 민사 소송을 제기했습니다." },
            { step: 3, title: "과실 상계 방어", description: "피고 측의 '자신도 피해자'라는 주장에 대해 계좌 대여 행위의 중과실을 입증하여 책임을 물었습니다." }
        ],
        outcomes: ["계좌에 남아있던 피해금 배당", "계좌주 대상 판결문 확보", "추가 피해 예방"]
    },
    {
        title: "암호화폐 투자 사기 손해배상",
        summary: "상장 예정 코인이라 속인 다단계 투자 사기단으로부터 피해 회복",
        client: "김OO",
        amount: "1억원",
        period: "10개월",
        lawyer: "박지율 변호사",
        result: "합의금 8,000만원 수령",
        caseType: "투자 사기",
        background: "지인의 권유로 가상화폐에 투자했으나, 거래소 상장은 거짓이었고 다단계 형태의 폰지 사기임이 드러났습니다.",
        strategy: [
            { step: 1, title: "모집책 재산 가압류", description: "실질적으로 투자를 권유한 상위 모집책의 부동산과 예금 채권을 신속히 가압류했습니다." },
            { step: 2, title: "사기죄 고소", description: "유사수신행위 및 사기 혐의로 고소장을 제출하고 조직적인 범행임을 소명했습니다." },
            { step: 3, title: "피해자 연대 대응", description: "피해자 모임을 결성하여 탄원서를 제출하고 수사 기관의 적극적인 수사를 촉구했습니다." }
        ],
        outcomes: ["가압류 해제를 조건으로 80% 피해금 반환 합의", "가해자 구속 기소", "투자 원금 대부분 회수"]
    },
    {
        title: "주가조작 피해 집단 소송",
        summary: "허위 공시로 인한 주가 하락 손해 배상 승소",
        client: "이OO 외 20명",
        amount: "총 5억원",
        period: "2년",
        lawyer: "김법무 변호사",
        result: "손해액 60% 배상 판결",
        caseType: "증권 집단 소송",
        background: "상장사가 대규모 수주 계약을 허위로 공시하여 주가를 띄운 후 유상증자를 단행, 이후 계약 해지로 주가가 폭락한 사건입니다.",
        strategy: [
            { step: 1, title: "자본시장법 위반 입증", description: "금융감독원 공시 자료와 내부 고발 내용을 분석하여 허위 공시의 고의성을 입증했습니다." },
            { step: 2, title: "인과관계 증명", description: "허위 공시 시점과 주가 변동 추이를 통계적으로 분석하여 투자자들의 손해와의 인과관계를 밝혔습니다." },
            { step: 3, title: "대표당사자 소송", description: "다수의 피해자를 대표하여 소송을 진행하며 효율적으로 증거를 정리했습니다." }
        ],
        outcomes: ["회사 및 경영진의 배상 책임 인정", "투자자 보호 판례 확립", "피해 보상금 지급"]
    },
    {
        title: "보험금 지급 거절 대응 승소",
        summary: "고지의무 위반을 이유로 해지당한 암보험금 전액 수령",
        client: "정OO",
        amount: "5,000만원",
        period: "6개월",
        lawyer: "정의석 변호사",
        result: "보험금 전액 지급 및 계약 유지",
        caseType: "보험 분쟁",
        background: "갑상선암 진단 후 보험금을 청구했으나, 보험사는 가입 전 경미한 통원 치료 내역을 알리지 않았다며 지급을 거절하고 계약을 해지했습니다.",
        strategy: [
            { step: 1, title: "의료 자문", description: "과거 통원 치료 내용이 이번 암 발병과 의학적 인과관계가 없음을 전문의 소견서로 입증했습니다." },
            { step: 2, title: "설명 의무 위반 주장", description: "설계사가 고지 의무 범위에 대해 상세히 설명하지 않은 점을 녹취록으로 증명했습니다." },
            { step: 3, title: "금감원 민원 병행", description: "소송과 동시에 금융감독원에 분쟁 조정을 신청하여 보험사를 전방위로 압박했습니다." }
        ],
        outcomes: ["암 진단비 5,000만원 전액 수령", "일방적 계약 해지 철회", "지연 이자까지 확보"]
    },
    {
        title: "카드사 리볼빙 채무 금리 인하",
        summary: "과도한 리볼빙 이자에 대한 채무 조정 성공",
        client: "송OO",
        amount: "2,000만원",
        period: "3개월",
        lawyer: "이소연 변호사",
        result: "이자율 5%대로 인하 및 분할 상환",
        caseType: "프리워크아웃",
        background: "카드 리볼빙 서비스를 장기간 이용하다 보니 이자만 매달 100만원이 넘어 원금 상환이 불가능한 악순환에 빠졌습니다.",
        strategy: [
            { step: 1, title: "채무 구조 분석", description: "현재 소득 대비 상환 능력을 분석하여 개인회생보다는 신속 채무 조정이 유리함을 판단했습니다." },
            { step: 2, title: "신용회복위원회 신청", description: "프리워크아웃 제도를 활용하여 금융기관 동의를 이끌어내는 협상안을 마련했습니다." },
            { step: 3, title: "상환 계획서 제출", description: "구체적이고 실현 가능한 변제 계획을 제시하여 채권단의 신뢰를 얻었습니다." }
        ],
        outcomes: ["이자율 18% -> 5% 인하", "최장 10년 분할 상환 확정", "신용 불량 등록 방지"]
    },
    {
        title: "유사수신업체 투자금 반환",
        summary: "FX마진거래를 빙자한 불법 업체로부터 원금 회수",
        client: "조OO",
        amount: "4,000만원",
        period: "4개월",
        lawyer: "박지율 변호사",
        result: "투자금 전액 반환",
        caseType: "유사수신",
        background: "원금 보장과 고수익을 미끼로 FX마진거래 투자를 권유받았으나, 실제로는 도박 사이트와 유사한 불법 업체였습니다.",
        strategy: [
            { step: 1, title: "계좌 추적", description: "입금한 법인 계좌가 대포 통장임을 의심하고 관련 계좌들을 가압류 신청했습니다." },
            { step: 2, title: "내용증명 발송", description: "유사수신행위규제법 위반 사실을 적시하고 즉각적인 반환 없으면 형사 고발함을 통지했습니다." },
            { step: 3, title: "합의 유도", description: "운영진이 처벌을 두려워하여 먼저 합의를 제안하도록 유도했습니다." }
        ],
        outcomes: ["투자 원금 즉시 반환", "추가적인 법적 조치 없이 종결", "신속한 피해 구제"]
    },
    {
        title: "해외 선물 리딩방 사기 피해 구제",
        summary: "유튜브 전문가 사칭 리딩방 피해금 회수",
        client: "황OO",
        amount: "6,000만원",
        period: "7개월",
        lawyer: "김법무 변호사",
        result: "피해금 50% 회수",
        caseType: "사이버 사기",
        background: "유튜브 유명 전문가를 사칭한 카카오톡 리딩방에 초대되어 가짜 거래소 HTS를 설치하고 투자금을 편취당했습니다.",
        strategy: [
            { step: 1, title: "IP 추적 의뢰", description: "경찰 수사에 협조하여 가짜 HTS 서버 IP와 운영자 접속 기록 추적을 요청했습니다." },
            { step: 2, title: "환전책 검거 지원", description: "자금 세탁을 담당한 환전책이 검거되자 민사상 손해배상을 청구했습니다." },
            { step: 3, title: "배상명령 신청", description: "형사 재판 과정에서 배상명령을 신청하여 별도 소송 비용 없이 집행권원을 얻었습니다." }
        ],
        outcomes: ["환전책으로부터 3,000만원 회수", "나머지 금액에 대한 채권 확보"]
    },
    {
        title: "대출 사기(작업대출) 연루 무혐의",
        summary: "저금리 대환대출을 미끼로 한 작업대출 가담 혐의 벗어남",
        client: "류OO",
        amount: "무죄 판결",
        period: "6개월",
        lawyer: "정의석 변호사",
        result: "사기 방조 혐의 없음 처분",
        caseType: "금융 형사 변호",
        background: "급전이 필요해 대출을 알아보던 중, 서류를 조작해 대출을 받게 해주는 일당에게 속아 사기 공범으로 몰렸습니다.",
        strategy: [
            { step: 1, title: "고의성 부인", description: "의뢰인 또한 정상적인 대출로 오인했으며 범죄에 가담할 의사가 없었음을 문자 내역 등으로 입증했습니다." },
            { step: 2, title: "이익 부존재", description: "실제 대출 실행 후 수수료를 떼이고 남은 돈도 거의 없다는 점을 들어 범죄 수익이 없음을 강조했습니다." },
            { step: 3, title: "변호인 의견서", description: "금융 지식이 부족한 사회 초년생이 이용당한 사건임을 법리적으로 주장했습니다." }
        ],
        outcomes: ["검찰 혐의 없음 처분", "형사 처벌 면제", "일상 복귀"]
    },
    {
        title: "착오 송금 반환 청구",
        summary: "계좌번호 입력 실수로 잘못 보낸 1,000만원 회수",
        client: "서OO",
        amount: "1,000만원",
        period: "3개월",
        lawyer: "이소연 변호사",
        result: "전액 회수",
        caseType: "부당이득 반환",
        background: "중고차 구매 대금을 이체하다가 계좌번호 한 자리를 틀려 전혀 모르는 사람에게 1,000만원을 송금했습니다.",
        strategy: [
            { step: 1, title: "반환 지원 제도 신청", description: "예금보험공사의 착오송금 반환 지원 제도를 먼저 안내했으나 한도 초과로 반려되었습니다." },
            { step: 2, title: "수취인 특정", description: "은행에 사실조회 신청을 하여 수취인의 인적 사항을 파악했습니다." },
            { step: 3, title: "지급명령 신청", description: "부당이득금 반환 청구 소송 전 간이 절차인 지급명령으로 신속하게 압류를 예고했습니다." }
        ],
        outcomes: ["소장 송달 후 수취인이 자진 반환", "소송 비용 피고 부담", "빠른 해결"]
    }
];

const rehabilitationCases = [
    {
        title: "채무 8억원, 탕감율 85% 개인회생 인가",
        summary: "무리한 사업 확장에 따른 거액의 채무를 성공적으로 탕감받은 사례",
        client: "최사업",
        amount: "8억원 -> 1.2억원",
        period: "6개월",
        lawyer: "박지율 변호사",
        result: "인가 결정 및 85% 탕감",
        caseType: "개인회생",
        background: "요식업 프랜차이즈 사업 실패로 인해 금융권 채무와 사채 등 총 8억원의 빚을 지게 되어 정상적인 생활이 불가능했습니다.",
        strategy: [
            { step: 1, title: "재산 목록 정리", description: "배우자 명의의 재산 기여도를 소명하여 청산 가치를 최대한 낮게 산정받도록 조력했습니다." },
            { step: 2, title: "회생 계획안 작성", description: "현재 소득에서 최저 생계비를 제외한 가용 소득으로 36개월간 변제하는 최적의 계획안을 수립했습니다." },
            { step: 3, title: "채권자 이의 대응", description: "보증인 및 대부업체의 이의 신청에 대해 법리적으로 반박하며 인가를 설득했습니다." }
        ],
        outcomes: ["원금 및 이자 총 85% 탕감", "월 변제금 330만원 확정", "채권 추심 중단"]
    },
    {
        title: "도박 채무 개인회생 성공",
        summary: "주식 및 코인 투자 실패로 인한 채무도 탕감 가능함을 증명",
        client: "김투자",
        amount: "1.5억원 -> 6,000만원",
        period: "5개월",
        lawyer: "김법무 변호사",
        result: "개시 결정 및 금지 명령",
        caseType: "개인회생",
        background: "가상화폐 투자 실패로 1억 5천만원의 빚을 졌고, 최근 대출이 많아 기각 우려가 높은 상황이었습니다.",
        strategy: [
            { step: 1, title: "사용처 소명", description: "대출금 사용처를 투명하게 정리하고 도박 치료 상담 내역을 첨부하여 재활 의지를 피력했습니다." },
            { step: 2, title: "변제율 상향 조정", description: "사행성 채무임을 감안하여 일반적인 경우보다 변제율을 다소 높게 조정해 법원의 허가를 득했습니다." },
            { step: 3, title: "금지 명령", description: "신청과 동시에 금지 명령을 받아 독촉 전화를 차단했습니다." }
        ],
        outcomes: ["원금 40% 탕감", "이자 전액 면제", "성실 상환 중"]
    },
    // ... (will generate 8 more rehabilitation cases in the file content)
    {
        title: "법인 파산 및 대표자 개인회생 동시 진행",
        summary: "경영난에 처한 법인 정리와 대표자의 연대보증 채무 해결",
        client: "이대표",
        amount: "법인 20억 / 개인 15억",
        period: "1년",
        lawyer: "정의석 변호사",
        result: "법인 파산 선고 및 개인 면책",
        caseType: "법인파산/개인회생",
        background: "제조업 운영 중 원자재 가격 폭등으로 법인이 부도 위기에 처했고, 대표이사 역시 연대보증으로 거액의 채무를 떠안게 되었습니다.",
        strategy: [
            { step: 1, title: "법인 파산 신청", description: "법인의 자산과 부채를 정밀 실사하여 지급 불능 상태를 소명하고 파산 신청을 했습니다." },
            { step: 2, title: "대표자 회생 연계", description: "법인 채무에 대한 대표자의 책임을 개인회생 채권에 포함시켜 동시에 해결책을 모색했습니다." },
            { step: 3, title: "근로자 체불 임금 해결", description: "체당금 신청을 대리하여 직원들의 임금 문제를 우선적으로 해결, 형사 고소를 방지했습니다." }
        ],
        outcomes: ["법인 채무 전액 소멸", "대표자 15억 채무 90% 탕감", "새로운 경제 활동 시작"]
    },
    {
        title: "전업주부 개인파산 면책 불허가 극복",
        summary: "남편의 사업 실패 명의 대여로 인한 채무 면책",
        client: "박주부",
        amount: "3억원 탕감",
        period: "8개월",
        lawyer: "이소연 변호사",
        result: "면책 결정",
        caseType: "개인파산",
        background: "소득이 없는 전업주부였으나 남편의 사업 자금 대출에 명의를 빌려주었다가 이혼 후 빚더미에 앉게 되었습니다.",
        strategy: [
            { step: 1, title: "지급 불능 소명", description: "현재 소득 활동이 불가능한 건강 상태와 부양 가족 상황을 입증했습니다." },
            { step: 2, title: "비면책 채권 방어", description: "채권자들의 사기죄 고소 협박에 대해 명의 대여 사실만으로는 사기가 아님을 법리적으로 방어했습니다." },
            { step: 3, title: "관재인 설득", description: "은닉 재산이 없음을 파산 관재인에게 적극 소명하여 환가 절차 없이 면책을 이끌어냈습니다." }
        ],
        outcomes: ["3억원 채무 전액 면책", "신용 불량 기록 삭제", "기초생활수급비 압류 해제"]
    },
    {
        title: "공무원 개인회생 인가 결정",
        summary: "직위 유지하며 공무원 연금 대출 포함 채무 조정",
        client: "최공무",
        amount: "1억원 -> 7천만원",
        period: "4개월",
        lawyer: "박지율 변호사",
        result: "인가 결정 및 직위 유지",
        caseType: "전문직 회생",
        background: "가족 병원비와 생활고로 대출이 늘어났으나, 공무원 품위 유지 의무와 직장 내 불이익이 두려워 망설이던 상황입니다.",
        strategy: [
            { step: 1, title: "비밀 보장 신청", description: "직장에 회생 사실이 알려지지 않도록 송달 장소를 대리인 사무실로 지정하고 보안을 철저히 했습니다." },
            { step: 2, title: "공무원 연금 대출 처리", description: "일반 채권과 달리 우선 변제권이 있는 공무원 연금 대출을 별제권으로 분류하여 변제 계획을 짰습니다." },
            { step: 3, title: "생계비 추가 인정", description: "장기 입원 중인 부모님 부양비를 추가 생계비로 인정받아 월 변제금을 낮췄습니다." }
        ],
        outcomes: ["직장에서 불이익 없이 회생 진행", "원금 30% 탕감", "성실하게 직무 수행 중"]
    },
    {
        title: "프리랜서 소득 소명 개인회생",
        summary: "불규칙한 수입의 프리랜서 디자이너 회생 성공",
        client: "정디자인",
        amount: "7,000만원",
        period: "5개월",
        lawyer: "김법무 변호사",
        result: "개시 결정",
        caseType: "일반 회생",
        background: "수입이 일정하지 않은 프리랜서라 소득 증빙이 어려워 타 사무실에서 회생 신청이 어렵다는 답변을 받았습니다.",
        strategy: [
            { step: 1, title: "1년 평균 소득 산출", description: "지난 1년간의 입금 내역과 원천징수영수증을 토대로 월 평균 소득을 산출하여 법원을 설득했습니다." },
            { step: 2, title: "조건부 인가 방어", description: "매년 소득을 신고해야 하는 번거로운 조건부 인가를 피하기 위해 현재 소득의 안정성을 강조했습니다." },
            { step: 3, title: "1인 가구 생계비 확보", description: "월세와 작업실 비용 등 고정 지출을 소명하여 최대한 많은 생계비를 인정받았습니다." }
        ],
        outcomes: ["월 변제금 40만원으로 책정", "이자 전액 및 원금 40% 탕감", "안정적인 창작 활동 보장"]
    },
    {
        title: "신혼부부 동시 회생 신청",
        summary: "결혼 준비 대출과 주거비로 인한 부부 동반 채무 해결",
        client: "이부부",
        amount: "합산 2억원",
        period: "6개월",
        lawyer: "정의석 변호사",
        result: "부부 모두 인가 결정",
        caseType: "개인회생",
        background: "무리한 결혼식 비용과 전세 자금 대출로 시작부터 빚더미에 앉은 신혼부부가 이혼 위기까지 겪었습니다.",
        strategy: [
            { step: 1, title: "사건 병합 신청", description: "부부의 사건을 같은 재판부에 배당 요청하여 심리의 효율성을 높이고 빠른 결정을 유도했습니다." },
            { step: 2, title: "주거비 분담", description: "월세를 부부가 분담하는 것으로 처리하여 각자의 가용 소득을 늘려 변제율을 낮췄습니다." },
            { step: 3, title: "상호 보증 채무 정리", description: "서로 선 보증 문제까지 회생 채권에 포함시켜 깔끔하게 채무 관계를 정리했습니다." }
        ],
        outcomes: ["부부 합산 월 250만원 변제", "이자율 0%", "가정의 평화 회복"]
    },
    {
        title: "고령자 개인파산 및 면책",
        summary: "70대 기초수급자의 오래된 채무 정리",
        client: "오어르신",
        amount: "5,000만원",
        period: "4개월",
        lawyer: "이소연 변호사",
        result: "파산 선고 및 동시 폐지",
        caseType: "개인파산",
        background: "젊은 시절 사업 실패로 진 빚이 20년 넘게 따라다니며 통장 압류로 기초연금조차 마음대로 못 쓰는 상황이었습니다.",
        strategy: [
            { step: 1, title: "압류 금지 채권 범위 변경", description: "법원에 압류 금지 채권 범위 변경을 신청하여 당장의 생계비 인출을 도왔습니다." },
            { step: 2, title: "환가 포기 신청", description: "유일한 재산인 낡은 임대 아파트 보증금은 면제 재산임을 주장하여 지켜냈습니다." },
            { step: 3, title: "신속 재판 요청", description: "고령이고 건강이 좋지 않음을 이유로 신속한 재판 진행을 요청하는 탄원서를 냈습니다." }
        ],
        outcomes: ["모든 채무 탕감", "압류 해제로 자유로운 은행 거래", "편안한 노후 보장"]
    },
    {
        title: "개인회생 폐지 후 재신청 인가",
        summary: "변제금 미납으로 폐지된 회생 사건을 재신청하여 성공",
        client: "김재기",
        amount: "잔여 채무 조정",
        period: "5개월",
        lawyer: "박지율 변호사",
        result: "재신청 인가",
        caseType: "개인회생 재신청",
        background: "실직으로 회생 변제금을 5회 미납하여 절차가 폐지되었고, 채권자들의 독촉이 다시 시작된 급박한 상황이었습니다.",
        strategy: [
            { step: 1, title: "즉시 항고 대신 재신청", description: "밀린 변제금을 일시에 낼 수 없다면 재신청이 유리함을 판단하여 빠르게 서류를 접수했습니다." },
            { step: 2, title: "금지 명령 재허가", description: "재신청의 경우 기각 확률이 높으나, 실직이라는 불가피한 사유를 소명하여 금지 명령을 받아냈습니다." },
            { step: 3, title: "변경된 직장 소득 반영", description: "재취업한 직장의 급여에 맞춰 현실적인 변제 계획안을 다시 제출했습니다." }
        ],
        outcomes: ["기존 미납금 부담 해소", "새로운 변제 계획으로 인가", "다시 시작할 기회 획득"]
    },
    {
        title: "의사 개인회생 면허 유지",
        summary: "개원 실패로 인한 병원 채무 15억 조정",
        client: "최원장",
        amount: "15억원 -> 9억원",
        period: "8개월",
        lawyer: "김법무 변호사",
        result: "일반회생 인가",
        caseType: "일반회생(전문직)",
        background: "담보 채무가 15억원을 초과하여 개인회생 자격이 안 되는 의사가 일반회생을 통해 병원을 유지하고자 했습니다.",
        strategy: [
            { step: 1, title: "계속 기업 가치 평가", description: "병원을 청산하는 것보다 운영을 계속하여 10년간 갚는 것이 채권자에게도 이득임을 회계적으로 증명했습니다." },
            { step: 2, title: "채권단 동의", description: "주요 채권자인 의료기기 리스사와 은행을 직접 방문하여 변제 계획을 설명하고 동의를 얻었습니다." },
            { step: 3, title: "병원 운영 정상화 지원", description: "불필요한 지출을 줄이는 자구안을 회생 계획에 포함시켰습니다." }
        ],
        outcomes: ["의사 면허 유지 및 병원 운영 지속", "채무 40% 탕감", "장기 분할 상환으로 유동성 확보"]
    }
];

const otherCases = [
    {
        title: "이혼 재산분할 및 위자료 청구 승소",
        summary: "유책 배우자를 상대로 재산분할 7:3 인정받은 사례",
        client: "김미래",
        amount: "재산 7억원 + 위자료 3,000만원",
        period: "10개월",
        lawyer: "이소연 변호사",
        result: "승소",
        caseType: "이혼/가사",
        background: "배우자의 외도와 폭언으로 이혼을 결심했으나, 배우자는 재산 형성에 기여한 바가 없다며 한 푼도 줄 수 없다고 버텼습니다.",
        strategy: [
            { step: 1, title: "금융 거래 내역 조회", description: "배우자가 은닉한 주식과 코인 계좌를 찾아내어 분할 대상 재산에 포함시켰습니다." },
            { step: 2, title: "가사 조사관 면담", description: "가사 조사 과정에서 혼인 파탄의 주된 책임이 배우자에게 있음을 진술하고 증거를 제출했습니다." },
            { step: 3, title: "기여도 입증", description: "전업주부였지만 20년간 가사와 육아를 전담하며 재테크에 성공한 점을 인정받아 70% 기여도를 주장했습니다." }
        ],
        outcomes: ["재산분할 7억원 확보", "위자료 3,000만원 지급 판결", "양육권 및 양육비 확보"]
    },
    {
        title: "음주운전 3진 아웃 집행유예 선처",
        summary: "실형 위기의 음주운전 사건에서 집행유예로 구속 면함",
        client: "박운전",
        amount: "집행유예",
        period: "4개월",
        lawyer: "정의석 변호사",
        result: "징역 1년 6월, 집행유예 3년",
        caseType: "형사 변호",
        background: "과거 2회 음주 처벌 전력이 있음에도 숙취 운전으로 접촉 사고를 내어 구속 영장이 청구될 수 있는 위기였습니다.",
        strategy: [
            { step: 1, title: "차량 매각", description: "재범 방지 의지를 확실히 보여주기 위해 소유 차량을 즉시 매각하고 관련 서류를 제출했습니다." },
            { step: 2, title: "피해자 합의", description: "사고 피해자에게 진심으로 사과하고 충분한 합의금을 지급하여 처벌 불원서를 받아냈습니다." },
            { step: 3, title: "양형 자료 제출", description: "가장의 구속 시 가족 생계가 위협받는 점과 알코올 치료 프로그램 이수 계획 등을 호소했습니다." }
        ],
        outcomes: ["구속 면함", "사회 봉사 명령 이행으로 대체", "가족 곁으로 복귀"]
    },
    // Add 8 more "other" cases here...
    {
        title: "상속재산분할 심판 청구",
        summary: "형제간 불공평한 상속 협의를 바로잡고 기여분 인정",
        client: "최막내",
        amount: "3억원 추가 확보",
        period: "1년",
        lawyer: "박지율 변호사",
        result: "기여분 20% 인정",
        caseType: "상속",
        background: "부모님 병간호를 도맡았던 의뢰인과 달리, 연락도 없던 형제들이 법정 상속분대로 나누자고 주장하여 분쟁이 발생했습니다.",
        strategy: [
            { step: 1, title: "기여분 청구", description: "10년간 부모님을 모시고 병원비를 부담한 간병 사실을 입증하여 특별 기여분을 청구했습니다." },
            { step: 2, title: "특별 수익 입증", description: "다른 형제들이 과거에 증여받은 유학 자금과 전세금을 찾아내어 이를 상속분에서 공제해야 함을 주장했습니다." },
            { step: 3, title: "부동산 감정", description: "상속 부동산의 시가를 정확히 재감정하여 현금 정산액을 높였습니다." }
        ],
        outcomes: ["법정 상속분 외 기여분 20% 추가 인정", "공평한 유산 분배 실현", "형제간 감정 대립 종결"]
    },
    {
        title: "학교폭력 가해 누명 벗음",
        summary: "쌍방 폭행으로 몰린 학폭위 사건에서 피해자임을 인정받음",
        client: "김학생",
        amount: "조치 없음(무혐의)",
        period: "2개월",
        lawyer: "김법무 변호사",
        result: "피해 학생 보호 조치",
        caseType: "학교폭력",
        background: "일방적으로 괴롭힘을 당하다 저항하는 과정에서 신체 접촉이 있었는데, 가해 학생이 쌍방 폭행이라며 맞신고를 했습니다.",
        strategy: [
            { step: 1, title: "CCTV 및 목격자 확보", description: "교내 CCTV 영상과 주변 친구들의 진술서를 확보하여 의뢰인이 일방적 폭행을 당하는 장면을 찾아냈습니다." },
            { step: 2, title: "학폭위 의견 진술", description: "변호사가 직접 학교폭력대책심의위원회에 참석하여 정당방위 상황임을 설득력 있게 변론했습니다." },
            { step: 3, title: "고소 대리", description: "상대 학생을 폭행 및 명예훼손으로 형사 고소하여 압박했습니다." }
        ],
        outcomes: ["가해 학생 전학 조치", "의뢰인은 징계 없음", "피해 회복을 위한 심리 치료 지원"]
    },
    {
        title: "저작권 침害 경고장 대응",
        summary: "폰트 무단 사용으로 거액의 합의금 요구받은 건 해결",
        client: "이스타트업",
        amount: "청구액 300만원 -> 0원",
        period: "1개월",
        lawyer: "정의석 변호사",
        result: "저작권 침해 아님 입증",
        caseType: "지식재산권",
        background: "프리랜서 디자이너에게 외주를 맡긴 작업물에 유료 폰트가 포함되어 있었고, 법무법인으로부터 내용증명을 받았습니다.",
        strategy: [
            { step: 1, title: "라이선스 확인", description: "디자이너가 적법한 라이선스를 보유하고 있음을 확인하고 계약서를 검토했습니다." },
            { step: 2, title: "외주 면책 주장", description: "클라이언트는 저작권 침해의 고의 과실이 없으며 책임은 작업자에게 있음을 법리적으로 주장했습니다." },
            { step: 3, title: "내용증명 회신", description: "강력한 어조의 답변서를 보내어 소송 제기 시 무고죄 및 업무방해로 대응하겠다고 경고했습니다." }
        ],
        outcomes: ["추가 문제 제기 없음", "합의금 지급 없이 종결", "저작권 리스크 해소"]
    },
    {
        title: "층간소음 손해배상 청구",
        summary: "윗집의 고의적인 소음 유발에 대한 위자료 승소",
        client: "박아랫집",
        amount: "500만원",
        period: "6개월",
        lawyer: "이소연 변호사",
        result: "위자료 지급 및 소음 중지 명령",
        caseType: "환경 분쟁",
        background: "윗집의 고의적인 발망치 소리와 음악 소리로 불면증에 시달렸으나 대화가 통하지 않았습니다.",
        strategy: [
            { step: 1, title: "소음 측정 데이터", description: "소음 측정 앱과 전문 측정 기관 데이터를 통해 법적 수인한도를 초과함을 입증했습니다." },
            { step: 2, title: "병원 진단서", description: "소음으로 인한 수면 장애와 스트레스성 질환에 대한 진단서를 증거로 제출했습니다." },
            { step: 3, title: "간접 강제 신청", description: "이후 소음 발생 시마다 벌금을 부과하는 간접 강제를 함께 신청하여 실효성을 높였습니다." }
        ],
        outcomes: ["위자료 500만원 지급 판결", "평온한 일상 회복", "이웃 간 배려의 계기 마련"]
    },
    {
        title: "사이버 명예훼손 고소 대리",
        summary: "악성 댓글로 고통받던 유튜버의 악플러 처벌",
        client: "최유튜버",
        amount: "벌금형 확정",
        period: "5개월",
        lawyer: "박지율 변호사",
        result: "가해자 전원 처벌",
        caseType: "형사 고소",
        background: "허위 사실을 유포하고 입에 담기 힘든 욕설을 한 악플러 수십 명을 대상으로 법적 조치를 원했습니다.",
        strategy: [
            { step: 1, title: "채증 및 특정", description: "삭제된 댓글까지 복원하여 PDF로 채증하고, IP 추적을 통해 신원을 특정했습니다." },
            { step: 2, title: "무관용 원칙 고수", description: "합의 없는 강력한 처벌 의사를 수사 기관에 전달하고 엄벌 탄원서를 냈습니다." },
            { step: 3, title: "민사 소송 진행", description: "형사 처벌이 확정된 후 별도의 민사 소송을 제기하여 위자료까지 받아냈습니다." }
        ],
        outcomes: ["주동자 벌금 300만원 등 전원 처벌", "악플 근절 효과", "클린한 채널 환경 조성"]
    },
    {
        title: "부당 해고 구제 신청 승소",
        summary: "구두 해구 통보를 받은 직장인의 복직 및 임금 지급",
        client: "정직원",
        amount: "해고 기간 임금 전액",
        period: "3개월",
        lawyer: "김법무 변호사",
        result: "부당 해고 인정",
        caseType: "노동 분쟁",
        background: "대표이사와의 의견 충돌 후 '내일부터 나오지 마라'는 구두 통보를 받고 쫓겨났습니다.",
        strategy: [
            { step: 1, title: "해고의 서면 통지 의무 위반", description: "근로기준법상 해고 사유와 시기를 서면으로 통지하지 않은 절차적 위법성을 집중 공략했습니다." },
            { step: 2, title: "실업 급여 아님", description: "회사가 권고사직으로 처리하려 했으나, 의원 면직이 아닌 일방적 해고임을 입증했습니다." },
            { step: 3, title: "노동위원회 심문", description: "심문 기일에 출석하여 사용자의 감정적 해고 조치를 조목조목 반박했습니다." }
        ],
        outcomes: ["원직 복직 명령", "해고 기간 미지급 임금 전액 수령", "복직 대신 합의 퇴사로 해결"]
    },
    {
        title: "성범죄 무고죄 고소 승소",
        summary: "합의하에 가진 관계를 강간으로 고소당한 사건의 무혐의 및 무고 인정",
        client: "한무고",
        amount: "무혐의",
        period: "8개월",
        lawyer: "정의석 변호사",
        result: "강간 무혐의 및 상대방 무고 기소",
        caseType: "성범죄 변호",
        background: "연인 관계였던 상대방이 헤어지자고 하자 앙심을 품고 과거의 성관계를 강간으로 허위 고소했습니다.",
        strategy: [
            { step: 1, title: "메신저 대화 분석", description: "사건 전후의 다정한 대화 내용과 CCTV 영상을 통해 강제성이 없었음을 입증했습니다." },
            { step: 2, title: "디지털 포렌식", description: "휴대폰 포렌식을 통해 상대방이 지인에게 '돈을 뜯어내겠다'고 말한 내용을 확보했습니다." },
            { step: 3, title: "무고 인지 수사 요청", description: "경찰에 무혐의 처분과 동시에 상대방의 무고 혐의에 대한 인지 수사를 요청했습니다." }
        ],
        outcomes: ["성범죄 혐의 없음 처분", "상대방 무고죄로 징역형 선고", "억울한 누명 벗음"]
    },
    {
        title: "국제 이혼 및 양육권 분쟁",
        summary: "외국인 배우자와의 이혼 및 자녀 양육권 확보",
        client: "박글로벌",
        amount: "양육비 월 200만원",
        period: "1년 2개월",
        lawyer: "이소연 변호사",
        result: "이혼 및 양육권 지정",
        caseType: "국제 가사",
        background: "외국 국적 배우자가 자녀를 데리고 본국으로 돌아가려 하여 급박하게 출국 금지와 이혼 소송이 필요했습니다.",
        strategy: [
            { step: 1, title: "사전 처분", description: "자녀의 여권 인도를 명하는 사전 처분과 출국 정지 신청을 하여 아이의 이동을 막았습니다." },
            { step: 2, title: "준거법 검토", description: "국제사법에 따라 대한민국 법원에 재판 관할권이 있음을 주장하고 한국 법을 적용받도록 했습니다." },
            { step: 3, title: "양육 환경 비교", description: "한국에서의 교육 환경과 보육 지지 기반이 자녀 복리에 더 우수함을 강조했습니다." }
        ],
        outcomes: ["친권 및 양육자 한국인 부로 지정", "안정적인 국내 양육 환경 조성", "국제적 분쟁 해결"]
    }
];

async function main() {
    console.log('Start seeding realistic success cases...');

    const allCases = [
        ...realEstateCases.map(c => ({ ...c, category: "부동산 법률" })),
        ...financialCases.map(c => ({ ...c, category: "금융 솔루션" })),
        ...rehabilitationCases.map(c => ({ ...c, category: "개인회생" })),
        ...otherCases.map(c => ({ ...c, category: "기타 법률" })),
    ];

    let personaIndex = 0;

    for (const caseData of allCases) {
        // Determine persona based on some logic (e.g. strict rotation)
        // To ensure "List" and "Detail" match, we use getPersona.
        // Also, we want to mix them up a bit so it's not always Male->Female->Male->Female in strict order if the categories are sequential.
        // But categories ARE sequential in this list.
        // Let's just rotate.

        // Custom rotation logic to add variety based on category if needed, but simple cycle is fine.
        const persona = getPersona(personaIndex);

        // Prepare strategy JSON
        const strategyJson = JSON.stringify(caseData.strategy);
        // Prepare outcomes string (new line separated for compatibility with existing view logic fallback, or JSON if view supports it)
        // The view logic supports JSON array string now.
        const outcomesJson = JSON.stringify(caseData.outcomes);

        // Upsert based on title or create new
        // Using title as a pseudo-unique key for upsert might be risky if titles duplicate, but here they are unique.
        // Better: findFirst by title, then update or create.

        const existing = await prisma.successCase.findFirst({
            where: { title: caseData.title }
        });

        if (existing) {
            await prisma.successCase.update({
                where: { id: existing.id },
                data: {
                    ...caseData,
                    strategy: strategyJson,
                    outcomes: outcomesJson,
                    imageUrl: persona.list,
                    detailImageUrl: persona.detail,
                }
            });
            console.log(`Updated: ${caseData.title}`);
        } else {
            await prisma.successCase.create({
                data: {
                    ...caseData,
                    strategy: strategyJson,
                    outcomes: outcomesJson,
                    imageUrl: persona.list,
                    detailImageUrl: persona.detail,
                }
            });
            console.log(`Created: ${caseData.title}`);
        }

        personaIndex++;
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
