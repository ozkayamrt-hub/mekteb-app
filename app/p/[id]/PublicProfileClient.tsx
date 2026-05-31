'use client'

import { useState, useMemo } from 'react'

interface Props { psyId: string; psyName: string; psyApproach: string }

export default function PublicProfileClient({ psyId, psyName, psyApproach }: Props) {
  const [open, setOpen]           = useState(false)
  const [selectedSlot, setSlot]   = useState<number | null>(null)
  const [name, setName]           = useState('')
  const [sessionType, setSession] = useState('')
  const [note, setNote]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [token, setToken]         = useState('')
  const [done, setDone]           = useState(false)

  const slots = useMemo(() => {
    const result = [], d = new Date()
    d.setDate(d.getDate() + 1)
    const days = ['Pzt','Sal','Çar','Per','Cum']
    const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
    const times = ['10:00','13:00','16:00']
    while (result.length < 6) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        result.push({ day: days[d.getDay()-1], date: `${d.getDate()} ${months[d.getMonth()]}`, time: times[result.length % 3] })
      }
      d.setDate(d.getDate() + 1)
    }
    return result
  }, [])

  async function submit() {
    setLoading(true)
    const res = await fetch('/api/appointment-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        psychologist_id:   psyId,
        psychologist_name: psyName,
        client_name:       name || null,
        session_type:      sessionType === 'Online' ? 'online' : sessionType === 'Yüz Yüze' ? 'yuz_yuze' : null,
        preferred_dates:   selectedSlot !== null ? [{ date: `${slots[selectedSlot].day} ${slots[selectedSlot].date} ${slots[selectedSlot].time}`, time: '' }] : null,
        note:              note || null,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.token) setToken(data.token)
    setDone(true)
  }

  const iSt: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 14px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', appearance:'none' }

  if (done) return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:'12px' }}>✦</div>
      <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.2rem', fontWeight:400, marginBottom:'10px' }}>Talebiniz Alındı</h3>
      {token && (
        <div style={{ background:'rgba(201,169,110,.08)', border:'1px solid rgba(201,169,110,.25)', padding:'12px', marginBottom:'12px' }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--gold-d)', marginBottom:'6px' }}>Takip Linkiniz</div>
          <button onClick={() => navigator.clipboard?.writeText(`https://mekteb.vercel.app/randevu/${token}`)}
            className="btn btn-gold btn-sm" style={{ width:'100%', justifyContent:'center', fontSize:'.82rem' }}>
            🔗 Linki Kopyala
          </button>
        </div>
      )}
      <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)', lineHeight:1.6 }}>
        Bu linkten talebi takip edebilir, psikologla mesajlaşabilirsiniz.
      </p>
    </div>
  )

  if (!open) return (
    <button onClick={() => setOpen(true)} className="btn btn-gold" style={{ width:'100%', justifyContent:'center', fontSize:'1rem', padding:'14px' }}>
      Randevu Talep Et →
    </button>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--text)', padding:'10px 14px', background:'rgba(110,201,138,.05)', border:'1px solid rgba(110,201,138,.15)' }}>
        🔒 Ad vermek zorunda değilsiniz. Mesajlaşma platform üzerinden, KVKK kapsamında.
      </div>

      {/* Tarih */}
      <div>
        <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>Tercih Ettiğiniz Tarih</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px' }}>
          {slots.map((s, i) => (
            <div key={i} onClick={() => setSlot(i)} style={{ border:`1px solid ${selectedSlot===i ? 'var(--gold)' : 'var(--border)'}`, background: selectedSlot===i ? 'rgba(201,169,110,.1)' : 'transparent', padding:'8px 6px', textAlign:'center', cursor:'pointer' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.65rem', color:'var(--muted)', textTransform:'uppercase' }}>{s.day}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--cream)' }}>{s.date}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--gold-d)' }}>{s.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
        <div>
          <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'5px' }}>Ad (opsiyonel)</label>
          <input style={iSt} value={name} onChange={e => setName(e.target.value)} placeholder="Takma ad olabilir"
            onFocus={e => (e.target.style.borderColor='var(--gold-d)')} onBlur={e => (e.target.style.borderColor='var(--border)')} />
        </div>
        <div>
          <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'5px' }}>Seans Türü</label>
          <select style={{ ...iSt, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', paddingRight:'28px', cursor:'pointer' }}
            value={sessionType} onChange={e => setSession(e.target.value)}>
            <option value="">Seçiniz</option>
            <option>Online</option>
            <option>Yüz Yüze</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'5px' }}>Not (opsiyonel)</label>
        <textarea style={{ ...iSt, resize:'vertical', minHeight:'70px', lineHeight:1.6 }} value={note} onChange={e => setNote(e.target.value)}
          placeholder="Kısaca neden destek almak istediğinizi paylaşabilirsiniz…"
          onFocus={e => (e.target.style.borderColor='var(--gold-d)')} onBlur={e => (e.target.style.borderColor='var(--border)')} />
      </div>

      <div style={{ display:'flex', gap:'8px' }}>
        <button onClick={() => setOpen(false)} className="btn btn-outline btn-sm" style={{ flex:1, justifyContent:'center' }}>İptal</button>
        <button onClick={submit} disabled={loading} className="btn btn-gold btn-sm" style={{ flex:2, justifyContent:'center' }}>
          {loading ? 'Gönderiliyor…' : 'Talebi Gönder →'}
        </button>
      </div>
    </div>
  )
}
