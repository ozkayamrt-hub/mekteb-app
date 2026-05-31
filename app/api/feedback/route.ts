import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { subject, message, contact, page_url, user_type } = await req.json()

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Konu ve mesaj zorunludur' }, { status: 400 })
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: 'Mesaj en az 10 karakter olmalıdır' }, { status: 400 })
  }

  const admin = await createAdminClient()
  const { error } = await admin.from('feedback').insert({
    subject:   subject.trim(),
    message:   message.trim(),
    contact:   contact?.trim() || null,
    page_url:  page_url || null,
    user_type: user_type || 'visitor',
    status:    'unread',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
