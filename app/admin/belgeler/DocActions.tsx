'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DocActions({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

  async function handle(action: 'approve' | 'reject') {
    setLoading(action)
    const status = action === 'approve' ? 'verified' : 'rejected'
    const body: Record<string, string> = { status }
    if (action === 'approve') body.verified_at = new Date().toISOString()

    await fetch(`/api/admin/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setDone(action === 'approve' ? 'approved' : 'rejected')
    setLoading(null)
    setTimeout(() => router.refresh(), 600)
  }

  if (done) return (
    <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color: done === 'approved' ? 'var(--green)' : 'var(--red)' }}>
      {done === 'approved' ? '✓ Onaylandı' : '✕ Reddedildi'}
    </span>
  )

  return (
    <div style={{ display:'flex', gap:'6px' }}>
      <button onClick={() => handle('approve')} disabled={!!loading} className="btn btn-gold btn-sm">Onayla</button>
      <button onClick={() => handle('reject')}  disabled={!!loading} className="btn btn-outline btn-sm" style={{ color:'var(--red)', borderColor:'rgba(201,110,110,.3)' }}>Reddet</button>
    </div>
  )
}
