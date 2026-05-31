import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SupervizyonClient from './SupervizyonClient'

export default async function SupervizyonPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const [{ data: psy }, { data: groups }, { data: myMemberships }] = await Promise.all([
    supabase.from('psychologists').select('tier, profiles(full_name)').eq('id', user.id).single(),
    supabase.from('supervision_groups')
      .select(`*, leader:leader_id ( id, tier, profiles ( full_name, city ) ), supervision_group_members ( id, member_id, status )`)
      .neq('status', 'closed')
      .order('created_at', { ascending: false }),
    supabase.from('supervision_group_members')
      .select('group_id, status')
      .eq('member_id', user.id),
  ])

  const tier = (psy as any)?.tier as string
  const myGroupIds = new Set((myMemberships ?? []).map((m: any) => m.group_id))

  return (
    <div style={{ padding: '32px 36px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow" style={{ marginBottom: '6px' }}>Topluluk</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>
          Süpervizyon & <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Akran Grupları</em>
        </h1>
        <p style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--text)', marginTop: '10px', maxWidth: '600px', lineHeight: 1.7 }}>
          Süpervizyon grupları: Üstatlar yönetir, Aday psikologlar katılır. Akran grupları: Uzman psikologlar kendi aralarında vaka istişaresi ve mesleki dayanışma için buluşur.
        </p>
      </div>
      <SupervizyonClient
        userId={user.id}
        tier={tier}
        groups={(groups ?? []) as any[]}
        myGroupIds={Array.from(myGroupIds)}
      />
    </div>
  )
}
