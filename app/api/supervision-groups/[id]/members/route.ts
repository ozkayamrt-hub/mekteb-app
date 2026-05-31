import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Gruba katılma talebi (Aday/Uzman)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { note } = await req.json()

  const { data, error } = await supabase
    .from('supervision_group_members')
    .insert({ group_id: id, member_id: user.id, status: 'pending', note: note || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// Üye durumunu güncelle (Üstat: onayla/reddet)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { member_id, status } = await req.json()

  // Sadece grup lideri güncelleyebilir
  const { data: group } = await supabase
    .from('supervision_groups')
    .select('leader_id, max_members')
    .eq('id', id)
    .single()

  if (group?.leader_id !== user.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { error } = await supabase
    .from('supervision_group_members')
    .update({ status })
    .eq('group_id', id)
    .eq('member_id', member_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Grup doluysa status güncelle
  if (status === 'approved') {
    const { count } = await supabase
      .from('supervision_group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', id)
      .eq('status', 'approved')

    if (count && group?.max_members && count >= group.max_members) {
      await supabase.from('supervision_groups').update({ status: 'full' }).eq('id', id)
    }
  }

  return NextResponse.json({ success: true })
}
