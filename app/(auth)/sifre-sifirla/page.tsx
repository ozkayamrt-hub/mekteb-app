'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SifreSifirlaPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    // Supabase sets session from URL hash automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is authenticated, ready to set new password
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Şifre en az 8 karakter olmalıdır.'); return }
    if (password !== confirm) { setError('Şifreler eşleşmiyor.'); return }

    setLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/panel'), 2500)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <Link href="/" style={{ display:'block', textAlign:'center', marginBottom:'40px', fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
          Mek<span style={{ color:'var(--gold)' }}>teb</span>
        </Link>

        <div className="card" style={{ padding:'40px' }}>
          {success ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', color:'var(--green)', marginBottom:'16px' }}>✓</div>
              <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:400, marginBottom:'10px' }}>
                Şifre <em style={{ fontStyle:'italic', color:'var(--gold)' }}>güncellendi</em>
              </h2>
              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)' }}>
                Panele yönlendiriliyorsunuz…
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:'28px' }}>
                <div className="eyebrow" style={{ marginBottom:'8px' }}>Yeni Şifre</div>
                <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:400 }}>
                  Şifrenizi <em style={{ fontStyle:'italic', color:'var(--gold)' }}>belirleyin</em>
                </h2>
              </div>

              <form onSubmit={handleReset} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div>
                  <label className="form-label">Yeni Şifre</label>
                  <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="En az 8 karakter" required />
                </div>
                <div>
                  <label className="form-label">Şifre Tekrar</label>
                  <input type="password" className="form-input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
                </div>

                {error && (
                  <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--red)', padding:'10px 14px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)' }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn btn-gold btn-md" style={{ width:'100%', justifyContent:'center' }}>
                  {loading ? 'Güncelleniyor…' : 'Şifreyi Kaydet →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
