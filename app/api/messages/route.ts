import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

// GET /api/messages?token=xxx — danışan mesajlarını getirir (token ile)
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token gerekli' }, { status: 400 })

  const admin = await createAdminClient()
  const { data: request } = await admin
    .from('appointment_requests')
    .select('id, status, client_name, psychologist_id, psychologist_name, created_at')
    .eq('token', token)
    .single()

  if (!request) return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })

  const { data: messages } = await admin
    .from('request_messages')
    .select('*')
    .eq('request_id', request.id)
    .order('created_at')

  return NextResponse.json({ request, messages: messages ?? [] })
}

// POST /api/messages — mesaj gönder
export async function POST(req: NextRequest) {
  const { token, body, sender } = await req.json()
  if (!body?.trim()) return NextResponse.json({ error: 'Mesaj boş olamaz' }, { status: 400 })

  const admin = await createAdminClient()

  // Token ile ya da psikolog girişiyle
  if (token) {
    const { data: request } = await admin
      .from('appointment_requests')
      .select('id')
      .eq('token', token)
      .single()
    if (!request) return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })

    await admin.from('request_messages').insert({ request_id: request.id, sender: 'client', body: body.trim() })
    return NextResponse.json({ success: true })
  }

  // Psikolog mesajı
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { request_id } = await req.json().catch(() => ({})) as { request_id?: string }
  if (!request_id) return NextResponse.json({ error: 'request_id gerekli' }, { status: 400 })

  await admin.from('request_messages').insert({ request_id, sender: 'psychologist', body: body.trim() })
  return NextResponse.json({ success: true })
}
