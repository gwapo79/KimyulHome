
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("ERROR: GOOGLE_API_KEY is not set.");
    process.exit(1);
}

// Simple keyword mapping for "Intuitive Objects"
function generatePromptFromTitle(title: string): string {
    const t = title.toLowerCase();

    if (t.includes('음주') || t.includes('교통')) return 'close up shot of car keys and a breathalyzer on a dark table, mood lighting, realistic, high quality';
    if (t.includes('이혼') || t.includes('양육')) return 'wedding ring left on a wooden table next to divorce papers, focus on ring, realistic, cinematic lighting';
    if (t.includes('폭행') || t.includes('상해')) return 'broken glass on the floor, dramatic shadow, legal gavel in background, realistic, serious atmosphere';
    if (t.includes('사기') || t.includes('보이스')) return 'magnifying glass analyzing a complex contract document, close up, detailed texture, realistic';
    if (t.includes('부동산') || t.includes('전세') || t.includes('임대')) return 'architectural blueprints and a set of house keys, modern aesthetic, bright lighting, realistic';
    if (t.includes('성범죄') || t.includes('성추행')) return 'shadowy figure in a hallway, legal books in foreground, focus on justice, realistic, moody';
    if (t.includes('마약')) return 'pill bottle tipped over, legal documents, serious tone, realistic, 8k';
    if (t.includes('명예훼손') || t.includes('모욕')) return 'smartphone showing social media feed, blurred background, focus on screen, realistic';
    if (t.includes('기업') || t.includes('횡령')) return 'calculator and stack of financial reports, office setting, realistic, professional';

    return 'legal gavel and scales of justice on a mahogany table, library background, realistic, cinematic, 8k';
}

async function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

// Note: Using a direct fetch to a known Google Imagen endpoint pattern or fallback.
// Since the exact endpoint for user's plan via REST might vary, we simulate the 'intuitive' generation request.
// If actual API fails, we log it. But we try standard endpoint.
// For now, assume we can use a helper or standard fetch.
// If this fails, the script will skip as per instructions.
// Text Generation for Prompt Engineering
async function generatePromptWithGemini(title: string, excerpt: string = ""): Promise<string> {
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const context = excerpt ? `Context: ${excerpt.substring(0, 300)}...` : "";

    // Instruction: explicit removal of 'still life' constraint, asking for best visual style.
    // REVISED (CEO Directive): Strict constraints for Text-Free and Korean identity.
    const textPrompt = `
    Analyze this blog post title: "${title}"
    ${context}
    
    Task: Create a highly descriptive English prompt for an AI image generator (Imagen).
    
    Guidelines:
    1. **Visual Style**: Determine the best style (Cinematic, Interior, Moody, etc.). Do not strict to still life.
    2. **CRITICAL - NO TEXT**: Do NOT include any legible text, letters, numbers, or watermarks. The scene must be completely text-free. Focus on visual elements only.
    3. **CRITICAL - RACE**: If the scene includes any person (lawyer, client, shadowy figure, hands):
       - MUST specify "Korean" or "East Asian". 
       - e.g., "A specific Korean lawyer", "Two East Asian business people".
    4. Describe lighting, atmosphere, and composition.
    5. Return ONLY the English prompt string.
    `;

    const requestBody = {
        contents: [{
            parts: [{ text: textPrompt }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.warn(`Gemini Prompt Gen Failed (${response.status}), falling back to keyword logic.`);
            return generatePromptFromTitle(title); // Fallback
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
            return generatedText.trim();
        }
    } catch (e) {
        console.error("Gemini API Error:", e);
    }

    return generatePromptFromTitle(title); // Fallback
}

// Real Google Imagen API Implementation
async function generateImageGoogle(prompt: string): Promise<string> {
    // Verified working model from previous steps
    const model = 'imagen-4.0-fast-generate-001';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${API_KEY}`;

    const requestBody = {
        instances: [{ prompt: prompt }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "1:1"
        }
    };

    console.log(`Calling Google AI Model: ${model}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google AI API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();

    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return data.predictions[0].bytesBase64Encoded;
    }

    throw new Error("No image data found in response");
}

async function saveBase64Image(base64Data: string, filepath: string): Promise<void> {
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.promises.writeFile(filepath, buffer);
}

async function main() {
    console.log("--- Starting Advanced AI Image Generation (Gemini + Imagen) ---");

    const posts = await prisma.blogPost.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${posts.length} posts.`);

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        console.log(`\n[${i + 1}/${posts.length}] Processing: ${post.title}`);

        try {
            const fileName = `post-${post.id}.jpg`;
            const relativePath = `/images/blog/${fileName}`;
            const absolutePath = path.join(process.cwd(), 'public', relativePath);

            // [CEO Directive]: Regenerate all from #1 to fix quality constraints.
            // if (fs.existsSync(absolutePath)) {
            //     console.log(`[Skipping] Image already exists for: ${post.title}`);
            //     continue;
            // }

            // 1. Generate Dynamic Prompt
            console.log("Analyzing content with Gemini...");
            const prompt = await generatePromptWithGemini(post.title, post.excerpt || "");
            console.log(`Generated Prompt: ${prompt}`);

            // 2. Generate Image
            const base64Data = await generateImageGoogle(prompt);
            console.log("Generation Success.");

            // Save
            const dir = path.dirname(absolutePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            await saveBase64Image(base64Data, absolutePath);
            console.log(`Saved to ${relativePath}`);

            // Update DB
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { thumbnailUrl: relativePath }
            });
            console.log("Database updated.");

        } catch (error: any) {
            console.error(`Generation Failed: ${error.message}`);
        }

        // Cool-down 40s
        if (i < posts.length - 1) {
            console.log("Cool-down 40s (Safety)...");
            await new Promise(resolve => setTimeout(resolve, 40000));
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
