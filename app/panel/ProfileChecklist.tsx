'use client'

import Link from 'next/link'

interface Props {
  psy: {
    bio?: string | null
    approach?: string | null
    session_fee_min?: number | null
    session_types?: string[]
    tier?: string
    profiles?: { full_name?: string | null } | null
  } | null
}

export default function ProfileChecklist({ psy }: Props) {
  if (!psy) return null

  const items = [
    {
      done: !!(psy.bio && psy.bio.length > 10),
      label: 'Profil biyografisi eklendi',
      hint: 'Danışanlar sizi bu yazıyla tanıyacak',
      href: '/panel/profil',
    },
    {
      done: !!(psy.session_fee_min),
      label: 'Seans ücreti belirlendi',
      hint: 'Danışanlar ücretinizi göremeden karar veremez',
      href: '/panel/profil',
    },
    {
      done: !!(psy.session_types && psy.session_types.length > 0),
      label: 'Seans türü seçildi (online/yüz yüze)',
      hint: 'Danışanlar buna göre sizi filtreler',
      href: '/panel/profil',
    },
    {
      done: false, // Takvim default açık, kapalı gün ayarlamak opsiyonel
      label: 'Kapalı günler ayarlandı (opsiyonel)',
      hint: 'Müsait olmadığınız günleri belirtin',
      href: '/panel/takvim',
    },
  ]

  const doneCount = items.filter(i => i.done).length
  const allDone   = doneCount >= 3 // 4. madde opsiyonel

  if (allDone) return null // Tamamsa gösterme

  return (
    <div style={{ background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.2)', padding:'20px 24px', marginBottom:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500 }}>
          ✦ &nbsp; Profilinizi tamamlayın
        </div>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
          {doneCount}/{items.length} tamamlandı
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:'2px', background:'var(--border)', marginBottom:'16px', borderRadius:'1px' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,var(--gold-d),var(--gold))', width:`${(doneCount/items.length)*100}%`, transition:'width .5s', borderRadius:'1px' }} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {items.map(item => (
          <Link key={item.label} href={item.href} style={{ display:'flex', alignItems:'center', gap:'12px', textDecoration:'none', padding:'8px 10px', transition:'background .2s', borderRadius:'2px' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:`1px solid ${item.done ? 'var(--green)' : 'var(--border-h)'}`, background: item.done ? 'rgba(110,201,138,.15)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.7rem', color:'var(--green)' }}>
              {item.done ? '✓' : ''}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color: item.done ? 'var(--muted)' : 'var(--cream)', textDecoration: item.done ? 'line-through' : 'none' }}>
                {item.label}
              </div>
              {!item.done && (
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)' }}>{item.hint}</div>
              )}
            </div>
            {!item.done && <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold-d)' }}>→</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
