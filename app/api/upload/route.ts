import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Prefer Service Role for Admin Uploads)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET_NAME = 'success-cases';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Sanitize Filename (Timestamp + Clean Name)
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const fileName = `${Date.now()}_${cleanName}`;
        const filePath = `uploads/${fileName}`;

        // 2. Upload to Supabase Storage
        // 'upsert: false' -> fail if exists (rare with timestamp)
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Storage Upload Error:', error);
            // If bucket not found, it's a specific setup error. User must fix dashboard.
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 3. Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return NextResponse.json({
            url: publicUrlData.publicUrl
        });

    } catch (error) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
