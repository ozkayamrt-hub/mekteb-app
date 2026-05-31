'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { clientId: string; clientName: string; currentStatus: string }

export default function ClientActions({ clientId, clientName, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading]   = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [note, setNote]         = useState('')

  async function updateStatus(status: string) {
    setLoading(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    router.refresh()
  }

  async function incrementSession() {
    setLoading(true)
    await fetch(`/api/clients/${clientId}/session`, { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  async function saveNote() {
    if (!note.trim()) return
    setLoading(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: note }),
    })
    setLoading(false)
    setNote('')
    setShowNote(false)
    router.refresh()
  }

  return (
    <>
      <button onClick={incrementSession} disabled={loading} className="btn btn-gold btn-sm">
        + Seans Tamamlandı
      </button>
      <button onClick={() => setShowNote(!showNote)} disabled={loading} className="btn btn-outline btn-sm">
        📝 Not
      </button>
      {currentStatus === 'active'
        ? <button onClick={() => updateStatus('passive')} disabled={loading} className="btn btn-ghost btn-sm" style={{ color:'var(--muted)', fontSize:'.78rem' }}>Pasife Al</button>
        : <button onClick={() => updateStatus('active')}  disabled={loading} className="btn btn-ghost btn-sm" style={{ color:'var(--green)', fontSize:'.78rem' }}>Aktife Al</button>
      }

      {showNote && (
        <div style={{ width:'100%', marginTop:'8px', display:'flex', gap:'8px' }}>
          <input
            value={note} onChange={e => setNote(e.target.value)}
            placeholder={`${clientName} hakkında not…`}
            style={{ flex:1, background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'8px 12px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.85rem', outline:'none' }}
          />
          <button onClick={saveNote} disabled={loading || !note.trim()} className="btn btn-gold btn-sm">Kaydet</button>
        </div>
      )}
    </>
  )
}
