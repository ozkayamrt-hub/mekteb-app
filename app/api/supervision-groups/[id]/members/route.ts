import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendGroupApplicationEmail, sendApplicationResultEmail } from '@/lib/email'

// Gruba katılma talebi (Aday/Uzman)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const admin    = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { note } = await req.json()

  const { data, error } = await supabase
    .from('supervision_group_members')
    .insert({ group_id: id, member_id: user.id, status: 'pending', note: note || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Lider + başvurucu bilgilerini çek → e-posta gönder
  try {
    const { data: group } = await admin
      .from('supervision_groups')
      .select('title, leader_id')
      .eq('id', id).single()

    if (group) {
      const [{ data: leaderAuth }, { data: applicantAuth }] = await Promise.all([
        admin.auth.admin.getUserById(group.leader_id),
        admin.auth.admin.getUserById(user.id),
      ])
      const { data: leaderProfile }    = await admin.from('profiles').select('full_name').eq('id', group.leader_id).single()
      const { data: applicantProfile } = await admin.from('profiles').select('full_name').eq('id', user.id).single()

      if (leaderAuth.user?.email && leaderProfile && applicantProfile) {
        await sendGroupApplicationEmail({
          leaderEmail:   leaderAuth.user.email,
          leaderName:    leaderProfile.full_name,
          groupTitle:    group.title,
          applicantName: applicantProfile.full_name,
        })
      }
    }
  } catch (_) { /* e-posta hatası asıl işlemi engellemesin */ }

  return NextResponse.json(data, { status: 201 })
}

// Üye durumunu güncelle (Üstat: onayla/reddet)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const admin    = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { member_id, status } = await req.json()

  // Sadece grup lideri güncelleyebilir
  const { data: group } = await supabase
    .from('supervision_groups')
    .select('leader_id, max_members, title')
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

  // Başvurucuya sonuç e-postası gönder
  try {
    const { data: memberAuth }    = await admin.auth.admin.getUserById(member_id)
    const { data: memberProfile } = await admin.from('profiles').select('full_name').eq('id', member_id).single()

    if (memberAuth.user?.email && memberProfile && group) {
      await sendApplicationResultEmail({
        applicantEmail: memberAuth.user.email,
        applicantName:  memberProfile.full_name,
        groupTitle:     group.title,
        approved:       status === 'approved',
      })
    }
  } catch (_) { /* e-posta hatası asıl işlemi engellemesin */ }

  return NextResponse.json({ success: true })
}
