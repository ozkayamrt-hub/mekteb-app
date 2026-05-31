'use client'

import { useState } from 'react'

const DAYS = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']
const HOURS = Array.from({ length: 29 }, (_, i) => {
  const h = Math.floor(i / 2) + 8
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2,'0')}:${m}`
}).filter(t => t <= '22:00')

interface Block {
  id: string
  block_type: string
  day_of_week: number | null
  specific_date: string | null
  start_time: string | null
  end_time: string | null
  reason: string | null
}

interface Props { initialBlocks: Block[] }

export default function AvailabilityManager({ initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [tab, setTab]       = useState<'weekly' | 'specific'>('weekly')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Form
  const [selDay,    setSelDay]    = useState<number[]>([])   // çoklu gün seçimi
  const [specDate,  setSpecDate]  = useState('')
  const [allDay,    setAllDay]    = useState(true)
  const [startTime, setStartTime] = useState('08:00')
  const [endTime,   setEndTime]   = useState('22:00')
  const [reason,    setReason]    = useState('')

  const weeklyBlocks   = blocks.filter(b => b.block_type === 'weekly')
  const specificBlocks = blocks.filter(b => b.block_type === 'specific')

  function toggleDay(d: number) {
    setSelDay(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  async function addBlock() {
    setError('')
    if (tab === 'weekly' && selDay.length === 0) { setError('En az bir gün seçin'); return }
    if (tab === 'specific' && !specDate) { setError('Tarih seçin'); return }
    if (!allDay && startTime >= endTime) { setError('Bitiş saati başlangıçtan sonra olmalı'); return }

    setLoading(true)

    const daysToAdd = tab === 'weekly' ? selDay : [null]

    for (const day of daysToAdd) {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_type:    tab,
          day_of_week:   day,
          specific_date: tab === 'specific' ? specDate : null,
          start_time:    allDay ? null : startTime,
          end_time:      allDay ? null : endTime,
          reason:        reason || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setBlocks(prev => [...prev, data])
    }

    setLoading(false)
    setSelDay([])
    setSpecDate('')
    setReason('')
    setAllDay(true)
  }

  async function removeBlock(id: string) {
    await fetch('/api/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  function blockLabel(b: Block) {
    const time = b.start_time && b.end_time
      ? `${b.start_time.slice(0,5)} – ${b.end_time.slice(0,5)}`
      : 'Tüm gün'
    return time
  }

  // Haftalık grid görünümü
  const blocksByDay = DAYS.map((_, i) => weeklyBlocks.filter(b => b.day_of_week === i))

  const inputSt: React.CSSProperties = { background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'9px 12px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.88rem', outline:'none', appearance:'none' }
  const labelSt: React.CSSProperties = { display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'5px' }
  const selSt = (sel: boolean): React.CSSProperties => ({
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:'32px', cursor:'pointer',
  })

  return (
    <div>
      {/* Açıklama */}
      <div style={{ padding:'16px 20px', background:'rgba(110,201,138,.05)', border:'1px solid rgba(110,201,138,.18)', marginBottom:'28px', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)', lineHeight:1.65 }}>
        ✓ &nbsp; Takviminiz <strong style={{ color:'var(--cream)' }}>varsayılan olarak tamamen açık</strong>tır. Müsait olmadığınız gün veya saatleri aşağıdan kapatın.
      </div>

      {/* Tab */}
      <div style={{ display:'flex', gap:'0', marginBottom:'24px', borderBottom:'1px solid var(--border)' }}>
        {(['weekly','specific'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'10px 24px', fontFamily:'Cormorant Garant,serif', fontSize:'.9rem',
            background:'none', border:'none', cursor:'pointer',
            color: tab === t ? 'var(--gold)' : 'var(--muted)',
            borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom:'-1px',
          }}>
            {t === 'weekly' ? '↻ Her Hafta Kapalı' : '📅 Belirli Gün/Tarih'}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'28px' }}>

        {/* Sol: Form */}
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'24px', alignSelf:'start' }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'18px' }}>
            {tab === 'weekly' ? 'Kapalı Gün Ekle' : 'Kapalı Tarih Ekle'}
          </div>

          {tab === 'weekly' ? (
            <div style={{ marginBottom:'16px' }}>
              <label style={labelSt}>Gün(ler) — birden fazla seçebilirsiniz</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {DAYS.map((d, i) => (
                  <button key={i} onClick={() => toggleDay(i)} style={{
                    padding:'6px 12px', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem',
                    border:`1px solid ${selDay.includes(i) ? 'var(--red)' : 'var(--border)'}`,
                    background: selDay.includes(i) ? 'rgba(201,110,110,.12)' : 'transparent',
                    color: selDay.includes(i) ? 'var(--red)' : 'var(--text)',
                    cursor:'pointer', transition:'all .2s',
                  }}>
                    {d.slice(0,3)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom:'16px' }}>
              <label style={labelSt}>Tarih</label>
              <input type="date" style={{ ...inputSt, width:'100%' }}
                value={specDate} onChange={e => setSpecDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
            </div>
          )}

          {/* Tüm gün mü, saat aralığı mı */}
          <div style={{ marginBottom:'16px' }}>
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setAllDay(v)} style={{
                  flex:1, padding:'8px', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem',
                  border:`1px solid ${allDay === v ? 'rgba(201,110,110,.4)' : 'var(--border)'}`,
                  background: allDay === v ? 'rgba(201,110,110,.08)' : 'transparent',
                  color: allDay === v ? 'var(--red)' : 'var(--text)',
                  cursor:'pointer', transition:'all .2s',
                }}>
                  {v ? 'Tüm Gün' : 'Saat Aralığı'}
                </button>
              ))}
            </div>

            {!allDay && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <div>
                  <label style={labelSt}>Başlangıç</label>
                  <select style={{ ...inputSt, ...selSt(true), width:'100%' }}
                    value={startTime} onChange={e => setStartTime(e.target.value)}>
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Bitiş</label>
                  <select style={{ ...inputSt, ...selSt(true), width:'100%' }}
                    value={endTime} onChange={e => setEndTime(e.target.value)}>
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={labelSt}>Açıklama (isteğe bağlı)</label>
            <input style={{ ...inputSt, width:'100%' }} value={reason}
              onChange={e => setReason(e.target.value)} placeholder='ör. "Tatil", "Özel"'
              onFocus={e => (e.target.style.borderColor='var(--gold-d)')}
              onBlur={e => (e.target.style.borderColor='var(--border)')} />
          </div>

          {error && (
            <div style={{ padding:'9px 12px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--red)', marginBottom:'12px' }}>
              {error}
            </div>
          )}

          <button onClick={addBlock} disabled={loading} className="btn btn-outline btn-sm"
            style={{ width:'100%', justifyContent:'center', borderColor:'rgba(201,110,110,.4)', color:'var(--red)' }}>
            {loading ? 'Kaydediliyor…' : '✕ Kapat'}
          </button>
        </div>

        {/* Sağ: Görünüm */}
        <div>
          {tab === 'weekly' ? (
            <div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>
                Haftalık Kapalı Günler
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'8px' }}>
                {DAYS.map((day, i) => {
                  const dayBlocks = blocksByDay[i]
                  const isClosed = dayBlocks.length > 0
                  return (
                    <div key={i} style={{ border:`1px solid ${isClosed ? 'rgba(201,110,110,.35)' : 'var(--border)'}`, background: isClosed ? 'rgba(201,110,110,.06)' : 'rgba(110,201,138,.04)', padding:'12px 8px', textAlign:'center', minHeight:'80px' }}>
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color: isClosed ? 'var(--red)' : 'var(--green)', fontWeight:500, marginBottom:'6px' }}>
                        {day.slice(0,3)}
                      </div>
                      {isClosed ? (
                        dayBlocks.map(b => (
                          <div key={b.id} style={{ marginBottom:'4px' }}>
                            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.65rem', color:'var(--red)' }}>{blockLabel(b)}</div>
                            <button onClick={() => removeBlock(b.id)}
                              style={{ background:'none', border:'none', color:'rgba(201,110,110,.6)', cursor:'pointer', fontSize:'.7rem', padding:'0' }}>
                              ✕ kaldır
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.65rem', color:'var(--green)', opacity:.7 }}>Açık</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'14px' }}>
                Kapalı Tarihler ({specificBlocks.length})
              </div>
              {specificBlocks.length === 0 ? (
                <div style={{ padding:'28px', border:'1px dashed var(--border)', textAlign:'center', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)' }}>
                  Kapalı tarih yok — tüm tarihler açık
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {specificBlocks
                    .sort((a, b) => (a.specific_date || '') > (b.specific_date || '') ? 1 : -1)
                    .map(b => (
                      <div key={b.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', background:'rgba(201,110,110,.06)', border:'1px solid rgba(201,110,110,.25)' }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.92rem', color:'var(--cream)', fontWeight:500 }}>
                            {new Date(b.specific_date! + 'T12:00:00').toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                          </div>
                          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--red)' }}>
                            {blockLabel(b)}{b.reason ? ` · ${b.reason}` : ''}
                          </div>
                        </div>
                        <button onClick={() => removeBlock(b.id)}
                          style={{ background:'none', border:'1px solid rgba(201,110,110,.3)', color:'var(--red)', cursor:'pointer', padding:'5px 12px', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', transition:'all .2s' }}>
                          Kaldır
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
