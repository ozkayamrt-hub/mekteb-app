-- ════════════════════════════════════════
--  Mekteb — Supabase Storage
-- ════════════════════════════════════════

-- Bucket oluştur (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'psikolog-belgeleri',
  'psikolog-belgeleri',
  false,
  5242880,  -- 5MB limit
  ARRAY['application/pdf','image/jpeg','image/png','image/jpg','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ── Storage Policies ──

-- Psikolog kendi klasörüne yükleyebilir
CREATE POLICY "upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'psikolog-belgeleri' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Psikolog kendi dosyalarını okuyabilir
CREATE POLICY "read_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'psikolog-belgeleri' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Psikolog kendi dosyalarını silebilir
CREATE POLICY "delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'psikolog-belgeleri' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Admin (service_role) her şeyi okuyabilir — API route'larda createAdminClient() ile erişilir
