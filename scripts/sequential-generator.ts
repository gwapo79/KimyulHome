
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;

// Config
const MODEL = "imagen-4.0-generate-001"; // Verified via list-models

const DELAY_MS = 30000; // 30s cool-down between requests

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(prompt: string, filename: string) {
    if (!API_KEY) throw new Error("API_KEY not found in env");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    // Construct request body for Imagen 
    // Note: The specific endpoint schema might vary. Using standard `generateContent` for multi-modal if predict fails, but `predict` is standard for Imagen on Vertex/Studio.
    // Actually, for AI Studio, the endpoint is likely: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict`

    const body = {
        instances: [
            { prompt: prompt }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "4:3"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            if (response.status === 429) {
                console.warn(`[429] Quota exhausted. Waiting...`);
                return "QUOTA_EXHAUSTED";
            }
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        const b64 = data.predictions?.[0]?.bytesBase64Encoded;

        if (!b64) throw new Error("No image data in response");

        const buffer = Buffer.from(b64, 'base64');
        const filePath = path.join(process.cwd(), 'public/images/success-cases', filename);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved: ${filename}`);
        return filePath;
    } catch (e) {
        console.error("Generation failed:", e);
        return null;
    }
}

async function main() {
    console.log("Starting Sequential Image Generation (Round 5: Scene & Atmosphere)...");

    // Read cases
    const data = JSON.parse(fs.readFileSync('success_cases.json', 'utf-8'));

    let processed = 0;

    for (const item of data) {
        console.log(`Processing Case ${item.id}: ${item.title} [${item.category}]`);

        // --- ROUND 5: SCENE & ATMOSPHERE (CTO Final Directive) ---
        // Concept: "The Scene of the Event" - No Desks, No Tables.
        let visualSubject = "";
        const cat = item.category || "";
        const title = item.title || "";

        // Helper to pick a distinct variation based on ID
        const pick = (arr: string[]) => arr[item.id.charCodeAt(0) % arr.length];

        if (cat.includes("부동산") || title.includes("건물") || title.includes("임대") || title.includes("아파트")) {
            // Real Estate: Construction sites, Building exteriors
            visualSubject = pick([
                "A wide architectural shot of a halted construction site with a large tower crane silhouetted against a sunset.",
                "The entrance of a modern luxury apartment building with a 'Seized' notice tape across the door. Cinematic angle.",
                "A low-angle view of a towering modern skyscraper reflecting the city skyline. Clean and imposing.",
                "A wide shot of an empty, unfinished concrete interior of a large building. Dust motes dancing in shafts of light."
            ]);
        } else if (cat.includes("사기") || cat.includes("형사") || title.includes("투자") || title.includes("코인")) {
            // Fraud/Invest: Server rooms, Vaults, Stock Walls
            visualSubject = pick([
                "A cold, blue-lit corridor of a massive data center server room. Infinite rows of blinking racks. High-tech atmosphere.",
                "A wide shot of a large, empty bank vault with the heavy steel door slightly ajar. Dramatic lighting.",
                "A massive digital stock market display wall showing glowing red downward trend lines in a dark trading floor.",
                "A blurry wide shot of a modern city street at night with police lights reflecting on wet pavement. Noir atmosphere."
            ]);
        } else if (title.includes("공사") || countOccurrences(title, "대금") > 0) {
            // Construction: Industrial sites
            visualSubject = pick([
                "A wide panoramic view of a large industrial factory floor with stationary heavy machinery. Silent and still.",
                "A construction site at dawn, with raw materials stacked neatly but abandoned. Golden hour lighting.",
                "An interior wide shot of an incomplete commercial space with exposed wires and concrete. Gritty but aesthetic.",
                "A view through a chain-link fence looking at a construction project in progress. Depth of field focus on the fence."
            ]);
        } else if (cat.includes("세금") || cat.includes("조세") || title.includes("명의")) {
            // Tax: Government buildings, Archives
            visualSubject = pick([
                "A long perspective shot of a quiet, modern library archive aisle filled with rows of document boxes.",
                "The imposing stone columns and steps of a modern courthouse or government building. Low angle grandeur.",
                "A wide interior shot of a sleek, modern corporate taxation office, completely empty at night.",
                "A view of a neatly organized modern accounting office with rows of empty desks and computers. Symmetry."
            ]);
        } else if (cat.includes("회생") || cat.includes("파산") || cat.includes("채무")) {
            // Debt: Empty spaces, metaphorical
            visualSubject = pick([
                "A wide shot of a long, empty modern hallway with light at the far end (symbolizing hope). Minimalist architecture.",
                "A view of a single modern chair in the center of a large, empty white room. Symbol of starting over.",
                "A dramatic silhouette of a person (back view only) standing before a large window overlooking a city at sunrise.",
                "A clean, white minimalist room with a single green plant growing in the corner. Symbol of recovery."
            ]);
        } else if (cat.includes("이혼") || cat.includes("가사") || cat.includes("상속")) {
            // Family: Homes, Gates, Living rooms
            visualSubject = pick([
                "A wide shot of the closed iron gates of a large, luxury private estate. Mysterious and wealthy atmosphere.",
                "A sunlit, expansive luxury living room that feels completely empty and quiet. Serene but melancholic.",
                "A view of a peaceful garden path leading to a modern house. Soft focus and warm sunlight.",
                "A wide shot of a modern dining room table set for one, with empty chairs around. Cinematic framing."
            ]);
        } else {
            // Default: Law Office Scenery
            visualSubject = pick([
                "A wide interior shot of a high-end modern law firm lobby with marble floors and glass walls.",
                "A view of a grand conference room with a long glass table, overlooking a city skyline.",
                "A cinematic shot of a law library with floor-to-ceiling bookshelves. Warm, sophisticated lighting.",
                "A modern architectural atrium in a corporate building. Glass and steel structure."
            ]);
        }

        const prompt = `Hyper-realistic architectural and editorial photography, 2025 modern aesthetic.
        Subject: ${visualSubject}
        Lighting: Cinematic lighting, natural sunlight, volumetric fog, dramatic shadows.
        Composition: Wide shot, rule of thirds, depth of field, high-end magazine style.
        Resolution: 8k, highly detailed.
        
        Negative prompt: on a desk, on a table, flat lay, top down view, stationery, pen, paper, hologram, cyber, blue light, neon, people, human face, man, woman, crowd, text, watermark, horror, dark.`;

        // -----------------------------------------------------------------------

        const filename = `sc_${item.id}.png`;
        const publicPath = `/images/success-cases/${filename}`;

        // RESTART POLICY: Always Overwrite

        // Attempt Gen
        const result = await generateImage(prompt, filename);

        if (result === "QUOTA_EXHAUSTED") {
            console.log("Stopping sequence due to Quota Limit. Resume later.");
            break;
        }

        if (result) {
            // Update DB
            await prisma.successCase.update({
                where: { id: item.id },
                data: { imageUrl: publicPath }
            });
            console.log(`Database updated for ${item.id}`);
            processed++;
        }

        // Cool-down
        console.log(`Waiting ${DELAY_MS}ms...`);
        await sleep(DELAY_MS);
    }

    console.log(`Finished sequence. Processed: ${processed} cases.`);
}

function countOccurrences(str: string, sub: string) {
    return str.split(sub).length - 1;
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
