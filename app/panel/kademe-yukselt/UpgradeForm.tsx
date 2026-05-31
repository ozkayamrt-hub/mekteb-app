'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { nextTier: string; nextTierLabel: string; hasDiploma: boolean }

const CHECKLIST: Record<string, string[]> = {
  uzman: [
    'En az 3 yıl mesleki deneyimim var',
    'En az 50 tamamlanmış seans geçmişim var',
    'Geçerli lisans/yüksek lisans diplomam var ve sisteme ekledim',
    'Geçerli dernek üyeliğim var',
  ],
  ustat: [
    'En az 10 yıl mesleki deneyimim var',
    'En az 200 tamamlanmış seans geçmişim var (belgeleyebiliyorum)',
    'Yüksek Lisans veya Doktora diplomam var ve sisteme ekledim',
    'En az bir geçerli uzmanlık sertifikam var ve sisteme ekledim',
    'En az 1 yıldır Mekteb Uzman üyesiyim',
    'En az 2 aktif Üstat referansım var',
  ],
}

export default function UpgradeForm({ nextTier, nextTierLabel, hasDiploma }: Props) {
  const router = useRouter()
  const [checked, setChecked] = useState<boolean[]>(
    new Array((CHECKLIST[nextTier] ?? []).length).fill(false)
  )
  const [selfAssessment, setSelfAssessment] = useState('')
  const [loading, setLoading]  = useState(false)
  const [success, setSuccess]  = useState(false)
  const [error, setError]      = useState('')

  const allChecked = checked.every(Boolean)
  const items = CHECKLIST[nextTier] ?? []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allChecked) { setError('Tüm koşulları onaylamanız gerekiyor.'); return }
    if (selfAssessment.trim().length < 50) { setError('Öz değerlendirme en az 50 karakter olmalıdır.'); return }

    setLoading(true); setError('')
    const res = await fetch('/api/tier-upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestedTier: nextTier, selfAssessment }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Bir hata oluştu.'); return }
    setSuccess(true)
    setTimeout(() => router.refresh(), 1500)
  }

  if (success) return (
    <div style={{ padding:'32px', background:'rgba(110,201,138,.06)', border:'1px solid rgba(110,201,138,.25)', textAlign:'center' }}>
      <div style={{ fontSize:'2rem', color:'var(--green)', marginBottom:'12px' }}>✓</div>
      <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', color:'var(--cream)', marginBottom:'10px' }}>
        Başvurunuz alındı
      </h3>
      <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--text)' }}>
        Komite tarafından incelenecek. Ortalama değerlendirme süresi 7–14 gündür.
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>
        Koşulları Onaylayın
      </div>

      {/* Kontrol listesi */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'28px' }}>
        {items.map((item, i) => (
          <label key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px 16px', border:`1px solid ${checked[i] ? 'rgba(110,201,138,.3)' : 'var(--border)'}`, background: checked[i] ? 'rgba(110,201,138,.04)' : 'rgba(255,255,255,.02)', cursor:'pointer', transition:'all .2s' }}>
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={e => {
                const next = [...checked]; next[i] = e.target.checked; setChecked(next)
              }}
              style={{ width:'16px', height:'16px', flexShrink:0, marginTop:'2px', accentColor:'var(--green)', cursor:'pointer' }}
            />
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color: checked[i] ? 'var(--cream)' : 'var(--text)', lineHeight:1.5 }}>{item}</span>
          </label>
        ))}
      </div>

      {/* Öz değerlendirme */}
      <div style={{ marginBottom:'24px' }}>
        <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'8px' }}>
          Öz Değerlendirme <span style={{ color:'var(--gold)' }}>*</span>
        </label>
        <textarea
          className="form-input"
          value={selfAssessment}
          onChange={e => setSelfAssessment(e.target.value)}
          placeholder={nextTier === 'uzman'
            ? 'Mesleki deneyiminizi, tamamladığınız seans sayısını, çalışma tarzınızı ve neden Uzman kademesine geçmeye hazır olduğunuzu açıklayın…'
            : 'Mesleki yolculuğunuzu, uzmanlıklarınızı, mentörlük deneyimlerinizi ve neden Üstat kademesine geçmeye hazır olduğunuzu açıklayın. Referans Üstatlarınızı da belirtin…'
          }
          style={{ minHeight:'140px', resize:'vertical', lineHeight:1.75 }}
        />
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', color: selfAssessment.length < 50 && selfAssessment.length > 0 ? 'var(--red)' : 'var(--muted)', marginTop:'5px', display:'flex', justifyContent:'space-between' }}>
          <span>En az 50 karakter</span>
          <span>{selfAssessment.length} karakter</span>
        </div>
      </div>

      {/* Uyarı: diploma yoksa */}
      {!hasDiploma && (
        <div style={{ padding:'12px 16px', background:'rgba(201,110,110,.06)', border:'1px solid rgba(201,110,110,.25)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--red)', marginBottom:'18px' }}>
          ⚠ Sisteme onaylı belge eklenmemiş. Başvurunuz komite tarafından incelenebilir ancak belge olmadan onay almanız güçtür.
        </div>
      )}

      {error && (
        <div style={{ padding:'12px 16px', background:'rgba(201,110,110,.06)', border:'1px solid rgba(201,110,110,.25)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--red)', marginBottom:'18px' }}>
          {error}
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
        <button type="submit" disabled={loading || !allChecked} className="btn btn-gold btn-lg">
          {loading ? 'Gönderiliyor…' : `${nextTierLabel} Başvurusu Gönder →`}
        </button>
        {!allChecked && (
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>
            {checked.filter(Boolean).length}/{items.length} koşul onaylandı
          </span>
        )}
      </div>
    </form>
  )
}
