-- ════════════════════════════════════════
--  Mekteb — Initial Database Schema
-- ════════════════════════════════════════

-- ── Extensions ──
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fuzzy search

-- ── Profiles (extends auth.users) ──
CREATE TABLE public.profiles (
  id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT        NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  city          TEXT,
  linkedin      TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Psychologists ──
CREATE TABLE public.psychologists (
  id                UUID        REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  university        TEXT,
  department        TEXT,
  grad_year         INT,
  exp_years         INT         DEFAULT 0,
  approach          TEXT,
  bio               TEXT,
  session_types     TEXT[]      DEFAULT '{}',   -- ['online','yuz_yuze']
  weekly_capacity   TEXT,
  mentor_pref       TEXT,       -- 'mentor_olmak','mentor_istemek','her_ikisi','hayir'
  tier              TEXT        NOT NULL DEFAULT 'aday'
                                CHECK (tier IN ('aday','uzman','ustat')),
  status            TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','active','suspended')),
  is_online         BOOLEAN     DEFAULT FALSE,
  mentor_id         UUID        REFERENCES public.psychologists(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Specializations (lookup) ──
CREATE TABLE public.specializations (
  id    UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  name  TEXT  NOT NULL UNIQUE
);

INSERT INTO public.specializations (name) VALUES
  ('Depresyon'),('Anksiyete'),('Travma & TSSB'),('Çift Terapisi'),
  ('Çocuk & Ergen'),('OKB'),('Yas & Kayıp'),('Bağımlılık'),
  ('Yeme Bozuklukları'),('Kişilik Bozuklukları'),('Psikoz'),
  ('Cinsel Sağlık'),('Kariyer & Tükenmişlik'),('Aile Terapisi');

-- ── Psychologist ↔ Specialization (many-to-many) ──
CREATE TABLE public.psychologist_specializations (
  psychologist_id  UUID  REFERENCES public.psychologists(id) ON DELETE CASCADE,
  specialization_id UUID REFERENCES public.specializations(id) ON DELETE CASCADE,
  PRIMARY KEY (psychologist_id, specialization_id)
);

-- ── Clients (danışanlar — not auth users) ──
CREATE TABLE public.clients (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id  UUID        REFERENCES public.psychologists(id) ON DELETE SET NULL,
  name             TEXT        NOT NULL,
  email            TEXT,
  phone            TEXT,
  status           TEXT        DEFAULT 'active' CHECK (status IN ('active','passive','ended')),
  session_count    INT         DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Appointments (randevular) ──
CREATE TABLE public.appointments (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id  UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  client_id        UUID        REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INT         DEFAULT 50,
  session_type     TEXT        CHECK (session_type IN ('online','yuz_yuze')),
  status           TEXT        DEFAULT 'confirmed'
                               CHECK (status IN ('pending','confirmed','cancelled','completed')),
  psy_notes        TEXT,       -- sadece psikolog görür
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Appointment Requests (yeni danışan talepleri) ──
CREATE TABLE public.appointment_requests (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id  UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  client_name      TEXT        NOT NULL,
  client_email     TEXT        NOT NULL,
  session_type     TEXT,
  preferred_dates  JSONB,      -- [{date, time}]
  note             TEXT,
  status           TEXT        DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Mentorships ──
CREATE TABLE public.mentorships (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id    UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  mentee_id    UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  status       TEXT        DEFAULT 'pending' CHECK (status IN ('pending','active','completed','declined')),
  progress_pct INT         DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  notes        TEXT,
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (mentor_id, mentee_id)
);

-- ── Memberships (Stripe abonelik) ──
CREATE TABLE public.memberships (
  id                       UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id          UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier                     TEXT        NOT NULL CHECK (tier IN ('aday','uzman','ustat')),
  status                   TEXT        DEFAULT 'inactive' CHECK (status IN ('active','inactive','past_due','cancelled')),
  stripe_customer_id       TEXT,
  stripe_subscription_id   TEXT        UNIQUE,
  current_period_start     TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════
--  Row Level Security
-- ════════════════════════════════════════

ALTER TABLE public.profiles                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychologists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychologist_specializations ENABLE ROW LEVEL SECURITY;

-- Profiles: kendi profilini görebilir/güncelleyebilir
CREATE POLICY "profile_select_own"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profile_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profile_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Psychologists: aktifler herkese görünür, güncelleme yalnızca sahibine
CREATE POLICY "psy_select_active"   ON public.psychologists FOR SELECT USING (status = 'active' OR auth.uid() = id);
CREATE POLICY "psy_update_own"      ON public.psychologists FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "psy_insert_own"      ON public.psychologists FOR INSERT WITH CHECK (auth.uid() = id);

-- Specializations: herkes okuyabilir
CREATE POLICY "spec_select_all"     ON public.specializations FOR SELECT USING (TRUE);
CREATE POLICY "spec_psy_all"        ON public.psychologist_specializations FOR SELECT USING (TRUE);
CREATE POLICY "spec_psy_insert"     ON public.psychologist_specializations FOR INSERT WITH CHECK (auth.uid() = psychologist_id);
CREATE POLICY "spec_psy_delete"     ON public.psychologist_specializations FOR DELETE USING (auth.uid() = psychologist_id);

-- Clients: yalnızca ilgili psikolog
CREATE POLICY "client_psy_own"      ON public.clients FOR ALL USING (auth.uid() = psychologist_id);

-- Appointments: psikolog kendi randevularını görür
CREATE POLICY "appt_psy_own"        ON public.appointments FOR ALL USING (auth.uid() = psychologist_id);

-- Appointment requests
CREATE POLICY "req_psy_own"         ON public.appointment_requests FOR ALL USING (auth.uid() = psychologist_id);
CREATE POLICY "req_insert_all"      ON public.appointment_requests FOR INSERT WITH CHECK (TRUE);

-- Mentorships: mentor veya mentee görebilir
CREATE POLICY "mentor_own"          ON public.mentorships FOR ALL
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Memberships: kendi kaydı
CREATE POLICY "member_own"          ON public.memberships FOR ALL USING (auth.uid() = psychologist_id);

-- ════════════════════════════════════════
--  Functions & Triggers
-- ════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER set_profiles_updated_at       BEFORE UPDATE ON public.profiles       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_psychologists_updated_at  BEFORE UPDATE ON public.psychologists  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_clients_updated_at        BEFORE UPDATE ON public.clients        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_appointments_updated_at   BEFORE UPDATE ON public.appointments   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_memberships_updated_at    BEFORE UPDATE ON public.memberships    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Increment session count when appointment completed
CREATE OR REPLACE FUNCTION public.increment_session_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.clients SET session_count = session_count + 1 WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_appointment_completed
  AFTER UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.increment_session_count();
