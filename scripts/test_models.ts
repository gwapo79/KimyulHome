
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config({ path: '.env.local' });
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function run() {
    try {
        // There isn't a direct listModels on client instance in some versions,
        // but let's try a simple generation with 'gemini-pro' which is usually safe.
        // If that fails, we know it's something else.
        // Actually, let's just try to generate with 'gemini-1.5-flash-001' specifically.

        console.log("Defining models to test...");
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-pro", "gemini-1.0-pro"];

        for (const modelName of models) {
            console.log(`Testing model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                const response = await result.response;
                console.log(`SUCCESS: ${modelName}`);
            } catch (e) {
                console.log(`FAILED: ${modelName} - ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

run();
