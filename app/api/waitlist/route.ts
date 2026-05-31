import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email?.match(/\S+@\S+\.\S+/)) {
    return NextResponse.json({ error: 'Geçerli bir e-posta girin' }, { status: 400 })
  }
  const admin = await createAdminClient()
  const { error } = await admin.from('waitlist').insert({ email: email.trim().toLowerCase(), source: 'danisan' })
  if (error && error.code === '23505') {
    return NextResponse.json({ already: true }) // Zaten kayıtlı
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
