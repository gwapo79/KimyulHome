const https = require('https');
require('dotenv').config();

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: No API KEY found in .env");
    process.exit(1);
}

console.log(`Loaded API Key: ${apiKey.substring(0, 10)}... (Length: ${apiKey.length})`);

const tests = [
    {
        name: 'gemini-2.5-pro',
        method: 'POST',
        path: '/v1beta/models/gemini-2.5-pro:generateContent',
        payload: {
            contents: [{ parts: [{ text: "Hello" }] }]
        }
    },
    {
        name: 'imagen-4.0-generate-001',
        method: 'POST',
        path: '/v1beta/models/imagen-4.0-generate-001:predict',
        payload: {
            instances: [{ prompt: "A simple line drawing of a cat" }],
            parameters: { sampleCount: 1 }
        }
    }
];

async function runTest(test) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `${test.path}?key=${apiKey}`,
            method: test.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const status = res.statusCode;
                if (status === 200) {
                    console.log(`[SUCCESS] ${test.name}: API Response Normal (200 OK)`);
                } else {
                    console.error(`[FAILURE] ${test.name}: Error ${status}`);
                    console.error(`Response Body: ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`[ERROR] ${test.name}: Network Request Failed - ${e.message}`);
            resolve();
        });

        req.write(JSON.stringify(test.payload));
        req.end();
    });
}

(async () => {
    console.log("Starting API Real-time Probe...");
    for (const test of tests) {
        await runTest(test);
    }
    console.log("Probe Complete.");
})();
