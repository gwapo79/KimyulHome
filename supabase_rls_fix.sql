-- 1. Create the 'avatars' bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow Public Read Access (Anyone can view avatars)
-- "SELECT 권한 허용"
DROP POLICY IF EXISTS "Public Avatars View" ON storage.objects;
CREATE POLICY "Public Avatars View"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 4. Policy: Allow Authenticated Users to Upload
-- "INSERT 권한 허용" - Restricting to their own folder based on file path "userId/filename"
DROP POLICY IF EXISTS "Authenticated Avatar Upload" ON storage.objects;
CREATE POLICY "Authenticated Avatar Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Allow Users to Update/Delete their own avatars
DROP POLICY IF EXISTS "Authenticated Avatar Update" ON storage.objects;
CREATE POLICY "Authenticated Avatar Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Authenticated Avatar Delete" ON storage.objects;
CREATE POLICY "Authenticated Avatar Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
