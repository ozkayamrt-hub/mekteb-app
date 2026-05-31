-- ════════════════════════════════════════
--  Mekteb — Tier System, Documents, Mentor Preferences
-- ════════════════════════════════════════

-- ── Psikolog Belgeleri (diploma, sertifika, lisans) ──
CREATE TABLE public.psychologist_documents (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id   UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  document_type     TEXT        NOT NULL CHECK (document_type IN (
    'diploma',          -- Lisans/yüksek lisans/doktora diploması
    'license',          -- Psikolog çalışma ruhsatı
    'certificate',      -- Uzmanlık sertifikaları (EMDR, BDT vb.)
    'membership',       -- Dernek/oda üyelik belgesi
    'supervision',      -- Süpervizyon tamamlama belgesi
    'other'
  )),
  title             TEXT        NOT NULL,          -- "BDT Sertifikası", "Lisans Diploması" vb.
  issuer            TEXT,                          -- Veren kurum
  issue_year        INT,                           -- Veriliş yılı
  document_url      TEXT,                          -- Yüklenen dosya URL (Supabase Storage)
  status            TEXT        DEFAULT 'pending'
                               CHECK (status IN ('pending', 'verified', 'rejected')),
  admin_note        TEXT,                          -- Admin notu (ret nedeni vb.)
  verified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.psychologist_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doc_own"    ON public.psychologist_documents FOR ALL    USING (auth.uid() = psychologist_id);
CREATE POLICY "doc_insert" ON public.psychologist_documents FOR INSERT WITH CHECK (auth.uid() = psychologist_id);

-- ── Mentor Tercihleri (Aday → 5 Üstat sıralı tercih) ──
CREATE TABLE public.mentor_preferences (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_id         UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  mentor_id         UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  preference_order  INT         NOT NULL CHECK (preference_order BETWEEN 1 AND 5),
  status            TEXT        DEFAULT 'pending'
                               CHECK (status IN ('pending', 'notified', 'accepted', 'declined')),
  notified_at       TIMESTAMPTZ,
  responded_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (mentee_id, mentor_id),
  UNIQUE (mentee_id, preference_order)
);

ALTER TABLE public.mentor_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pref_own"   ON public.mentor_preferences FOR ALL USING (auth.uid() = mentee_id OR auth.uid() = mentor_id);
CREATE POLICY "pref_insert" ON public.mentor_preferences FOR INSERT WITH CHECK (auth.uid() = mentee_id);

-- ── Komite Üyeleri ──
ALTER TABLE public.psychologists ADD COLUMN IF NOT EXISTS is_committee BOOLEAN DEFAULT FALSE;
ALTER TABLE public.psychologists ADD COLUMN IF NOT EXISTS committee_role TEXT;  -- 'uye', 'baskan', 'raportör'

-- Komite üyelerine ücretsiz üyelik: memberships.status = 'complimentary'
ALTER TABLE public.memberships DROP CONSTRAINT IF EXISTS memberships_status_check;
ALTER TABLE public.memberships ADD CONSTRAINT memberships_status_check
  CHECK (status IN ('active', 'inactive', 'past_due', 'cancelled', 'complimentary'));

-- ── Şikayetler ──
CREATE TABLE public.complaints (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id   UUID        REFERENCES public.psychologists(id) ON DELETE SET NULL,
  complainant_type  TEXT        NOT NULL CHECK (complainant_type IN ('client', 'psychologist', 'other')),
  complainant_info  TEXT,       -- Şikayet eden bilgisi (gizli tutulur)
  subject           TEXT        NOT NULL,
  description       TEXT        NOT NULL,
  status            TEXT        DEFAULT 'open'
                               CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
  assigned_to       UUID        REFERENCES public.psychologists(id) ON DELETE SET NULL,  -- Komite üyesi
  committee_report  TEXT,       -- Komite raporu
  resolution        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
-- Şikayetler yalnızca komite üyeleri + admin görebilir (service_role ile erişim)
CREATE POLICY "complaint_committee" ON public.complaints FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.psychologists
    WHERE id = auth.uid() AND is_committee = TRUE
  ));

-- ── Kademe Yükseltme Talepleri ──
CREATE TABLE public.tier_upgrade_requests (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id   UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  current_tier      TEXT        NOT NULL,
  requested_tier    TEXT        NOT NULL,
  self_assessment   TEXT,       -- Psikologun kendi değerlendirmesi
  status            TEXT        DEFAULT 'pending'
                               CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  admin_note        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ
);

ALTER TABLE public.tier_upgrade_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "upgrade_own" ON public.tier_upgrade_requests FOR ALL USING (auth.uid() = psychologist_id);

-- ── Trigger: şikayet güncelleme tarihi ──
CREATE TRIGGER set_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
