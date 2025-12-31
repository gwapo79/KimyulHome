
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const MODEL_NAME = "imagen-4.0-generate-001";

async function generateImage(prompt: string, outputPath: string) {
    if (!API_KEY) {
        console.error("Error: No API Key found in .env");
        process.exit(1);
    }

    console.log(`Generating image directly via API for prompt: "${prompt}"...`);

    // Using REST API for Imagen on Vertex AI / AI Studio
    // Endpoint might vary, trying standard Generative Language API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:predict?key=${API_KEY}`;

    const body = {
        instances: [{ prompt: prompt }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "4:3"
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        // Structure: predictions[0].bytesBase64Encoded or similar
        // Check specific response structure for Imagen on AI Studio
        // Usually: { predictions: [ { bytesBase64Encoded: "..." } ] }

        if (!data.predictions || !data.predictions[0] || !data.predictions[0].bytesBase64Encoded) {
            // Fallback for different response format if any
            if (data.error) throw new Error(JSON.stringify(data.error));
            throw new Error("Unexpected response format: " + JSON.stringify(data).slice(0, 200));
        }

        const base64Image = data.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Image, 'base64');

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(outputPath, buffer);
        console.log(`Image saved to ${outputPath}`);

    } catch (error) {
        console.error("Generation Failed:", error);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: ts-node generate_literal_image.ts <prompt> <output_path>");
    process.exit(1);
}

generateImage(args[0], args[1]);
