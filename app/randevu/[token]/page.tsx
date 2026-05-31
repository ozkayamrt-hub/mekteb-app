'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Message { id: string; sender: string; body: string; created_at: string }
interface RequestData {
  id: string; status: string; client_name: string | null
  psychologist_name: string | null; psychologist_id: string; created_at: string
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  pending:  { label: 'Psikolog inceliyor',  color: 'var(--gold)',  icon: '◷' },
  accepted: { label: 'Onaylandı',           color: 'var(--green)', icon: '✓' },
  declined: { label: 'Reddedildi',          color: 'var(--red)',   icon: '✕' },
}

export default function RandevuTakipPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData]       = useState<{ request: RequestData; messages: Message[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [newMsg, setNewMsg]       = useState('')
  const [showRebook, setShowRebook] = useState(false)
  const [rebookNote, setRebookNote] = useState('')
  const [rebookSent, setRebookSent] = useState(false)
  const [rebookLoading, setRebookLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    const res  = await fetch(`/api/messages?token=${token}`)
    if (!res.ok) { setError('Talep bulunamadı. Link doğru mu?'); setLoading(false); return }
    const json = await res.json()
    setData(json)
    setLoading(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => { load() }, [token])

  async function sendMessage() {
    if (!newMsg.trim()) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, body: newMsg, sender: 'client' }),
    })
    setNewMsg('')
    setSending(false)
    load()
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:'Cormorant Garant,serif', color:'var(--gold)', fontSize:'1.1rem' }}>Yükleniyor…</div>
    </div>
  )

  if (error || !data) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px' }}>
      <div style={{ fontSize:'2rem' }}>🔍</div>
      <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', color:'var(--cream)' }}>Talep Bulunamadı</h2>
      <p style={{ fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>{error || 'Bu link geçersiz veya süresi dolmuş.'}</p>
      <Link href="/danisan" className="btn btn-outline btn-sm">Psikolog Aramaya Dön</Link>
    </div>
  )

  const { request, messages } = data
  const statusInfo = STATUS_MAP[request.status] || STATUS_MAP['pending']

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
          Mek<span style={{ color:'var(--gold)' }}>teb</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color: statusInfo.color }}>{statusInfo.icon}</span>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color: statusInfo.color }}>{statusInfo.label}</span>
        </div>
      </div>

      {/* Bilgi kartı */}
      <div style={{ padding:'24px', maxWidth:'700px', margin:'0 auto', width:'100%' }}>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'20px 24px', marginBottom:'16px' }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>
            Randevu Talebiniz
          </div>
          <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
            {request.client_name && (
              <div>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>Ad: </span>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--cream)' }}>{request.client_name}</span>
              </div>
            )}
            {request.psychologist_name && (
              <div>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>Psikolog: </span>
                <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--cream)' }}>{request.psychologist_name}</span>
              </div>
            )}
            <div>
              <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>Talep tarihi: </span>
              <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--cream)' }}>
                {new Date(request.created_at).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Gizlilik notu */}
        <div style={{ padding:'12px 16px', background:'rgba(110,201,138,.05)', border:'1px solid rgba(110,201,138,.18)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--text)', lineHeight:1.65, marginBottom:'20px' }}>
          🔒 &nbsp; Bu sayfa yalnızca bu bağlantıya sahip olanlar tarafından görülebilir. Kişisel bilgileriniz psikolog dışındakilerle paylaşılmaz.
        </div>
      </div>

      {/* Mesajlar */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 24px', maxWidth:'700px', margin:'0 auto', width:'100%' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0', fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'12px' }}>💬</div>
            <p>Henüz mesaj yok.</p>
            <p style={{ fontSize:'.85rem', marginTop:'6px' }}>Psikolog talebinizi inceleyip size mesaj yazacak.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px', paddingBottom:'16px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'client' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}>
                <div style={{
                  padding:'12px 16px',
                  background: msg.sender === 'client' ? 'rgba(201,169,110,.12)' : 'var(--bg2)',
                  border: `1px solid ${msg.sender === 'client' ? 'rgba(201,169,110,.3)' : 'var(--border)'}`,
                  borderRadius: '2px',
                }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', color:'var(--muted)', marginBottom:'5px' }}>
                    {msg.sender === 'client' ? 'Siz' : `Psikolog${request.psychologist_name ? ` (${request.psychologist_name})` : ''}`}
                  </div>
                  <p style={{ fontSize:'.92rem', color:'var(--cream)', lineHeight:1.65, whiteSpace:'pre-wrap' }}>{msg.body}</p>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', color:'var(--muted)', marginTop:'5px' }}>
                    {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit', day:'numeric', month:'short' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

          {/* Tekrar Randevu İste — onaylı seanslar için */}
      {request.status === 'accepted' && (
        <div style={{ padding:'0 24px', maxWidth:'700px', margin:'0 auto 12px', width:'100%' }}>
          {!showRebook && !rebookSent && (
            <button
              onClick={() => setShowRebook(true)}
              className="btn btn-outline btn-sm"
              style={{ width:'100%', justifyContent:'center', borderColor:'rgba(201,169,110,.3)', color:'var(--gold-d)' }}>
              ↻ Tekrar Randevu İste
            </button>
          )}

          {showRebook && !rebookSent && (
            <div style={{ background:'var(--bg2)', border:'1px solid rgba(201,169,110,.25)', padding:'18px 20px' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--cream)', fontWeight:500, marginBottom:'10px' }}>
                Yeni Seans Talebi
              </div>
              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--text)', marginBottom:'12px', lineHeight:1.6 }}>
                Tercih ettiğiniz tarih/saat veya kısa bir not yazın. Psikologunuz size dönecek.
              </p>
              <textarea
                value={rebookNote}
                onChange={e => setRebookNote(e.target.value)}
                placeholder="ör. Haftaya Salı öğleden sonra uygun, online seans tercih ederim"
                rows={3}
                style={{ width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 14px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', resize:'none', marginBottom:'10px', lineHeight:1.6 }}
              />
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setShowRebook(false)} className="btn btn-ghost btn-sm" style={{ flex:1, justifyContent:'center' }}>
                  İptal
                </button>
                <button
                  disabled={rebookLoading || !rebookNote.trim()}
                  className="btn btn-gold btn-sm"
                  style={{ flex:2, justifyContent:'center' }}
                  onClick={async () => {
                    setRebookLoading(true)
                    await fetch('/api/appointment-requests', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        psychologist_id:   request.psychologist_id,
                        psychologist_name: request.psychologist_name,
                        client_name:       request.client_name,
                        note:              `[Devam Seansı] ${rebookNote}`,
                        session_type:      null,
                      }),
                    })
                    setRebookLoading(false)
                    setShowRebook(false)
                    setRebookSent(true)
                  }}>
                  {rebookLoading ? '…' : 'Talebi Gönder →'}
                </button>
              </div>
            </div>
          )}

          {rebookSent && (
            <div style={{ padding:'14px 18px', background:'rgba(110,201,138,.06)', border:'1px solid rgba(110,201,138,.25)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--green)', textAlign:'center' }}>
              ✓ Yeni seans talebiniz psikologunuza iletildi.
            </div>
          )}
        </div>
      )}

      {/* Mesaj gönder */}
      {request.status !== 'declined' && (
        <div style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'16px 24px' }}>
          <div style={{ maxWidth:'700px', margin:'0 auto', display:'flex', gap:'10px' }}>
            <textarea
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Mesajınızı yazın… (Enter ile gönder)"
              rows={2}
              style={{ flex:1, background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 14px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.9rem', outline:'none', resize:'none', lineHeight:1.5 }}
            />
            <button onClick={sendMessage} disabled={sending || !newMsg.trim()} className="btn btn-gold btn-sm" style={{ alignSelf:'flex-end', padding:'12px 20px' }}>
              {sending ? '…' : 'Gönder'}
            </button>
          </div>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', textAlign:'center', marginTop:'8px' }}>
            Mesajlarınız yalnızca siz ve psikologunuz tarafından görülür.
          </p>
        </div>
      )}
    </div>
  )
}
