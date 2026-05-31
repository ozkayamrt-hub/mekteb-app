'use client'

import { useState } from 'react'
import Link from 'next/link'

const SUBJECTS = [
  'Etik ihlal — seans gizliliğinin ihlali',
  'Etik ihlal — uygunsuz davranış veya söylem',
  'Mesleki yetersizlik — yanlış tanı veya yanlış yönlendirme',
  'İletişim sorunu — randevu iptali veya bildirim yapılmaması',
  'Ücret veya seans koşullarına ilişkin uyuşmazlık',
  'Platform kurallarının ihlali',
  'Başka bir psikolog veya kullanıcı hakkında şikayet',
  'Diğer',
]

export default function SikayetPage() {
  const [form, setForm] = useState({
    psychologistName: '',
    subject: '',
    description: '',
    complainantInfo: '',
    contactEmail: '',
    isAnonymous: false,
  })
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]        = useState('')

  function set(k: keyof typeof form, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subject) { setError('Lütfen bir konu seçin.'); return }
    if (form.description.trim().length < 30) { setError('Açıklama en az 30 karakter olmalıdır.'); return }

    setLoading(true)
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        psychologistName: form.psychologistName,
        subject:          form.subject,
        description:      form.description,
        complainantInfo:  form.isAnonymous ? null : form.complainantInfo,
        contactEmail:     form.isAnonymous ? null : form.contactEmail,
        complainantType:  'client',
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Bir hata oluştu.'); return }
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background:'rgba(9,15,12,.95)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', gap:'20px' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <span style={{ color:'var(--border-h)' }}>/</span>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)' }}>Şikayet Formu</span>
        </div>
      </nav>

      <div style={{ maxWidth:'720px', margin:'0 auto', padding:'64px 32px 100px' }}>

        {submitted ? (
          /* Başarı ekranı */
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <div style={{ width:'80px', height:'80px', borderRadius:'50%', border:'1px solid rgba(110,201,138,.4)', background:'rgba(110,201,138,.06)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontSize:'2rem' }}>
              ✓
            </div>
            <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.2rem', fontWeight:400, marginBottom:'16px' }}>
              Şikayetiniz <em style={{ fontStyle:'italic', color:'var(--gold)' }}>alındı</em>
            </h2>
            <p style={{ fontSize:'1rem', color:'var(--text)', maxWidth:'460px', margin:'0 auto 20px', lineHeight:1.8 }}>
              Komite üyelerimiz şikayetinizi en kısa sürede inceleyecek. Gizliliğiniz korunur; bilgileriniz yalnızca inceleme sürecinde kullanılır.
            </p>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)', marginBottom:'40px' }}>
              İletişim e-postası bıraktıysanız sonuç hakkında bilgilendirileceksiniz.
            </p>
            <div style={{ display:'flex', gap:'14px', justifyContent:'center' }}>
              <Link href="/danisan" className="btn btn-gold btn-md">Psikolog Aramaya Dön</Link>
              <Link href="/" className="btn btn-outline btn-md">Ana Sayfa</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Başlık */}
            <div style={{ marginBottom:'48px' }}>
              <div className="eyebrow" style={{ marginBottom:'10px' }}>Mekteb Şikayet Sistemi</div>
              <h1 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:300, marginBottom:'16px' }}>
                Şikayet <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Bildirin</em>
              </h1>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.8, maxWidth:'560px', marginBottom:'24px' }}>
                Mekteb'de görev yapan bir psikologla ilgili etik ihlal, mesleki sorun veya platform kurallarına aykırı bir durum yaşadıysanız bu formu kullanabilirsiniz.
              </p>

              {/* Güvence */}
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[
                  '🔒 Kimliğiniz tamamen gizli tutulabilir — anonim başvuru seçeneği mevcuttur.',
                  '⬡  Şikayetiniz Mekteb Komite Üyeleri tarafından incelenir, size geri bildirim yapılır.',
                  '✦  Haklı bulunan şikayetler gereği yapılmak üzere ilgili birime iletilir.',
                ].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'flex-start', gap:'10px', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)', lineHeight:1.6 }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0' }}>

              {/* Psikolog adı */}
              <div style={{ marginBottom:'22px' }}>
                <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'7px' }}>
                  Şikayet Ettiğiniz Psikolog <span style={{ color:'var(--muted)', fontSize:'.65rem' }}>isteğe bağlı</span>
                </label>
                <input
                  className="form-input"
                  value={form.psychologistName}
                  onChange={e => set('psychologistName', e.target.value)}
                  placeholder="Psikologun adını biliyorsanız yazın"
                />
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', marginTop:'5px' }}>
                  Psikologun adını hatırlamıyorsanız boş bırakabilirsiniz.
                </div>
              </div>

              {/* Konu */}
              <div style={{ marginBottom:'22px' }}>
                <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'7px' }}>
                  Şikayet Konusu <span style={{ color:'var(--gold)' }}>*</span>
                </label>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {SUBJECTS.map(s => (
                    <label key={s} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 16px', border:`1px solid ${form.subject === s ? 'var(--gold)' : 'var(--border)'}`, background: form.subject === s ? 'rgba(201,169,110,.07)' : 'rgba(255,255,255,.02)', cursor:'pointer', transition:'all .2s' }}>
                      <input
                        type="radio" name="subject" value={s}
                        checked={form.subject === s}
                        onChange={() => set('subject', s)}
                        style={{ accentColor:'var(--gold)', width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }}
                      />
                      <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color: form.subject === s ? 'var(--cream)' : 'var(--text)' }}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Açıklama */}
              <div style={{ marginBottom:'22px' }}>
                <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'7px' }}>
                  Açıklama <span style={{ color:'var(--gold)' }}>*</span>
                </label>
                <textarea
                  className="form-input"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Yaşadığınız durumu olabildiğince ayrıntılı anlatın. Tarih, seans ortamı ve yaşananlar hakkında bilgi verebilirsiniz."
                  style={{ minHeight:'160px', resize:'vertical', lineHeight:1.7 }}
                />
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', color: form.description.length < 30 && form.description.length > 0 ? 'var(--red)' : 'var(--muted)', marginTop:'5px', display:'flex', justifyContent:'space-between' }}>
                  <span>En az 30 karakter</span>
                  <span>{form.description.length} karakter</span>
                </div>
              </div>

              {/* Anonimlik seçeneği */}
              <div style={{ marginBottom:'22px', padding:'20px 24px', background:'rgba(255,255,255,.02)', border:'1px solid var(--border)' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', marginBottom:'14px' }}>
                  <input
                    type="checkbox"
                    checked={form.isAnonymous}
                    onChange={e => set('isAnonymous', e.target.checked)}
                    style={{ accentColor:'var(--gold)', width:'16px', height:'16px', cursor:'pointer' }}
                  />
                  <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--cream)', fontWeight:500 }}>
                    Anonim olarak başvurmak istiyorum
                  </span>
                </label>
                {form.isAnonymous ? (
                  <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)', lineHeight:1.6, marginLeft:'28px' }}>
                    Kimliğiniz gizli tutulacak. Şikayetiniz incelenecek ancak size geri bildirim yapılamayacak.
                  </p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginLeft:'0' }}>
                    <div>
                      <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>
                        Adınız / Takma Adınız <span style={{ color:'var(--muted)', fontSize:'.65rem' }}>isteğe bağlı</span>
                      </label>
                      <input
                        className="form-input"
                        value={form.complainantInfo}
                        onChange={e => set('complainantInfo', e.target.value)}
                        placeholder="Ad veya takma ad — sadece komite görür"
                      />
                    </div>
                    <div>
                      <label style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'6px' }}>
                        İletişim E-postası <span style={{ color:'var(--muted)', fontSize:'.65rem' }}>isteğe bağlı</span>
                      </label>
                      <input
                        className="form-input"
                        type="email"
                        value={form.contactEmail}
                        onChange={e => set('contactEmail', e.target.value)}
                        placeholder="Sonuç hakkında bilgilendirilmek istiyorsanız"
                      />
                      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', color:'var(--muted)', marginTop:'4px' }}>
                        🔒 E-postanız yalnızca komite üyeleriyle paylaşılır, üçüncü taraflara iletilmez.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hata */}
              {error && (
                <div style={{ padding:'12px 16px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--red)', marginBottom:'20px' }}>
                  {error}
                </div>
              )}

              {/* Gönder */}
              <div style={{ display:'flex', alignItems:'center', gap:'16px', paddingTop:'8px' }}>
                <button type="submit" disabled={loading} className="btn btn-gold btn-lg" style={{ fontSize:'1rem' }}>
                  {loading ? 'Gönderiliyor…' : 'Şikayeti Gönder →'}
                </button>
                <Link href="/" className="btn btn-ghost btn-md" style={{ fontSize:'.9rem' }}>Vazgeç</Link>
              </div>

              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', marginTop:'20px', lineHeight:1.65 }}>
                Bu formu göndererek bilgilerinizin Mekteb Komite Üyeleri tarafından gizlilik içinde inceleneceğini kabul etmiş olursunuz.{' '}
                <Link href="/gizlilik" style={{ color:'var(--gold-d)', textDecoration:'none' }}>Gizlilik Politikası →</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
