import { createAdminClient } from '@/lib/supabase/server'
import ComplaintActions from './ComplaintActions'

export default async function SikayetlerPage() {
  const supabase = await createAdminClient()

  const { data: complaints } = await supabase
    .from('complaints')
    .select(`
      *,
      psychologists ( id, tier, profiles ( full_name ) )
    `)
    .order('created_at', { ascending: false })

  const open       = (complaints ?? []).filter((c: any) => c.status === 'open')
  const reviewing  = (complaints ?? []).filter((c: any) => c.status === 'under_review')
  const resolved   = (complaints ?? []).filter((c: any) => ['resolved','dismissed'].includes(c.status))

  const statusBadge = (s: string) => {
    if (s === 'open')          return <span className="badge badge-red">Açık</span>
    if (s === 'under_review')  return <span className="badge badge-gold">İnceleniyor</span>
    if (s === 'resolved')      return <span className="badge badge-green">Çözüldü</span>
    if (s === 'dismissed')     return <span className="badge badge-muted">Reddedildi</span>
    return null
  }

  return (
    <div>
      <div style={{ marginBottom:'28px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom:'6px' }}>Yönetim</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Şikayet <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Yönetimi</em></h1>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          {open.length > 0      && <span className="badge badge-red">{open.length} açık</span>}
          {reviewing.length > 0 && <span className="badge badge-gold">{reviewing.length} inceleniyor</span>}
          {resolved.length > 0  && <span className="badge badge-muted">{resolved.length} kapalı</span>}
        </div>
      </div>

      {(complaints ?? []).length === 0 ? (
        <div className="card" style={{ padding:'60px', textAlign:'center' }}>
          <div style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:'12px' }}>✦</div>
          <p style={{ fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>Henüz şikayet bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {(complaints ?? []).map((c: any) => (
            <div key={c.id} className="card">
              {/* Header */}
              <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
                    {statusBadge(c.status)}
                    <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500 }}>{c.subject}</span>
                  </div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
                    {new Date(c.created_at).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    {c.psychologists?.profiles?.full_name && (
                      <> · Hakkında: <strong style={{ color:'var(--text)' }}>{c.psychologists.profiles.full_name}</strong></>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:'18px 24px' }}>
                {/* Açıklama */}
                <div style={{ marginBottom:'16px' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>Açıklama</div>
                  <p style={{ fontSize:'.92rem', color:'var(--text)', lineHeight:1.75, fontStyle:'italic' }}>&ldquo;{c.description}&rdquo;</p>
                </div>

                {/* Şikayetçi bilgisi */}
                {c.complainant_info && (
                  <div style={{ marginBottom:'16px', padding:'10px 14px', background:'rgba(255,255,255,.02)', border:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem' }}>
                    <span style={{ color:'var(--muted)' }}>Şikayetçi: </span>
                    <span style={{ color:'var(--text)' }}>{c.complainant_info}</span>
                  </div>
                )}

                {/* Komite raporu (varsa) */}
                {c.committee_report && (
                  <div style={{ marginBottom:'16px' }}>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>Komite Raporu</div>
                    <p style={{ fontSize:'.88rem', color:'var(--text)', lineHeight:1.7 }}>{c.committee_report}</p>
                  </div>
                )}

                {/* Actions */}
                <ComplaintActions id={c.id} currentStatus={c.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
