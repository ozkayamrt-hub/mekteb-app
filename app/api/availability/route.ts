import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const { data } = await supabase
    .from('availability_slots')
    .select('*')
    .eq('psychologist_id', user.id)
    .order('day_of_week')
    .order('start_time')

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const { slot_type, day_of_week, specific_date, start_time, end_time, session_type } = body

  if (!start_time || !end_time) return NextResponse.json({ error: 'Saat zorunlu' }, { status: 400 })
  if (start_time >= end_time) return NextResponse.json({ error: 'Bitiş saati başlangıçtan sonra olmalı' }, { status: 400 })

  const { data, error } = await supabase
    .from('availability_slots')
    .insert({
      psychologist_id: user.id,
      slot_type:       slot_type || 'weekly',
      day_of_week:     slot_type === 'weekly' ? day_of_week : null,
      specific_date:   slot_type === 'specific' ? specific_date : null,
      start_time,
      end_time,
      session_type:    session_type || 'both',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await req.json()
  const { error } = await supabase
    .from('availability_slots')
    .delete()
    .eq('id', id)
    .eq('psychologist_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
