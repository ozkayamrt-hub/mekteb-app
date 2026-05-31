'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { id: string; tier: string }

export default function ApprovalActions({ id, tier }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [done, setDone] = useState<{ action: 'approved' | 'rejected'; mentorAssigned?: boolean } | null>(null)

  async function handle(action: 'approve' | 'reject') {
    setLoading(action)
    const status = action === 'approve' ? 'active' : 'suspended'

    // 1. Psikolog statüsünü güncelle
    await fetch(`/api/admin/psychologists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    // 2. Aday ise otomatik mentor ata
    let mentorAssigned = false
    if (action === 'approve' && tier === 'aday') {
      const res = await fetch('/api/admin/assign-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menteeId: id }),
      })
      const data = await res.json()
      mentorAssigned = data.success === true
    }

    setDone({ action: action === 'approve' ? 'approved' : 'rejected', mentorAssigned })
    setLoading(null)
    setTimeout(() => router.refresh(), 1000)
  }

  if (done) return (
    <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ color: done.action === 'approved' ? 'var(--green)' : 'var(--red)', fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem' }}>
        {done.action === 'approved' ? '✓ Başvuru onaylandı — psikolog aktif edildi' : '✕ Başvuru reddedildi'}
      </span>
      {done.action === 'approved' && tier === 'aday' && (
        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: done.mentorAssigned ? 'var(--gold-d)' : 'var(--muted)' }}>
          {done.mentorAssigned
            ? '⬡ Mentor otomatik atandı'
            : '⚠ Aktif Üstat bulunamadı — mentor ataması beklemede'}
        </span>
      )}
    </div>
  )

  return (
    <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,.01)' }}>
      <button onClick={() => handle('approve')} disabled={!!loading} className="btn btn-gold btn-sm">
        {loading === 'approve' ? 'Onaylanıyor…' : '✓ Onayla & Aktif Et'}
      </button>
      <button onClick={() => handle('reject')} disabled={!!loading} className="btn btn-outline btn-sm"
        style={{ borderColor: 'rgba(201,110,110,.4)', color: 'var(--red)' }}>
        {loading === 'reject' ? 'Reddediliyor…' : '✕ Reddet'}
      </button>
      <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
          Onaylanırsa <strong style={{ color: 'var(--cream)' }}>{tier === 'aday' ? '499₺' : tier === 'uzman' ? '999₺' : '1.499₺'}/ay</strong>
        </span>
        {tier === 'aday' && (
          <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', color: 'var(--gold-d)' }}>
            ⬡ Mentor sistem tarafından otomatik atanır
          </span>
        )}
      </div>
    </div>
  )
}
