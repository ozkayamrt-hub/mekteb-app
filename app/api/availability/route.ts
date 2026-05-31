import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const { data } = await supabase
    .from('availability_blocks')
    .select('*')
    .eq('psychologist_id', user.id)
    .order('block_type')
    .order('day_of_week')
    .order('specific_date')

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const { block_type, day_of_week, specific_date, start_time, end_time, reason } = body

  if (!block_type) return NextResponse.json({ error: 'block_type zorunlu' }, { status: 400 })
  if (block_type === 'weekly' && day_of_week === undefined) return NextResponse.json({ error: 'Gün seçin' }, { status: 400 })
  if (block_type === 'specific' && !specific_date) return NextResponse.json({ error: 'Tarih seçin' }, { status: 400 })
  if (start_time && end_time && start_time >= end_time) return NextResponse.json({ error: 'Bitiş saati başlangıçtan sonra olmalı' }, { status: 400 })

  const { data, error } = await supabase
    .from('availability_blocks')
    .insert({
      psychologist_id: user.id,
      block_type,
      day_of_week:   block_type === 'weekly' ? day_of_week : null,
      specific_date: block_type === 'specific' ? specific_date : null,
      start_time:    start_time || null,
      end_time:      end_time || null,
      reason:        reason || null,
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
    .from('availability_blocks')
    .delete()
    .eq('id', id)
    .eq('psychologist_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
