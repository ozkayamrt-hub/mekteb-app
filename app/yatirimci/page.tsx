import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yatırımcı İlişkileri — Mekteb',
  description: 'Türkiye\'nin ilk komisyonsuz psikolog topluluğuna yatırım yapın.',
}

export default function YatirimciPage() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <nav style={{ background:'rgba(9,15,12,.95)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <Link href="/iletisim" className="btn btn-outline btn-sm">İletişim →</Link>
        </div>
      </nav>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'72px 32px 100px' }}>

        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:'80px' }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Yatırımcı İlişkileri</div>
          <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
          <h1 style={{ fontSize:'clamp(2.2rem,5vw,4rem)', fontWeight:300, marginBottom:'20px' }}>
            Türkiye'nin psikoloji<br />
            <em style={{ fontStyle:'italic', color:'var(--gold)' }}>okuluyla büyüyün</em>
          </h1>
          <p style={{ fontSize:'1.05rem', color:'var(--text)', maxWidth:'580px', margin:'0 auto', lineHeight:1.8 }}>
            Mekteb; komisyonsuz, topluluğa dayalı, mentörlük odaklı bir psikolog platformudur. Türkiye'nin 15.000+ psikologuna ve 85 milyonluk danışan kitlesine ulaşıyoruz.
          </p>
        </div>

        {/* Fırsat metrikleri */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2px', marginBottom:'80px' }}>
          {[
            { n:'15.000+', l:'Türkiye\'de Kayıtlı Psikolog', sub:'Hedef pazar' },
            { n:'85M',     l:'Potansiyel Danışan Kitlesi',   sub:'Türkiye nüfusu' },
            { n:'%0',      l:'Komisyon',                      sub:'Rakip avantajı' },
            { n:'3x',      l:'Yıllık Büyüme Hedefi',         sub:'12. ayda' },
          ].map(m => (
            <div key={m.n} style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'28px 24px', textAlign:'center' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.8rem', fontWeight:300, color:'var(--gold)', lineHeight:1, marginBottom:'8px' }}>{m.n}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--cream)', marginBottom:'4px' }}>{m.l}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)', letterSpacing:'.06em' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', marginBottom:'80px' }}>

          {/* Neden Mekteb */}
          <div>
            <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:400, marginBottom:'24px' }}>
              Neden <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Mekteb?</em>
            </h2>
            {[
              { icon:'◈', title:'Benzersiz İş Modeli', desc:'Seans komisyonu yok — yalnızca aylık aidat. Psikologlar için çok daha cazip, platform için öngörülebilir gelir.' },
              { icon:'⬡', title:'Mentörlük Ekosistemi', desc:'Türkiye\'de başka hiçbir platformda olmayan yapılandırılmış mentor-mentee sistemi. Hem arz hem kalite sorunu çözülüyor.' },
              { icon:'⟁', title:'Topluluk Kültürü', desc:'Psikologlar sadece danışan bulmak için değil, mesleki gelişim için de platforma bağlı kalıyor. Düşük churn.' },
              { icon:'✦', title:'Hazır Platform', desc:'Kayıt, panel, takvim, belge doğrulama, şikayet sistemi, kademe yükseltme — tüm altyapı tamamlandı. Yatırım büyümeye gidecek.' },
            ].map(i => (
              <div key={i.title} style={{ display:'flex', gap:'14px', marginBottom:'20px' }}>
                <span style={{ fontSize:'1.2rem', color:'var(--gold)', flexShrink:0, marginTop:'2px' }}>{i.icon}</span>
                <div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500, marginBottom:'4px' }}>{i.title}</div>
                  <div style={{ fontSize:'.88rem', color:'var(--text)', lineHeight:1.65 }}>{i.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Finansal projeksiyon */}
          <div>
            <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:400, marginBottom:'24px' }}>
              Finansal <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Projeksiyon</em>
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {[
                { ay:'3. Ay',  ps:'50 psikolog',   gelir:'~23.000₺/ay',   renk:'var(--text)' },
                { ay:'6. Ay',  ps:'100 psikolog',  gelir:'~46.000₺/ay',   renk:'var(--text)' },
                { ay:'12. Ay', ps:'300 psikolog',  gelir:'~155.000₺/ay',  renk:'var(--gold)' },
                { ay:'24. Ay', ps:'1.000 psikolog', gelir:'~520.000₺/ay', renk:'var(--gold-l)' },
              ].map(r => (
                <div key={r.ay} style={{ display:'grid', gridTemplateColumns:'80px 1fr 1fr', gap:'0', padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)' }}>{r.ay}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--text)' }}>{r.ps}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:r.renk, fontWeight: r.renk === 'var(--text)' ? 400 : 500 }}>{r.gelir}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', marginTop:'12px', lineHeight:1.6 }}>
              * Ağırlıklı ortalama aidat baz alındı. Gerçek rakamlar psikolog dağılımına bağlıdır.
            </p>
          </div>
        </div>

        {/* Yol haritası özeti */}
        <div style={{ marginBottom:'72px' }}>
          <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:400, textAlign:'center', marginBottom:'32px' }}>
            Büyüme <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Yol Haritası</em>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0', position:'relative' }}>
            <div style={{ position:'absolute', top:'28px', left:'12.5%', right:'12.5%', height:'1px', background:'linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold-d))' }} />
            {[
              { faz:'Faz 1', sure:'0–3. Ay',   baslik:'Psikolog Edinimi',  desc:'50 psikolog, domain, e-posta kampanyası, iyzico' },
              { faz:'Faz 2', sure:'3–6. Ay',   baslik:'Beta Lansmanı',     desc:'100 psikolog, Google Ads, ilk 500 danışan' },
              { faz:'Faz 3', sure:'6–12. Ay',  baslik:'Büyüme',            desc:'300 psikolog, mobil uygulama, video görüşme' },
              { faz:'Faz 4', sure:'12–24. Ay', baslik:'Ölçekleme',         desc:'1.000 psikolog, kurumsal, uluslararası' },
            ].map(f => (
              <div key={f.faz} style={{ textAlign:'center', padding:'0 20px' }}>
                <div style={{ width:'56px', height:'56px', borderRadius:'50%', border:'1px solid var(--gold-d)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', background:'var(--bg)', position:'relative', zIndex:1, boxShadow:'0 0 0 6px var(--bg)' }}>
                  <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', color:'var(--gold)', letterSpacing:'.08em', textTransform:'uppercase' }}>{f.faz}</span>
                </div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--gold-d)', letterSpacing:'.08em', marginBottom:'6px' }}>{f.sure}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--cream)', fontWeight:500, marginBottom:'6px' }}>{f.baslik}</div>
                <div style={{ fontSize:'.82rem', color:'var(--text)', lineHeight:1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* İletişim */}
        <div style={{ background:'var(--bg2)', border:'1px solid rgba(201,169,110,.2)', padding:'48px 40px', textAlign:'center' }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Yatırım Görüşmesi</div>
          <h2 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2rem', fontWeight:400, marginBottom:'16px' }}>
            Birlikte <em style={{ fontStyle:'italic', color:'var(--gold)' }}>büyüyelim</em>
          </h2>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--text)', maxWidth:'480px', margin:'0 auto 32px', lineHeight:1.75 }}>
            Yatırım, stratejik ortaklık veya hibe fırsatları için bizimle iletişime geçin. Detaylı pitch deck ve finansal veriler talep üzerine sunulur.
          </p>
          <a href="mailto:yatirimci@mekteb.com.tr" className="btn btn-gold btn-lg" style={{ fontSize:'1rem' }}>
            yatirimci@mekteb.com.tr
          </a>
        </div>

      </div>
    </div>
  )
}
