
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
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function refinePost(post: any) {
    const prompt = `
    You are a professional legal content editor for a law firm's blog.
    
    Current Post Title: "${post.title}"
    Current Content Snippet: "${post.content.substring(0, 500)}..."
    
    Task:
    1. Analyze if the current content matches the title and is high-quality (informative, professional, structured).
    2. If the content is "lorem ipsum", "test", meaningless, or does not match the title, REWRITE the entire content.
    3. The rewritten content must be:
       - In Korean.
       - Professional tone (Law firm style).
       - Well-structured with Markdown (## Subheadings, bullet points).
       - HTML safe (no script tags).
       - At least 1000 characters long.
    4. If the content is already good, reply with "PASS".
    5. If you rewrite, reply with the NEW CONTENT only (Markdown format). Do not include "Here is the content" prefix.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim();

        if (text === "PASS") {
            console.log(`[PASS] ${post.title} - Content is sufficient.`);
            return false;
        } else {
            // It's a rewrite
            // Simple validation to ensure it's not an error message
            if (text.length < 50) {
                console.warn(`[SKIP] Generated text too short for ${post.title}`);
                return false;
            }

            // Update DB
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { content: text }
            });
            console.log(`[UPDATED] ${post.title} / Content Rewritten / Success`);
            return true;
        }

    } catch (error: any) {
        console.error(`[ERROR] Failed to refine ${post.title}: ${error.message}`);
        // If 429, we might want to wait?
        if (error.message.includes('429')) {
            throw error; // Let main loop handle it
        }
    }
}

async function main() {
    console.log("--- Starting Blog Content Refinement ---");

    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' }, // Latest first? Or ID order? User said "1 to 100". Usually implies creation order or logic. Let's do desc (latest) as priority.
        take: 100
    });

    console.log(`Found ${posts.length} posts to check.`);

    let updatedCount = 0;

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        try {
            const refined = await refinePost(post);
            if (refined) updatedCount++;

            // Rate limit handling (Gemini Flash is generous but safe side)
            // 2-3 seconds delay
            if (i < posts.length - 1) {
                await new Promise(r => setTimeout(r, 2000));
            }

        } catch (e: any) {
            console.error("Critical Error or Rate Limit:", e.message);
            if (e.message.includes('429')) {
                console.log("Rate limit hit. Waiting 60s...");
                await new Promise(r => setTimeout(r, 60000));
            }
        }
    }

    console.log(`\n--- Refinement Complete. Updated ${updatedCount} posts. ---`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
