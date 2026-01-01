
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

console.log("GOOGLE_API_KEY present:", !!process.env.GOOGLE_API_KEY);
console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);
