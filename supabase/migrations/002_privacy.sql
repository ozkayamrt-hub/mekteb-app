-- ════════════════════════════════════════
--  Mekteb — Privacy Migration
--  Danışan bilgilerini opsiyonel yapar
-- ════════════════════════════════════════

-- appointment_requests: client_name ve client_email opsiyonel
ALTER TABLE public.appointment_requests
  ALTER COLUMN client_name  DROP NOT NULL,
  ALTER COLUMN client_email DROP NOT NULL;

-- clients: email ve phone zaten nullable, ek güvenlik için audit
-- Hiçbir danışan verisi psikolog dışına sızmaz (RLS zaten bunu garanti eder)

-- Psikolog profili: sadece adı ve uzmanlığı public, iletişim bilgileri gizli
-- (mevcut RLS politikaları yeterli — profiles tablosu sadece kendi sahibine açık)

-- Notlar için şifreleme notu: uygulama katmanında yapılmalı (ileride)
