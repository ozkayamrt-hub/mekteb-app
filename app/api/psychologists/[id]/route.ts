import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('psychologists')
    .select(`
      *,
      profiles ( full_name, city, phone, linkedin ),
      psychologist_specializations (
        specializations ( id, name )
      )
    `)
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const body = await req.json()
  const { specs, ...psyFields } = body

  // Update psychologist fields
  const { error } = await supabase
    .from('psychologists')
    .update(psyFields)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update specializations if provided
  if (specs) {
    await supabase.from('psychologist_specializations').delete().eq('psychologist_id', id)
    const { data: specRows } = await supabase
      .from('specializations').select('id, name').in('name', specs)
    if (specRows?.length) {
      await supabase.from('psychologist_specializations')
        .insert(specRows.map(s => ({ psychologist_id: id, specialization_id: s.id })))
    }
  }

  return NextResponse.json({ success: true })
}
