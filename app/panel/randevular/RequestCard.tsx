'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  req: {
    id: string; token?: string; client_name?: string; client_email?: string
    session_type?: string; note?: string; preferred_dates?: any; status: string
    created_at: string
  }
}

export default function RequestCard({ req }: Props) {
  const router  = useRouter()
  const [loading, setLoading]   = useState<'accept'|'decline'|null>(null)
  const [msg, setMsg]           = useState('')
  const [sending, setSending]   = useState(false)
  const [showMsg, setShowMsg]   = useState(false)
  const [done, setDone]         = useState<string|null>(null)

  const trackingUrl = req.token ? `https://mekteb.vercel.app/randevu/${req.token}` : null

  async function handleStatus(status: 'accepted' | 'declined') {
    setLoading(status === 'accepted' ? 'accept' : 'decline')
    await fetch(`/api/admin/appointment-requests/${req.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    setDone(status)
    router.refresh()
  }

  async function sendMessage() {
    if (!msg.trim()) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: req.token, body: msg, sender: 'psychologist', request_id: req.id }),
    })
    setMsg('')
    setSending(false)
    setShowMsg(false)
    router.refresh()
  }

  return (
    <div style={{ marginBottom:'12px' }}>
      {/* Danışan bilgileri */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'8px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#2a1e30', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--cream)', flexShrink:0 }}>
            {(req.client_name || 'A').slice(0,1).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily:'Cormorant Garant,serif', color:'var(--cream)', fontSize:'.95rem' }}>
              {req.client_name || 'Anonim Danışan'}
            </div>
            {req.client_email && (
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>{req.client_email}</div>
            )}
          </div>
        </div>
        <span className={`badge ${req.session_type === 'online' ? 'badge-blue' : 'badge-muted'}`}>
          {req.session_type === 'online' ? 'Online' : req.session_type === 'yuz_yuze' ? 'Yüz Yüze' : 'Belirtilmemiş'}
        </span>
      </div>

      {req.note && (
        <p style={{ fontStyle:'italic', fontSize:'.85rem', color:'var(--text)', marginBottom:'8px', padding:'8px 12px', background:'rgba(255,255,255,.02)', border:'1px solid var(--border)' }}>
          &ldquo;{req.note}&rdquo;
        </p>
      )}

      {/* Tercih edilen tarih */}
      {req.preferred_dates?.[0]?.date && (
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)', marginBottom:'8px' }}>
          Tercih: {req.preferred_dates[0].date}
        </div>
      )}

      {/* Takip linki */}
      {trackingUrl && (
        <div style={{ padding:'8px 12px', background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.15)', marginBottom:'8px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', flexWrap:'wrap' }}>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>
            Danışan takip linki:
          </span>
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--gold-d)' }}>
              /randevu/{req.token?.slice(0,8)}…
            </span>
            <button
              onClick={() => navigator.clipboard?.writeText(trackingUrl)}
              className="btn btn-ghost btn-sm" style={{ fontSize:'.72rem', padding:'3px 8px' }}>
              Kopyala
            </button>
          </div>
        </div>
      )}

      {/* Aksiyonlar */}
      {done ? (
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color: done === 'accepted' ? 'var(--green)' : 'var(--red)' }}>
          {done === 'accepted' ? '✓ Onaylandı — danışan takip sayfasından görebilir' : '✕ Reddedildi'}
        </div>
      ) : (
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <button onClick={() => handleStatus('accepted')} disabled={!!loading} className="btn btn-gold btn-sm">
            {loading === 'accept' ? '…' : '✓ Onayla'}
          </button>
          <button onClick={() => setShowMsg(!showMsg)} disabled={!!loading} className="btn btn-outline btn-sm">
            💬 Mesaj Yaz
          </button>
          <button onClick={() => handleStatus('declined')} disabled={!!loading} className="btn btn-outline btn-sm"
            style={{ color:'var(--red)', borderColor:'rgba(201,110,110,.3)' }}>
            ✕ Reddet
          </button>
        </div>
      )}

      {/* Mesaj formu */}
      {showMsg && (
        <div style={{ marginTop:'10px', display:'flex', gap:'8px' }}>
          <textarea
            value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Danışana mesaj yazın (tarih önerisi, soru, Zoom linki vb.)"
            rows={2}
            style={{ flex:1, background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'8px 12px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.85rem', outline:'none', resize:'none' }}
          />
          <button onClick={sendMessage} disabled={sending || !msg.trim()} className="btn btn-gold btn-sm" style={{ alignSelf:'flex-end' }}>
            Gönder
          </button>
        </div>
      )}
    </div>
  )
}
