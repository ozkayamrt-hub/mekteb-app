import { createClient } from '@/lib/supabase/server'
import PsychologistSearch from '@/components/psychologist/PsychologistSearch'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Psikolog Bul — Mekteb',
  description: 'Deneyimli, etik ilkelere bağlı psikologlarla tanışın.',
}

export default async function DanisanPage() {
  const supabase = await createClient()

  const { data: rawList } = await supabase
    .from('psychologists')
    .select(`
      id, tier, exp_years, approach, bio, session_types, is_online,
      profiles ( full_name, city ),
      psychologist_specializations (
        specializations ( name )
      )
    `)
    .eq('status', 'active')
    .order('exp_years', { ascending: false })

  // Flatten joined data for client component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const psychologists = (rawList ?? []).map((p: any) => ({
    id:          p.id,
    tier:        p.tier as 'aday' | 'uzman' | 'ustat',
    expYears:    p.exp_years ?? 0,
    approach:    p.approach ?? '',
    bio:         p.bio ?? '',
    sessionTypes: (p.session_types ?? []) as string[],
    isOnline:    p.is_online ?? false,
    fullName:    p.profiles?.full_name ?? 'Psikolog',
    city:        p.profiles?.city ?? '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    specs:       (p.psychologist_specializations ?? []).map((s: any) => s.specializations?.name).filter(Boolean) as string[],
  }))

  return <PsychologistSearch psychologists={psychologists} />
}
