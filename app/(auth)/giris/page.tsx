import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  async function login(formData: FormData) {
    'use server'
    const email    = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      redirect('/giris?error=' + encodeURIComponent(error.message))
    }

    redirect('/panel')
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

          <form action={login} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label className="form-label">E-posta</label>
              <input
                type="email" name="email"
                className="form-input"
                placeholder="ornek@mail.com" required
              />
            </div>
            <div>
              <label className="form-label">Şifre</label>
              <input
                type="password" name="password"
                className="form-input"
                placeholder="••••••••" required
              />
            </div>

            {error && (
              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--red)', padding:'10px 14px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)' }}>
                {decodeURIComponent(error)}
              </p>
            )}

            <button
              type="submit" className="btn btn-gold btn-md"
              style={{ width:'100%', justifyContent:'center', marginTop:'8px' }}
            >
              Giriş Yap →
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
