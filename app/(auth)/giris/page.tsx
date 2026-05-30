'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function GirisPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }

    router.push('/panel')
    router.refresh()
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <Link href="/" style={{ display:'block', textAlign:'center', marginBottom:'40px', fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
          Mek<span style={{ color:'var(--gold)' }}>teb</span>
        </Link>

        <div className="card" style={{ padding:'40px' }}>
          <div style={{ textAlign:'center', marginBottom:'32px' }}>
            <div className="eyebrow" style={{ marginBottom:'8px' }}>Psikolog Girişi</div>
            <h2 style={{ fontSize:'1.8rem', fontWeight:400 }}>Hoş <em style={{ fontStyle:'italic', color:'var(--gold)' }}>geldiniz</em></h2>
          </div>

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label className="form-label">E-posta</label>
              <input
                type="email" className="form-input"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ornek@mail.com" required
              />
            </div>
            <div>
              <label className="form-label">Şifre</label>
              <input
                type="password" className="form-input"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
              />
            </div>

            {error && (
              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--red)', padding:'10px 14px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)' }}>
                {error}
              </p>
            )}

            <button
              type="submit" className="btn btn-gold btn-md"
              style={{ width:'100%', justifyContent:'center', marginTop:'8px' }}
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap →'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:'24px', borderTop:'1px solid var(--border)', paddingTop:'20px' }}>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)' }}>
              Henüz üye değil misiniz?{' '}
              <Link href="/kayit" style={{ color:'var(--gold)', textDecoration:'none' }}>Psikolog olarak katılın →</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:'20px', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>
          <Link href="/" style={{ color:'var(--muted)', textDecoration:'none' }}>← Ana Sayfaya Dön</Link>
        </p>
      </div>
    </div>
  )
}
