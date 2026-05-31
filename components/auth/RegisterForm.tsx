'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

/* ── Types ── */
type Tier = 'aday' | 'uzman' | 'ustat'
type Step = 1 | 2 | 3 | 4 | 5

interface Certificate {
  title: string; issuer: string; year: string; type: string
}

interface FormData {
  // Step 1
  firstName: string; lastName: string; email: string; password: string
  phone: string; city: string; linkedin: string
  // Step 2
  university: string; department: string; gradYear: string; expYears: string
  approach: string; specs: string[]
  // Step 3 — Sertifikalar
  certificates: Certificate[]
  // Step 4 — Kademe & Tercihler
  tier: Tier | ''; sessionTypes: string[]; weeklyCapacity: string; mentorPref: string; bio: string
  // Step 5
  agreeTerms: boolean; agreeEthics: boolean; agreeComm: boolean
}

const INIT: FormData = {
  firstName:'', lastName:'', email:'', password:'', phone:'', city:'', linkedin:'',
  university:'', department:'', gradYear:'', expYears:'', approach:'', specs:[],
  certificates:[],
  tier:'', sessionTypes:[], weeklyCapacity:'', mentorPref:'', bio:'',
  agreeTerms:false, agreeEthics:false, agreeComm:false,
}

const STEPS = [
  { label:'Kişisel Bilgiler',   sub:'Ad, iletişim' },
  { label:'Mesleki Bilgiler',   sub:'Deneyim, uzmanlık' },
  { label:'Belgeler',           sub:'Diploma, sertifikalar' },
  { label:'Kademe & Tercihler', sub:'Mentörlük, çalışma' },
  { label:'Onay',               sub:'İncele & gönder' },
]

const CITIES = ['İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Kayseri','Eskişehir','Trabzon','Gaziantep','Mersin','Diğer']
const DEPARTMENTS = ['Psikoloji','Klinik Psikoloji (Lisans)','Klinik Psikoloji (Yüksek Lisans)','Klinik Psikoloji (Doktora)','Psikolojik Danışmanlık','Diğer']
const APPROACHES = ['Bilişsel Davranışçı Terapi (BDT)','Psikanalitik / Psikodinamik','EMDR','Gestalt Terapisi','Şema Terapi','Kabul ve Kararlılık Terapisi (ACT)','Çözüm Odaklı Terapi','Varoluşçu Terapi','Entegratif / Eklektik','Diğer']
const ALL_SPECS = ['Depresyon','Anksiyete','Travma & TSSB','Çift Terapisi','Çocuk & Ergen','OKB','Yas & Kayıp','Bağımlılık','Yeme Bozuklukları','Kişilik Bozuklukları','Psikoz','Cinsel Sağlık','Kariyer & Tükenmişlik','Aile Terapisi']
const MENTOR_PREFS = [
  { val:'mentor_olmak',   label:'Mentor olmak istiyorum',       desc:'Aday psikologları yetiştirmek, seanslarıma almak istiyorum.' },
  { val:'mentor_istemek', label:'Mentor ile çalışmak istiyorum', desc:'Bir üstatın yönlendirmesiyle pratik kazanmak istiyorum.' },
  { val:'her_ikisi',      label:'Her ikisi',                    desc:'Hem mentor olabilir, hem de süpervizyon almaya açığım.' },
  { val:'hayir',          label:'Mentörlük istemiyorum',        desc:'Şimdilik yalnızca bağımsız çalışmayı tercih ediyorum.' },
]
const TIER_INFO = [
  { val:'aday'  as Tier, roman:'I',   name:'Aday',  sub:'Yeni Mezun',        price:'299₺', desc:'Mentor eşliğinde, güvenli ilk adımlar. 3–5 danışan kabulü.', maxExp:2 },
  { val:'uzman' as Tier, roman:'II',  name:'Uzman', sub:'Deneyimli Psikolog', price:'599₺', desc:'Bağımsız pratik, öncelikli eşleştirme, sınırsız danışan.', maxExp:9 },
  { val:'ustat' as Tier, roman:'III', name:'Üstat', sub:'Mentor & Otorite',   price:'999₺', desc:'Mentörlük yetkisi, ortak seans, Üstat rozeti ve karar komitesi.', maxExp:99 },
]

/* ── Shared field styles ── */
const fieldStyle: React.CSSProperties = {
  width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)',
  padding:'11px 16px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.93rem',
  outline:'none', appearance:'none' as const, transition:'border-color .25s',
}
const labelStyle: React.CSSProperties = {
  display:'block', fontFamily:'Cormorant Garant,serif',
  fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase' as const,
  color:'var(--gold-d)', marginBottom:'7px',
}

/* ── Field wrapper ── */
function Field({ label, req, hint, error, children }: { label:string; req?:boolean; hint?:string; error?:string; children:React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}{req && <span style={{ color:'var(--gold)', marginLeft:'2px' }}>*</span>}</label>
      {children}
      {hint && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', marginTop:'5px' }}>{hint}</div>}
      {error && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--red)', marginTop:'4px' }}>{error}</div>}
    </div>
  )
}

/* ── Select ── */
function Select({ value, onChange, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value} onChange={onChange}
      style={{ ...fieldStyle, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center', paddingRight:'36px', cursor:'pointer' }}
      onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      {...rest}
    >
      {children}
    </select>
  )
}

/* ── Input ── */
function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={fieldStyle}
      onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      {...props}
    />
  )
}

/* ══════════════════════════════════════════
   STEP 1 — Kişisel Bilgiler
══════════════════════════════════════════ */
function Step1({ data, set, errors }: { data:FormData; set:(k:keyof FormData, v:string)=>void; errors:Record<string,string> }) {
  return (
    <>
      <PanelHeader eyebrow="Adım 1 / 4" title={<>Sizi <em style={{ fontStyle:'italic', color:'var(--gold)' }}>tanıyalım</em></>} desc="Profilinizde görünecek temel bilgilerinizi girin." />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px' }}>
        <Field label="Ad" req error={errors.firstName}>
          <Input value={data.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Adınız" />
        </Field>
        <Field label="Soyad" req error={errors.lastName}>
          <Input value={data.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Soyadınız" />
        </Field>
        <Field label="E-posta" req error={errors.email}>
          <Input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="ornek@mail.com" />
        </Field>
        <Field label="Şifre" req error={errors.password} hint="En az 8 karakter, büyük harf ve rakam içermeli">
          <Input type="password" value={data.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
        </Field>
        <Field label="Telefon" req error={errors.phone}>
          <Input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="05XX XXX XX XX" />
        </Field>
        <Field label="Şehir" req error={errors.city}>
          <Select value={data.city} onChange={e => set('city', e.target.value)}>
            <option value="">Seçiniz</option>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <div style={{ gridColumn:'span 2' }}>
          <Field label="LinkedIn / Web Sitesi" hint="İsteğe bağlı">
            <Input value={data.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/…" />
          </Field>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════
   STEP 2 — Mesleki Bilgiler
══════════════════════════════════════════ */
function Step2({ data, set, setSpecs, errors }: { data:FormData; set:(k:keyof FormData, v:string)=>void; setSpecs:(s:string[])=>void; errors:Record<string,string> }) {
  const toggleSpec = (s: string) => {
    setSpecs(data.specs.includes(s) ? data.specs.filter(x => x !== s) : [...data.specs, s])
  }
  return (
    <>
      <PanelHeader eyebrow="Adım 2 / 4" title={<>Meslek <em style={{ fontStyle:'italic', color:'var(--gold)' }}>geçmişiniz</em></>} desc="Deneyiminize göre kademede yerinizi belirleyeceğiz." />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'28px' }}>
        <Field label="Mezun Olunan Üniversite" req error={errors.university}>
          <Input value={data.university} onChange={e => set('university', e.target.value)} placeholder="Üniversite adı" />
        </Field>
        <Field label="Bölüm" req error={errors.department}>
          <Select value={data.department} onChange={e => set('department', e.target.value)}>
            <option value="">Seçiniz</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </Select>
        </Field>
        <Field label="Mezuniyet Yılı" req error={errors.gradYear}>
          <Input type="number" value={data.gradYear} onChange={e => set('gradYear', e.target.value)} placeholder="2020" min="1980" max="2026" />
        </Field>
        <Field label="Toplam Deneyim (Yıl)" req error={errors.expYears}>
          <Select value={data.expYears} onChange={e => set('expYears', e.target.value)}>
            <option value="">Seçiniz</option>
            <option value="0">Yeni mezun (0–1 yıl)</option>
            <option value="2">1–2 yıl</option>
            <option value="3">3–4 yıl</option>
            <option value="5">5–7 yıl</option>
            <option value="8">8–9 yıl</option>
            <option value="10">10+ yıl</option>
          </Select>
        </Field>
        <div style={{ gridColumn:'span 2' }}>
          <Field label="Terapötik Yaklaşım" req error={errors.approach}>
            <Select value={data.approach} onChange={e => set('approach', e.target.value)}>
              <option value="">Seçiniz</option>
              {APPROACHES.map(a => <option key={a}>{a}</option>)}
            </Select>
          </Field>
        </div>
      </div>

      <Divider label="Uzmanlık Alanları" />
      {errors.specs && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--red)', marginBottom:'10px' }}>{errors.specs}</div>}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'9px' }}>
        {ALL_SPECS.map(s => (
          <span key={s} onClick={() => toggleSpec(s)} style={{
            padding:'6px 14px', border:`1px solid ${data.specs.includes(s) ? 'var(--gold)' : 'var(--border)'}`,
            background: data.specs.includes(s) ? 'rgba(201,169,110,.1)' : 'transparent',
            color: data.specs.includes(s) ? 'var(--gold)' : 'var(--text)',
            fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', cursor:'pointer', transition:'all .2s', userSelect:'none',
          }}>
            {s}
          </span>
        ))}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════
   STEP 3 — Belgeler (diploma, sertifika)
══════════════════════════════════════════ */
const DOC_TYPES = [
  { val:'diploma',      label:'Diploma (Lisans/Yüksek Lisans/Doktora)' },
  { val:'license',      label:'Çalışma Ruhsatı / Yetki Belgesi' },
  { val:'certificate',  label:'Uzmanlık Sertifikası (BDT, EMDR vb.)' },
  { val:'membership',   label:'Dernek / Oda Üyeliği' },
  { val:'supervision',  label:'Süpervizyon Tamamlama Belgesi' },
  { val:'other',        label:'Diğer' },
]

function Step3Docs({ data, setCerts }: { data:FormData; setCerts:(c:Certificate[])=>void }) {
  const addCert = () => setCerts([...data.certificates, { title:'', issuer:'', year:'', type:'diploma' }])
  const removeCert = (i: number) => setCerts(data.certificates.filter((_, idx) => idx !== i))
  const updateCert = (i: number, field: keyof Certificate, val: string) => {
    const updated = [...data.certificates]
    updated[i] = { ...updated[i], [field]: val }
    setCerts(updated)
  }

  return (
    <>
      <PanelHeader eyebrow="Adım 3 / 5" title={<>Belgelerinizi <em style={{ fontStyle:'italic', color:'var(--gold)' }}>ekleyin</em></>} desc="Diploma ve sertifikalarınız admin tarafından doğrulanır. Şu an URL veya bilgi girişi yapabilirsiniz — ilerleyen dönemde dosya yükleme aktif edilecek." />

      {/* Diploma zorunlu */}
      <div style={{ background:'rgba(201,169,110,.06)', border:'1px solid rgba(201,169,110,.18)', padding:'16px 20px', marginBottom:'28px', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)' }}>
        ◈ &nbsp; <strong style={{ color:'var(--cream)' }}>Diploma bilgisi zorunludur.</strong> Diğer belgeler isteğe bağlı olmakla birlikte Uzman/Üstat kademesine geçiş için gereklidir.
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
        {data.certificates.map((cert, i) => (
          <div key={i} style={{ padding:'24px', background:'var(--bg2)', border:'1px solid var(--border)', position:'relative' }}>
            <button onClick={() => removeCert(i)} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'1rem', lineHeight:1 }}>✕</button>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div style={{ gridColumn:'span 2' }}>
                <label style={labelStyle}>Belge Türü <span style={{ color:'var(--gold)' }}>*</span></label>
                <select style={{ ...fieldStyle, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center', paddingRight:'36px', cursor:'pointer' }}
                  value={cert.type} onChange={e => updateCert(i, 'type', e.target.value)}>
                  {DOC_TYPES.map(d => <option key={d.val} value={d.val}>{d.label}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'span 2' }}>
                <label style={labelStyle}>Belge Başlığı <span style={{ color:'var(--gold)' }}>*</span></label>
                <input style={fieldStyle} value={cert.title} onChange={e => updateCert(i, 'title', e.target.value)} placeholder='ör. "Klinik Psikoloji Yüksek Lisans Diploması"'
                  onFocus={e => (e.target.style.borderColor='var(--gold-d)')} onBlur={e => (e.target.style.borderColor='var(--border)')} />
              </div>
              <div>
                <label style={labelStyle}>Veren Kurum</label>
                <input style={fieldStyle} value={cert.issuer} onChange={e => updateCert(i, 'issuer', e.target.value)} placeholder='ör. "Boğaziçi Üniversitesi"'
                  onFocus={e => (e.target.style.borderColor='var(--gold-d)')} onBlur={e => (e.target.style.borderColor='var(--border)')} />
              </div>
              <div>
                <label style={labelStyle}>Veriliş Yılı</label>
                <input style={fieldStyle} type="number" value={cert.year} onChange={e => updateCert(i, 'year', e.target.value)} placeholder="2018"
                  onFocus={e => (e.target.style.borderColor='var(--gold-d)')} onBlur={e => (e.target.style.borderColor='var(--border)')} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addCert} className="btn btn-outline btn-sm" style={{ marginTop:'16px', width:'100%', justifyContent:'center' }}>
        + Belge / Sertifika Ekle
      </button>

      {data.certificates.length === 0 && (
        <div style={{ textAlign:'center', padding:'24px 0' }}>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)' }}>Henüz belge eklenmedi. Diploma bilginizi mutlaka ekleyin.</p>
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════
   STEP 4 — Kademe & Tercihler (eski Step 3)
══════════════════════════════════════════ */
function Step4Kademe({ data, set, setSessionTypes, errors }: { data:FormData; set:(k:keyof FormData, v:string)=>void; setSessionTypes:(s:string[])=>void; errors:Record<string,string> }) {
  const expN = parseInt(data.expYears) || 0
  const suggested: Tier = expN <= 2 ? 'aday' : expN < 10 ? 'uzman' : 'ustat'

  const toggleSession = (s: string) => {
    setSessionTypes(data.sessionTypes.includes(s) ? data.sessionTypes.filter(x => x !== s) : [...data.sessionTypes, s])
  }

  return (
    <>
      <PanelHeader eyebrow="Adım 4 / 5" title={<>Kademe & <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Tercihler</em></>} desc="Deneyiminize göre önerilen kademedeki yerinizi alın." />

      {/* Tier suggestion banner */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.07)', border:'1px solid rgba(201,169,110,.18)', padding:'12px 18px', marginBottom:'22px', fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--gold)' }}>
        ◈ &nbsp; Deneyiminize göre <strong style={{ marginLeft:'4px' }}>{suggested === 'aday' ? 'Aday' : suggested === 'uzman' ? 'Uzman' : 'Üstat'}</strong> kademesi önerilir.
      </div>

      {errors.tier && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--red)', marginBottom:'10px' }}>{errors.tier}</div>}

      {/* Tier cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'32px' }}>
        {TIER_INFO.map(t => (
          <div key={t.val} onClick={() => set('tier', t.val)} style={{
            border:`1px solid ${data.tier === t.val ? 'var(--gold)' : 'var(--border)'}`,
            background: data.tier === t.val ? 'var(--bg3)' : 'var(--bg2)',
            padding:'22px 18px', cursor:'pointer', transition:'all .25s', position:'relative',
          }}>
            {data.tier === t.val && <span style={{ position:'absolute', top:'10px', right:'12px', color:'var(--gold)', fontSize:'.85rem' }}>✓</span>}
            {suggested === t.val && <span style={{ position:'absolute', top:'-11px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'#090f0c', fontFamily:'Cormorant Garant,serif', fontSize:'.65rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', padding:'2px 10px', whiteSpace:'nowrap' }}>Önerilen</span>}
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2rem', color:'var(--gold)', lineHeight:1, marginBottom:'6px' }}>{t.roman}</div>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.1rem', color:'var(--cream)', fontWeight:500, marginBottom:'3px' }}>{t.name}</div>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'10px' }}>{t.sub}</div>
            <p style={{ fontSize:'.8rem', color:'var(--text)', lineHeight:1.55, marginBottom:'10px' }}>{t.desc}</p>
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold-d)', border:'1px solid var(--border-h)', padding:'2px 8px' }}>{t.price} / ay</span>
          </div>
        ))}
      </div>

      <Divider label="Çalışma Tercihleri" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'28px' }}>
        {/* Session type */}
        <div>
          <label style={labelStyle}>Seans Türü <span style={{ color:'var(--gold)' }}>*</span></label>
          {errors.sessionTypes && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--red)', marginBottom:'6px' }}>{errors.sessionTypes}</div>}
          <div style={{ display:'flex', gap:'9px' }}>
            {[['online','Online'],['yuz_yuze','Yüz Yüze']].map(([val, lbl]) => (
              <span key={val} onClick={() => toggleSession(val)} style={{
                flex:1, textAlign:'center', padding:'9px', border:`1px solid ${data.sessionTypes.includes(val) ? 'var(--gold)' : 'var(--border)'}`,
                background: data.sessionTypes.includes(val) ? 'rgba(201,169,110,.1)' : 'transparent',
                color: data.sessionTypes.includes(val) ? 'var(--gold)' : 'var(--text)',
                fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', cursor:'pointer', transition:'all .2s',
              }}>
                {lbl}
              </span>
            ))}
          </div>
        </div>
        <Field label="Haftalık Kapasite">
          <Select value={data.weeklyCapacity} onChange={e => set('weeklyCapacity', e.target.value)}>
            <option value="">Seçiniz</option>
            <option>1–5</option><option>6–10</option><option>11–15</option><option>15+</option>
          </Select>
        </Field>
      </div>

      <Divider label="Mentörlük" />
      {/* Mentor atama sistem tarafından otomatik yapılır */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', background:'rgba(201,169,110,.06)', border:'1px solid rgba(201,169,110,.18)', padding:'16px 20px', marginBottom:'20px' }}>
        <span style={{ color:'var(--gold)', fontSize:'1.1rem', flexShrink:0 }}>⬡</span>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--text)', lineHeight:1.65 }}>
          <strong style={{ color:'var(--cream)', display:'block', marginBottom:'4px' }}>Mentor ataması otomatiktir</strong>
          Aday kademesinde mentor zorunludur. Başvurunuz onaylandığında sistem, aktif Üstatlar arasında uygun olanı otomatik olarak atar. Herhangi bir seçim yapmanıza gerek yoktur.
        </div>
      </div>
      <div style={{ marginBottom:'28px' }}>
        <label style={{ ...labelStyle, marginBottom:'12px' }}>İleride mentor olmak ister misiniz?</label>
        <div style={{ display:'flex', gap:'12px' }}>
          {[
            { val:'evet', label:'Evet — ileride Üstat olarak mentor olmayı hedefliyorum' },
            { val:'hayir', label:'Şimdilik önceliğim kendi pratiğimi geliştirmek' },
          ].map(opt => (
            <label key={opt.val} style={{ flex:1, display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', padding:'12px 14px', border:`1px solid ${data.mentorPref === opt.val ? 'var(--gold)' : 'var(--border)'}`, background: data.mentorPref === opt.val ? 'rgba(201,169,110,.06)' : 'transparent', transition:'all .2s' }}>
              <input type="radio" name="mentor" value={opt.val} checked={data.mentorPref === opt.val} onChange={() => set('mentorPref', opt.val)} style={{ width:'15px', height:'15px', flexShrink:0, marginTop:'2px', accentColor:'var(--gold)', cursor:'pointer' }} />
              <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)', lineHeight:1.5 }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="Kısa Tanıtım" req error={errors.bio} hint="Danışanlara profilinizde gösterilir. Maksimum 300 karakter.">
        <textarea
          value={data.bio} onChange={e => set('bio', e.target.value.slice(0,300))}
          placeholder="Kendinizi ve çalışma tarzınızı birkaç cümleyle tanıtın…"
          style={{ ...fieldStyle, minHeight:'100px', resize:'vertical' as const }}
          onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', marginTop:'4px', textAlign:'right' }}>{data.bio.length} / 300</div>
      </Field>
    </>
  )
}

/* ══════════════════════════════════════════
   STEP 4 — Onay & İnceleme
══════════════════════════════════════════ */
function Step5Onay({ data, set, errors }: { data:FormData; set:(k:keyof FormData, v:string|boolean)=>void; errors:Record<string,string> }) {
  const tierInfo = TIER_INFO.find(t => t.val === data.tier)
  return (
    <>
      <PanelHeader eyebrow="Adım 5 / 5" title={<>İnceleyin & <em style={{ fontStyle:'italic', color:'var(--gold)' }}>onaylayın</em></>} desc="Bilgilerinizi kontrol edin. Başvurunuz 24 saat içinde incelenir." />

      {/* Review sections */}
      <ReviewSection title="Kişisel Bilgiler">
        <ReviewGrid rows={[
          ['Ad Soyad', `${data.firstName} ${data.lastName}`],
          ['E-posta', data.email],
          ['Telefon', data.phone],
          ['Şehir', data.city],
        ]} />
      </ReviewSection>

      <ReviewSection title="Mesleki Bilgiler">
        <ReviewGrid rows={[
          ['Üniversite', data.university],
          ['Bölüm', data.department],
          ['Mezuniyet', data.gradYear],
          ['Deneyim', data.expYears ? `${data.expYears}+ yıl` : ''],
          ['Yaklaşım', data.approach],
        ]} />
        {data.specs.length > 0 && (
          <div style={{ marginTop:'14px' }}>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', letterSpacing:'.06em', marginBottom:'8px' }}>Uzmanlık Alanları</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {data.specs.map(s => (
                <span key={s} style={{ padding:'3px 10px', border:'1px solid var(--border-h)', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </ReviewSection>

      <ReviewSection title="Kademe & Tercihler">
        <ReviewGrid rows={[
          ['Kademe', tierInfo ? `${tierInfo.roman} — ${tierInfo.name}` : ''],
          ['Aylık Aidat', tierInfo?.price ?? ''],
          ['Seans Türü', data.sessionTypes.map(s => s === 'online' ? 'Online' : 'Yüz Yüze').join(', ')],
        ]} />
        {data.bio && (
          <div style={{ marginTop:'12px', fontStyle:'italic', fontSize:'.88rem', color:'var(--text)', padding:'12px 16px', background:'rgba(255,255,255,.02)', border:'1px solid var(--border)' }}>
            &ldquo;{data.bio}&rdquo;
          </div>
        )}
      </ReviewSection>

      <div style={{ height:'1px', background:'var(--border)', margin:'28px 0' }} />

      {/* Agreements */}
      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        {errors.agree && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--red)' }}>{errors.agree}</div>}
        {[
          { key:'agreeTerms' as const, text:<>Kullanım Koşullarını ve Gizlilik Politikasını okudum, kabul ediyorum.</>, req:true },
          { key:'agreeEthics' as const, text:<>Mekteb Etik Kodeksini okudum; mesleğimi bu ilkeler çerçevesinde sürdürmeyi taahhüt ediyorum.</>, req:true },
          { key:'agreeComm' as const, text:<>Platform ile ilgili bilgilendirme e-postalarını almak istiyorum.</>, req:false },
        ].map(({ key, text, req }) => (
          <label key={key} style={{ display:'flex', alignItems:'flex-start', gap:'12px', cursor:'pointer' }}>
            <input type="checkbox" checked={data[key] as boolean} onChange={e => set(key, e.target.checked)} style={{ width:'16px', height:'16px', flexShrink:0, marginTop:'2px', accentColor:'var(--gold)', cursor:'pointer' }} />
            <span style={{ fontSize:'.9rem', color:'var(--text)', lineHeight:1.5 }}>
              {text}{req && <span style={{ color:'var(--gold)', marginLeft:'3px' }}>*</span>}
            </span>
          </label>
        ))}
      </div>
    </>
  )
}

/* ── Small helpers ── */
function ReviewSection({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:'22px' }}>
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px', paddingBottom:'8px', borderBottom:'1px solid var(--border)' }}>{title}</div>
      {children}
    </div>
  )
}
function ReviewGrid({ rows }: { rows:[string,string][] }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 28px' }}>
      {rows.filter(([,v]) => v).map(([l, v]) => (
        <div key={l}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', letterSpacing:'.06em', marginBottom:'2px' }}>{l}</div>
          <div style={{ fontSize:'.92rem', color:'var(--cream)' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
function PanelHeader({ eyebrow, title, desc }: { eyebrow:string; title:React.ReactNode; desc:string }) {
  return (
    <div style={{ marginBottom:'36px' }}>
      <div className="eyebrow" style={{ marginBottom:'8px' }}>{eyebrow}</div>
      <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.4rem)', fontWeight:400, marginBottom:'10px' }}>{title}</h2>
      <p style={{ color:'var(--text)', fontSize:'.95rem' }}>{desc}</p>
    </div>
  )
}
function Divider({ label }: { label:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'14px', margin:'24px 0 18px' }}>
      <div style={{ height:'1px', background:'var(--border)', flex:1 }} />
      <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', whiteSpace:'nowrap' }}>{label}</span>
      <div style={{ height:'1px', background:'var(--border)', flex:1 }} />
    </div>
  )
}

/* ══════════════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════════════ */
function SuccessScreen() {
  return (
    <div style={{ textAlign:'center', padding:'60px 40px', animation:'fadeUp .5s ease' }}>
      <div style={{ width:'72px', height:'72px', border:'1px solid var(--gold-d)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontSize:'1.8rem', color:'var(--gold)', boxShadow:'0 0 40px rgba(201,169,110,.12)' }}>✦</div>
      <h2 style={{ fontSize:'2.2rem', fontWeight:400, marginBottom:'16px' }}>Başvurunuz <em style={{ fontStyle:'italic', color:'var(--gold)' }}>alındı</em></h2>
      <p style={{ fontSize:'1rem', color:'var(--text)', maxWidth:'420px', margin:'0 auto 36px' }}>
        Mekteb ailesine hoş geldiniz. Başvurunuz ekibimiz tarafından inceleniyor — 24 saat içinde e-posta ile dönüş yapacağız.
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxWidth:'380px', margin:'0 auto 40px', textAlign:'left' }}>
        {[
          ['01','E-posta doğrulama bağlantısı gönderilecek — gelen kutunuzu kontrol edin.'],
          ['02','Ekibimiz başvurunuzu inceleyip kademede yerinizi onaylayacak.'],
          ['03','Profiliniz yayına girer, danışan eşleştirmesi başlar.'],
        ].map(([n, t]) => (
          <div key={n} style={{ display:'flex', gap:'14px', background:'var(--bg2)', border:'1px solid var(--border)', padding:'14px 18px' }}>
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.2rem', color:'var(--gold)', fontWeight:300, flexShrink:0 }}>{n}</span>
            <p style={{ fontSize:'.87rem', color:'var(--text)', margin:0 }}>{t}</p>
          </div>
        ))}
      </div>
      <Link href="/giris" className="btn btn-gold btn-md">Giriş Yap →</Link>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN REGISTER FORM
══════════════════════════════════════════ */
export default function RegisterForm() {
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<FormData>(INIT)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [apiError, setApiError] = useState('')

  const set = useCallback((k: keyof FormData, v: string | boolean) => {
    setData(prev => ({ ...prev, [k]: v }))
    setErrors(prev => { const n = { ...prev }; delete n[k as string]; return n })
  }, [])

  const setSpecs        = useCallback((s: string[]) => setData(prev => ({ ...prev, specs: s })), [])
  const setSessionTypes = useCallback((s: string[]) => setData(prev => ({ ...prev, sessionTypes: s })), [])
  const setCerts        = useCallback((c: Certificate[]) => setData(prev => ({ ...prev, certificates: c })), [])

  /* Validation */
  function validate(): boolean {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!data.firstName.trim()) e.firstName = 'Zorunlu alan'
      if (!data.lastName.trim()) e.lastName = 'Zorunlu alan'
      if (!data.email.match(/\S+@\S+\.\S+/)) e.email = 'Geçerli bir e-posta girin'
      if (data.password.length < 8) e.password = 'En az 8 karakter olmalı'
      if (!data.phone.trim()) e.phone = 'Zorunlu alan'
      if (!data.city) e.city = 'Şehir seçiniz'
    }
    if (step === 2) {
      if (!data.university.trim()) e.university = 'Zorunlu alan'
      if (!data.department) e.department = 'Zorunlu alan'
      if (!data.gradYear) e.gradYear = 'Zorunlu alan'
      if (!data.expYears) e.expYears = 'Zorunlu alan'
      if (!data.approach) e.approach = 'Zorunlu alan'
      if (data.specs.length === 0) e.specs = 'En az bir uzmanlık alanı seçin'
    }
    // Step 3: belgeler — diploma zorunlu
    if (step === 3) {
      const hasDiploma = data.certificates.some(c => c.type === 'diploma' && c.title.trim().length > 0)
      if (!hasDiploma) e.certs = 'En az bir diploma bilgisi girmelisiniz'
    }
    if (step === 4) {
      if (!data.tier) e.tier = 'Kademe seçiniz'
      if (data.sessionTypes.length === 0) e.sessionTypes = 'En az bir seans türü seçin'
      if (data.bio.trim().length < 10) e.bio = 'En az 10 karakter yazın'
    }
    if (step === 5) {
      if (!data.agreeTerms || !data.agreeEthics) e.agree = 'Zorunlu sözleşmeleri kabul etmeniz gerekiyor'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleNext() {
    if (!validate()) return
    if (step < 5) { setStep((step + 1) as Step); return }

    // Submit
    setLoading(true); setApiError('')
    try {
      const res = await fetch('/api/psychologists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:    data.firstName,
          lastName:     data.lastName,
          email:        data.email,
          password:     data.password,
          phone:        data.phone,
          city:         data.city,
          linkedin:     data.linkedin,
          university:   data.university,
          department:   data.department,
          gradYear:     parseInt(data.gradYear),
          expYears:     parseInt(data.expYears),
          approach:     data.approach,
          bio:          data.bio,
          sessionTypes: data.sessionTypes,
          weeklyCapacity: data.weeklyCapacity,
          mentorPref:   data.mentorPref,
          tier:         data.tier,
          specs:        data.specs,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setApiError(json.error ?? 'Bir hata oluştu'); return }
      setDone(true)
    } catch {
      setApiError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const progressPct = (step / 5) * 100

  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', minHeight:'100vh' }}>

      {/* ── Sidebar ── */}
      <aside style={{ background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'48px 32px', position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>
        <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none', display:'block', marginBottom:'48px' }}>
          Mek<span style={{ color:'var(--gold)' }}>teb</span>
        </Link>

        {/* Steps */}
        <nav style={{ flex:1 }}>
          {STEPS.map((s, i) => {
            const n = i + 1
            const isActive = step === n
            const isDone = step > n
            return (
              <div key={n} style={{ display:'flex', alignItems:'flex-start', gap:'16px', marginBottom:'28px', opacity: isActive ? 1 : isDone ? .65 : .3, transition:'opacity .3s' }}>
                <div style={{
                  width:'32px', height:'32px', borderRadius:'50%', flexShrink:0,
                  border:`1px solid ${isActive ? 'transparent' : 'var(--gold-d)'}`,
                  background: isActive ? 'var(--gold)' : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Cormorant Garant,serif', fontSize:'.88rem',
                  color: isActive ? '#090f0c' : 'var(--gold)',
                  boxShadow: isActive ? '0 0 20px rgba(201,169,110,.25)' : 'none',
                  position:'relative',
                }}>
                  {isDone ? '✓' : n}
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div style={{ position:'absolute', top:'32px', left:'50%', transform:'translateX(-50%)', width:'1px', height:'28px', background: isDone ? 'var(--gold-d)' : 'var(--border)' }} />
                  )}
                </div>
                <div style={{ paddingTop:'4px' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--cream)', fontWeight:500 }}>{s.label}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', letterSpacing:'.06em' }}>{s.sub}</div>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Quote */}
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'24px' }}>
          <blockquote style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', fontStyle:'italic', color:'var(--text)', fontWeight:300, lineHeight:1.6 }}>
            &ldquo;Bir ustanın en büyük mirası, yetiştirdiği zihinlerdir.&rdquo;
          </blockquote>
          <cite style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--gold-d)', letterSpacing:'.1em', textTransform:'uppercase', marginTop:'10px', fontStyle:'normal' }}>— Mekteb Felsefesi</cite>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ overflow:'auto', display:'flex', flexDirection:'column' }}>
        {/* Progress bar */}
        <div style={{ height:'2px', background:'var(--border)', flexShrink:0, position:'relative' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,var(--gold-d),var(--gold))', width:`${progressPct}%`, transition:'width .5s cubic-bezier(.4,0,.2,1)' }} />
        </div>

        <div style={{ flex:1, padding:'52px 72px 52px 72px', maxWidth:'760px' }}>
          {done ? <SuccessScreen /> : (
            <>
              {/* Form content */}
              {step === 1 && <Step1 data={data} set={set} errors={errors} />}
              {step === 2 && <Step2 data={data} set={set} setSpecs={setSpecs} errors={errors} />}
              {step === 3 && <Step3Docs data={data} setCerts={setCerts} />}
              {step === 4 && <Step4Kademe data={data} set={set} setSessionTypes={setSessionTypes} errors={errors} />}
              {step === 5 && <Step5Onay data={data} set={set} errors={errors} />}

              {/* API error */}
              {apiError && (
                <div style={{ marginTop:'16px', padding:'12px 16px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--red)' }}>
                  {apiError}
                </div>
              )}

              {/* Navigation */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'48px', paddingTop:'28px', borderTop:'1px solid var(--border)' }}>
                <button
                  onClick={() => setStep((step - 1) as Step)}
                  disabled={step === 1}
                  className="btn btn-outline btn-md"
                >
                  ← Geri
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="btn btn-gold btn-md"
                >
                  {loading ? 'Gönderiliyor…' : step === 5 ? 'Başvuruyu Gönder ✦' : 'İleri →'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
