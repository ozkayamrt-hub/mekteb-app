import { createAdminClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createAdminClient()

  const [
    { count: total },
    { count: aktif },
    { count: bekleyen },
    { count: aday },
    { count: uzman },
    { count: ustat },
    { data: recent },
  ] = await Promise.all([
    supabase.from('psychologists').select('*', { count: 'exact', head: true }),
    supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('tier', 'aday'),
    supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('tier', 'uzman'),
    supabase.from('psychologists').select('*', { count: 'exact', head: true }).eq('tier', 'ustat'),
    supabase.from('psychologists')
      .select('id, tier, status, created_at, profiles(full_name, city)')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const stats = [
    { label: 'Toplam Psikolog', value: total ?? 0, color: 'var(--gold)' },
    { label: 'Aktif',           value: aktif ?? 0, color: 'var(--green)' },
    { label: 'Onay Bekleyen',   value: bekleyen ?? 0, color: 'var(--gold-d)' },
    { label: 'Aday (I)',        value: aday ?? 0, color: 'var(--text)' },
    { label: 'Uzman (II)',      value: uzman ?? 0, color: 'var(--text)' },
    { label: 'Üstat (III)',     value: ustat ?? 0, color: 'var(--text)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow" style={{ marginBottom: '6px' }}>Yönetim</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 400 }}>Genel <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Bakış</em></h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '36px' }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '2.4rem', fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent registrations */}
      <div className="card">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', fontWeight: 500 }}>Son Kayıtlar</h3>
          <a href="/admin/basvurular" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.82rem', color: 'var(--gold)', textDecoration: 'none' }}>Tümünü gör →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['İsim', 'Kademe', 'Şehir', 'Durum', 'Kayıt Tarihi'].map(h => (
                <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(recent ?? []).map((p: any) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 24px', fontFamily: 'Cormorant Garant,serif', color: 'var(--cream)' }}>{p.profiles?.full_name ?? '—'}</td>
                <td style={{ padding: '12px 24px' }}>
                  <span className={`badge tier-${p.tier}`}>{p.tier === 'aday' ? 'I' : p.tier === 'uzman' ? 'II' : 'III'} — {p.tier.charAt(0).toUpperCase() + p.tier.slice(1)}</span>
                </td>
                <td style={{ padding: '12px 24px', fontFamily: 'Cormorant Garant,serif', fontSize: '.88rem', color: 'var(--text)' }}>{p.profiles?.city ?? '—'}</td>
                <td style={{ padding: '12px 24px' }}>
                  <span className={`badge ${p.status === 'active' ? 'badge-green' : p.status === 'pending' ? 'badge-gold' : 'badge-red'}`}>
                    {p.status === 'active' ? 'Aktif' : p.status === 'pending' ? 'Bekliyor' : 'Askıya Alındı'}
                  </span>
                </td>
                <td style={{ padding: '12px 24px', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)' }}>
                  {new Date(p.created_at).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
