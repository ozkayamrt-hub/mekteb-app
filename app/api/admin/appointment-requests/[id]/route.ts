import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// Psikolog kendi talebini günceller
// Onaylandığında danışan clients tablosuna otomatik eklenir
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const admin = await createAdminClient()

  // Mevcut talebi getir
  const { data: req_data } = await admin
    .from('appointment_requests')
    .select('client_name, client_email, psychologist_id, status')
    .eq('id', id)
    .eq('psychologist_id', user.id)
    .single()

  if (!req_data) return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })

  // Güncelle
  const { error } = await admin
    .from('appointment_requests')
    .update(body)
    .eq('id', id)
    .eq('psychologist_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Onaylandıysa → danışanı clients tablosuna ekle (zaten yoksa)
  if (body.status === 'accepted' && req_data.status !== 'accepted') {
    const { data: existing } = await admin
      .from('clients')
      .select('id')
      .eq('psychologist_id', user.id)
      .eq('email', req_data.client_email || '')
      .single()

    if (!existing) {
      await admin.from('clients').insert({
        psychologist_id: user.id,
        name:            req_data.client_name || 'Anonim Danışan',
        email:           req_data.client_email || null,
        status:          'active',
        session_count:   0,
      })
    }
  }

  return NextResponse.json({ success: true })
}
