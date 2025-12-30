const https = require('https');

const API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
                });
            } else {
                console.error("No models found or error:", json);
            }
        } catch (e) {
            console.error("Parse error", e);
            console.log("Raw:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error", e);
});
