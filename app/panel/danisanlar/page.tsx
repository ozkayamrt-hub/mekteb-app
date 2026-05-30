import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DanisanlarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('psychologist_id', user.id)
    .order('created_at', { ascending: false })

  const active  = clients?.filter(c => c.status === 'active').length ?? 0
  const passive = clients?.filter(c => c.status === 'passive').length ?? 0

  function initials(name: string) {
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  const COLORS = ['#1a2e3f','#2e2230','#2e3a1a','#1e3040','#3a2a18','#1a3028','#2a3018','#302018']

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: '4px' }}>Danışan Yönetimi</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>Danışan<em style={{ fontStyle:'italic', color:'var(--gold)' }}>larım</em></h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="badge badge-green">{active} Aktif</span>
          {passive > 0 && <span className="badge badge-muted">{passive} Pasif</span>}
        </div>
      </div>

      {(!clients || clients.length === 0) ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.4rem', marginBottom: '12px' }}>Henüz danışanınız yok</h3>
          <p style={{ color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif' }}>Randevu talepleri onaylandıkça danışanlarınız burada görünecek.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {clients.map((client, i) => (
            <div key={client.id} className="card card-hover" style={{ padding: '20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: COLORS[i % COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--cream)',
                }}>
                  {initials(client.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--cream)', fontWeight: 500 }}>{client.name}</div>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.75rem', color: 'var(--muted)' }}>
                    {new Date(client.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <span className={`badge ${client.status === 'active' ? 'badge-green' : 'badge-muted'}`}>{client.status === 'active' ? 'Aktif' : 'Pasif'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 300 }}>{client.session_count}</div>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Seans</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--text)' }}>Devam</div>
                  <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Durum</div>
                </div>
              </div>
              {client.email && <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>{client.email}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
