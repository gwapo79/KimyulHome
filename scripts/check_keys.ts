
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log("GOOGLE_API_KEY exists:", !!process.env.GOOGLE_API_KEY);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
