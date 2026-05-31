import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { requestedTier, selfAssessment } = await req.json()
  if (!requestedTier || !selfAssessment?.trim()) {
    return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 })
  }

  const admin = await createAdminClient()

  // Mevcut tier
  const { data: psy } = await admin
    .from('psychologists')
    .select('tier')
    .eq('id', user.id)
    .single()

  if (!psy) return NextResponse.json({ error: 'Psikolog bulunamadı' }, { status: 404 })

  // Geçerli yükseltme kontrolü
  const validUpgrades: Record<string, string> = { aday: 'uzman', uzman: 'ustat' }
  if (validUpgrades[psy.tier] !== requestedTier) {
    return NextResponse.json({ error: 'Geçersiz kademe yükseltme talebi' }, { status: 400 })
  }

  // Bekleyen talep var mı?
  const { data: existing } = await admin
    .from('tier_upgrade_requests')
    .select('id, status')
    .eq('psychologist_id', user.id)
    .in('status', ['pending', 'needs_info'])
    .single()

  if (existing) {
    return NextResponse.json({
      error: 'Zaten bekleyen bir yükseltme talebiniz var. Sonuçlanmadan yeni başvuru yapılamaz.'
    }, { status: 409 })
  }

  const { error } = await admin
    .from('tier_upgrade_requests')
    .insert({
      psychologist_id: user.id,
      current_tier:    psy.tier,
      requested_tier:  requestedTier,
      self_assessment: selfAssessment.trim(),
      status:          'pending',
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}

export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const admin = await createAdminClient()
  const { data } = await admin
    .from('tier_upgrade_requests')
    .select('*')
    .eq('psychologist_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
