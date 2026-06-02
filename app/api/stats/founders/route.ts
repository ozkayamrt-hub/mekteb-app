import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createAdminClient()
  const { count } = await supabase
    .from('psychologists')
    .select('*', { count: 'exact', head: true })
  return NextResponse.json({ count: count ?? 0, total: 100 })
}
