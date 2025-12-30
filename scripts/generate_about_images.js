const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("CRITICAL: No API KEY found in .env");
    process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '../public/images/about');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Finalized Prompts from Strategy
const IMAGES_TO_GENERATE = [
    {
        filename: "vision-main.png",
        prompt: "High-end documentary photography, a candid snapshot of two legal and financial experts, a man and a woman in their late 30s, deeply engrossed in a discussion at a large oak conference table. They are not looking at the camera. Papers with architectural blueprints and financial charts are spread before them. The setting is a minimalist, sophisticated 2025 office interior with a large floor-to-ceiling window casting soft, natural morning light across the scene. The atmosphere is serious but warm, a moment of deep focus and shared expertise. Shot on a Leica M11 with a 50mm lens, shallow depth of field, razor-sharp details on their focused expressions and the documents. Vibe of quiet confidence and strategic planning."
    },
    {
        filename: "why-us-1.png",
        prompt: "Photojournalistic style, a candid wide shot of a diverse team of three professionals collaborating around a standing desk in a modern 2025 office. One points to a large, minimalist screen displaying data visualizations, while the other two listen intently, one jotting notes in a leather-bound notebook. All are completely absorbed in the task, not acknowledging the camera. The lighting is soft and diffused, coming from an overhead architectural light fixture. The background is a clean, minimalist office with concrete walls and subtle green plants. The image conveys a sense of dynamic, fluid collaboration and shared intelligence. Shot with a 35mm lens to capture the environment, with a natural, slightly desaturated color palette."
    },
    {
        filename: "why-us-2.png",
        prompt: "An intimate, high-end documentary photograph. A close-up, over-the-shoulder shot of a female professional in her 40s, sitting at a minimalist desk. Her face is in profile, showing an expression of deep empathy and intense focus as she listens to someone out of frame. She is not looking at the camera. Soft, warm window light illuminates one side of her face, creating gentle shadows and highlighting her compassionate yet serious demeanor. The setting is a quiet, sophisticated office corner with a single plant in the background. The feeling is one of complete immersion and creating a safe, trusted space. Shot on a Leica with an 85mm lens, beautiful bokeh in the background, focusing entirely on her expression."
    },
    {
        filename: "why-us-3.png",
        prompt: "High-end documentary photography, a candid shot of a male expert in his early 30s working in a 'focus pod' within a sophisticated 2025 open-plan office. He is interacting with a clean, minimalist interface on a large, vertical touch-enabled screen, analyzing complex property data. He is seen from the side, completely engrossed, his hand mid-gesture over the screen. The lighting is soft and integrated into the pod's architecture. The overall vibe is one of quiet innovation, precision, and a modern, efficient workflow. The composition is clean and asymmetrical. Shot with a 50mm lens, capturing the texture of the materials and the sharp details of the interface."
    },
    {
        filename: "why-us-4.png",
        prompt: "A quiet, powerful candid snapshot in a high-end documentary style. An older, distinguished male professional in his 50s sits alone in a law library section of a minimalist 2025 office. He is meticulously reviewing a thick legal document with a fountain pen in hand, a look of deep concentration on his face. He is not looking at the camera. A single desk lamp casts a warm, focused light on his hands and the document, while the surrounding shelves of books fade into soft shadow. The atmosphere is one of profound diligence, experience, and unwavering integrity. Shot with a shallow depth of field, emphasizing the texture of the paper and the focused expression of the expert."
    }
];

async function generateImage(item) {
    console.log(`Generating ${item.filename}...`);
    return new Promise((resolve, reject) => {
        const payload = {
            instances: [{ prompt: item.prompt }],
            parameters: { sampleCount: 1, aspectRatio: "4:3" } // Default 4:3 for these slots
        };

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`[FAILED] ${item.filename}: Status ${res.statusCode}`);
                    // console.error(data); // Uncomment for valid error details
                    return resolve(false); // Don't crash, just mark fail
                }
                try {
                    const response = JSON.parse(data);
                    const base64Image = response.predictions[0].bytesBase64Encoded;
                    if (base64Image) {
                        const buffer = Buffer.from(base64Image, 'base64');
                        fs.writeFileSync(path.join(OUTPUT_DIR, item.filename), buffer);
                        console.log(`[SUCCESS] Saved to public/images/about/${item.filename}`);
                        resolve(true);
                    } else {
                        console.error(`[ERROR] No image data received for ${item.filename}`);
                        resolve(false);
                    }
                } catch (e) {
                    console.error(`[ERROR] Parse/Save failed for ${item.filename}:`, e);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`[NETWORK ERROR] ${item.filename}:`, e);
            resolve(false);
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
}

(async () => {
    console.log(`Target Output Directory: ${OUTPUT_DIR}`);
    let successCount = 0;
    for (const item of IMAGES_TO_GENERATE) {
        const success = await generateImage(item);
        if (success) successCount++;
        // Short delay to be nice to the API
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log(`\nJob Complete. Generated ${successCount}/${IMAGES_TO_GENERATE.length} images.`);
})();
