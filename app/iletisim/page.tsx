import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'İletişim — Mekteb' }

export default function IletisimPage() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <nav style={{ background:'rgba(9,15,12,.95)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', gap:'20px' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <span style={{ color:'var(--border-h)' }}>/</span>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)' }}>İletişim</span>
        </div>
      </nav>

      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'64px 32px 100px' }}>
        <div style={{ marginBottom:'52px' }}>
          <div className="eyebrow" style={{ marginBottom:'10px' }}>Bize Ulaşın</div>
          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, marginBottom:'16px' }}>
            İletişim<em style={{ fontStyle:'italic', color:'var(--gold)' }}> & Destek</em>
          </h1>
          <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.8, maxWidth:'520px' }}>
            Sorularınız, önerileriniz veya destek talepleriniz için aşağıdaki kanalları kullanabilirsiniz.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'36px' }}>

          {/* E-posta */}
          <div className="card" style={{ padding:'32px' }}>
            <div style={{ fontSize:'2rem', marginBottom:'14px' }}>✉</div>
            <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.15rem', color:'var(--cream)', marginBottom:'8px' }}>E-posta</h3>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)', lineHeight:1.65, marginBottom:'16px' }}>
              Genel sorular, işbirliği teklifleri ve platform hakkında her türlü soru için.
            </p>
            <a href="mailto:info@mekteb.com.tr" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--gold)', textDecoration:'none' }}>
              info@mekteb.com.tr
            </a>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', marginTop:'6px' }}>
              Yanıt süresi: 1–2 iş günü
            </div>
          </div>

          {/* Psikolog başvuruları */}
          <div style={{ padding:'32px', background:'rgba(201,169,110,.04)', border:'1px solid rgba(201,169,110,.18)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'14px' }}>⬡</div>
            <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.15rem', color:'var(--cream)', marginBottom:'8px' }}>Psikolog Başvuruları</h3>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)', lineHeight:1.65, marginBottom:'16px' }}>
              Mekteb'e psikolog olarak katılmak için kayıt formunu kullanabilirsiniz.
            </p>
            <Link href="/kayit" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.92rem', color:'var(--gold)', textDecoration:'none' }}>
              Başvuru Formu →
            </Link>
          </div>

          {/* Şikayet */}
          <div className="card" style={{ padding:'32px' }}>
            <div style={{ fontSize:'2rem', marginBottom:'14px' }}>⚑</div>
            <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.15rem', color:'var(--cream)', marginBottom:'8px' }}>Şikayet & Bildirim</h3>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)', lineHeight:1.65, marginBottom:'16px' }}>
              Platform hakkında veya bir psikologla ilgili şikayetiniz için şikayet formunu kullanın.
            </p>
            <Link href="/sikayet" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.92rem', color:'var(--gold)', textDecoration:'none' }}>
              Şikayet Formu →
            </Link>
          </div>
        </div>

        {/* KVKK */}
        <div style={{ padding:'20px 24px', background:'rgba(255,255,255,.02)', border:'1px solid var(--border)', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)', lineHeight:1.7 }}>
          🔒 KVKK başvuruları için:{' '}
          <a href="mailto:kvkk@mekteb.com.tr" style={{ color:'var(--gold-d)', textDecoration:'none' }}>kvkk@mekteb.com.tr</a>
          {' · '}
          <Link href="/gizlilik" style={{ color:'var(--gold-d)', textDecoration:'none' }}>Gizlilik Politikası</Link>
          {' · '}
          <Link href="/kvkk" style={{ color:'var(--gold-d)', textDecoration:'none' }}>KVKK Metni</Link>
        </div>

        <div style={{ marginTop:'32px', textAlign:'center' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)', textDecoration:'none' }}>← Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  )
}
