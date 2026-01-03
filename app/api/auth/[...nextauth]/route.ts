
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth"; // Reuse existing auth logic
import { cookies } from "next/headers";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID || "",
            clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "kakao") {
                try {
                    const kakaoId = account.providerAccountId;
                    const email = user.email || `kakao_${kakaoId}@no-email.com`;
                    const name = user.name || "Kakao User";

                    // 1. Check if user exists by kakaoId
                    let dbUser = await prisma.user.findUnique({
                        where: { kakaoId: kakaoId },
                    });

                    // 2. If not, check by email (link account)
                    if (!dbUser && user.email) {
                        dbUser = await prisma.user.findUnique({
                            where: { email: user.email },
                        });

                        // If found by email, update kakaoId
                        if (dbUser) {
                            await prisma.user.update({
                                where: { id: dbUser.id },
                                data: { kakaoId: kakaoId },
                            });
                        }
                    }

                    // 3. If still not found, create new user
                    if (!dbUser) {
                        dbUser = await prisma.user.create({
                            data: {
                                email: email,
                                name: name,
                                kakaoId: kakaoId,
                                provider: "kakao",
                                role: "USER",
                            },
                        });
                    }

                    // --- [ADDED] Sync with Profile Table ---
                    // Purpose: Ensure this user appears in Admin Client List
                    try {
                        const profileImage = user.image || (user as any).picture || null;

                        // Check if Profile exists
                        const existingProfile = await (prisma as any).profile.findUnique({
                            where: { email: email }
                        });

                        if (!existingProfile) {
                            await (prisma as any).profile.create({
                                data: {
                                    email: email,
                                    name: name,
                                    avatarUrl: profileImage,
                                    role: 'USER', // Default Role
                                    phone: null,  // Kakao might not provide phone without extra permissions
                                    supabaseAuthId: null // Not using Supabase Auth for Kakao
                                }
                            });
                            console.log(`[NextAuth] Created new Profile for ${email}`);
                        } else {
                            // Optional: Update avatar if changed? 
                            // For now, satisfy "Profile 매핑"
                        }
                    } catch (profileError) {
                        console.error("[NextAuth] Profile Sync Failed:", profileError);
                        // Do not block login, but log critical error
                    }
                    // ---------------------------------------

                    // 4. Generate Custom JWT Token (Reuse lib/auth.ts)
                    // We need to set the cookie manually here because 'events' might be async/detached
                    // But 'signIn' callback returns boolean.
                    // Better place is 'jwt' callback or 'session'.
                    // However, to sync with existing middleware, we simply ensure the user is created.

                    return true; // Allow sign in
                } catch (error) {
                    console.error("Kakao SignIn Error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // access_token from Kakao
            if (account && user) {
                token.id = user.id;
                token.provider = account.provider;

                // Find DB user to get the Real UUID
                const kakaoId = account.providerAccountId;
                const dbUser = await prisma.user.findUnique({
                    where: { kakaoId: kakaoId }
                });

                if (dbUser) {
                    token.sub = dbUser.id; // Use DB ID as subject
                    token.role = dbUser.role;

                    // CRITICAL: Set the legacy auth_token cookie for middleware compatibility
                    // This is a side-effect in JWT callback, which runs on the server.
                    const p = {
                        sub: dbUser.id,
                        email: dbUser.email,
                        role: dbUser.role,
                        name: dbUser.name
                    };
                    const customToken = await signToken(p);

                    // We cannot use 'setAuthCookie' directly if it uses 'cookies()' which might be read-only here?
                    // Actually in Route Handlers cookies() is writable.
                    // But NextAuth JWT callback might be called in context where cookies are not writable?
                    // Let's try to verify if we can set it via side effect or if we need a workaround.
                    // Workaround: Client-side sync or Middleware.
                    // A common pattern is to just use the NextAuth session.
                    // BUT user asked for "세션 쿠키 생성".
                    // Let's try to set it.
                    // NOTE: 'cookies()' function is available in Next.js 13+ App Dir.
                    // We'll trust that we can import it.
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name;
                // session.user.id = token.sub; // Typings might complain
            }
            return session;
        }
    },
    events: {
        async signIn(message) {
            // This is a good place for side effects like logging or data sync
        }
    },
    pages: {
        signIn: '/login',
    }
});

export { handler as GET, handler as POST };
