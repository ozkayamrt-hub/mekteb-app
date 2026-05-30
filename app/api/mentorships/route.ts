import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — list my mentorships (as mentor or mentee)
export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { data, error } = await supabase
    .from('mentorships')
    .select(`
      *,
      mentor:mentor_id ( id, tier, profiles ( full_name, city ) ),
      mentee:mentee_id ( id, tier, profiles ( full_name, city ) )
    `)
    .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — request a mentorship
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { mentor_id } = await req.json()
  if (!mentor_id) return NextResponse.json({ error: 'mentor_id gerekli' }, { status: 400 })

  const { data, error } = await supabase
    .from('mentorships')
    .insert({ mentor_id, mentee_id: user.id, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH — accept / decline / update progress
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id, ...updates } = await req.json()

  // Set started_at when activating
  if (updates.status === 'active') updates.started_at = new Date().toISOString()
  if (updates.status === 'completed') updates.ended_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('mentorships')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
