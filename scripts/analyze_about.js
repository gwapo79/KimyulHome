const https = require('https');
require('dotenv').config();

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: No API KEY found in .env");
    process.exit(1);
}

const aboutContent = `
# About Us Page Content

## Hero Section
"새로운 시작을 돕는 법률-금융 전문가 그룹", "서초지율을 소개합니다"
"법과 금융의 전문성을 결합해, 집과 재산을 지키는 종합 법률-금융 서비스 파트너 새희망홀입니다."

## Mission & Vision
"위기에 처한 고객이 집과 가족, 재정의 미래를 지킬 수 있도록 돕는 것."
"서초지율합동법률사무소: 부동산/경매 법률 특화, 권리분석, 소송."
"영투투자대부(주): 윤리적 금융, 채무조정, 투명한 수수료."
"엘아이피(주): 개인회생 특화, 변제계획, 신용 회복 가이드."
Image Slot 1: Vision Main (Currently vision-main.png)

## Why Us (Reason to Choose)
"통합 전문성, 숙련된 전문가, 고객 중심, 윤리적 운영, 입증된 결과"
Image Slot 2: Grid 1 (Currently why-us-1.png)
Image Slot 3: Grid 2 (Currently why-us-2.png)
Image Slot 4: Grid 3 (Currently why-us-3.png)
Image Slot 5: Grid 4 (Currently why-us-4.png)
`;

const systemInstruction = `
You are a Creative Director for a high-end brand.
Analyze the provided company profile and generate 5 Image Prompts for a "High-end Documentary Photography" style.
The images should visualize the core values: Professionalism, Empathy, Innovation, Trust, Teamwork.

CRITICAL VISUAL RULES:
- Style: High-end Documentary Photography, Candid Snapshots, Natural Soft Lighting.
- Subjects: Professional models in modern office settings. MUST NOT LOOK AT THE CAMERA.
- Vibe: Deep focus, "Moment of Immersion", Serious but warm.
- Setting: Minimalist, sophisticated 2025 office interior.
- Forbidden: Stock photo look, cheesy smiles, shaking hands, posing, holograms.

OUTPUT FORMAT:
Return ONLY a valid JSON array of 5 objects. No markdown formatting.
Each object must have:
- "filename": (e.g., "vision-main.png")
- "concept": (Short validation of why this visual fits)
- "prompt": (The detailed prompt for Imagen 2/3)

Filenames to target:
1. vision-main.png
2. why-us-1.png
3. why-us-2.png
4. why-us-3.png
5. why-us-4.png
`;

const payload = {
    contents: [{
        role: "user",
        parts: [{ text: systemInstruction + "\n\n" + aboutContent }]
    }],
    generationConfig: {
        responseMimeType: "application/json"
    }
};

async function generatePrompts() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`Error: ${res.statusCode} ${data}`);
                    return reject(data);
                }
                try {
                    const response = JSON.parse(data);
                    const text = response.candidates[0].content.parts[0].text;
                    console.log(text);
                    resolve(text);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    reject(e);
                }
            });
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
}

generatePrompts();
