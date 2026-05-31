import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientActions from './ClientActions'

export default async function DanisanlarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  // Danışanları + geçmiş randevu talep sayısını çek
  const [{ data: clients }, { data: allRequests }] = await Promise.all([
    supabase.from('clients').select('*').eq('psychologist_id', user.id).order('created_at', { ascending: false }),
    supabase.from('appointment_requests')
      .select('id, client_name, client_email, status, created_at, note')
      .eq('psychologist_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const active  = clients?.filter(c => c.status === 'active').length ?? 0
  const passive = clients?.filter(c => c.status === 'passive').length ?? 0

  function initials(name: string) {
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  const COLORS = ['#1a2e3f','#2e2230','#2e3a1a','#1e3040','#3a2a18','#1a3028','#2a3018','#302018']

  // Her danışan için istek geçmişi eşleştir
  function getRequestCount(clientName: string | null, clientEmail: string | null) {
    return (allRequests ?? []).filter(r =>
      (clientEmail && r.client_email === clientEmail) ||
      (clientName && r.client_name === clientName)
    ).length
  }

  function getLastRequest(clientName: string | null, clientEmail: string | null) {
    return (allRequests ?? []).find(r =>
      (clientEmail && r.client_email === clientEmail) ||
      (clientName && r.client_name === clientName)
    )
  }

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: '6px' }}>Danışan Yönetimi</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>Danışan<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>larım</em></h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-green">{active} Aktif</span>
          {passive > 0 && <span className="badge badge-muted">{passive} Pasif</span>}
        </div>
      </div>

      {/* Bilgi notu */}
      <div style={{ padding:'12px 18px', background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.15)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)', lineHeight:1.65, marginBottom:'24px' }}>
        ◈ &nbsp; Danışanlarınız buraya otomatik eklenir. Randevu talebini onayladığınızda danışan aktif olarak listelenir.
        Tekrar seans talebi geldiğinde <strong style={{ color:'var(--cream)' }}>Randevular</strong> sekmesinde görünür.
      </div>

      {(!clients || clients.length === 0) ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:'16px' }}>⟁</div>
          <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.4rem', marginBottom: '12px' }}>Henüz danışanınız yok</h3>
          <p style={{ color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif', marginBottom:'20px' }}>
            Randevu talepleri onaylandıkça danışanlarınız burada görünecek.
          </p>
          <a href="/panel/randevular" className="btn btn-gold btn-sm" style={{ display:'inline-flex' }}>
            Randevu Taleplerini Gör →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection:'column', gap:'12px' }}>
          {clients.map((client, i) => {
            const reqCount = getRequestCount(client.name, client.email)
            const lastReq  = getLastRequest(client.name, client.email)
            return (
              <div key={client.id} className="card" style={{ padding:'0' }}>
                <div style={{ padding:'18px 24px', display:'flex', alignItems:'center', gap:'16px' }}>
                  {/* Avatar */}
                  <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:COLORS[i % COLORS.length], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', flexShrink:0 }}>
                    {initials(client.name)}
                  </div>

                  {/* Bilgi */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500 }}>{client.name}</div>
                    <div style={{ display:'flex', gap:'14px', marginTop:'3px', flexWrap:'wrap' }}>
                      {client.email && (
                        <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>{client.email}</span>
                      )}
                      <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>
                        İlk: {new Date(client.created_at).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Seans & durum */}
                  <div style={{ display:'flex', gap:'12px', alignItems:'center', flexShrink:0 }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', color:'var(--gold)', fontWeight:300, lineHeight:1 }}>{client.session_count}</div>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em' }}>Seans</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', color:'var(--text)', fontWeight:300, lineHeight:1 }}>{reqCount}</div>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em' }}>Talep</div>
                    </div>
                    <span className={`badge ${client.status === 'active' ? 'badge-green' : 'badge-muted'}`}>
                      {client.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>

                {/* Son not */}
                {lastReq?.note && (
                  <div style={{ padding:'0 24px 10px', fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)', fontStyle:'italic' }}>
                    Son not: &ldquo;{lastReq.note.replace('[Devam Seansı] ','').slice(0,80)}{lastReq.note.length > 80 ? '…' : ''}&rdquo;
                  </div>
                )}

                {/* Aksiyonlar */}
                <div style={{ borderTop:'1px solid var(--border)', padding:'12px 24px', display:'flex', gap:'8px', alignItems:'center', background:'rgba(255,255,255,.01)' }}>
                  <ClientActions clientId={client.id} clientName={client.name} currentStatus={client.status} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
