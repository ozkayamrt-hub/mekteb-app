import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLANS } from '@/lib/stripe/plans'
import { MIN_SESSION_FEE } from '@/lib/constants'
import BelgelerSection from './BelgelerSection'
import AvatarUpload from '@/components/upload/AvatarUpload'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const [{ data: profile }, { data: psy }, { data: membership }, { data: specs }, { data: docs }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('psychologists').select('*').eq('id', user.id).single(),
    supabase.from('memberships').select('*').eq('psychologist_id', user.id).single(),
    supabase.from('psychologist_specializations').select('specializations(name)').eq('psychologist_id', user.id),
    supabase.from('psychologist_documents').select('*').eq('psychologist_id', user.id).order('created_at', { ascending: false }),
  ])

  const { data: allSpecs } = await supabase.from('specializations').select('name').order('name')
  const mySpecs = specs?.map((s: any) => s.specializations?.name).filter(Boolean) ?? []
  const plan = membership ? PLANS[membership.tier as keyof typeof PLANS] : null

  const initials = profile?.full_name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() ?? 'PS'

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow" style={{ marginBottom: '4px' }}>Hesap Ayarları</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 400 }}>Profil<em style={{ fontStyle:'italic', color:'var(--gold)' }}>im</em></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div>
          {/* Profile header */}
          <div className="card" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <AvatarUpload userId={user.id} currentUrl={profile?.avatar_url} size={72} />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '4px' }}>{profile?.full_name}</h2>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)', letterSpacing:'.06em', marginBottom:'10px' }}>
                {psy?.approach} · {profile?.city} · {psy?.exp_years} yıl
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <span className={`badge tier-${psy?.tier}`}>{psy?.tier === 'aday' ? 'I — Aday' : psy?.tier === 'uzman' ? 'II — Uzman' : 'III — Üstat'}</span>
                <span className={`badge ${psy?.status === 'active' ? 'badge-green' : 'badge-gold'}`}>{psy?.status === 'active' ? 'Aktif' : 'Onay Bekliyor'}</span>
              </div>
            </div>
            <a href="/danisan" target="_blank" className="btn btn-outline btn-sm">Profili Gör ↗</a>
          </div>

          {/* Edit form */}
          <div className="card" style={{ padding: '28px', marginBottom: '16px' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'20px' }}>
              Profil Bilgileri
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <div>
                <label className="form-label">Ad Soyad</label>
                <input className="form-input" defaultValue={profile?.full_name ?? ''} />
              </div>
              <div>
                <label className="form-label">Telefon</label>
                <input className="form-input" defaultValue={profile?.phone ?? ''} />
              </div>
              <div>
                <label className="form-label">Şehir</label>
                <input className="form-input" defaultValue={profile?.city ?? ''} />
              </div>
              <div>
                <label className="form-label">LinkedIn</label>
                <input className="form-input" defaultValue={profile?.linkedin ?? ''} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Kısa Tanıtım</label>
              <textarea className="form-textarea" defaultValue={psy?.bio ?? ''} style={{ minHeight:'90px', resize:'vertical' }} />
            </div>
            {(() => {
              const tier = (psy as any)?.tier as 'aday' | 'uzman' | 'ustat' | undefined
              const minAllowed = tier ? MIN_SESSION_FEE[tier] : 0
              return (
                <>
                  {/* Platform minimum uyarısı */}
                  <div style={{ marginTop:'16px', padding:'12px 16px', background:'rgba(201,169,110,.06)', border:'1px solid rgba(201,169,110,.2)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--text)', lineHeight:1.65 }}>
                    ◈ &nbsp; <strong style={{ color:'var(--cream)' }}>
                      {tier === 'aday' ? 'Aday' : tier === 'uzman' ? 'Uzman' : 'Üstat'} kademesi minimum seans ücreti:{' '}
                      <span style={{ color:'var(--gold)' }}>{minAllowed.toLocaleString('tr-TR')}₺</span>
                    </strong>
                    <br />Platform kuralı: Aidat ücretinin altında seans ücreti belirlenemez. Bu kural sağlıklı rekabeti korur.
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'14px' }}>
                    <div>
                      <label className="form-label">Seans Ücreti — Minimum (₺) <span style={{ color:'var(--gold)' }}>*</span></label>
                      <input className="form-input" type="number"
                        defaultValue={(psy as any)?.session_fee_min ?? ''}
                        placeholder={`Min. ${minAllowed.toLocaleString('tr-TR')}₺`}
                        min={minAllowed} step="50" />
                    </div>
                    <div>
                      <label className="form-label">Seans Ücreti — Maksimum (₺)</label>
                      <input className="form-input" type="number"
                        defaultValue={(psy as any)?.session_fee_max ?? ''}
                        placeholder="Aralık için (opsiyonel)"
                        min={minAllowed} step="50" />
                    </div>
                  </div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', marginTop:'6px', lineHeight:1.6 }}>
                    Danışanlar bu ücreti arama sayfasında görür. Sabit ücret için yalnızca minimum girin.
                  </div>
                </>
              )
            })()}
            <div style={{ marginTop: '16px' }}>
              <label className="form-label">Uzmanlık Alanları</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {allSpecs?.map(s => (
                  <button
                    key={s.name}
                    style={{
                      padding:'5px 14px', border:`1px solid ${mySpecs.includes(s.name) ? 'var(--gold)' : 'var(--border)'}`,
                      background: mySpecs.includes(s.name) ? 'rgba(201,169,110,.1)' : 'transparent',
                      color: mySpecs.includes(s.name) ? 'var(--gold)' : 'var(--text)',
                      fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', cursor:'pointer',
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-gold btn-sm" style={{ marginTop: '20px' }}>Kaydet</button>
          </div>
        </div>

        {/* Membership */}
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>Üyelik</div>
          <div style={{ padding:'24px', background:'var(--bg3)', border:'1px solid rgba(201,169,110,.2)', marginBottom:'16px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', border:'1px solid rgba(201,169,110,.08)' }} />
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'6px' }}>
              {plan?.label ?? 'Üyelik Yok'}
            </div>
            <h3 style={{ fontSize:'1.3rem', fontWeight:400, marginBottom:'16px' }}>
              {membership?.status === 'active' ? 'Aktif Üye' : 'Pasif'}
            </h3>
            {[
              ['Aylık Aidat',   plan ? `${plan.price}₺` : '—'],
              ['Durum',         membership?.status === 'active' ? 'Aktif ✓' : 'Pasif'],
              ['Sonraki Ödeme', membership?.current_period_end
                ? new Date(membership.current_period_end).toLocaleDateString('tr-TR')
                : '—'],
            ].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem' }}>
                <span style={{ color:'var(--muted)' }}>{l}</span>
                <span style={{ color: String(v).includes('✓') ? 'var(--green)' : 'var(--cream)' }}>{v}</span>
              </div>
            ))}
            <button className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:'16px' }}>
              Fatura Geçmişi
            </button>
          </div>

          <div className="card" style={{ padding:'24px' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>
              Çalışma Ayarları
            </div>
            {[
              ['Haftalık Kapasite', psy?.weekly_capacity ?? '—'],
              ['Seans Türü',        psy?.session_types?.join(', ') ?? '—'],
            ].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem' }}>
                <span style={{ color:'var(--muted)' }}>{l}</span>
                <span style={{ color:'var(--cream)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Belgeler */}
      <div style={{ marginTop:'28px' }}>
        <BelgelerSection userId={user.id} initialDocs={docs ?? []} />
      </div>
    </div>
  )
}
