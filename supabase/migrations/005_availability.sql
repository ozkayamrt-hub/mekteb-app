-- ════════════════════════════════════════
--  Mekteb — Availability Slots
-- ════════════════════════════════════════

CREATE TABLE public.availability_slots (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id UUID        REFERENCES public.psychologists(id) ON DELETE CASCADE NOT NULL,
  slot_type       TEXT        NOT NULL CHECK (slot_type IN ('weekly', 'specific')),
  day_of_week     INT         CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Pzt, 6=Paz
  specific_date   DATE,
  start_time      TIME        NOT NULL,
  end_time        TIME        NOT NULL,
  session_type    TEXT        DEFAULT 'both' CHECK (session_type IN ('online', 'yuz_yuze', 'both')),
  is_active       BOOLEAN     DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_slot CHECK (
    (slot_type = 'weekly'   AND day_of_week IS NOT NULL AND specific_date IS NULL) OR
    (slot_type = 'specific' AND specific_date IS NOT NULL AND day_of_week IS NULL)
  )
);

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Psikolog kendi slotlarını yönetebilir
CREATE POLICY "avail_own" ON public.availability_slots
  FOR ALL USING (auth.uid() = psychologist_id);

-- Danışanlar aktif Üstatların slotlarını görebilir (randevu talebi için)
CREATE POLICY "avail_read_public" ON public.availability_slots
  FOR SELECT USING (
    is_active = TRUE AND
    EXISTS (
      SELECT 1 FROM public.psychologists
      WHERE id = psychologist_id AND status = 'active'
    )
  );
