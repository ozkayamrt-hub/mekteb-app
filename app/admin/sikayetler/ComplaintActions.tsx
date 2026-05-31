'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { id: string; currentStatus: string }

export default function ComplaintActions({ id, currentStatus }: Props) {
  const router  = useRouter()
  const [report, setReport]   = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function updateStatus(status: string, committeeReport?: string) {
    setLoading(true)
    await fetch(`/api/admin/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, committee_report: committeeReport }),
    })
    setLoading(false)
    setExpanded(false)
    router.refresh()
  }

  if (currentStatus === 'resolved' || currentStatus === 'dismissed') {
    return (
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)' }}>
        {currentStatus === 'resolved' ? '✓ Çözüme kavuşturuldu' : '— Reddedildi'}
      </div>
    )
  }

  return (
    <div style={{ borderTop:'1px solid var(--border)', paddingTop:'16px', marginTop:'4px' }}>
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom: expanded ? '14px' : '0' }}>
        {currentStatus === 'open' && (
          <button onClick={() => updateStatus('under_review')} disabled={loading} className="btn btn-gold btn-sm">
            İncelemeye Al
          </button>
        )}
        <button onClick={() => setExpanded(!expanded)} disabled={loading} className="btn btn-outline btn-sm">
          {expanded ? 'İptal' : 'Rapor Yaz & Kapat'}
        </button>
        <button onClick={() => updateStatus('dismissed')} disabled={loading} className="btn btn-ghost btn-sm" style={{ color:'var(--muted)', fontSize:'.78rem' }}>
          Reddet
        </button>
      </div>

      {expanded && (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <div>
            <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>
              Komite Raporu
            </label>
            <textarea
              value={report}
              onChange={e => setReport(e.target.value)}
              placeholder="Şikayetin inceleme sonucu ve alınan karar…"
              style={{ width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'10px 14px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', minHeight:'80px', resize:'vertical' }}
            />
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => updateStatus('resolved', report)} disabled={loading || !report.trim()} className="btn btn-gold btn-sm">
              {loading ? 'Kaydediliyor…' : 'Çözüldü Olarak Kapat'}
            </button>
            <button onClick={() => updateStatus('dismissed', report)} disabled={loading} className="btn btn-outline btn-sm" style={{ color:'var(--muted)' }}>
              Reddet & Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
