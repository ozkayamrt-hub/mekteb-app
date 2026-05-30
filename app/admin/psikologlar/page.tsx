import { createAdminClient } from '@/lib/supabase/server'
import StatusActions from './StatusActions'

export default async function PsikologlarPage({ searchParams }: { searchParams: Promise<{ durum?: string; kademe?: string }> }) {
  const { durum, kademe } = await searchParams
  const supabase = await createAdminClient()

  let query = supabase
    .from('psychologists')
    .select('id, tier, status, exp_years, approach, created_at, profiles(full_name, city, email)')
    .order('created_at', { ascending: false })

  if (durum)  query = query.eq('status', durum)
  if (kademe) query = query.eq('tier', kademe)

  const { data: psys } = await query

  const filterLink = (key: string, val: string, label: string, current?: string) => {
    const isActive = current === val
    return (
      <a href={`/admin/psikologlar?${key}=${isActive ? '' : val}${key === 'durum' && kademe ? `&kademe=${kademe}` : ''}${key === 'kademe' && durum ? `&durum=${durum}` : ''}`}
        style={{ padding: '5px 14px', border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`, background: isActive ? 'rgba(201,169,110,.1)' : 'transparent', color: isActive ? 'var(--gold)' : 'var(--text)', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', textDecoration: 'none', transition: 'all .2s' }}>
        {label}
      </a>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow" style={{ marginBottom: '6px' }}>Yönetim</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 400 }}>Tüm <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Psikologlar</em></h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Durum:</span>
          {filterLink('durum', 'pending',   'Bekleyen', durum)}
          {filterLink('durum', 'active',    'Aktif',    durum)}
          {filterLink('durum', 'suspended', 'Askıda',   durum)}
        </div>
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Kademe:</span>
          {filterLink('kademe', 'aday',  'I — Aday',  kademe)}
          {filterLink('kademe', 'uzman', 'II — Uzman', kademe)}
          {filterLink('kademe', 'ustat', 'III — Üstat',kademe)}
        </div>
        <span style={{ marginLeft: 'auto', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--cream)' }}>{(psys ?? []).length}</strong> sonuç
        </span>
      </div>

      {/* Table */}
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['İsim', 'E-posta', 'Kademe', 'Şehir', 'Deneyim', 'Durum', 'İşlem'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(psys ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garant,serif' }}>
                  Bu kriterlere uygun psikolog bulunamadı.
                </td>
              </tr>
            ) : (
              (psys ?? []).map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '13px 20px', fontFamily: 'Cormorant Garant,serif', color: 'var(--cream)', fontWeight: 500 }}>{p.profiles?.full_name ?? '—'}</td>
                  <td style={{ padding: '13px 20px', fontFamily: 'Cormorant Garant,serif', fontSize: '.82rem', color: 'var(--muted)' }}>{p.profiles?.email ?? '—'}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <span className={`badge tier-${p.tier}`}>{p.tier === 'aday' ? 'I' : p.tier === 'uzman' ? 'II' : 'III'}</span>
                  </td>
                  <td style={{ padding: '13px 20px', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--text)' }}>{p.profiles?.city ?? '—'}</td>
                  <td style={{ padding: '13px 20px', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--text)' }}>{p.exp_years ?? 0} yıl</td>
                  <td style={{ padding: '13px 20px' }}>
                    <span className={`badge ${p.status === 'active' ? 'badge-green' : p.status === 'pending' ? 'badge-gold' : 'badge-red'}`}>
                      {p.status === 'active' ? 'Aktif' : p.status === 'pending' ? 'Bekliyor' : 'Askıda'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <StatusActions id={p.id} status={p.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
