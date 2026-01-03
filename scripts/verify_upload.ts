
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use ANON key to simulate client-side upload
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Skipping: Missing env vars");
    process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log("🚀 Testing Uplpoad with ANON key...");
    const fileName = `verify_${Date.now()}.txt`;

    // Create a dummy file
    const fileBody = "This is a test file to verify RLS policies.";

    // Upload
    const { data, error } = await supabase.storage
        .from('chat_attachments')
        .upload(`test/${fileName}`, fileBody);

    if (error) {
        console.error("❌ Upload FAILED:", error);
    } else {
        console.log("✅ Upload SUCCESS:", data);

        // Check Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('chat_attachments')
            .getPublicUrl(`test/${fileName}`);

        console.log("🔗 Public URL:", publicUrl);

        // Verify access to public URL
        const check = await fetch(publicUrl);
        if (check.ok) {
            console.log("✅ Public Access CONFIRMED (200 OK)");
        } else {
            console.error("❌ Public Access FAILED:", check.status);
        }
    }
}

main();
