'use client'

import { useState } from 'react'

const DAYS = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']
const HOURS = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 8
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2,'0')}:${m}`
}).filter(t => t <= '22:00')

interface Slot {
  id: string; slot_type: string; day_of_week: number | null
  specific_date: string | null; start_time: string; end_time: string
  session_type: string; is_active: boolean
}

interface Props { initialSlots: Slot[] }

export default function AvailabilityManager({ initialSlots }: Props) {
  const [slots, setSlots]       = useState<Slot[]>(initialSlots)
  const [tab, setTab]           = useState<'weekly' | 'specific'>('weekly')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Form state
  const [dayOfWeek,  setDayOfWeek]  = useState(0)
  const [specDate,   setSpecDate]   = useState('')
  const [startTime,  setStartTime]  = useState('09:00')
  const [endTime,    setEndTime]    = useState('17:00')
  const [sessType,   setSessType]   = useState('both')

  const weekly   = slots.filter(s => s.slot_type === 'weekly')
  const specific = slots.filter(s => s.slot_type === 'specific')

  async function addSlot() {
    if (tab === 'specific' && !specDate) { setError('Tarih seçin'); return }
    if (startTime >= endTime) { setError('Bitiş saati başlangıçtan sonra olmalı'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slot_type:     tab,
        day_of_week:   tab === 'weekly' ? dayOfWeek : null,
        specific_date: tab === 'specific' ? specDate : null,
        start_time:    startTime,
        end_time:      endTime,
        session_type:  sessType,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setSlots(prev => [...prev, data])
  }

  async function removeSlot(id: string) {
    await fetch('/api/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSlots(prev => prev.filter(s => s.id !== id))
  }

  const sessLabel = (t: string) =>
    t === 'online' ? 'Online' : t === 'yuz_yuze' ? 'Yüz Yüze' : 'Her İkisi'

  const inputSt: React.CSSProperties = {
    background:'rgba(255,255,255,.03)', border:'1px solid var(--border)',
    padding:'9px 12px', color:'var(--cream)', fontFamily:'Lora,serif',
    fontSize:'.88rem', outline:'none', appearance:'none',
  }
  const labelSt: React.CSSProperties = {
    display:'block', fontFamily:'Cormorant Garant,serif',
    fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase',
    color:'var(--gold-d)', marginBottom:'5px',
  }

  return (
    <div>
      {/* Tab */}
      <div style={{ display:'flex', gap:'0', marginBottom:'28px', borderBottom:'1px solid var(--border)' }}>
        {(['weekly','specific'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'10px 24px', fontFamily:'Cormorant Garant,serif', fontSize:'.9rem',
            background:'none', border:'none', cursor:'pointer',
            color: tab === t ? 'var(--gold)' : 'var(--muted)',
            borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom:'-1px', transition:'color .2s',
          }}>
            {t === 'weekly' ? '↻ Haftalık Tekrar' : '📅 Belirli Günler'}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'28px' }}>

        {/* Sol: Form */}
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'16px' }}>
            Yeni Slot Ekle
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {tab === 'weekly' ? (
              <div>
                <label style={labelSt}>Gün</label>
                <select style={{ ...inputSt, width:'100%', cursor:'pointer',
                  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:'32px' }}
                  value={dayOfWeek} onChange={e => setDayOfWeek(+e.target.value)}>
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label style={labelSt}>Tarih</label>
                <input type="date" style={{ ...inputSt, width:'100%' }}
                  value={specDate} onChange={e => setSpecDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <div>
                <label style={labelSt}>Başlangıç</label>
                <select style={{ ...inputSt, width:'100%', cursor:'pointer',
                  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:'32px' }}
                  value={startTime} onChange={e => setStartTime(e.target.value)}>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>Bitiş</label>
                <select style={{ ...inputSt, width:'100%', cursor:'pointer',
                  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:'32px' }}
                  value={endTime} onChange={e => setEndTime(e.target.value)}>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelSt}>Seans Türü</label>
              <div style={{ display:'flex', gap:'8px' }}>
                {[['both','Her İkisi'],['online','Online'],['yuz_yuze','Yüz Yüze']].map(([v,l]) => (
                  <button key={v} onClick={() => setSessType(v)}
                    style={{ flex:1, padding:'8px', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', border:`1px solid ${sessType === v ? 'var(--gold)' : 'var(--border)'}`, background: sessType === v ? 'rgba(201,169,110,.1)' : 'transparent', color: sessType === v ? 'var(--gold)' : 'var(--text)', cursor:'pointer', transition:'all .2s' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ padding:'9px 12px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--red)' }}>
                {error}
              </div>
            )}

            <button onClick={addSlot} disabled={loading} className="btn btn-gold btn-sm" style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Ekleniyor…' : '+ Slot Ekle'}
            </button>
          </div>
        </div>

        {/* Sağ: Mevcut slotlar */}
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'16px' }}>
            {tab === 'weekly' ? `Haftalık Slotlar (${weekly.length})` : `Özel Günler (${specific.length})`}
          </div>

          {(tab === 'weekly' ? weekly : specific).length === 0 ? (
            <div style={{ padding:'28px', border:'1px dashed var(--border)', textAlign:'center', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)' }}>
              Henüz slot eklenmemiş.
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {(tab === 'weekly'
                ? DAYS.map((_, i) => weekly.filter(s => s.day_of_week === i)).flat()
                : specific.sort((a, b) => (a.specific_date || '') > (b.specific_date || '') ? 1 : -1)
              ).map(slot => (
                <div key={slot.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', background:'var(--bg2)', border:'1px solid var(--border)' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--cream)', fontWeight:500 }}>
                      {slot.slot_type === 'weekly'
                        ? DAYS[slot.day_of_week ?? 0]
                        : new Date(slot.specific_date!).toLocaleDateString('tr-TR', { weekday:'short', day:'numeric', month:'short' })
                      }
                    </div>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
                      {slot.start_time.slice(0,5)} – {slot.end_time.slice(0,5)} · {sessLabel(slot.session_type)}
                    </div>
                  </div>
                  <button onClick={() => removeSlot(slot.id)} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'.9rem', padding:'4px 8px', transition:'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Haftalık özet */}
          {tab === 'weekly' && weekly.length > 0 && (
            <div style={{ marginTop:'16px', padding:'12px 16px', background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.15)', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
              ◈ &nbsp; Danışanlar randevu talep ederken bu saatleri görebilir.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
