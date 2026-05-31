'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { id: string; status: string; contact?: string | null }

export default function FeedbackActions({ id, status, contact }: Props) {
  const router  = useRouter()
  const [note,    setNote]    = useState('')
  const [loading, setLoading] = useState(false)
  const [showNote, setShowNote] = useState(false)

  async function update(newStatus: string, adminNote?: string) {
    setLoading(true)
    await fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, admin_note: adminNote || null }),
    })
    setLoading(false)
    setShowNote(false)
    router.refresh()
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px', paddingTop:'12px', borderTop:'1px solid var(--border)' }}>
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
        {status === 'unread' && (
          <button onClick={() => update('read')} disabled={loading} className="btn btn-outline btn-sm">
            ✓ Okundu İşaretle
          </button>
        )}
        {contact && (
          <a href={`mailto:${contact}?subject=Mekteb - Görüşünüz Hakkında`}
            onClick={() => status !== 'replied' && update('replied')}
            className="btn btn-gold btn-sm">
            ✉ Yanıtla
          </a>
        )}
        <button onClick={() => setShowNote(!showNote)} disabled={loading} className="btn btn-ghost btn-sm">
          {showNote ? 'İptal' : '📌 Not Ekle'}
        </button>
      </div>

      {showNote && (
        <div style={{ display:'flex', gap:'8px' }}>
          <input
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="İç not (sadece siz görürsünüz)…"
            style={{ flex:1, background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'8px 12px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.85rem', outline:'none' }}
          />
          <button onClick={() => update(status, note)} disabled={loading || !note.trim()} className="btn btn-outline btn-sm">
            Kaydet
          </button>
        </div>
      )}
    </div>
  )
}
