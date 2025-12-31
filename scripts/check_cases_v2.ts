
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

const targets = [
    { id: 1, label: "가사/이혼", keywords: ["이혼", "가사"] },
    { id: 2, label: "기업/금융", keywords: ["기업", "금융", "M&A", "주식"] },
    { id: 3, label: "부동산/임대차", keywords: ["부동산", "임대", "명도", "전세"] },
    { id: 4, label: "형사/무죄", keywords: ["형사", "무죄", "폭행", "사기"] },
    { id: 5, label: "민사/손해배상", keywords: ["민사", "손해", "배상"] },
    { id: 6, label: "회생/파산", keywords: ["회생", "파산"] },
    { id: 7, label: "상속/증여", keywords: ["상속", "증여", "유류분"] },
    { id: 8, label: "노무/고용", keywords: ["노무", "고용", "해고", "임금"] },
    { id: 9, label: "채무조정", keywords: ["채무", "빛", "신용"] },
    { id: 10, label: "지식재산권", keywords: ["지식", "특허", "저작권", "상표"] },
    { id: 11, label: "교통사고", keywords: ["교통", "사고", "음주"] },
    { id: 12, label: "종합 자문", keywords: ["자문", "종합", "컨설팅"] },
];

async function main() {
    console.log("Mapping 12 Items to Success Cases...");

    const mapping: any = {};
    for (const t of targets) {
        const found = await prisma.successCase.findFirst({
            where: {
                OR: [
                    { category: { contains: t.keywords[0] } },
                    { title: { contains: t.keywords[0] } },
                    // Try second keyword if exists
                    ...(t.keywords[1] ? [{ category: { contains: t.keywords[1] } }, { title: { contains: t.keywords[1] } }] : [])
                ]
            }
        });

        if (found) {
            console.log(`[Item ${t.id}] ${t.label} -> ID: ${found.id} | Title: ${found.title}`);
            mapping[t.id] = found.id;
        } else {
            console.log(`[Item ${t.id}] ${t.label} -> NO MATCH FOUND`);
            mapping[t.id] = null;
        }
    }

    fs.writeFileSync('scripts/mapping.json', JSON.stringify(mapping, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
