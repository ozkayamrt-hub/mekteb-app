import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(9,15,12,.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <div style={{ display:'flex', gap:'32px', alignItems:'center' }}>
            <Link href="/danisan" style={{ fontFamily:'Cormorant Garant,serif', color:'var(--text)', textDecoration:'none' }}>Psikolog Bul</Link>
            <Link href="/#kademe" style={{ fontFamily:'Cormorant Garant,serif', color:'var(--text)', textDecoration:'none' }}>Kademe Sistemi</Link>
          </div>
          <Link href="/kayit" className="btn btn-gold btn-sm">Psikolog Olarak Katıl</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:'80px', background:'var(--bg2)', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'900px', background:'radial-gradient(ellipse,rgba(30,70,40,.45) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'20px' }}>
            Türkiye'nin İlk Psikolog Okulu
          </div>
          <h1 style={{ fontSize:'clamp(2.8rem,6vw,5.2rem)', fontWeight:300, letterSpacing:'-.01em', marginBottom:'28px', maxWidth:'660px' }}>
            Bilgelik <em style={{ fontStyle:'italic', color:'var(--gold)' }}>aktarılır.</em><br />Deneyim kazanılır.
          </h1>
          <p style={{ fontSize:'1.15rem', color:'var(--text)', maxWidth:'520px', marginBottom:'44px', lineHeight:1.8 }}>
            Mekteb; yeni mezun psikologları ustalarıyla, danışanları doğru terapistleriyle buluşturan — komisyonsuz, topluluğa dayalı platform.
          </p>
          <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
            <Link href="/kayit" className="btn btn-gold btn-lg">Psikolog Olarak Katıl</Link>
            <Link href="/danisan" className="btn btn-outline btn-lg">Psikolog Bul</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'40px 0' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {[['%0','Komisyon'],['3','Uzmanlık Kademesi'],['1','Seansla Çıkan Aidat'],['∞','Büyüme Potansiyeli']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center', padding:'12px 24px', borderRight:'1px solid var(--border)' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.8rem', fontWeight:300, color:'var(--gold)', lineHeight:1, marginBottom:'8px' }}>{v}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier section */}
      <section id="kademe" style={{ padding:'120px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'70px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Kademe Sistemi</div>
            <div className="gold-line" style={{ margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:400 }}>Her psikolog için <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru yer</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
            {([
              { roman:'I',   name:'Aday',  sub:'Yeni Mezun',        price:'299₺', desc:'Mentor eşliğinde ilk adımlar. 3–5 danışan kabulü.', featured:false },
              { roman:'II',  name:'Uzman', sub:'Deneyimli Psikolog', price:'599₺', desc:'Bağımsız pratik, öncelikli eşleştirme, sınırsız danışan.', featured:true },
              { roman:'III', name:'Üstat', sub:'Mentor & Otorite',   price:'999₺', desc:'Mentörlük yetkisi, ortak seans, Üstat rozeti.', featured:false },
            ] as const).map(t => (
              <div key={t.name} style={{ border:`1px solid ${t.featured ? 'rgba(201,169,110,.4)' : 'var(--border)'}`, background: t.featured ? 'var(--bg3)' : 'var(--bg2)', padding:'48px 40px', position:'relative' }}>
                {t.featured && <div style={{ position:'absolute', top:'-13px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'#090f0c', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 18px', whiteSpace:'nowrap' }}>Önerilen</div>}
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'3rem', color:'var(--gold)', marginBottom:'8px', lineHeight:1 }}>{t.roman}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', color:'var(--cream)', fontWeight:500, marginBottom:'6px' }}>{t.name}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'20px' }}>{t.sub}</div>
                <p style={{ fontSize:'.96rem', color:'var(--text)', marginBottom:'28px', lineHeight:1.7 }}>{t.desc}</p>
                <span style={{ padding:'4px 14px', border:'1px solid var(--border-h)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold-d)' }}>{t.price} / ay</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'120px 0' }}>
        <div style={{ maxWidth:'680px', margin:'0 auto', textAlign:'center', padding:'0 32px' }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Kurucu Üyelik</div>
          <div className="gold-line" style={{ margin:'0 auto 20px' }} />
          <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:400, marginBottom:'24px' }}>
            Türkiye'nin psikoloji <em style={{ fontStyle:'italic', color:'var(--gold)' }}>okulunsunuz.</em>
          </h2>
          <p style={{ marginBottom:'48px', fontSize:'1.1rem' }}>İlk 100 psikolog arasına girin. Kurucu üyeler fiyat garantisi ve özel rozet kazanır.</p>
          <Link href="/kayit" className="btn btn-gold btn-lg">Psikolog Olarak Katıl →</Link>
        </div>
      </section>

      <footer style={{ background:'var(--bg)', borderTop:'1px solid var(--border)', padding:'40px 0' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', color:'var(--cream)', textDecoration:'none' }}>Mek<span style={{ color:'var(--gold)' }}>teb</span></Link>
          <div style={{ display:'flex', gap:'24px' }}>
            {[['Psikolog Bul','/danisan'],['Kayıt','/kayit'],['Giriş','/giris']].map(([l,h]) => (
              <Link key={h} href={h} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.83rem', color:'var(--muted)' }}>© 2026 Mekteb</p>
        </div>
      </footer>
    </div>
  )
}
