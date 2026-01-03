
const https = require('https');
const dotenv = require("dotenv");

dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Status Code:", res.statusCode);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods})`));
            } else {
                console.log("Response:", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log("Error parsing JSON:", e.message);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
