import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MentorlukPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: psy } = await supabase.from('psychologists').select('tier').eq('id', user.id).single()

  const [{ data: myMentees }, { data: myMentor }, { data: incoming }] = await Promise.all([
    supabase.from('mentorships')
      .select('*, mentee:mentee_id(id, exp_years, approach, tier, profiles(full_name, city))')
      .eq('mentor_id', user.id)
      .in('status', ['active', 'pending']),
    supabase.from('mentorships')
      .select('*, mentor:mentor_id(id, tier, profiles(full_name, city))')
      .eq('mentee_id', user.id)
      .eq('status', 'active')
      .single(),
    psy?.tier === 'ustat'
      ? supabase.from('mentorships')
          .select('*, mentee:mentee_id(id, exp_years, approach, profiles(full_name, city))')
          .eq('mentor_id', user.id)
          .eq('status', 'pending')
      : Promise.resolve({ data: [] }),
  ])

  function initials(name: string) {
    return name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() ?? 'PS'
  }

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow" style={{ marginBottom: '4px' }}>Topluluk</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>Mentör<em style={{ fontStyle:'italic', color:'var(--gold)' }}>lük</em></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <div>
          {/* My mentor (if mentee) */}
          {myMentor && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>Mentörüm</div>
              <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:'#1e3d2a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'1.1rem', color:'var(--cream)' }}>
                  {initials(myMentor.mentor?.profiles?.full_name ?? '')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.1rem', color:'var(--cream)', fontWeight:500 }}>{myMentor.mentor?.profiles?.full_name}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>{myMentor.mentor?.profiles?.city}</div>
                </div>
                <span className="badge badge-green">Aktif</span>
              </div>
            </div>
          )}

          {/* My mentees */}
          {psy?.tier !== 'aday' && (
            <div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>
                Menteelerim {myMentees && myMentees.length > 0 ? `(${myMentees.length})` : ''}
              </div>
              <div className="card">
                {(!myMentees || myMentees.length === 0) ? (
                  <p style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif' }}>Henüz aktif mentee yok.</p>
                ) : (
                  myMentees.map(m => (
                    <div key={m.id} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'#2a3018', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', flexShrink:0 }}>
                        {initials(m.mentee?.profiles?.full_name ?? '')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500 }}>{m.mentee?.profiles?.full_name}</div>
                          <span className={`badge ${m.status === 'active' ? 'badge-green' : 'badge-gold'}`}>{m.status === 'active' ? 'Aktif' : 'Bekliyor'}</span>
                        </div>
                        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>Aday · {m.mentee?.profiles?.city}</div>
                        {m.status === 'active' && (
                          <div style={{ marginTop:'10px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                              <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)' }}>İlerleme</span>
                              <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)' }}>{m.progress_pct}%</span>
                            </div>
                            <div style={{ height:'3px', background:'var(--border)', position:'relative', maxWidth:'240px' }}>
                              <div style={{ position:'absolute', top:0, left:0, height:'100%', background:'linear-gradient(90deg,var(--gold-d),var(--gold))', width:`${m.progress_pct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                        <button className="btn btn-outline btn-sm">Not Ekle</button>
                        {m.status === 'active' && <button className="btn btn-gold btn-sm">Ortak Seans</button>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Incoming requests */}
        <div>
          {(incoming && incoming.length > 0) && (
            <>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>
                Gelen Talepler ({incoming.length})
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {incoming.map((m: any) => (
                  <div key={m.id} style={{ padding:'20px 24px', background:'rgba(201,169,110,.04)', border:'1px solid rgba(201,169,110,.2)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
                      <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#2e2a18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', color:'var(--cream)' }}>
                        {initials(m.mentee?.profiles?.full_name ?? '')}
                      </div>
                      <div>
                        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500 }}>{m.mentee?.profiles?.full_name}</div>
                        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>Aday · {m.mentee?.profiles?.city}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button className="btn btn-gold btn-sm">Kabul Et</button>
                      <button className="btn btn-outline btn-sm">Reddet</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="card" style={{ padding:'24px', marginTop:'16px' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>Mentörlük İstatistikleri</div>
            {[
              ['Toplam Mentee', myMentees?.length ?? 0],
              ['Aktif',         myMentees?.filter((m: any) => m.status === 'active').length ?? 0],
              ['Bekleyen',      myMentees?.filter((m: any) => m.status === 'pending').length ?? 0],
            ].map(([label, val]) => (
              <div key={label as string} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem' }}>
                <span style={{ color:'var(--muted)' }}>{label}</span>
                <span style={{ color:'var(--cream)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
