import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import UpgradeForm from './UpgradeForm'

const CRITERIA: Record<string, { title: string; items: string[] }[]> = {
  uzman: [
    {
      title: 'Deneyim',
      items: ['En az 3 yıl aktif mesleki deneyim', 'En az 50 tamamlanmış seans (Mekteb veya belgelenmiş)'],
    },
    {
      title: 'Eğitim & Belgeler',
      items: ['Psikoloji veya Klinik Psikoloji lisans/yüksek lisans diploması', 'Geçerli TPD veya muadil dernek üyeliği'],
    },
    {
      title: 'Platform',
      items: ['Mekteb üyeliği en az 6 ay', 'Aktif danışan geçmişi'],
    },
  ],
  ustat: [
    {
      title: 'Deneyim',
      items: ['En az 10 yıl aktif mesleki deneyim', 'En az 200 tamamlanmış seans (belgelenmiş)'],
    },
    {
      title: 'Eğitim & Belgeler',
      items: ['Klinik Psikoloji Yüksek Lisans veya Doktora', 'En az bir geçerli uzmanlık sertifikası (BDT, EMDR, Şema vb.)', 'Geçerli dernek üyeliği'],
    },
    {
      title: 'Platform & Komite',
      items: ['Mekteb Uzman üyeliği en az 1 yıl', 'Komite değerlendirmesi ve onayı gerektirir', 'Referans: en az 2 aktif Üstat'],
    },
  ],
}

export default async function KademeYukseltPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const admin = await createAdminClient()

  const [{ data: psy }, { data: docs }, { data: requests }] = await Promise.all([
    admin.from('psychologists').select('tier, exp_years, profiles(full_name)').eq('id', user.id).single(),
    admin.from('psychologist_documents').select('id, document_type, title, status').eq('psychologist_id', user.id),
    admin.from('tier_upgrade_requests').select('*').eq('psychologist_id', user.id).order('created_at', { ascending: false }),
  ])

  const tier = (psy as any)?.tier as 'aday' | 'uzman' | 'ustat'
  const nextTier = tier === 'aday' ? 'uzman' : tier === 'uzman' ? 'ustat' : null
  const nextTierLabel = nextTier === 'uzman' ? 'II — Uzman' : nextTier === 'ustat' ? 'III — Üstat' : null

  const pendingRequest = (requests as any[])?.find(r => ['pending', 'needs_info'].includes(r.status))
  const latestRequest  = (requests as any[])?.[0]

  const verifiedDocs   = (docs as any[])?.filter(d => d.status === 'verified') ?? []
  const hasDiploma     = verifiedDocs.some(d => d.document_type === 'diploma')

  return (
    <div style={{ padding:'32px 40px', maxWidth:'800px' }}>
      <div style={{ marginBottom:'36px' }}>
        <div className="eyebrow" style={{ marginBottom:'6px' }}>Hesabım</div>
        <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Kademe <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Yükseltme</em></h1>
      </div>

      {/* Mevcut kademe */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'32px' }}>
        <div className="card" style={{ padding:'20px 24px' }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>Mevcut Kademe</div>
          <span className={`badge tier-${tier}`} style={{ fontSize:'.85rem', padding:'5px 14px' }}>
            {tier === 'aday' ? 'I — Aday' : tier === 'uzman' ? 'II — Uzman' : 'III — Üstat'}
          </span>
        </div>
        {nextTier ? (
          <div style={{ padding:'20px 24px', background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.2)' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>Hedef Kademe</div>
            <span className={`badge tier-${nextTier}`} style={{ fontSize:'.85rem', padding:'5px 14px' }}>
              {nextTierLabel}
            </span>
          </div>
        ) : (
          <div className="card" style={{ padding:'20px 24px', display:'flex', alignItems:'center' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--gold)' }}>
              ✦ En yüksek kademedeydiniz
            </div>
          </div>
        )}
      </div>

      {/* Mevcut talep durumu */}
      {latestRequest && (
        <div style={{ marginBottom:'28px', padding:'18px 24px', border:`1px solid ${
          latestRequest.status === 'pending' ? 'rgba(201,169,110,.3)' :
          latestRequest.status === 'approved' ? 'rgba(110,201,138,.3)' :
          latestRequest.status === 'rejected' ? 'rgba(201,110,110,.3)' :
          'var(--border)'
        }`, background: latestRequest.status === 'approved' ? 'rgba(110,201,138,.05)' : 'rgba(255,255,255,.02)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom: latestRequest.admin_note ? '10px' : '0' }}>
            <span className={`badge ${
              latestRequest.status === 'pending'    ? 'badge-gold' :
              latestRequest.status === 'needs_info' ? 'badge-blue' :
              latestRequest.status === 'approved'   ? 'badge-green' :
              'badge-red'
            }`}>
              {latestRequest.status === 'pending'    ? 'İnceleniyor' :
               latestRequest.status === 'needs_info' ? 'Ek Bilgi Gerekli' :
               latestRequest.status === 'approved'   ? 'Onaylandı' : 'Reddedildi'}
            </span>
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)' }}>
              {latestRequest.current_tier} → {latestRequest.requested_tier} talebi ·{' '}
              {new Date(latestRequest.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>
          {latestRequest.admin_note && (
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)', fontStyle:'italic', marginTop:'8px' }}>
              Komite notu: &ldquo;{latestRequest.admin_note}&rdquo;
            </div>
          )}
        </div>
      )}

      {!nextTier ? null : pendingRequest ? (
        <div style={{ padding:'24px', background:'rgba(201,169,110,.04)', border:'1px solid rgba(201,169,110,.18)', fontFamily:'Cormorant Garant,serif', fontSize:'.92rem', color:'var(--text)', lineHeight:1.7 }}>
          ◈ &nbsp; Bekleyen bir başvurunuz var. Sonuçlanmadan yeni başvuru yapılamaz.
        </div>
      ) : (
        <>
          {/* Kriterler */}
          <div style={{ marginBottom:'32px' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'16px' }}>
              {nextTierLabel} için Gereklilikler
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'20px' }}>
              {(CRITERIA[nextTier] ?? []).map(group => (
                <div key={group.title} style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'18px 20px' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'10px' }}>{group.title}</div>
                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'8px' }}>
                    {group.items.map(item => (
                      <li key={item} style={{ display:'flex', gap:'8px', alignItems:'flex-start', fontSize:'.82rem', color:'var(--text)' }}>
                        <span style={{ color:'var(--gold-d)', fontSize:'.55rem', marginTop:'6px', flexShrink:0 }}>◆</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Onaylı belgeler özeti */}
            <div style={{ padding:'14px 18px', background: hasDiploma ? 'rgba(110,201,138,.05)' : 'rgba(201,110,110,.05)', border:`1px solid ${hasDiploma ? 'rgba(110,201,138,.2)' : 'rgba(201,110,110,.2)'}`, fontFamily:'Cormorant Garant,serif', fontSize:'.85rem' }}>
              {hasDiploma ? (
                <span style={{ color:'var(--green)' }}>
                  ✓ Onaylı belgeniz var: {verifiedDocs.map(d => d.title).join(', ')}
                </span>
              ) : (
                <span style={{ color:'var(--red)' }}>
                  ⚠ Henüz onaylı belgeniz yok.{' '}
                  <a href="/panel/profil" style={{ color:'var(--gold)', textDecoration:'none' }}>Profil sayfasından ekleyin →</a>
                </span>
              )}
            </div>
          </div>

          {/* Başvuru formu */}
          <UpgradeForm nextTier={nextTier} nextTierLabel={nextTierLabel!} hasDiploma={hasDiploma} />
        </>
      )}
    </div>
  )
}
