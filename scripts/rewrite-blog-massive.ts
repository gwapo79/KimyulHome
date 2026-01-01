
import { PrismaClient } from '@prisma/client';
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

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // High capacity model

async function rewritePostMassive(post: any) {
    console.log(`\n[START] Rewriting: ${post.title} (ID: ${post.id})`);

    const prompt = `
    You are a Senior Partner Lawyer at a top-tier law firm, specializing in the topic of "${post.title}".
    
    Task: Write an EXTREMELY COMPREHENSIVE, professional, and deep legal blog post about "${post.title}".
    
    CRITICAL PROHIBITIONS (STRICTLY ENFORCED):
    1. **NO GREETINGS**: Do NOT write "Hello", "Greetings", "This is Lawyer X".
    2. **NO SELF-INTRODUCTION**: Do NOT mention your name, role, or firm name at the beginning.
    3. **NO OUTRO/SIGN-OFF**: Do NOT write "Thank you", "Contact us", or "This was...". 
    4. **NO MARKETING**: Do NOT include promotional text.
    5. **Start Immediately**: The first sentence MUST be a definition, a legal principle, or a direct statement about the topic.
    
    CRITICAL CONTENT REQUIREMENTS:
    1. **Length**: The content MUST be AT LEAST 10,000 - 13,000 characters long (Korean). This is a HARD REQUIREMENT. Expand every section with maximum detail.
    2. **Depth**: Use "Thesis Level" depth. Cite specific laws (Civil Act Article X), Supreme Court Precedents (YearDaNumber), and detailed legal logic.
    3. **Structure**:
       - **I. Introduction**: Immediate deep dive into the legal issue, stats, and significance.
       - **II. Legal Framework**: Comprehensive breakdown of relevant statutes and legal theories.
       - **III. Case Law Analysis**: Detailed dissection of 2-3 key precedents. Explain the court's reasoning step-by-step.
       - **IV. Critical Issues & Variables**: What changes the outcome? (Evidence, Timing, Intent).
       - **V. Strategic Response Guide**: A detailed manual for clients (Step-by-step technical actions).
       - **VI. Conclusion**: Summary of legal implications (No marketing).
    4. **Format**: Use Markdown (## Headers, **Bold**, > Blockquotes).
    
    Generate the full, massive content now.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text().trim();

        // Length Check & Expansion (Simple loop if too short? No, single shot is safer for stability, but we log it)
        console.log(`[GENERATED] Length: ${text.length} characters.`);

        // Length Enforcement Loop (Strict 10k)
        let expansionCount = 0;

        while (text.length < 10000 && expansionCount < 3) {
            console.log(`[LENGTH CHECK] Current: ${text.length} chars. Target: 10,000+. Expanding...`);

            const expandPrompt = `
            The current content is ${text.length} characters long. I need it to be over 10,000 characters.
            
            Task: Write an ADDITIONAL detailed section (Title: "VII. Deep Dive: Advanced Legal Strategy & Precedents") that adds 3000+ characters of NEW, non-repetitive, highly technical legal analysis, specifically focusing on recent Supreme Court rulings and complex variables.
            
            Do NOT repeat previous content. Just generate the new section.
            `;

            const expandResult = await model.generateContent([prompt, text, expandPrompt]);
            const addedText = expandResult.response.text().trim();

            text += "\n\n" + addedText;
            expansionCount++;
        }

        if (text.length < 10000) {
            console.warn(`[WARNING] Could not reach 10k after expansions. Final: ${text.length}`);
        } else {
            console.log(`[TARGET MET] Final Length: ${text.length} characters.`);
        }

        // Update DB
        await prisma.blogPost.update({
            where: { id: post.id },
            data: { content: text }
        });

        console.log(`[SUCCESS] Updated DB for: ${post.title}`);
        console.log(`[REPORT] ID: ${post.id} / Title: ${post.title} / Length: ${text.length} chars`);

        // Return summary for external logging if needed
        return {
            id: post.id,
            title: post.title,
            length: text.length,
            preview: text.substring(0, 100).replace(/\n/g, ' ')
        };

    } catch (error: any) {
        console.error(`[ERROR] Failed to rewrite ${post.title}:`, error.message);
        if (error.message.includes('429')) throw error; // Stop script on rate limit
    }
}

async function main() {
    console.log("--- Starting MASSIVE Blog Content Upgrade (10,000+ chars goal) ---");

    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' }, // Latest first
        take: 100
    });

    console.log(`Found ${posts.length} posts to upgrade.`);

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        try {
            await rewritePostMassive(post);

            // Safety Delay for massive generation (Token usage is high)
            // 20s delay to avoid "Tokens per minute" limit
            if (i < posts.length - 1) {
                console.log("Cool-down 20s (Heavy Load Check)...");
                await new Promise(r => setTimeout(r, 20000));
            }

        } catch (e: any) {
            console.error("Critical Error or Rate Limit:", e.message);
            if (e.message.includes('429')) {
                console.log("Rate limit hit. Waiting 60s...");
                await new Promise(r => setTimeout(r, 60000));
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
