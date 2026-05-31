import { createAdminClient } from '@/lib/supabase/server'
import UpgradeActions from './UpgradeActions'

export default async function YukseltmelerPage() {
  const supabase = await createAdminClient()

  const { data: requests } = await supabase
    .from('tier_upgrade_requests')
    .select(`
      *,
      psychologists (
        id, exp_years, tier,
        profiles ( full_name, city ),
        psychologist_documents ( document_type, title, status )
      )
    `)
    .order('created_at', { ascending: true })

  const pending  = (requests ?? []).filter((r: any) => ['pending','needs_info'].includes(r.status))
  const closed   = (requests ?? []).filter((r: any) => ['approved','rejected'].includes(r.status))

  const tierLabel = (t: string) => t === 'aday' ? 'I Aday' : t === 'uzman' ? 'II Uzman' : 'III Üstat'

  return (
    <div>
      <div style={{ marginBottom:'28px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom:'6px' }}>Yönetim</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Kademe <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Yükseltme</em></h1>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          {pending.length > 0 && <span className="badge badge-gold">{pending.length} bekliyor</span>}
          {closed.length  > 0 && <span className="badge badge-muted">{closed.length} kapalı</span>}
        </div>
      </div>

      {/* Bekleyen talepler */}
      {pending.length === 0 ? (
        <div className="card" style={{ padding:'52px', textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:'12px' }}>✦</div>
          <p style={{ fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>Bekleyen yükseltme talebi yok.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'20px', marginBottom:'32px' }}>
          {pending.map((r: any) => {
            const psy  = r.psychologists
            const docs = (psy?.psychologist_documents ?? [])
            const verifiedDocs = docs.filter((d: any) => d.status === 'verified')
            return (
              <div key={r.id} className="card">
                <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'#1e3d2a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', color:'var(--cream)', flexShrink:0 }}>
                    {psy?.profiles?.full_name?.split(' ').map((w: string) => w[0]).join('').slice(0,2) ?? 'PS'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500 }}>{psy?.profiles?.full_name}</div>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
                      {psy?.profiles?.city} · {psy?.exp_years} yıl deneyim
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <span className={`badge tier-${r.current_tier}`}>{tierLabel(r.current_tier)}</span>
                    <span style={{ color:'var(--muted)', fontSize:'1rem' }}>→</span>
                    <span className={`badge tier-${r.requested_tier}`}>{tierLabel(r.requested_tier)}</span>
                    <span className={`badge ${r.status === 'pending' ? 'badge-gold' : 'badge-blue'}`}>
                      {r.status === 'pending' ? 'Bekliyor' : 'Ek Bilgi Bekleniyor'}
                    </span>
                  </div>
                </div>

                <div style={{ padding:'18px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                  <div>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>Öz Değerlendirme</div>
                    <p style={{ fontSize:'.88rem', color:'var(--text)', lineHeight:1.7, fontStyle:'italic', maxHeight:'120px', overflow:'auto' }}>
                      &ldquo;{r.self_assessment}&rdquo;
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>
                      Onaylı Belgeler ({verifiedDocs.length})
                    </div>
                    {verifiedDocs.length === 0 ? (
                      <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--red)' }}>Onaylı belge yok</p>
                    ) : (
                      <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'6px' }}>
                        {verifiedDocs.map((d: any) => (
                          <li key={d.title} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--green)', display:'flex', gap:'8px' }}>
                            <span>✓</span>{d.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    {docs.filter((d: any) => d.status === 'pending').length > 0 && (
                      <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', marginTop:'8px' }}>
                        +{docs.filter((d: any) => d.status === 'pending').length} belge inceleme bekliyor
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ borderTop:'1px solid var(--border)', padding:'0 24px' }}>
                  <UpgradeActions id={r.id} psychologistId={r.psychologist_id} requestedTier={r.requested_tier} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Kapalı talepler */}
      {closed.length > 0 && (
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>Geçmiş ({closed.length})</div>
          <div className="card">
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Psikolog','Talep','Sonuç','Tarih'].map(h => (
                    <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', fontWeight:400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {closed.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'11px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--cream)', fontSize:'.9rem' }}>{r.psychologists?.profiles?.full_name}</td>
                    <td style={{ padding:'11px 20px' }}>
                      <span className={`badge tier-${r.current_tier}`}>{tierLabel(r.current_tier)}</span>
                      <span style={{ color:'var(--muted)', margin:'0 6px', fontSize:'.8rem' }}>→</span>
                      <span className={`badge tier-${r.requested_tier}`}>{tierLabel(r.requested_tier)}</span>
                    </td>
                    <td style={{ padding:'11px 20px' }}>
                      <span className={`badge ${r.status === 'approved' ? 'badge-green' : 'badge-red'}`}>
                        {r.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </td>
                    <td style={{ padding:'11px 20px', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)' }}>
                      {new Date(r.reviewed_at ?? r.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
