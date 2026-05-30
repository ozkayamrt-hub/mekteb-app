import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const AppointmentSchema = z.object({
  client_id:        z.string().uuid(),
  scheduled_at:     z.string().datetime(),
  duration_minutes: z.number().int().default(50),
  session_type:     z.enum(['online', 'yuz_yuze']),
})

// GET /api/appointments — psychologist's own appointments
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const from   = searchParams.get('from')
  const to     = searchParams.get('to')

  let query = supabase
    .from('appointments')
    .select('*, clients ( id, name, email, session_count )')
    .eq('psychologist_id', user.id)
    .order('scheduled_at', { ascending: true })

  if (status) query = query.eq('status', status)
  if (from)   query = query.gte('scheduled_at', from)
  if (to)     query = query.lte('scheduled_at', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/appointments — create appointment
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const parsed = AppointmentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...parsed.data, psychologist_id: user.id, status: 'confirmed' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
