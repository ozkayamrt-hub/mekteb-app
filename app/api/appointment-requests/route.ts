import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// POST — danışan randevu talebi gönderir (hesap gerekmez)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    psychologist_id, psychologist_name,
    client_name, client_email,
    session_type, preferred_dates, note,
  } = body

  if (!psychologist_id) {
    return NextResponse.json({ error: 'Psikolog seçilmedi' }, { status: 400 })
  }

  const admin = await createAdminClient()

  // Token otomatik oluşturulur (DB default gen_random_uuid())
  const { data, error } = await admin
    .from('appointment_requests')
    .insert({
      psychologist_id,
      psychologist_name: psychologist_name || null,
      client_name:       client_name || null,
      client_email:      client_email || null,
      session_type:      session_type || null,
      preferred_dates:   preferred_dates || null,
      note:              note || null,
      status:            'pending',
    })
    .select('id, token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, token: data.token, id: data.id }, { status: 201 })
}
