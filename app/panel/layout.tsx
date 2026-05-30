import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PanelSidebar from '@/components/layout/PanelSidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  // Fetch psychologist + profile
  const { data: psyRaw } = await supabase
    .from('psychologists')
    .select('tier, status, profiles ( full_name, city )')
    .eq('id', user.id)
    .single()

  type PsyResult = { tier: string; status: string; profiles: { full_name: string | null; city: string | null } | null } | null
  const psy = psyRaw as PsyResult

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', height:'100vh', overflow:'hidden' }}>
      <PanelSidebar
        fullName={psy?.profiles?.full_name ?? user.email ?? 'Psikolog'}
        tier={(psy?.tier ?? 'aday') as import('@/types/database').Tier}
        isAdmin={user.email === 'ozkaya.mrt@gmail.com'}
      />
      <main style={{ overflow:'auto', background:'var(--bg)' }}>
        {children}
      </main>
    </div>
  )
}
