
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Creating Profile Table Manually ---");

    try {
        // 1. Check/Create Enum Role
        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CEO', 'LAWYER', 'STAFF', 'DEV', 'USER')`);
            console.log("✅ Enum 'Role' created.");
        } catch (e: any) {
            if (e.message.includes('already exists')) {
                console.log("ℹ️ Enum 'Role' already exists.");
            } else {
                console.error("⚠️ Enum creation error (ignoring):", e.message);
            }
        }

        // 2. Create Profile Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Profile" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "role" "Role" NOT NULL DEFAULT 'USER',
        "avatarUrl" TEXT,
        "phone" TEXT,
        "supabaseAuthId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
      );
    `);
        console.log("✅ 'Profile' table created/verified.");

        // 3. Create Indexes
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Profile_email_key" ON "Profile"("email")`);
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Profile_supabaseAuthId_key" ON "Profile"("supabaseAuthId")`);
        console.log("✅ Indexes created.");

    } catch (e) {
        console.error("Error creating Profile table:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
