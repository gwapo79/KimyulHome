
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

async function listModels() {
    if (!API_KEY) {
        console.error("No API Key");
        return;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
            });
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
