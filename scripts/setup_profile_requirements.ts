import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// We need these from env. If not present in process.env, we might need to read .env manually or hardcode if user provided.
// Based on previous step, I will rely on process.env being loaded by dotenv via command line or similar.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pklzapardiddnxwmobcj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
    console.log('🔄 Starting manual schema update...');

    try {
        // 1. Add columns to User table
        console.log('Adding address and avatarUrl to User table...');
        await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "address" TEXT,
      ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
    `);
        console.log('✅ Columns added successfully.');

    } catch (e: any) {
        console.error('❌ Error updating schema:', e.message);
    }

    // 2. Setup Storage
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Skipping Storage setup. Please create "avatars" bucket manually if needed.');
        return;
    }

    console.log('🔄 Setting up Storage...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Create 'avatars' bucket
        const { data: bucket, error: bucketError } = await supabase.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        });

        if (bucketError) {
            if (bucketError.message.includes('already exists')) {
                console.log('✅ Bucket "avatars" already exists.');
            } else {
                console.error('❌ Error creating bucket:', bucketError.message);
            }
        } else {
            console.log('✅ Bucket "avatars" created.');
        }

        // Since we are using Service Role, we can try to set policies via SQL if needed, 
        // but for Public buckets, reading is open. Writing usually requires policies.
        // Creating a policy programmatically via Client is not directly supported for Storage policies (it's SQL).
        // But we can try to use SQL via Prisma to insert into storage.buckets or storage.policies provided we have permissions.
        // Usually easier to instruct user or just rely on public bucket for update-profile use case (auth users).

        // Let's try to add a policy via SQL if possible (requires superuser or owning role).
        // This part is often restricted in connection poolers.
        // We will skip SQL-based policy creation for now to avoid errors and assume standard setup or manual intervention if strict RLS needed.
        // For now, making it public allows read. Write might be restricted to auth.

    } catch (e: any) {
        console.error('❌ Error setting up storage:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
