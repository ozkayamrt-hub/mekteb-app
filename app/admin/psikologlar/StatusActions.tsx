'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { id: string; status: string }

export default function StatusActions({ id, status }: Props) {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)

  async function update(newStatus: string) {
    setBusy(true)
    await fetch(`/api/admin/psychologists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setBusy(false)
    router.refresh()
  }

  if (status === 'pending') return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button onClick={() => update('active')} disabled={busy} className="btn btn-gold btn-sm">Onayla</button>
      <button onClick={() => update('suspended')} disabled={busy} className="btn btn-outline btn-sm" style={{ color: 'var(--red)', borderColor: 'rgba(201,110,110,.3)' }}>Reddet</button>
    </div>
  )

  if (status === 'active') return (
    <button onClick={() => update('suspended')} disabled={busy} className="btn btn-outline btn-sm" style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
      Askıya Al
    </button>
  )

  if (status === 'suspended') return (
    <button onClick={() => update('active')} disabled={busy} className="btn btn-outline btn-sm" style={{ fontSize: '.75rem', color: 'var(--green)' }}>
      Aktif Et
    </button>
  )

  return null
}
