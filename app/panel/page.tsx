import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileChecklist from './ProfileChecklist'

export default async function PanelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  // Appointments this week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const [
    { count: clientCount },
    { count: weekCount },
    { data: upcoming },
    { data: requests },
    { data: menteeRows },
    { data: psy },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('psychologist_id', user.id).eq('status', 'active'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('psychologist_id', user.id).gte('scheduled_at', weekStart.toISOString()).lte('scheduled_at', weekEnd.toISOString()).eq('status', 'confirmed'),
    supabase.from('appointments').select('*, clients(name)').eq('psychologist_id', user.id).eq('status', 'confirmed').gte('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(5),
    supabase.from('appointment_requests').select('*').eq('psychologist_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('mentorships').select('*, mentee:mentee_id(id, tier, profiles(full_name))').eq('mentor_id', user.id).eq('status', 'active'),
    supabase.from('psychologists').select('bio, approach, session_fee_min, session_types, tier, profiles(full_name)').eq('id', user.id).single(),
  ])

  const stats = [
    { label: 'Aktif Danışan',     value: clientCount ?? 0,  delta: 'Bu ay',        icon: '⟁' },
    { label: 'Bu Haftaki Seans',  value: weekCount ?? 0,    delta: 'Onaylı',        icon: '◷' },
    { label: 'Bekleyen Talep',    value: (requests ?? []).length, delta: 'Yanıt bekliyor', icon: '◈' },
    { label: 'Aktif Mentee',      value: (menteeRows ?? []).length, delta: 'Süpervizyon', icon: '⬡' },
  ]

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: '4px' }}>Hoş geldiniz</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>Genel <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Bakış</em></h1>
        </div>
        {/* Bekleyen talep uyarısı */}
        {(requests ?? []).length > 0 && (
          <a href="/panel/randevular" style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.1)', border:'1px solid rgba(201,169,110,.35)', padding:'12px 20px', textDecoration:'none', animation:'pulse 2s ease-in-out infinite' }}>
            <span style={{ fontSize:'1.2rem' }}>🔔</span>
            <div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--gold)', fontWeight:500 }}>
                {(requests ?? []).length} yeni randevu talebi
              </div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)' }}>
                Yanıtlamak için tıklayın →
              </div>
            </div>
          </a>
        )}
      </div>

      {/* Profil tamamlama checklist */}
      <ProfileChecklist psy={psy as any} />


      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '2.4rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, marginBottom: '8px' }}>{s.value}</div>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.8rem', color: 'var(--muted)' }}>{s.delta}</div>
            <div style={{ position: 'absolute', top: '18px', right: '20px', fontSize: '1.4rem', color: 'rgba(201,169,110,.15)' }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        {/* Upcoming */}
        <div className="card">
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', fontWeight: 500 }}>Yaklaşan Seanslar</h3>
            <a href="/panel/randevular" className="btn btn-ghost btn-sm">Tümü →</a>
          </div>
          {(upcoming ?? []).length === 0 ? (
            <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif' }}>Yaklaşan seans yok.</p>
          ) : (
            (upcoming ?? []).map(appt => {
              const d = new Date(appt.scheduled_at)
              const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
              const dateStr = d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
              return (
                <div key={appt.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--cream)', fontWeight: 500 }}>{timeStr}</div>
                    <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.75rem', color: 'var(--muted)' }}>{dateStr}</div>
                  </div>
                  <div style={{ width: '1px', height: '36px', background: 'var(--border)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.95rem', color: 'var(--cream)', fontWeight: 500 }}>{appt.clients?.name}</div>
                    <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>{appt.session_type === 'online' ? 'Online' : 'Yüz Yüze'} · {appt.duration_minutes}dk</div>
                  </div>
                  <span className={`badge badge-green`}>Onaylı</span>
                </div>
              )
            })
          )}
        </div>

        {/* Requests */}
        <div className="card">
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', fontWeight: 500 }}>Randevu Talepleri</h3>
            {(requests ?? []).length > 0 && <span className="badge badge-gold">{requests!.length} bekliyor</span>}
          </div>
          {(requests ?? []).length === 0 ? (
            <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif' }}>Bekleyen talep yok.</p>
          ) : (
            (requests ?? []).map(req => (
              <RequestCard key={req.id} req={req} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Client component for interactive request actions
function RequestCard({ req }: { req: any }) {
  return (
    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2a1e30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garant,serif', fontSize: '.8rem', color: 'var(--cream)' }}>
          {req.client_name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, fontFamily: 'Cormorant Garant,serif', fontSize: '.95rem', color: 'var(--cream)' }}>{req.client_name}</div>
        <span className={`badge ${req.session_type === 'online' ? 'badge-blue' : 'badge-muted'}`}>{req.session_type === 'online' ? 'Online' : 'Yüz Yüze'}</span>
      </div>
      {req.note && (
        <p style={{ fontStyle: 'italic', fontSize: '.83rem', color: 'var(--text)', marginBottom: '10px' }}>&ldquo;{req.note}&rdquo;</p>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-gold btn-sm">Onayla</button>
        <button className="btn btn-outline btn-sm">Reddet</button>
      </div>
    </div>
  )
}
