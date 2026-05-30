import { createAdminClient } from '@/lib/supabase/server'
import ApprovalActions from './ApprovalActions'

export default async function BasvurularPage() {
  const supabase = await createAdminClient()

  const { data: pending } = await supabase
    .from('psychologists')
    .select(`
      id, tier, exp_years, approach, bio, session_types, created_at,
      profiles ( full_name, city, email, phone, linkedin ),
      psychologist_specializations ( specializations ( name ) )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: '6px' }}>Yönetim</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 400 }}>Bekleyen <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Başvurular</em></h1>
        </div>
        <span className="badge badge-gold">{(pending ?? []).length} başvuru</span>
      </div>

      {(pending ?? []).length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '16px' }}>✦</div>
          <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.4rem', marginBottom: '8px' }}>Bekleyen başvuru yok</h3>
          <p style={{ color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif' }}>Yeni başvurular burada görünecek.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(pending ?? []).map((p: any) => {
            const specs = (p.psychologist_specializations ?? []).map((s: any) => s.specializations?.name).filter(Boolean)
            return (
              <div key={p.id} className="card" style={{ padding: '0' }}>
                {/* Header */}
                <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1e3d2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--cream)', flexShrink: 0 }}>
                      {p.profiles?.full_name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() ?? 'PS'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.1rem', color: 'var(--cream)', fontWeight: 500 }}>{p.profiles?.full_name}</div>
                      <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
                        {p.profiles?.city} · {p.profiles?.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge tier-${p.tier}`}>{p.tier === 'aday' ? 'I — Aday' : p.tier === 'uzman' ? 'II — Uzman' : 'III — Üstat'}</span>
                    <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
                      {new Date(p.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    {[
                      ['Yaklaşım', p.approach],
                      ['Deneyim', p.exp_years ? `${p.exp_years} yıl` : '—'],
                      ['Seans', (p.session_types ?? []).map((s: string) => s === 'online' ? 'Online' : 'Yüz Yüze').join(', ')],
                      ['Telefon', p.profiles?.phone],
                      ['LinkedIn', p.profiles?.linkedin],
                    ].filter(([,v]) => v).map(([l, v]) => (
                      <div key={l as string} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.88rem' }}>
                        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)', width: '80px', flexShrink: 0 }}>{l}</span>
                        <span style={{ color: 'var(--cream)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {p.bio && (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>Tanıtım</div>
                        <p style={{ fontSize: '.88rem', color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.65 }}>&ldquo;{p.bio}&rdquo;</p>
                      </div>
                    )}
                    {specs.length > 0 && (
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Uzmanlık</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {specs.map((s: string) => (
                            <span key={s} style={{ padding: '3px 10px', border: '1px solid var(--border)', fontFamily: 'Cormorant Garant,serif', fontSize: '.75rem', color: 'var(--text)' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <ApprovalActions id={p.id} tier={p.tier} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
