import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const RegisterSchema = z.object({
  firstName:    z.string().min(1),
  lastName:     z.string().min(1),
  email:        z.string().email(),
  password:     z.string().min(8),
  phone:        z.string().min(10),
  city:         z.string().min(1),
  linkedin:     z.string().optional(),
  university:   z.string().min(1),
  department:   z.string().min(1),
  gradYear:     z.number().int().min(1980).max(2026),
  expYears:     z.number().int().min(0),
  approach:     z.string().min(1),
  bio:          z.string().min(10).max(300),
  sessionTypes: z.array(z.enum(['online', 'yuz_yuze'])).min(1),
  weeklyCapacity: z.string().optional(),
  mentorPref:   z.string().optional(),
  tier:         z.enum(['aday', 'uzman', 'ustat']),
  specs:        z.array(z.string()).min(1),
})

// GET /api/psychologists — public listing with filters
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const tier       = searchParams.get('tier')
  const session    = searchParams.get('session')
  const spec       = searchParams.get('spec')
  const city       = searchParams.get('city')
  const search     = searchParams.get('search')

  let query = supabase
    .from('psychologists')
    .select(`
      *,
      profiles ( full_name, city, phone, linkedin ),
      psychologist_specializations (
        specializations ( id, name )
      )
    `)
    .eq('status', 'active')

  if (tier)    query = query.eq('tier', tier)
  if (city)    query = query.eq('profiles.city', city)
  if (session) query = query.contains('session_types', [session])

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Filter by specialization or text search in JS (simpler than complex SQL)
  let result = data ?? []
  if (spec) result = result.filter(p =>
    p.psychologist_specializations?.some((s: any) => s.specializations?.name === spec)
  )
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(p =>
      p.profiles?.full_name?.toLowerCase().includes(q) ||
      p.approach?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q)
    )
  }

  return NextResponse.json(result)
}

// POST /api/psychologists — register a new psychologist
export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = RegisterSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const supabase = await createClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: `${data.firstName} ${data.lastName}` },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Kayıt başarısız' }, { status: 400 })
  }

  const userId = authData.user.id

  // 2. Update profile
  await supabase
    .from('profiles')
    .update({ phone: data.phone, city: data.city, linkedin: data.linkedin ?? null })
    .eq('id', userId)

  // 3. Create psychologist record
  const { error: psyError } = await supabase
    .from('psychologists')
    .insert({
      id:              userId,
      university:      data.university,
      department:      data.department,
      grad_year:       data.gradYear,
      exp_years:       data.expYears,
      approach:        data.approach,
      bio:             data.bio,
      session_types:   data.sessionTypes,
      weekly_capacity: data.weeklyCapacity ?? null,
      mentor_pref:     data.mentorPref ?? null,
      tier:            data.tier,
      status:          'pending',
    })

  if (psyError) {
    return NextResponse.json({ error: psyError.message }, { status: 500 })
  }

  // 4. Create membership record (inactive until payment)
  await supabase
    .from('memberships')
    .insert({ psychologist_id: userId, tier: data.tier, status: 'inactive' })

  // 5. Insert specializations (find IDs by name)
  if (data.specs.length > 0) {
    const { data: specRows } = await supabase
      .from('specializations')
      .select('id, name')
      .in('name', data.specs)

    if (specRows && specRows.length > 0) {
      await supabase
        .from('psychologist_specializations')
        .insert(specRows.map(s => ({ psychologist_id: userId, specialization_id: s.id })))
    }
  }

  return NextResponse.json({ success: true, userId }, { status: 201 })
}
