import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Şifremi Unuttum — Mekteb' }

export default async function SifremiUnuttumPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>
}) {
  const { sent, error } = await searchParams

  async function resetPassword(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    if (!email?.match(/\S+@\S+\.\S+/)) {
      redirect('/sifremi-unuttum?error=Geçerli bir e-posta adresi girin')
    }
    const supabase = await createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/sifre-sifirla`,
    })
    // Her zaman "gönderildi" mesajı göster (güvenlik: e-posta varlığını sızdırma)
    redirect('/sifremi-unuttum?sent=1')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <Link href="/" style={{ display:'block', textAlign:'center', marginBottom:'40px', fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
          Mek<span style={{ color:'var(--gold)' }}>teb</span>
        </Link>

        <div className="card" style={{ padding:'40px' }}>
          {sent ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', color:'var(--green)', marginBottom:'16px' }}>✉</div>
              <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:400, marginBottom:'14px' }}>
                E-posta <em style={{ fontStyle:'italic', color:'var(--gold)' }}>gönderildi</em>
              </h2>
              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--text)', lineHeight:1.7, marginBottom:'24px' }}>
                Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi. Spam klasörünüzü de kontrol edin.
              </p>
              <Link href="/giris" className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}>
                ← Giriş Sayfasına Dön
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:'28px' }}>
                <div className="eyebrow" style={{ marginBottom:'8px' }}>Şifre Sıfırlama</div>
                <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:400, marginBottom:'8px' }}>
                  Şifremi <em style={{ fontStyle:'italic', color:'var(--gold)' }}>unuttum</em>
                </h2>
                <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)' }}>
                  E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.
                </p>
              </div>

              <form action={resetPassword} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div>
                  <label className="form-label">E-posta</label>
                  <input type="email" name="email" className="form-input" placeholder="ornek@mail.com" required autoFocus />
                </div>

                {error && (
                  <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--red)', padding:'10px 14px', border:'1px solid rgba(201,110,110,.3)', background:'rgba(201,110,110,.06)' }}>
                    {decodeURIComponent(error)}
                  </p>
                )}

                <button type="submit" className="btn btn-gold btn-md" style={{ width:'100%', justifyContent:'center' }}>
                  Sıfırlama Bağlantısı Gönder →
                </button>
              </form>

              <div style={{ textAlign:'center', marginTop:'20px', borderTop:'1px solid var(--border)', paddingTop:'18px' }}>
                <Link href="/giris" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)', textDecoration:'none' }}>
                  ← Giriş Sayfasına Dön
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
