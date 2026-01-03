
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log("KAKAO_CLIENT_ID:", process.env.KAKAO_CLIENT_ID ? `Set (Length: ${process.env.KAKAO_CLIENT_ID.length})` : "NOT SET");
console.log("KAKAO_CLIENT_SECRET:", process.env.KAKAO_CLIENT_SECRET ? "Set" : "NOT SET");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
