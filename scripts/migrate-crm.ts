
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🛠️ Starting Manual Schema Migration for CRM...');

    try {
        // 1. Create UserActivity Table
        console.log('1️⃣ Creating UserActivity table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserActivity" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "details" TEXT,
        "ipAddress" TEXT,
        "device" TEXT,
        "path" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
      );
    `);

        // Create foreign key for UserActivity -> User
        // Note: We use executeRawUnsafe for DDL. 
        // Checking if constraint exists in raw SQL is tricky, so we wrap in try-catch or just try to add
        try {
            await prisma.$executeRawUnsafe(`
            ALTER TABLE "UserActivity" 
            ADD CONSTRAINT "UserActivity_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);
        } catch (e) {
            // Ignore if constraint already exists
            console.log('   ℹ️ FK UserActivity_userId_fkey might already exist.');
        }

        // 2. Add userId to Consultation Table
        console.log('2️⃣ Adding userId to Consultation table...');
        await prisma.$executeRawUnsafe(`
      ALTER TABLE "Consultation" 
      ADD COLUMN IF NOT EXISTS "userId" TEXT;
    `);

        // Create foreign key for Consultation -> User
        try {
            await prisma.$executeRawUnsafe(`
            ALTER TABLE "Consultation" 
            ADD CONSTRAINT "Consultation_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        `);
        } catch (e) {
            console.log('   ℹ️ FK Consultation_userId_fkey might already exist.');
        }

        console.log('✅ Manual Migration Completed Successfully.');

    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
