import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>
      {/* Astrolabe ring animations */}
      <style>{`
        @keyframes rotateRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        .ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.1); animation:rotateRing linear infinite; }
        .ring::before { content:''; position:absolute; width:5px; height:5px; background:var(--gold); border-radius:50%; top:0; left:50%; transform:translateX(-50%); }
      `}</style>

      {/* Navbar */}
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
        {/* Green radial glow */}
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'900px', background:'radial-gradient(ellipse,rgba(30,70,40,.45) 0%,transparent 70%)', pointerEvents:'none' }} />

        {/* Astrolabe rings — sağ taraf */}
        <div style={{ position:'absolute', right:'-80px', top:'50%', transform:'translateY(-50%)', width:'640px', height:'640px', pointerEvents:'none' }}>
          {/* Ring 1 */}
          <div className="ring" style={{ inset:0, animationDuration:'60s' }} />
          {/* Ring 2 */}
          <div className="ring" style={{ inset:'8%', borderColor:'rgba(201,169,110,.08)', animationDuration:'90s', animationDirection:'reverse' }} />
          {/* Ring 3 */}
          <div className="ring" style={{ inset:'18%', borderColor:'rgba(201,169,110,.14)', animationDuration:'70s' }} />
          {/* Ring 4 */}
          <div className="ring" style={{ inset:'30%', borderColor:'rgba(201,169,110,.08)', animationDuration:'50s', animationDirection:'reverse' }} />
          {/* Ring 5 */}
          <div className="ring" style={{ inset:'42%', borderColor:'rgba(201,169,110,.32)', animationDuration:'40s' }} />
          {/* Center dot */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'8px', height:'8px', borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 20px var(--gold), 0 0 40px rgba(201,169,110,.4)' }} />
        </div>

        {/* Hero content */}
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', position:'relative', zIndex:1 }}>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.08)', border:'1px solid rgba(201,169,110,.2)', padding:'8px 18px', marginBottom:'36px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--gold)', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)' }}>Türkiye'nin İlk Psikolog Okulu</span>
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

        {/* Bottom gold line */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 30%,var(--gold) 50%,var(--gold-d) 70%,transparent)' }} />
      </section>

      {/* Stats */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'40px 0' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {[['%0','Komisyon'],['3','Uzmanlık Kademesi'],['1','Seansla Çıkan Aidat'],['∞','Büyüme Potansiyeli']].map(([v,l],i) => (
            <div key={l} style={{ textAlign:'center', padding:'12px 24px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.8rem', fontWeight:300, color:'var(--gold)', lineHeight:1, marginBottom:'8px' }}>{v}</div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Neden Mekteb */}
      <section style={{ padding:'120px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'80px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Neden Mekteb?</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:400 }}>Bir platform değil,<br /><em style={{ fontStyle:'italic', color:'var(--gold)' }}>bir okul</em></h2>
            <p style={{ maxWidth:'540px', margin:'20px auto 0', fontSize:'1.05rem', color:'var(--text)' }}>Diğer platformlar danışan satarken, Mekteb bilgelik inşa eder.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
            {[
              { icon:'◈', title:'Sıfır Komisyon', desc:'Her seansınızın karşılığı tamamen size aittir. Aylık sabit aidat — başka hiçbir kesinti yok.' },
              { icon:'⟁', title:'Canlı Topluluk', desc:'Alanında köklü psikologlarla aynı çatı altında var olun. Vaka tartışmaları, süpervizyon grupları.' },
              { icon:'⬡', title:'Yapılandırılmış Mentörlük', desc:'Yeni mezunlar için ustadan öğrenmek, deneyimliler için iz bırakmak. Her kademede anlamlı bir rol.' },
            ].map(c => (
              <div key={c.title} style={{ background:'var(--bg2)', padding:'52px 44px', border:'1px solid var(--border)', transition:'border-color .35s' }}>
                <div style={{ width:'52px', height:'52px', border:'1px solid var(--border-h)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'28px', fontSize:'1.4rem', color:'var(--gold)' }}>{c.icon}</div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:400, color:'var(--cream)', marginBottom:'16px' }}>{c.title}</h3>
                <p style={{ fontSize:'.97rem', color:'var(--text)', lineHeight:1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier section */}
      <section id="kademe" style={{ padding:'120px 0', background:'var(--bg2)' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'70px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Kademe Sistemi</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:400 }}>Her psikolog için <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru yer</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
            {([
              { roman:'I',   name:'Aday',  sub:'Yeni Mezun',        price:'299₺', desc:'Mentor eşliğinde ilk adımlar. 3–5 danışan kabulü.', featured:false },
              { roman:'II',  name:'Uzman', sub:'Deneyimli Psikolog', price:'599₺', desc:'Bağımsız pratik, öncelikli eşleştirme, sınırsız danışan.', featured:true },
              { roman:'III', name:'Üstat', sub:'Mentor & Otorite',   price:'999₺', desc:'Mentörlük yetkisi, ortak seans, Üstat rozeti.', featured:false },
            ] as const).map(t => (
              <div key={t.name} style={{ border:`1px solid ${t.featured ? 'rgba(201,169,110,.4)' : 'var(--border)'}`, background: t.featured ? 'var(--bg3)' : 'var(--bg2)', padding:'48px 40px', position:'relative' }}>
                {t.featured && <div style={{ position:'absolute', top:'-13px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'#090f0c', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 18px', whiteSpace:'nowrap' }}>Felsefe Okulu</div>}
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
      <section style={{ background:'var(--bg)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'120px 0' }}>
        <div style={{ maxWidth:'680px', margin:'0 auto', textAlign:'center', padding:'0 32px' }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Kurucu Üyelik</div>
          <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
          <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.8rem)', fontWeight:400, marginBottom:'24px' }}>
            Türkiye'nin psikoloji <em style={{ fontStyle:'italic', color:'var(--gold)' }}>okulunsunuz.</em>
          </h2>
          <p style={{ marginBottom:'48px', fontSize:'1.1rem', color:'var(--text)' }}>
            İlk 100 psikolog arasına girin. Kurucu üyeler fiyat garantisi, özel rozet ve topluluk kararlarında oy hakkı kazanır.
          </p>
          <Link href="/kayit" className="btn btn-gold btn-lg">Psikolog Olarak Katıl →</Link>
          <p style={{ marginTop:'20px', fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)' }}>
            İlk 100 psikolog — kurucu üye fiyatı, ömür boyu geçerli
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'48px 0 32px' }}>
        {/* Gold line */}
        <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 20%,var(--gold) 50%,var(--gold-d) 80%,transparent)', marginBottom:'48px', opacity:.5 }} />
        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <div style={{ display:'flex', gap:'24px' }}>
            {[['Psikolog Bul','/danisan'],['Kayıt','/kayit'],['Giriş','/giris']].map(([l,h]) => (
              <Link key={h} href={h} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.83rem', color:'var(--muted)' }}>© 2026 Mekteb. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
