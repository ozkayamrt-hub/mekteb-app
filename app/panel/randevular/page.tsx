import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RandevularPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const now = new Date().toISOString()
  const [{ data: upcoming }, { data: pending }] = await Promise.all([
    supabase.from('appointments')
      .select('*, clients(name, email)')
      .eq('psychologist_id', user.id)
      .in('status', ['confirmed'])
      .gte('scheduled_at', now)
      .order('scheduled_at')
      .limit(20),
    supabase.from('appointment_requests')
      .select('*')
      .eq('psychologist_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
  ])

  function groupByDate(appts: any[]) {
    return appts.reduce((acc, a) => {
      const key = new Date(a.scheduled_at).toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' })
      if (!acc[key]) acc[key] = []
      acc[key].push(a)
      return acc
    }, {} as Record<string, any[]>)
  }

  const grouped = groupByDate(upcoming ?? [])

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow" style={{ marginBottom: '4px' }}>Takvim</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>Randevu<em style={{ fontStyle:'italic', color:'var(--gold)' }}>larım</em></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Upcoming list */}
        <div className="card">
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', fontWeight: 500 }}>Yaklaşan Seanslar</h3>
          </div>
          <div style={{ padding: '0 24px' }}>
            {Object.keys(grouped).length === 0 ? (
              <p style={{ padding: '32px 0', color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif', textAlign: 'center' }}>Yaklaşan randevu yok.</p>
            ) : (
              Object.entries(grouped).map(([date, appts]) => (
                <div key={date}>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold-d)', padding: '14px 0 8px', borderBottom: '1px solid var(--border)' }}>{date}</div>
                  {(appts as any[]).map(a => {
                    const t = new Date(a.scheduled_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '60px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.1rem', color: 'var(--cream)' }}>{t}</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--cream)', fontWeight: 500 }}>{a.clients?.name}</div>
                          <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
                            {a.session_type === 'online' ? 'Online' : 'Yüz Yüze'} · {a.duration_minutes}dk
                          </div>
                        </div>
                        <span className="badge badge-green">Onaylı</span>
                        <button className="btn btn-outline btn-sm">Not</button>
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending requests */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', fontWeight: 500 }}>Bekleyen Talepler</h3>
            {(pending ?? []).length > 0 && <span className="badge badge-gold">{pending!.length}</span>}
          </div>
          {(pending ?? []).length === 0 ? (
            <p style={{ padding: '24px', color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif', textAlign: 'center' }}>Bekleyen talep yok.</p>
          ) : (
            (pending ?? []).map(req => (
              <div key={req.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.95rem', color: 'var(--cream)', marginBottom: '4px' }}>{req.client_name}</div>
                <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '8px' }}>{req.client_email}</div>
                {req.note && <p style={{ fontStyle: 'italic', fontSize: '.83rem', color: 'var(--text)', marginBottom: '10px' }}>&ldquo;{req.note}&rdquo;</p>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-gold btn-sm">Onayla</button>
                  <button className="btn btn-outline btn-sm">Reddet</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
