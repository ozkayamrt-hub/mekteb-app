import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PanelSidebar from '@/components/layout/PanelSidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  // Fetch psychologist + profile
  const [{ data: psyRaw }, { count: pendingCount }] = await Promise.all([
    supabase.from('psychologists').select('tier, status, profiles ( full_name, city )').eq('id', user.id).single(),
    supabase.from('appointment_requests').select('*', { count: 'exact', head: true }).eq('psychologist_id', user.id).eq('status', 'pending'),
  ])

  type PsyResult = { tier: string; status: string; profiles: { full_name: string | null; city: string | null } | null } | null
  const psy = psyRaw as PsyResult

  return (
    <div className="r-sidebar" style={{ display:'grid', gridTemplateColumns:'240px 1fr', height:'100vh', overflow:'hidden' }}>
      <PanelSidebar
        fullName={psy?.profiles?.full_name ?? user.email ?? 'Psikolog'}
        tier={(psy?.tier ?? 'aday') as import('@/types/database').Tier}
        isAdmin={user.email === 'ozkaya.mrt@gmail.com'}
        pendingRequests={pendingCount ?? 0}
        userId={user.id}
      />
      <main style={{ overflow:'auto', background:'var(--bg)' }}>
        {children}
      </main>
    </div>
  )
}
