'use client'

import { useState, useEffect } from 'react'

const SUBJECTS = [
  'Genel görüş veya öneri',
  'Teknik sorun bildirimi',
  'Yeni özellik isteği',
  'Psikolog kaydı hakkında soru',
  'Danışan desteği',
  'İşbirliği teklifi',
  'Basın & medya',
  'Diğer',
]

interface Props {
  open: boolean
  onClose: () => void
  pageUrl?: string
  userType?: 'visitor' | 'client' | 'psychologist'
}

export default function FeedbackModal({ open, onClose, pageUrl, userType = 'visitor' }: Props) {
  const [subject,  setSubject]  = useState('')
  const [message,  setMessage]  = useState('')
  const [contact,  setContact]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  // ESC ile kapat
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Scroll kilidi
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function reset() {
    setSubject(''); setMessage(''); setContact('')
    setError(''); setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject) { setError('Lütfen bir konu seçin.'); return }
    if (message.trim().length < 10) { setError('Mesaj en az 10 karakter olmalıdır.'); return }

    setLoading(true); setError('')
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject, message, contact: contact || null,
        page_url: pageUrl || (typeof window !== 'undefined' ? window.location.pathname : null),
        user_type: userType,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Bir hata oluştu.'); return }
    setSuccess(true)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:800, backdropFilter:'blur(3px)', animation:'fadeIn .25s ease' }}
      />

      {/* Modal */}
      <div style={{
        position:'fixed', bottom:'88px', right:'28px', zIndex:801,
        width:'min(440px, calc(100vw - 32px))',
        background:'var(--bg2)', border:'1px solid var(--border-h)',
        boxShadow:'0 24px 80px rgba(0,0,0,.5)',
        animation:'slideUp .3s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.15rem', fontWeight:500, color:'var(--cream)' }}>
              Görüş / İstek
            </h3>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', marginTop:'2px' }}>
              Ekibimiz en kısa sürede değerlendirir.
            </p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'1.2rem', lineHeight:1, padding:'4px', transition:'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
            ✕
          </button>
        </div>

        {success ? (
          /* Başarı */
          <div style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ fontSize:'2.2rem', color:'var(--green)', marginBottom:'14px' }}>✓</div>
            <h4 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.2rem', color:'var(--cream)', marginBottom:'8px' }}>
              Mesajınız alındı
            </h4>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)', lineHeight:1.65, marginBottom:'20px' }}>
              Görüşünüz için teşekkür ederiz. Ekibimiz inceleyecek.
            </p>
            <button onClick={() => { reset(); onClose(); }} className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}>
              Kapat
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} style={{ padding:'20px 24px' }}>
            {/* Konu */}
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>
                Konu <span style={{ color:'var(--gold)' }}>*</span>
              </label>
              <select
                value={subject} onChange={e => setSubject(e.target.value)}
                style={{ width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 32px 10px 12px', color: subject ? 'var(--cream)' : 'var(--muted)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', appearance:'none', cursor:'pointer', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center' }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                <option value="">Seçiniz…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Mesaj */}
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>
                Mesaj <span style={{ color:'var(--gold)' }}>*</span>
              </label>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Görüşünüzü veya isteğinizi yazın…"
                rows={4}
                style={{ width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 12px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', resize:'vertical', minHeight:'90px', lineHeight:1.65 }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', color:'var(--muted)', textAlign:'right', marginTop:'3px' }}>
                {message.length} karakter
              </div>
            </div>

            {/* İletişim (opsiyonel) */}
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>
                E-posta / Telefon <span style={{ color:'var(--muted)', fontSize:'.62rem', letterSpacing:'.04em', textTransform:'none' }}>yanıt almak için, isteğe bağlı</span>
              </label>
              <input
                type="text" value={contact} onChange={e => setContact(e.target.value)}
                placeholder="ornek@mail.com veya 05XX XXX XX XX"
                style={{ width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 12px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none' }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {error && (
              <div style={{ padding:'9px 12px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--red)', marginBottom:'12px' }}>
                {error}
              </div>
            )}

            <div style={{ display:'flex', gap:'10px' }}>
              <button type="button" onClick={() => { reset(); onClose(); }} className="btn btn-ghost btn-sm" style={{ flex:1, justifyContent:'center' }}>
                İptal
              </button>
              <button type="submit" disabled={loading} className="btn btn-gold btn-sm" style={{ flex:2, justifyContent:'center' }}>
                {loading ? 'Gönderiliyor…' : 'Gönder →'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  )
}
