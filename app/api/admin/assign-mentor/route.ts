import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = 'ozkaya.mrt@gmail.com'

// POST /api/admin/assign-mentor  { menteeId }
// Aktif Üstatlar arasında mentee sayısı en az olana otomatik atar
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { menteeId } = await req.json()
  if (!menteeId) return NextResponse.json({ error: 'menteeId gerekli' }, { status: 400 })

  const admin = await createAdminClient()

  // Zaten aktif bir mentörü var mı?
  const { data: existing } = await admin
    .from('mentorships')
    .select('id')
    .eq('mentee_id', menteeId)
    .eq('status', 'active')
    .single()

  if (existing) return NextResponse.json({ message: 'Zaten mentörü var', skipped: true })

  // Aktif Üstatları + mevcut aktif mentee sayılarını çek
  const { data: ustats, error: ustatErr } = await admin
    .from('psychologists')
    .select('id')
    .eq('tier', 'ustat')
    .eq('status', 'active')

  if (ustatErr || !ustats || ustats.length === 0) {
    return NextResponse.json({ error: 'Aktif Üstat bulunamadı — mentor ataması ertelendi' }, { status: 422 })
  }

  // Her Üstat için aktif mentee sayısını hesapla
  const counts = await Promise.all(
    ustats.map(async (u) => {
      const { count } = await admin
        .from('mentorships')
        .select('*', { count: 'exact', head: true })
        .eq('mentor_id', u.id)
        .eq('status', 'active')
      return { id: u.id, count: count ?? 0 }
    })
  )

  // En az mentee'ye sahip Üstatı seç (tie varsa rastgele)
  counts.sort((a, b) => a.count - b.count)
  const minCount = counts[0].count
  const candidates = counts.filter(c => c.count === minCount)
  const chosen = candidates[Math.floor(Math.random() * candidates.length)]

  // Mentörlük kaydı oluştur
  const { error: mentorErr } = await admin
    .from('mentorships')
    .insert({
      mentor_id:  chosen.id,
      mentee_id:  menteeId,
      status:     'active',
      started_at: new Date().toISOString(),
    })

  if (mentorErr) return NextResponse.json({ error: mentorErr.message }, { status: 500 })

  // Psikolog tablosunda mentor_id güncelle
  await admin
    .from('psychologists')
    .update({ mentor_id: chosen.id })
    .eq('id', menteeId)

  return NextResponse.json({ success: true, mentor_id: chosen.id, mentee_count_before: chosen.count })
}
