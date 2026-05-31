'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const DOC_TYPES = [
  { val: 'diploma',     label: 'Diploma (Lisans/Y.L./Doktora)' },
  { val: 'license',     label: 'Çalışma Ruhsatı' },
  { val: 'certificate', label: 'Uzmanlık Sertifikası' },
  { val: 'membership',  label: 'Dernek / Oda Üyeliği' },
  { val: 'supervision', label: 'Süpervizyon Belgesi' },
  { val: 'other',       label: 'Diğer' },
]

interface Props {
  userId: string
  onUploaded: () => void
}

export default function DocumentUpload({ userId, onUploaded }: Props) {
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [docType,  setDocType]  = useState('diploma')
  const [title,    setTitle]    = useState('')
  const [issuer,   setIssuer]   = useState('')
  const [year,     setYear]     = useState('')
  const [file,     setFile]     = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError('Dosya boyutu 5MB\'ı geçemez.'); return }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowed.includes(f.type)) { setError('Yalnızca PDF, JPG veya PNG yükleyebilirsiniz.'); return }
    setFile(f)
    setError('')
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
  }

  async function handleUpload() {
    if (!file) { setError('Lütfen bir dosya seçin.'); return }
    if (!title.trim()) { setError('Belge başlığı zorunludur.'); return }

    setLoading(true); setError(''); setProgress(10)

    const ext      = file.name.split('.').pop()
    const safeName = title.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
    const path     = `${userId}/${docType}/${Date.now()}_${safeName}.${ext}`

    // Upload to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from('psikolog-belgeleri')
      .upload(path, file, { upsert: false })

    if (uploadErr) { setError(uploadErr.message); setLoading(false); return }
    setProgress(60)

    // Get signed URL (private bucket)
    const { data: signedData } = await supabase.storage
      .from('psikolog-belgeleri')
      .createSignedUrl(path, 60 * 60 * 24 * 365) // 1 yıl

    setProgress(80)

    // Save record to DB
    const { error: dbErr } = await supabase
      .from('psychologist_documents')
      .insert({
        psychologist_id: userId,
        document_type:   docType,
        title:           title.trim(),
        issuer:          issuer.trim() || null,
        issue_year:      year ? parseInt(year) : null,
        document_url:    signedData?.signedUrl ?? null,
        status:          'pending',
      })

    setLoading(false)
    if (dbErr) { setError(dbErr.message); return }

    setProgress(100)
    setSuccess(true)
    setFile(null); setTitle(''); setIssuer(''); setYear('')
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => { setSuccess(false); setProgress(0); onUploaded() }, 2000)
  }

  const labelSt: React.CSSProperties = { display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'7px' }
  const inputSt: React.CSSProperties = { width:'100%', background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', padding:'11px 16px', color:'var(--cream)', fontFamily:'Lora,serif', fontSize:'.93rem', outline:'none', transition:'border-color .25s', appearance:'none' }

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'28px' }}>
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'20px' }}>
        Yeni Belge Yükle
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
        <div style={{ gridColumn:'span 2' }}>
          <label style={labelSt}>Belge Türü</label>
          <select style={{ ...inputSt, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239e7d4c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center', paddingRight:'36px', cursor:'pointer' }}
            value={docType} onChange={e => setDocType(e.target.value)}>
            {DOC_TYPES.map(d => <option key={d.val} value={d.val}>{d.label}</option>)}
          </select>
        </div>

        <div style={{ gridColumn:'span 2' }}>
          <label style={labelSt}>Belge Başlığı <span style={{ color:'var(--gold)' }}>*</span></label>
          <input style={inputSt} value={title} onChange={e => setTitle(e.target.value)}
            placeholder='ör. "Klinik Psikoloji Y.L. Diploması"'
            onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        <div>
          <label style={labelSt}>Veren Kurum</label>
          <input style={inputSt} value={issuer} onChange={e => setIssuer(e.target.value)}
            placeholder='ör. "Boğaziçi Üniversitesi"'
            onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        <div>
          <label style={labelSt}>Veriliş Yılı</label>
          <input style={inputSt} type="number" value={year} onChange={e => setYear(e.target.value)}
            placeholder="2018" min="1970" max="2026"
            onFocus={e => (e.target.style.borderColor = 'var(--gold-d)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>
      </div>

      {/* Dosya seçici */}
      <div style={{ marginBottom:'20px' }}>
        <label style={labelSt}>Dosya <span style={{ color:'var(--gold)' }}>*</span> <span style={{ color:'var(--muted)', fontSize:'.65rem', letterSpacing:'.04em', textTransform:'none' }}>PDF, JPG veya PNG · maks. 5MB</span></label>
        <div
          onClick={() => fileRef.current?.click()}
          style={{ border:`2px dashed ${file ? 'rgba(110,201,138,.4)' : 'var(--border)'}`, padding:'28px', textAlign:'center', cursor:'pointer', transition:'border-color .25s, background .25s', background: file ? 'rgba(110,201,138,.04)' : 'rgba(255,255,255,.02)' }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const ev = { target: { files: [f] } } as any; handleFile(ev) } }}>
          {file ? (
            <div style={{ fontFamily:'Cormorant Garant,serif', color:'var(--green)' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'6px' }}>✓</div>
              <div style={{ fontSize:'.9rem', color:'var(--cream)' }}>{file.name}</div>
              <div style={{ fontSize:'.78rem', color:'var(--muted)', marginTop:'3px' }}>
                {(file.size / 1024).toFixed(0)} KB
              </div>
            </div>
          ) : (
            <div style={{ fontFamily:'Cormorant Garant,serif', color:'var(--muted)' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:'8px' }}>↑</div>
              <div style={{ fontSize:'.9rem', color:'var(--text)' }}>Dosyayı buraya sürükleyin veya tıklayın</div>
              <div style={{ fontSize:'.75rem', marginTop:'4px' }}>PDF · JPG · PNG · maks. 5MB</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFile} style={{ display:'none' }} />
      </div>

      {/* Progress */}
      {progress > 0 && progress < 100 && (
        <div style={{ height:'2px', background:'var(--border)', marginBottom:'14px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, height:'100%', background:'linear-gradient(90deg,var(--gold-d),var(--gold))', width:`${progress}%`, transition:'width .3s ease' }} />
        </div>
      )}

      {error && (
        <div style={{ padding:'10px 14px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--red)', marginBottom:'14px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding:'10px 14px', border:'1px solid rgba(110,201,138,.3)', background:'rgba(110,201,138,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--green)', marginBottom:'14px' }}>
          ✓ Belge yüklendi — admin incelemesine gönderildi.
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file || !title.trim()}
        className="btn btn-gold btn-sm"
        style={{ width:'100%', justifyContent:'center' }}>
        {loading ? 'Yükleniyor…' : '↑ Belgeyi Yükle & Gönder'}
      </button>

      <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', color:'var(--muted)', marginTop:'10px', textAlign:'center', lineHeight:1.6 }}>
        🔒 Belgeler şifreli olarak saklanır. Yalnızca Mekteb Komitesi erişebilir.
      </p>
    </div>
  )
}
