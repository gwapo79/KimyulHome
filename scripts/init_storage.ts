
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// Try Service Role Key first, then Anon Key (Anon usually can't create buckets)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase Credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log(`🔌 Connecting to Supabase at ${SUPABASE_URL}...`);

    const BUCKET_NAME = 'chat_attachments';

    // 1. List Buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error("❌ Failed to list buckets:", listError.message);
        // If 401/403, it means key is insufficient
        return;
    }

    const exists = buckets?.find(b => b.name === BUCKET_NAME);

    if (exists) {
        console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
    } else {
        console.log(`🔨 Bucket '${BUCKET_NAME}' not found. Creating...`);
        const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
            console.error(`❌ Failed to create bucket: ${createError.message}`);
            return;
        }
        console.log(`✅ Bucket '${BUCKET_NAME}' created successfully.`);
    }

    // 2. Test Upload
    console.log("📤 Testing upload...");
    const testFileName = `test_${Date.now()}.txt`;
    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(testFileName, "Hello World", { upsert: true });

    if (uploadError) {
        console.error(`❌ Upload failed: ${uploadError.message}`);
        console.log("💡 Tip: Check RLS policies if bucket exists but upload fails.");
    } else {
        console.log(`✅ Test upload successful: ${testFileName}`);

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(testFileName);

        console.log(`🔗 Public URL: ${publicUrl}`);
    }
}

main();
