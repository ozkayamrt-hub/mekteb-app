import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { psychologistName, subject, description, complainantInfo, contactEmail, complainantType } = body

  if (!subject?.trim() || !description?.trim()) {
    return NextResponse.json({ error: 'Konu ve açıklama zorunludur' }, { status: 400 })
  }
  if (description.trim().length < 30) {
    return NextResponse.json({ error: 'Açıklama en az 30 karakter olmalıdır' }, { status: 400 })
  }

  const admin = await createAdminClient()

  // Psikolog adından ID bulmaya çalış (opsiyonel)
  let psychologistId: string | null = null
  if (psychologistName?.trim()) {
    const { data: psys } = await admin
      .from('psychologists')
      .select('id, profiles(full_name)')
      .eq('status', 'active')

    const match = psys?.find((p: any) =>
      p.profiles?.full_name?.toLowerCase().includes(psychologistName.toLowerCase())
    )
    if (match) psychologistId = match.id
  }

  // Şikayetçi bilgisi — iletişim emaili ayrı saklanır, gizlilik için
  const complainantData = [
    complainantInfo?.trim() ? complainantInfo.trim() : null,
    contactEmail?.trim() ? `İletişim: ${contactEmail.trim()}` : null,
  ].filter(Boolean).join(' | ') || null

  const { error } = await admin
    .from('complaints')
    .insert({
      psychologist_id:  psychologistId,
      complainant_type: complainantType || 'client',
      complainant_info: complainantData,
      subject:          subject.trim(),
      description:      description.trim(),
      status:           'open',
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
