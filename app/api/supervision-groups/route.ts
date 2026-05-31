import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const { data } = await supabase
    .from('supervision_groups')
    .select(`
      *,
      leader:leader_id ( id, tier, profiles ( full_name, city ) ),
      supervision_group_members ( id, member_id, status )
    `)
    .neq('status', 'closed')
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const { title, description, specialty, max_members, price_per_session, schedule, session_type, group_type } = body

  if (!title?.trim()) return NextResponse.json({ error: 'Başlık zorunlu' }, { status: 400 })

  const { data, error } = await supabase
    .from('supervision_groups')
    .insert({
      leader_id:        user.id,
      title:            title.trim(),
      description:      description?.trim() || null,
      specialty:        specialty?.trim() || null,
      max_members:      max_members || 5,
      price_per_session: price_per_session || null,
      schedule:         schedule?.trim() || null,
      session_type:     session_type || 'online',
      group_type:       group_type || 'formal',
      status:           'open',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Kurucuyu otomatik üye ekle (approved)
  await supabase.from('supervision_group_members').insert({
    group_id: data.id, member_id: user.id, status: 'approved',
  })

  return NextResponse.json(data, { status: 201 })
}
