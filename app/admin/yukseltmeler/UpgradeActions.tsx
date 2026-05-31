'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { id: string; psychologistId: string; requestedTier: string }

export default function UpgradeActions({ id, psychologistId, requestedTier }: Props) {
  const router = useRouter()
  const [note, setNote]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [showNote, setShowNote] = useState(false)

  async function handle(action: 'approve' | 'reject' | 'needs_info') {
    setLoading(true)

    if (action === 'approve') {
      // 1. Talebi onayla
      await fetch(`/api/admin/tier-upgrade/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', admin_note: note || null, reviewed_at: new Date().toISOString() }),
      })
      // 2. Psikologun tier'ını güncelle
      await fetch(`/api/admin/psychologists/${psychologistId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: requestedTier }),
      })
    } else {
      await fetch(`/api/admin/tier-upgrade/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'reject' ? 'rejected' : 'needs_info',
          admin_note: note || null,
          reviewed_at: new Date().toISOString(),
        }),
      })
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ padding:'16px 0' }}>
      {!showNote ? (
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <button onClick={() => handle('approve')} disabled={loading} className="btn btn-gold btn-sm">
            ✓ Onayla & Terfi Et
          </button>
          <button onClick={() => setShowNote(true)} disabled={loading} className="btn btn-outline btn-sm" style={{ color:'var(--red)', borderColor:'rgba(201,110,110,.3)' }}>
            ✕ Reddet
          </button>
          <button onClick={() => setShowNote(true)} disabled={loading} className="btn btn-outline btn-sm">
            ◈ Ek Bilgi İste
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Komite notu — psikologun göreceği açıklama…"
            style={{ width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 14px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', minHeight:'70px', resize:'vertical' }}
          />
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => handle('reject')} disabled={loading || !note.trim()} className="btn btn-outline btn-sm" style={{ color:'var(--red)', borderColor:'rgba(201,110,110,.3)' }}>
              {loading ? '…' : 'Reddet'}
            </button>
            <button onClick={() => handle('needs_info')} disabled={loading || !note.trim()} className="btn btn-outline btn-sm">
              {loading ? '…' : 'Ek Bilgi İste'}
            </button>
            <button onClick={() => setShowNote(false)} className="btn btn-ghost btn-sm">İptal</button>
          </div>
        </div>
      )}
    </div>
  )
}
