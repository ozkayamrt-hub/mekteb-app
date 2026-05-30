'use client'

import { useState, useMemo, useCallback } from 'react'

/* ── Types ── */
type Tier = 'aday' | 'uzman' | 'ustat'
interface Psychologist {
  id: string; tier: Tier; expYears: number; approach: string
  bio: string; sessionTypes: string[]; isOnline: boolean
  fullName: string; city: string; specs: string[]
}
interface Filters {
  tier: string[]; session: string[]; spec: string[]; city: string[]
}

const TIER_LABEL: Record<Tier, string> = { aday: 'I — Aday', uzman: 'II — Uzman', ustat: 'III — Üstat' }
const TIER_CLASS: Record<Tier, string> = { aday: 'tier-aday', uzman: 'tier-uzman', ustat: 'tier-ustat' }
const COLORS = ['#1a2e3f','#2e2230','#2e3a1a','#1e3040','#3a2a18','#1a3028','#2a3018','#302018','#1e2a30','#2a1e30']

const FILTER_OPTIONS = {
  tier:    [{ val:'ustat', label:'III — Üstat' },{ val:'uzman', label:'II — Uzman' },{ val:'aday', label:'I — Aday' }],
  session: [{ val:'online', label:'Online' },{ val:'yuz_yuze', label:'Yüz Yüze' }],
  specs:   ['Depresyon','Anksiyete','Travma & TSSB','Çift Terapisi','Çocuk & Ergen','OKB','Yas & Kayıp','Bağımlılık','Kariyer & Tükenmişlik','Aile Terapisi'],
  cities:  ['İstanbul','Ankara','İzmir','Bursa','Antalya'],
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

/* ══════════════════════════════════════════
   BOOKING MODAL
══════════════════════════════════════════ */
function BookingModal({ psy, onClose }: { psy: Psychologist; onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [sessionType, setSessionType] = useState('')

  const slots = useMemo(() => {
    const result = []
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const days = ['Pzt','Sal','Çar','Per','Cum']
    const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
    const times = ['10:00','13:00','16:00']
    while (result.length < 6) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        result.push({ day: days[d.getDay() - 1], date: `${d.getDate()} ${months[d.getMonth()]}`, time: times[result.length % 3] })
      }
      d.setDate(d.getDate() + 1)
    }
    return result
  }, [])

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'20px 0' }}>
      <div style={{ fontSize:'2.5rem', color:'var(--gold)', marginBottom:'16px' }}>✦</div>
      <h3 style={{ fontSize:'1.6rem', fontWeight:400, marginBottom:'10px' }}>
        Talebiniz <em style={{ fontStyle:'italic', color:'var(--gold)' }}>alındı</em>
      </h3>
      <p style={{ fontSize:'.93rem', color:'var(--text)' }}>
        Psikologunuz 24 saat içinde size dönüş yapacak. E-posta adresinizi kontrol edin.
      </p>
    </div>
  )

  return (
    <div>
      {/* For */}
      <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px', background:'rgba(201,169,110,.06)', border:'1px solid var(--border)', marginBottom:'24px' }}>
        <div style={{ width:'38px', height:'38px', borderRadius:'50%', background: COLORS[psy.id.charCodeAt(0) % COLORS.length], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--cream)', flexShrink:0 }}>
          {initials(psy.fullName)}
        </div>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)' }}>{psy.fullName}</div>
          <div style={{ fontSize:'.78rem', color:'var(--muted)', fontFamily:'Cormorant Garant,serif' }}>{psy.approach}</div>
        </div>
      </div>

      {/* Date slots */}
      <div style={{ marginBottom:'20px' }}>
        <label className="form-label">Tercih Ettiğiniz Tarih</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {slots.map((s, i) => (
            <div key={i} onClick={() => setSelectedSlot(i)} style={{
              border:`1px solid ${selectedSlot === i ? 'var(--gold)' : 'var(--border)'}`,
              background: selectedSlot === i ? 'rgba(201,169,110,.1)' : 'transparent',
              padding:'10px 8px', textAlign:'center', cursor:'pointer', transition:'all .2s',
            }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'3px' }}>{s.day}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)' }}>{s.date}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--gold-d)', marginTop:'2px' }}>{s.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
        <div>
          <label className="form-label">Adınız Soyadınız</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Ad Soyad" />
        </div>
        <div>
          <label className="form-label">Seans Türü</label>
          <select className="form-input" value={sessionType} onChange={e => setSessionType(e.target.value)} style={{ appearance:'none', cursor:'pointer' }}>
            <option value="">Seçiniz</option>
            <option>Online</option>
            <option>Yüz Yüze</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom:'14px' }}>
        <label className="form-label">E-posta</label>
        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@mail.com" />
      </div>
      <div style={{ marginBottom:'20px' }}>
        <label className="form-label">Kısa Not (isteğe bağlı)</label>
        <textarea className="form-input" value={note} onChange={e => setNote(e.target.value)} placeholder="Neden randevu almak istediğinizi kısaca paylaşabilirsiniz…" style={{ minHeight:'80px', resize:'vertical' }} />
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:'12px' }}>
        <button onClick={onClose} className="btn btn-outline btn-md" style={{ flex:1, justifyContent:'center' }}>Vazgeç</button>
        <button onClick={() => setSubmitted(true)} className="btn btn-gold btn-md" style={{ flex:2, justifyContent:'center' }}>
          Talebi Gönder →
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   PROFILE DRAWER
══════════════════════════════════════════ */
function ProfileDrawer({ psy, colorIdx, onClose, onBook }: {
  psy: Psychologist; colorIdx: number; onClose: () => void; onBook: () => void
}) {
  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:300, animation:'fadeIn .3s ease' }} />

      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(580px,100vw)',
        background:'var(--bg2)', borderLeft:'1px solid var(--border)',
        zIndex:301, display:'flex', flexDirection:'column', overflow:'hidden',
        animation:'slideIn .4s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding:'28px 36px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:COLORS[colorIdx], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', color:'var(--cream)', flexShrink:0 }}>
              {initials(psy.fullName)}
            </div>
            <div>
              <h3 style={{ fontSize:'1.5rem', fontWeight:400, marginBottom:'4px' }}>{psy.fullName}</h3>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)', letterSpacing:'.06em', marginBottom:'8px' }}>
                Klinik Psikolog · {psy.city}
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <span className={`badge ${TIER_CLASS[psy.tier]}`}>{TIER_LABEL[psy.tier]}</span>
                {psy.isOnline && <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--green)', letterSpacing:'.08em' }}>● Aktif</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:'36px', height:'36px', border:'1px solid var(--border)', background:'none', color:'var(--muted)', cursor:'pointer', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s', flexShrink:0 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'36px' }}>
          <Section title="Hakkında">
            <p style={{ fontSize:'.93rem', color:'var(--text)', lineHeight:1.75 }}>{psy.bio || 'Profil bilgisi henüz eklenmemiş.'}</p>
          </Section>

          <Section title="Uzmanlık Alanları">
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {psy.specs.map(s => (
                <span key={s} style={{ padding:'5px 14px', border:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--text)' }}>{s}</span>
              ))}
            </div>
          </Section>

          <Section title="Detaylar">
            {[
              ['Terapötik Yaklaşım', psy.approach],
              ['Deneyim', `${psy.expYears} yıl`],
              ['Şehir', psy.city],
              ['Seans Türü', psy.sessionTypes.map(s => s === 'online' ? 'Online' : 'Yüz Yüze').join(' & ')],
              ['Kademe', TIER_LABEL[psy.tier]],
            ].map(([l, v]) => v ? (
              <div key={l} style={{ display:'flex', gap:'12px', padding:'11px 0', borderBottom:'1px solid var(--border)', fontSize:'.9rem' }}>
                <span style={{ width:'140px', flexShrink:0, fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)', letterSpacing:'.06em' }}>{l}</span>
                <span style={{ color:'var(--cream)' }}>{v}</span>
              </div>
            ) : null)}
          </Section>
        </div>

        {/* Footer */}
        <div style={{ padding:'24px 36px', borderTop:'1px solid var(--border)', flexShrink:0 }}>
          <button onClick={onBook} className="btn btn-gold" style={{ width:'100%', justifyContent:'center', fontSize:'1.05rem', padding:'15px' }}>
            Randevu Talep Et
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
      `}</style>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'28px' }}>
      <h5 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px', paddingBottom:'8px', borderBottom:'1px solid var(--border)' }}>{title}</h5>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════
   FILTER TAG
══════════════════════════════════════════ */
function FilterTag({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <span onClick={onClick} style={{
      padding:'5px 13px', border:`1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
      background: active ? 'rgba(201,169,110,.12)' : 'transparent',
      color: active ? 'var(--gold)' : 'var(--text)',
      fontFamily:'Cormorant Garant,serif', fontSize:'.85rem',
      cursor:'pointer', transition:'all .2s', userSelect:'none',
    }}>
      {label}
    </span>
  )
}

/* ══════════════════════════════════════════
   PSYCHOLOGIST CARD
══════════════════════════════════════════ */
function PsyCard({ psy, colorIdx, onClick }: { psy: Psychologist; colorIdx: number; onClick: () => void }) {
  return (
    <div onClick={onClick} className="card card-hover" style={{ cursor:'pointer' }}>
      <div style={{ padding:'28px 28px 18px', display:'flex', gap:'16px', alignItems:'flex-start' }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'50%', flexShrink:0, background:COLORS[colorIdx], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'1.1rem', color:'var(--cream)', position:'relative' }}>
          {initials(psy.fullName)}
          {psy.isOnline && <span style={{ position:'absolute', bottom:'2px', right:'2px', width:'10px', height:'10px', borderRadius:'50%', background:'var(--green)', border:'2px solid var(--bg2)' }} />}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.15rem', fontWeight:500, color:'var(--cream)', marginBottom:'3px' }}>{psy.fullName}</div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>Klinik Psikolog</div>
        </div>
        <span className={`badge ${TIER_CLASS[psy.tier]}`}>{TIER_LABEL[psy.tier]}</span>
      </div>

      <div style={{ padding:'0 28px 18px' }}>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--gold-d)', letterSpacing:'.04em', marginBottom:'10px' }}>{psy.approach}</div>
        <p style={{ fontSize:'.87rem', color:'var(--text)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:'12px' }}>
          {psy.bio}
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
          {psy.specs.slice(0, 3).map(s => (
            <span key={s} style={{ padding:'2px 9px', background:'rgba(201,169,110,.06)', border:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.74rem', color:'var(--muted)' }}>{s}</span>
          ))}
          {psy.specs.length > 3 && <span style={{ padding:'2px 9px', background:'rgba(201,169,110,.06)', border:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.74rem', color:'var(--muted)' }}>+{psy.specs.length - 3}</span>}
        </div>
      </div>

      <div style={{ borderTop:'1px solid var(--border)', padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:'14px' }}>
          {[['◎', psy.city], ['◇', `${psy.expYears} yıl`], ['▷', psy.sessionTypes.map(s => s === 'online' ? 'Online' : 'Y.Y.').join(' & ')]].map(([icon, val]) => (
            <span key={val} style={{ display:'flex', alignItems:'center', gap:'5px', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
              <span style={{ fontSize:'.85rem' }}>{icon}</span>{val}
            </span>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); onClick() }}>Profil →</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function PsychologistSearch({ psychologists }: { psychologists: Psychologist[] }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({ tier: [], session: [], spec: [], city: [] })
  const [selectedPsy, setSelectedPsy] = useState<Psychologist | null>(null)
  const [bookingPsy, setBookingPsy] = useState<Psychologist | null>(null)

  const toggleFilter = useCallback((key: keyof Filters, val: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }))
  }, [])

  const resetFilters = () => {
    setFilters({ tier: [], session: [], spec: [], city: [] })
    setSearch('')
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return psychologists.filter(p => {
      if (q && !p.fullName.toLowerCase().includes(q) && !p.approach.toLowerCase().includes(q) && !p.specs.join(' ').toLowerCase().includes(q)) return false
      if (filters.tier.length && !filters.tier.includes(p.tier)) return false
      if (filters.session.length && !filters.session.some(s => p.sessionTypes.includes(s))) return false
      if (filters.spec.length && !filters.spec.some(s => p.specs.includes(s))) return false
      if (filters.city.length && !filters.city.includes(p.city)) return false
      return true
    })
  }, [psychologists, search, filters])

  const colorIdx = (psy: Psychologist) => Math.abs(psy.id.charCodeAt(0) + psy.id.charCodeAt(1)) % COLORS.length

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding:'80px 0 50px', background:'var(--bg2)', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-150px', right:'-150px', width:'500px', height:'500px', background:'radial-gradient(ellipse,rgba(30,70,40,.35) 0%,transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Mekteb Terapist Dizini</div>
          <h1 style={{ fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:300, marginBottom:'14px' }}>
            Sizin için <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru</em> psikologu bulun
          </h1>
          <p style={{ fontSize:'1rem', color:'var(--text)', maxWidth:'480px', marginBottom:'36px' }}>
            Deneyimli, etik ilkelere bağlı psikologlarla tanışın. Uzmanlık, yaklaşım ve konuma göre filtreleyin.
          </p>
          <div style={{ display:'flex', gap:'0', maxWidth:'620px' }}>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="İsim veya uzmanlık alanı ara…"
              style={{ flex:1, background:'rgba(255,255,255,.04)', border:'1px solid var(--border-h)', borderRight:'none', padding:'14px 20px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.97rem', outline:'none' }}
              onFocus={e => (e.target.style.background = 'rgba(201,169,110,.04)')}
              onBlur={e => (e.target.style.background = 'rgba(255,255,255,.04)')}
            />
            <button className="btn btn-gold" style={{ padding:'14px 28px', fontSize:'1rem', borderRadius:0 }}>Ara</button>
          </div>

          {/* Hero stats */}
          <div style={{ display:'flex', gap:'36px', marginTop:'32px' }}>
            {[[String(psychologists.length), 'Psikolog'],['3','Kademe'],['%0','Komisyon']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginTop:'4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'48px 32px 80px', display:'grid', gridTemplateColumns:'260px 1fr', gap:'40px' }}>

        {/* Sidebar filters */}
        <aside>
          <div style={{ position:'sticky', top:'88px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
              <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold-d)' }}>Filtrele</span>
              <button onClick={resetFilters} className="btn btn-ghost" style={{ fontSize:'.82rem', padding:'2px 8px' }}>Sıfırla</button>
            </div>

            {/* Tier */}
            <FilterBlock title="Kademe">
              {FILTER_OPTIONS.tier.map(({ val, label }) => (
                <FilterTag key={val} label={label} active={filters.tier.includes(val)} onClick={() => toggleFilter('tier', val)} />
              ))}
            </FilterBlock>

            {/* Session */}
            <FilterBlock title="Seans Türü">
              {FILTER_OPTIONS.session.map(({ val, label }) => (
                <FilterTag key={val} label={label} active={filters.session.includes(val)} onClick={() => toggleFilter('session', val)} />
              ))}
            </FilterBlock>

            {/* Specs */}
            <FilterBlock title="Uzmanlık">
              {FILTER_OPTIONS.specs.map(s => (
                <FilterTag key={s} label={s} active={filters.spec.includes(s)} onClick={() => toggleFilter('spec', s)} />
              ))}
            </FilterBlock>

            {/* Cities */}
            <FilterBlock title="Şehir">
              {FILTER_OPTIONS.cities.map(c => (
                <FilterTag key={c} label={c} active={filters.city.includes(c)} onClick={() => toggleFilter('city', c)} />
              ))}
            </FilterBlock>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--text)' }}>
              <strong style={{ color:'var(--cream)' }}>{filtered.length}</strong> psikolog bulundu
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ padding:'60px', textAlign:'center' }}>
              <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', marginBottom:'12px' }}>Sonuç bulunamadı</h3>
              <p style={{ color:'var(--muted)', fontFamily:'Cormorant Garant,serif' }}>Filtrelerinizi değiştirip tekrar deneyin.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'18px' }}>
              {filtered.map(psy => (
                <PsyCard key={psy.id} psy={psy} colorIdx={colorIdx(psy)} onClick={() => setSelectedPsy(psy)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Drawer */}
      {selectedPsy && (
        <ProfileDrawer
          psy={selectedPsy}
          colorIdx={colorIdx(selectedPsy)}
          onClose={() => setSelectedPsy(null)}
          onBook={() => { setBookingPsy(selectedPsy); setSelectedPsy(null) }}
        />
      )}

      {/* Booking Modal */}
      {bookingPsy && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }} onClick={() => setBookingPsy(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--bg3)', border:'1px solid var(--border-h)', width:'min(520px,100%)', maxHeight:'90vh', overflowY:'auto', animation:'scaleIn .3s ease' }}>
            <div style={{ padding:'24px 32px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontSize:'1.35rem', fontWeight:400 }}>Randevu <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Talep Et</em></h3>
              <button onClick={() => setBookingPsy(null)} style={{ background:'none', border:'1px solid var(--border)', width:'32px', height:'32px', color:'var(--muted)', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'24px 32px' }}>
              <BookingModal psy={bookingPsy} onClose={() => setBookingPsy(null)} />
            </div>
          </div>
          <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}
    </div>
  )
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'28px' }}>
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>{title}</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'7px' }}>{children}</div>
      <div style={{ height:'1px', background:'var(--border)', marginTop:'20px' }} />
    </div>
  )
}
