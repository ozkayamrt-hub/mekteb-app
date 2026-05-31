import { createAdminClient } from '@/lib/supabase/server'
import FeedbackActions from './FeedbackActions'

export default async function GorusPage() {
  const supabase = await createAdminClient()
  const { data: items } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  const unread   = (items ?? []).filter((f: any) => f.status === 'unread')
  const read     = (items ?? []).filter((f: any) => f.status === 'read')
  const replied  = (items ?? []).filter((f: any) => f.status === 'replied')

  const userTypeLabel = (t: string) =>
    t === 'psychologist' ? 'Psikolog' : t === 'client' ? 'Danışan' : 'Ziyaretçi'

  return (
    <div>
      <div style={{ marginBottom:'28px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom:'6px' }}>Gelen Kutusu</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Görüş & <em style={{ fontStyle:'italic', color:'var(--gold)' }}>İstekler</em></h1>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          {unread.length > 0  && <span className="badge badge-gold">{unread.length} okunmamış</span>}
          {replied.length > 0 && <span className="badge badge-green">{replied.length} yanıtlandı</span>}
        </div>
      </div>

      {(items ?? []).length === 0 ? (
        <div className="card" style={{ padding:'52px', textAlign:'center' }}>
          <div style={{ fontSize:'2rem', marginBottom:'12px' }}>💬</div>
          <p style={{ fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>Henüz görüş veya istek yok.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {(items ?? []).map((f: any) => (
            <div key={f.id} className="card" style={{ opacity: f.status === 'replied' ? .7 : 1 }}>
              <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
                <span className={`badge ${f.status === 'unread' ? 'badge-gold' : f.status === 'replied' ? 'badge-green' : 'badge-muted'}`}>
                  {f.status === 'unread' ? 'Okunmamış' : f.status === 'replied' ? 'Yanıtlandı' : 'Okundu'}
                </span>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--cream)', fontWeight:500, flex:1 }}>{f.subject}</span>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', border:'1px solid var(--border)', padding:'2px 8px' }}>
                  {userTypeLabel(f.user_type)}
                </span>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
                  {new Date(f.created_at).toLocaleDateString('tr-TR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                </span>
              </div>
              <div style={{ padding:'16px 24px' }}>
                <p style={{ fontSize:'.92rem', color:'var(--text)', lineHeight:1.7, marginBottom:'12px', fontStyle:'italic' }}>
                  &ldquo;{f.message}&rdquo;
                </p>
                {f.contact && (
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--gold-d)', marginBottom:'12px' }}>
                    İletişim: <a href={`mailto:${f.contact}`} style={{ color:'var(--gold)', textDecoration:'none' }}>{f.contact}</a>
                  </div>
                )}
                {f.page_url && (
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', marginBottom:'12px' }}>
                    Sayfa: {f.page_url}
                  </div>
                )}
                {f.admin_note && (
                  <div style={{ padding:'10px 14px', background:'rgba(110,201,138,.06)', border:'1px solid rgba(110,201,138,.2)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--green)', marginBottom:'12px' }}>
                    Not: {f.admin_note}
                  </div>
                )}
                <FeedbackActions id={f.id} status={f.status} contact={f.contact} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
