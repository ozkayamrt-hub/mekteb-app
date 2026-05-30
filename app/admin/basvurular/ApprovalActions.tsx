'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { id: string; tier: string }

export default function ApprovalActions({ id, tier }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

  async function handle(action: 'approve' | 'reject') {
    setLoading(action)
    const status = action === 'approve' ? 'active' : 'suspended'
    await fetch(`/api/admin/psychologists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setDone(action === 'approve' ? 'approved' : 'rejected')
    setLoading(null)
    setTimeout(() => router.refresh(), 800)
  }

  if (done) return (
    <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ color: done === 'approved' ? 'var(--green)' : 'var(--red)', fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem' }}>
        {done === 'approved' ? '✓ Başvuru onaylandı — psikolog aktif edildi' : '✕ Başvuru reddedildi'}
      </span>
    </div>
  )

  return (
    <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,.01)' }}>
      <button
        onClick={() => handle('approve')}
        disabled={!!loading}
        className="btn btn-gold btn-sm"
      >
        {loading === 'approve' ? 'Onaylanıyor…' : '✓ Onayla & Aktif Et'}
      </button>
      <button
        onClick={() => handle('reject')}
        disabled={!!loading}
        className="btn btn-outline btn-sm"
        style={{ borderColor: 'rgba(201,110,110,.4)', color: 'var(--red)' }}
      >
        {loading === 'reject' ? 'Reddediliyor…' : '✕ Reddet'}
      </button>
      <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)', marginLeft: 'auto' }}>
        Onaylanırsa <strong style={{ color: 'var(--cream)' }}>{tier === 'aday' ? '299₺' : tier === 'uzman' ? '599₺' : '999₺'}/ay</strong> aidat ödemeli olacak
      </span>
    </div>
  )
}
