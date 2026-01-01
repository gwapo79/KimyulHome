
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function main() {
    console.log(`Querying: ${url.replace(API_KEY!, 'HIDDEN')}`);
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach((m: any) => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
        });
    } else {
        console.log("No models found or error:", JSON.stringify(data, null, 2));
    }
}

main().catch(console.error);
