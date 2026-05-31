import { createAdminClient } from '@/lib/supabase/server'
import DocActions from './DocActions'

export default async function BelgelerPage() {
  const supabase = await createAdminClient()

  const { data: docs } = await supabase
    .from('psychologist_documents')
    .select(`
      *,
      psychologists ( id, tier, profiles ( full_name, city ) )
    `)
    .order('created_at', { ascending: true })

  const pending  = (docs ?? []).filter((d: any) => d.status === 'pending')
  const verified = (docs ?? []).filter((d: any) => d.status === 'verified')
  const rejected = (docs ?? []).filter((d: any) => d.status === 'rejected')

  const docTypeLabel: Record<string, string> = {
    diploma: 'Diploma', license: 'Ruhsat', certificate: 'Sertifika',
    membership: 'Üyelik', supervision: 'Süpervizyon', other: 'Diğer',
  }

  return (
    <div>
      <div style={{ marginBottom:'28px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom:'6px' }}>Yönetim</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Belge <em style={{ fontStyle:'italic', color:'var(--gold)' }}>İnceleme</em></h1>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <span className="badge badge-gold">{pending.length} bekliyor</span>
          <span className="badge badge-green">{verified.length} onaylı</span>
          {rejected.length > 0 && <span className="badge badge-red">{rejected.length} reddedildi</span>}
        </div>
      </div>

      {/* Bekleyen belgeler */}
      {pending.length > 0 && (
        <div style={{ marginBottom:'32px' }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px' }}>
            İnceleme Bekleyen ({pending.length})
          </div>
          <div className="card">
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Psikolog','Belge Türü','Başlık','Kurum','Yıl','İşlem'].map(h => (
                    <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', fontWeight:400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'13px 20px' }}>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--cream)', fontWeight:500 }}>{d.psychologists?.profiles?.full_name}</div>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>{d.psychologists?.profiles?.city}</div>
                    </td>
                    <td style={{ padding:'13px 20px' }}>
                      <span className={`badge ${d.document_type === 'diploma' ? 'badge-gold' : 'badge-muted'}`}>{docTypeLabel[d.document_type] || d.document_type}</span>
                    </td>
                    <td style={{ padding:'13px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--cream)', fontSize:'.9rem' }}>{d.title}</td>
                    <td style={{ padding:'13px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--text)', fontSize:'.85rem' }}>{d.issuer || '—'}</td>
                    <td style={{ padding:'13px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--muted)', fontSize:'.85rem' }}>{d.issue_year || '—'}</td>
                    <td style={{ padding:'13px 20px' }}>
                      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                        {d.document_url && (
                          <a href={d.document_url} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold-d)', textDecoration:'none', whiteSpace:'nowrap' }}>
                            Görüntüle ↗
                          </a>
                        )}
                        <DocActions id={d.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="card" style={{ padding:'52px', textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:'12px' }}>✦</div>
          <p style={{ fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>Bekleyen belge yok.</p>
        </div>
      )}

      {/* Onaylı belgeler */}
      {verified.length > 0 && (
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>
            Onaylı Belgeler ({verified.length})
          </div>
          <div className="card">
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Psikolog','Belge','Başlık','Onay Tarihi'].map(h => (
                    <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', fontWeight:400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {verified.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'11px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--cream)', fontSize:'.9rem' }}>{d.psychologists?.profiles?.full_name}</td>
                    <td style={{ padding:'11px 20px' }}><span className="badge badge-green">{docTypeLabel[d.document_type]}</span></td>
                    <td style={{ padding:'11px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--text)', fontSize:'.88rem' }}>{d.title}</td>
                    <td style={{ padding:'11px 20px', fontFamily:'Cormorant Garant,serif', color:'var(--muted)', fontSize:'.82rem' }}>
                      {d.verified_at ? new Date(d.verified_at).toLocaleDateString('tr-TR') : '—'}
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
