import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Seans tamamlandı — sayaç +1
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('session_count')
    .eq('id', id)
    .eq('psychologist_id', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Danışan bulunamadı' }, { status: 404 })

  const { error } = await supabase
    .from('clients')
    .update({ session_count: (client.session_count ?? 0) + 1 })
    .eq('id', id)
    .eq('psychologist_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
