import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import PublicProfileClient from './PublicProfileClient'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: psy } = await supabase
    .from('psychologists')
    .select('approach, bio, tier, profiles(full_name, city)')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!psy) return { title: 'Psikolog Bulunamadı — Mekteb' }

  const name = (psy.profiles as any)?.full_name ?? 'Psikolog'
  const city = (psy.profiles as any)?.city ?? ''
  const tier = psy.tier === 'ustat' ? 'Üstat' : psy.tier === 'uzman' ? 'Uzman' : 'Aday'

  return {
    title: `${name} — ${tier} Psikolog | Mekteb`,
    description: psy.bio?.slice(0, 160) ?? `${name}, ${city} • ${psy.approach} • Mekteb platformunda`,
    openGraph: {
      title: `${name} — ${tier} Klinik Psikolog`,
      description: psy.bio?.slice(0, 160) ?? `${psy.approach} • ${city}`,
      type: 'profile',
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createAdminClient()

  const [{ data: psy }, { data: specs }, { data: blocks }] = await Promise.all([
    supabase.from('psychologists')
      .select('id, tier, exp_years, approach, bio, session_types, is_online, session_fee_min, session_fee_max, profiles(full_name, city, avatar_url)')
      .eq('id', id)
      .eq('status', 'active')
      .single(),
    supabase.from('psychologist_specializations')
      .select('specializations(name)')
      .eq('psychologist_id', id),
    supabase.from('availability_blocks')
      .select('block_type, day_of_week, specific_date, start_time, end_time')
      .eq('psychologist_id', id),
  ])

  if (!psy) notFound()

  const profile = psy.profiles as any
  const specList = (specs ?? []).map((s: any) => s.specializations?.name).filter(Boolean) as string[]

  const TIER_LABEL = { aday: 'I — Aday', uzman: 'II — Uzman', ustat: 'III — Üstat' } as Record<string, string>
  const TIER_CLASS = { aday: 'tier-aday', uzman: 'tier-uzman', ustat: 'tier-ustat' } as Record<string, string>
  const DAYS = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']

  const blockedDays = (blocks ?? []).filter(b => b.block_type === 'weekly' && !b.start_time).map(b => b.day_of_week)
  const initials = profile?.full_name?.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase() ?? 'PS'

  function feeLabel(): string | null {
    const fMin = (psy as any).session_fee_min as number | null
    const fMax = (psy as any).session_fee_max as number | null
    if (!fMin && !fMax) return null
    if (fMin && fMax && fMin !== fMax) return `${fMin.toLocaleString('tr-TR')}₺ – ${fMax.toLocaleString('tr-TR')}₺`
    const v = fMin ?? fMax
    return v ? `${v.toLocaleString('tr-TR')}₺` : null
  }

  const profileUrl = `https://mekteb.vercel.app/p/${id}`

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Minimal Navbar */}
      <nav style={{ background:'rgba(9,15,12,.95)', borderBottom:'1px solid var(--border)', padding:'14px 0' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <Link href="/danisan" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)', textDecoration:'none' }}>
            ← Psikolog Listesine Dön
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'48px 24px 100px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'32px', alignItems:'start' }}>

          {/* Sol: Profil */}
          <div>
            {/* Kimlik */}
            <div style={{ display:'flex', gap:'24px', alignItems:'flex-start', marginBottom:'32px' }}>
              {/* Avatar */}
              <div style={{ width:'96px', height:'96px', borderRadius:'50%', flexShrink:0, overflow:'hidden', border:'2px solid var(--border)' }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', background:'#1e3d2a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'2rem', color:'var(--cream)' }}>{initials}</div>
                }
              </div>
              <div style={{ flex:1 }}>
                <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:400, marginBottom:'6px' }}>{profile?.full_name}</h1>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)', marginBottom:'10px' }}>
                  Klinik Psikolog · {profile?.city} · {psy.exp_years} yıl deneyim
                </div>
                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                  <span className={`badge ${TIER_CLASS[psy.tier]}`}>{TIER_LABEL[psy.tier]}</span>
                  {psy.is_online && <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--green)', letterSpacing:'.08em' }}>● Aktif</span>}
                </div>
              </div>
            </div>

            {/* Bio */}
            {psy.bio && (
              <div style={{ marginBottom:'28px' }}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'10px' }}>Hakkında</div>
                <p style={{ fontSize:'.97rem', color:'var(--text)', lineHeight:1.8 }}>{psy.bio}</p>
              </div>
            )}

            {/* Uzmanlıklar */}
            {specList.length > 0 && (
              <div style={{ marginBottom:'28px' }}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'10px' }}>Uzmanlık Alanları</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {specList.map(s => (
                    <span key={s} style={{ padding:'5px 14px', border:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Detaylar */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'10px' }}>Detaylar</div>
              <div className="card">
                {[
                  ['Terapötik Yaklaşım', psy.approach],
                  ['Deneyim', `${psy.exp_years} yıl`],
                  ['Şehir', profile?.city],
                  ['Seans Türü', (psy.session_types ?? []).map((s: string) => s === 'online' ? 'Online' : 'Yüz Yüze').join(' & ')],
                  ['Seans Ücreti', feeLabel() ? `${feeLabel()}/seans` : null],
                ].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l as string} style={{ display:'flex', gap:'16px', padding:'12px 20px', borderBottom:'1px solid var(--border)', fontSize:'.9rem' }}>
                    <span style={{ width:'160px', flexShrink:0, fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>{l}</span>
                    <span style={{ color:'var(--cream)', fontWeight: l === 'Seans Ücreti' ? 500 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Müsait günler */}
            {blockedDays.length < 7 && (
              <div style={{ marginBottom:'28px' }}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'10px' }}>Çalışma Günleri</div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {DAYS.map((day, i) => {
                    const isBlocked = blockedDays.includes(i)
                    return (
                      <div key={day} style={{ padding:'6px 12px', border:`1px solid ${isBlocked ? 'var(--border)' : 'rgba(110,201,138,.3)'}`, fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color: isBlocked ? 'var(--muted)' : 'var(--green)', background: isBlocked ? 'transparent' : 'rgba(110,201,138,.05)', textDecoration: isBlocked ? 'line-through' : 'none', opacity: isBlocked ? .4 : 1 }}>
                        {day.slice(0,3)}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sağ: Aksiyonlar */}
          <div style={{ position:'sticky', top:'80px' }}>
            {/* Randevu */}
            <div className="card" style={{ padding:'28px', marginBottom:'16px' }}>
              {feeLabel() && (
                <div style={{ marginBottom:'16px', textAlign:'center' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', color:'var(--gold)', fontWeight:300 }}>{feeLabel()}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>/ seans</div>
                </div>
              )}
              <PublicProfileClient psyId={id} psyName={profile?.full_name ?? 'Psikolog'} psyApproach={psy.approach ?? ''} />
            </div>

            {/* Paylaş */}
            <div className="card" style={{ padding:'20px 24px' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>
                Bu Profili Paylaş
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                <button
                  onClick={() => { typeof navigator !== 'undefined' && navigator.clipboard?.writeText(profileUrl) }}
                  className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}
                  suppressHydrationWarning>
                  🔗 Linki Kopyala
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${profile?.full_name} — Mekteb Psikolog\n${profileUrl}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center', color:'#25d366', borderColor:'rgba(37,211,102,.3)' }}>
                  📱 WhatsApp'ta Paylaş
                </a>
              </div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', marginTop:'10px', textAlign:'center', wordBreak:'break-all', lineHeight:1.5 }}>
                mekteb.vercel.app/p/{id.slice(0,8)}…
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
