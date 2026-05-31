'use client'

import Link from 'next/link'

/* ── Inline alıntı şeridi ── */
function QuoteBanner({ quote }: { quote: typeof QUOTES[0] }) {
  return (
    <div style={{ padding:'52px 0', background:'var(--bg2)', position:'relative', overflow:'hidden', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(270deg,rgba(20,60,40,.5),rgba(10,25,40,.7),rgba(30,15,50,.4),rgba(10,35,25,.6))', backgroundSize:'400% 400%', animation:'aurora 16s ease infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'400px', height:'200px', background:'radial-gradient(ellipse,rgba(201,169,110,.07) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'0 32px', textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:'2.2rem', color:'var(--gold-d)', opacity:.35, fontFamily:'Georgia,serif', lineHeight:1, marginBottom:'8px' }}>&ldquo;</div>
        <blockquote style={{ fontFamily:'Cormorant Garant,serif', fontSize:'clamp(1.1rem,2.2vw,1.5rem)', fontStyle:'italic', color:'var(--cream)', fontWeight:300, lineHeight:1.65, marginBottom:'20px' }}>
          {quote.text}
        </blockquote>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'14px' }}>
          <div style={{ height:'1px', width:'32px', background:'var(--gold-d)' }} />
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--gold)', fontWeight:500 }}>{quote.author}</span>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', letterSpacing:'.08em' }}>{quote.field}</span>
          <div style={{ height:'1px', width:'32px', background:'var(--gold-d)' }} />
        </div>
      </div>
    </div>
  )
}

const QUOTES = [
  { text: "İnsanlar nesnelerden değil, nesneler hakkındaki görüşlerden rahatsız olur.", author: "Epiktetos", field: "Stoacı Felsefe" },
  { text: "Bilinçdışı, şuurlu zihnin red ettiği her şeyi içerir.", author: "Carl Gustav Jung", field: "Analitik Psikoloji" },
  { text: "Acı kaçınılmazdır, ıstırap ise bir seçimdir.", author: "Viktor Frankl", field: "Logoterapist" },
  { text: "Sevgisiz geçen çocukluk yılları, hastalıkların çoğunun kaynağıdır.", author: "Sigmund Freud", field: "Psikanaliz" },
  { text: "Kendini bil.", author: "Sokrates", field: "Antik Felsefe" },
  { text: "Karanlığı aydınlatmadan önce önce onu kabul etmelisin.", author: "Carl Gustav Jung", field: "Analitik Psikoloji" },
  { text: "Her şeyin bir anlamı olduğuna inanan insan, her şeye katlanabilir.", author: "Viktor Frankl", field: "Logoterapist" },
  { text: "İnsanı tanımak istiyorsan, ona ne söylediğini değil ne yaptığını izle.", author: "Alfred Adler", field: "Bireysel Psikoloji" },
]

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <style>{`
        /* ── Partiküller ── */
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: .6; }
          100% { transform: translateY(-120vh) translateX(var(--dx,20px)) scale(.4); opacity: 0; }
        }
        .particle {
          position: absolute; border-radius: 50%;
          background: var(--gold); pointer-events: none;
          animation: floatUp var(--dur,12s) ease-in var(--delay,0s) infinite;
        }

        /* ── Astrolabe ── */
        @keyframes rotateRing { to { transform: rotate(360deg); } }
        .ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(201,169,110,.1);
          animation: rotateRing linear infinite;
        }
        .ring::before {
          content: ''; position: absolute;
          width: 5px; height: 5px; background: var(--gold);
          border-radius: 50%; top: 0; left: 50%; transform: translateX(-50%);
        }

        /* ── Nefes halkası ── */
        @keyframes breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: .06; }
          50%     { transform: translate(-50%,-50%) scale(1.18); opacity: .14; }
        }

        /* ── Aurora gradyan ── */
        @keyframes aurora {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Dalga SVG ── */
        @keyframes waveDrift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Nöron noktaları ── */
        @keyframes neuronPulse {
          0%,100% { opacity: .25; transform: scale(1); }
          50%     { opacity: .8;  transform: scale(1.6); }
        }
        @keyframes neuronLine {
          0%,100% { opacity: .06; }
          50%     { opacity: .22; }
        }

        /* ── Scroll fade ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; }
        .reveal.in { animation: fadeUp .7s ease forwards; }

        /* ── Badge pulse ── */
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }

        /* ── Alıntı geçişi ── */
        @keyframes quoteIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .quote-active { animation: quoteIn .6s ease forwards; }

        /* ── Davet hover ── */
        .invite-btn { transition: all .3s ease; }
        .invite-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(201,169,110,.2); }
      `}</style>

      {/* ════════════════ NAVBAR ════════════════ */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, background:'rgba(9,15,12,.92)', backdropFilter:'blur(24px)', borderBottom:'1px solid var(--border)', padding:'14px 0' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <div style={{ display:'flex', gap:'28px', alignItems:'center' }}>
            <Link href="/danisan" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--text)', textDecoration:'none' }}>Psikolog Bul</Link>
            <Link href="#nasil" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--text)', textDecoration:'none' }}>Nasıl Çalışır?</Link>
            <Link href="#psikologlar" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--text)', textDecoration:'none' }}>Psikologlar</Link>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <Link href="/giris" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)', textDecoration:'none', padding:'8px 14px' }}>Giriş</Link>
            <Link href="/kayit" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold)', border:'1px solid rgba(201,169,110,.35)', padding:'8px 18px', textDecoration:'none', transition:'all .25s' }}>
              Psikolog musunuz? →
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════ HERO — Danışan odaklı ════════════════ */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:'80px', background:'var(--bg2)', position:'relative', overflow:'hidden' }}>
        {/* Yeşil radyal ışık */}
        <div style={{ position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)', width:'1000px', height:'800px', background:'radial-gradient(ellipse,rgba(20,60,35,.55) 0%,transparent 65%)', pointerEvents:'none' }} />

        {/* Altın toz partikülleri */}
        {[
          { left:'8%',  size:3, dur:14, delay:0,   dx:30  },
          { left:'18%', size:2, dur:18, delay:3,   dx:-20 },
          { left:'30%', size:4, dur:12, delay:1,   dx:15  },
          { left:'45%', size:2, dur:16, delay:5,   dx:-30 },
          { left:'60%', size:3, dur:20, delay:2,   dx:25  },
          { left:'72%', size:2, dur:15, delay:7,   dx:-15 },
          { left:'82%', size:4, dur:13, delay:4,   dx:20  },
          { left:'92%', size:2, dur:17, delay:1,   dx:-25 },
          { left:'25%', size:3, dur:19, delay:8,   dx:10  },
          { left:'55%', size:2, dur:11, delay:6,   dx:-10 },
          { left:'68%', size:3, dur:22, delay:3,   dx:35  },
          { left:'38%', size:2, dur:16, delay:9,   dx:-18 },
        ].map((p, i) => (
          <div key={i} className="particle" style={{
            left: p.left, bottom: '-10px',
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: .7,
            '--dur':   `${p.dur}s`,
            '--delay': `${p.delay}s`,
            '--dx':    `${p.dx}px`,
          } as React.CSSProperties} />
        ))}

        {/* Astrolabe halkaları — sağ */}
        <div style={{ position:'absolute', right:'-60px', top:'50%', transform:'translateY(-50%)', width:'580px', height:'580px', pointerEvents:'none' }}>
          {[
            { inset:'0%',   dur:'62s',  dir:'normal',  opacity:.12 },
            { inset:'9%',   dur:'88s',  dir:'reverse', opacity:.08 },
            { inset:'20%',  dur:'72s',  dir:'normal',  opacity:.16 },
            { inset:'33%',  dur:'50s',  dir:'reverse', opacity:.08 },
            { inset:'44%',  dur:'38s',  dir:'normal',  opacity:.32 },
          ].map((r, i) => (
            <div key={i} className="ring" style={{
              inset: r.inset,
              borderColor: `rgba(201,169,110,${r.opacity})`,
              animationDuration: r.dur,
              animationDirection: r.dir as 'normal' | 'reverse',
            }} />
          ))}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'10px', height:'10px', borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 24px var(--gold), 0 0 60px rgba(201,169,110,.4)' }} />
        </div>

        {/* Hero içerik */}
        <div style={{ maxWidth:'640px', margin:'0 auto', padding:'0 32px', position:'relative', zIndex:2 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.08)', border:'1px solid rgba(201,169,110,.22)', padding:'8px 18px', marginBottom:'32px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--green)', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--green)' }}>Uzman Psikologlarla Tanışın</span>
          </div>

          <h1 style={{ fontSize:'clamp(2.6rem,5.5vw,5rem)', fontWeight:300, letterSpacing:'-.01em', marginBottom:'24px', lineHeight:1.1 }}>
            İyileşme<br />
            <em style={{ fontStyle:'italic', color:'var(--gold)' }}>yolculuğunuz</em><br />
            burada başlıyor.
          </h1>
          <p style={{ fontSize:'1.12rem', color:'var(--text)', maxWidth:'480px', marginBottom:'40px', lineHeight:1.85 }}>
            Kendinize uygun psikologu bulun. Güvenli, etik, komisyonsuz. Türkiye'nin en özenli terapist topluluğu sizi bekliyor.
          </p>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'56px' }}>
            <Link href="/danisan" className="btn btn-gold btn-lg" style={{ fontSize:'1.05rem' }}>Psikolog Bul →</Link>
            <a href="#nasil" className="btn btn-outline btn-lg" style={{ fontSize:'1.05rem' }}>Nasıl Çalışır?</a>
          </div>

          {/* Mini stats */}
          <div style={{ display:'flex', gap:'40px' }}>
            {[['%100','Gizlilik'],['%0','Komisyon'],['24s','İçinde Yanıt']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.7rem', fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginTop:'4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alt altın çizgi */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 30%,var(--gold) 50%,var(--gold-d) 70%,transparent)' }} />
      </section>

      {/* ════════════════ NASIL ÇALIŞIR — Dalga arka plan ════════════════ */}
      <section id="nasil" style={{ padding:'120px 0', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
        {/* Dalgalanan SVG arka plan */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'220px', opacity:.07, pointerEvents:'none', overflow:'hidden' }}>
          <svg viewBox="0 0 1440 220" style={{ width:'200%', animation:'waveDrift 18s linear infinite' }} preserveAspectRatio="none">
            <path d="M0,110 C240,40 480,180 720,110 C960,40 1200,180 1440,110 C1680,40 1920,180 2160,110 V220 H0Z" fill="var(--gold)" />
          </svg>
        </div>
        <div style={{ position:'absolute', bottom:'30px', left:0, right:0, height:'180px', opacity:.04, pointerEvents:'none', overflow:'hidden' }}>
          <svg viewBox="0 0 1440 180" style={{ width:'200%', animation:'waveDrift 26s linear infinite reverse' }} preserveAspectRatio="none">
            <path d="M0,90 C360,20 720,160 1080,90 C1440,20 1800,160 2160,90 V180 H0Z" fill="var(--gold-d)" />
          </svg>
        </div>

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'80px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Danışan Kılavuzu</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400 }}>Üç adımda <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru psikolog</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', position:'relative' }}>
            <div style={{ position:'absolute', top:'42px', left:'calc(16.5% + 24px)', right:'calc(16.5% + 24px)', height:'1px', background:'linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold-d))' }} />
            {[
              { n:'I',   icon:'◎', title:'Keşfet',    desc:'Uzmanlık alanı, yaklaşım ve şehre göre size uygun psikologları listeleyin. Her profil detaylı ve şeffaf.' },
              { n:'II',  icon:'◈', title:'Eşleş',     desc:'Beğendiğiniz psikologun profiline girin, randevu talep edin. 24 saat içinde yanıt alırsınız.' },
              { n:'III', icon:'⬡', title:'İyileş',    desc:'Online veya yüz yüze seanslarınıza başlayın. İlerlemenizi takip edin, gerekirse psikolog değiştirin.' },
            ].map(s => (
              <div key={s.n} style={{ textAlign:'center', padding:'0 48px' }}>
                <div style={{ width:'84px', height:'84px', borderRadius:'50%', border:'1px solid var(--gold-d)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', color:'var(--gold)', background:'var(--bg)', position:'relative', zIndex:1, boxShadow:'0 0 0 8px var(--bg)' }}>
                  {s.n}
                </div>
                <div style={{ fontSize:'1.3rem', marginBottom:'6px' }}>{s.icon}</div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', fontWeight:500, color:'var(--cream)', marginBottom:'12px' }}>{s.title}</h3>
                <p style={{ fontSize:'.93rem', color:'var(--text)', lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'60px' }}>
            <Link href="/danisan" className="btn btn-gold btn-lg">Hemen Psikolog Bul →</Link>
          </div>
        </div>
      </section>

      {/* Alıntı şeridi 1 — Nasıl Çalışır sonrası */}
      <QuoteBanner quote={QUOTES[0]} />

      {/* ════════════════ PSİKOLOGLAR — Nöron ağı ════════════════ */}
      <section id="psikologlar" style={{ padding:'120px 0', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
        {/* Nöron arka plan — SVG canvas */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:.35 }}>
          <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
            {/* Nöron noktaları */}
            {[
              [120,80],[280,150],[450,60],[600,180],[750,90],[900,160],[1100,70],[1200,140],
              [180,320],[350,280],[520,350],[680,300],[820,260],[970,330],[1150,280],
              [100,480],[300,420],[480,500],[640,440],[800,490],[1000,430],[1180,470],
              [200,600],[400,560],[580,620],[760,580],[950,550],[1120,610],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="var(--gold)"
                style={{ animation:`neuronPulse ${3 + (i % 4)}s ease-in-out ${i * .3}s infinite` }} />
            ))}
            {/* Bağlantı çizgileri */}
            {[
              [120,80,280,150],[280,150,450,60],[450,60,600,180],[600,180,750,90],
              [750,90,900,160],[900,160,1100,70],[280,150,180,320],[450,60,350,280],
              [600,180,520,350],[750,90,680,300],[900,160,820,260],[180,320,350,280],
              [350,280,520,350],[520,350,680,300],[680,300,820,260],[820,260,970,330],
              [100,480,180,320],[300,420,350,280],[480,500,520,350],[640,440,680,300],
            ].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gold)" strokeWidth=".8"
                style={{ animation:`neuronLine ${4 + (i % 5)}s ease-in-out ${i * .2}s infinite` }} />
            ))}
          </svg>
        </div>

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom:'12px' }}>Psikolog musunuz?</div>
              <div style={{ width:'40px', height:'1px', background:'var(--gold)', marginBottom:'20px' }} />
              <h2 style={{ fontSize:'clamp(2rem,3.5vw,3rem)', fontWeight:400, marginBottom:'24px' }}>
                Bir okula<br /><em style={{ fontStyle:'italic', color:'var(--gold)' }}>katılın.</em>
              </h2>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.85, marginBottom:'20px' }}>
                Mekteb bir platform değil, bir felsefe okuludur. Yeni mezunlar ustalarından öğrenir, ustalar iz bırakır. Komisyon yok — sadece aylık sabit aidat.
              </p>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.85, marginBottom:'36px' }}>
                Danışanlar uzmanlığınıza göre size yönlendirilir. Mentörlük verin ya da alın. Topluluğun gücüyle büyüyün.
              </p>
              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                <Link href="/kayit" className="btn btn-gold btn-lg invite-btn">Psikolog Olarak Katıl →</Link>
                <Link href="/#kademe" className="btn btn-outline btn-lg">Kademe Sistemi</Link>
              </div>
            </div>

            {/* Kademe kartları */}
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { roman:'I',   name:'Aday',  sub:'Yeni Mezun',        price:'299₺', color:'rgba(160,181,165,.12)', border:'rgba(160,181,165,.25)' },
                { roman:'II',  name:'Uzman', sub:'Deneyimli Psikolog', price:'599₺', color:'rgba(158,125,76,.12)',  border:'rgba(158,125,76,.35)'  },
                { roman:'III', name:'Üstat', sub:'Mentor & Otorite',   price:'999₺', color:'rgba(201,169,110,.12)', border:'rgba(201,169,110,.45)' },
              ].map(t => (
                <div key={t.name} style={{ background:t.color, border:`1px solid ${t.border}`, padding:'20px 28px', display:'flex', alignItems:'center', gap:'20px', transition:'transform .25s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(6px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2rem', color:'var(--gold)', fontWeight:300, width:'32px', flexShrink:0 }}>{t.roman}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.05rem', color:'var(--cream)', fontWeight:500 }}>{t.name}</div>
                    <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)', letterSpacing:'.08em' }}>{t.sub}</div>
                  </div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--gold-d)' }}>{t.price}<span style={{ fontSize:'.7rem' }}>/ay</span></div>
                </div>
              ))}
              <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', textAlign:'center', marginTop:'4px' }}>
                ✦ &nbsp; Tek bir seansta aidatınızı karşılarsınız
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ PSİKOLOG HEROsu — Eski anasayfa ════════════════ */}
      <section style={{ padding:'120px 0 80px', background:'var(--bg2)', position:'relative', overflow:'hidden', borderTop:'1px solid var(--border)' }}>
        {/* Astrolabe halkaları */}
        <div style={{ position:'absolute', right:'-80px', top:'50%', transform:'translateY(-50%)', width:'640px', height:'640px', pointerEvents:'none' }}>
          {[
            { inset:'0%',   dur:'60s',  dir:'normal',  op:.1  },
            { inset:'9%',   dur:'90s',  dir:'reverse', op:.07 },
            { inset:'19%',  dur:'70s',  dir:'normal',  op:.14 },
            { inset:'32%',  dur:'52s',  dir:'reverse', op:.07 },
            { inset:'43%',  dur:'40s',  dir:'normal',  op:.3  },
          ].map((r,i) => (
            <div key={i} className="ring" style={{ inset:r.inset, borderColor:`rgba(201,169,110,${r.op})`, animationDuration:r.dur, animationDirection:r.dir as 'normal'|'reverse' }} />
          ))}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'8px', height:'8px', borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 20px var(--gold)' }} />
        </div>
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'800px', height:'700px', background:'radial-gradient(ellipse,rgba(30,70,40,.4) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px', position:'relative', zIndex:2 }}>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.08)', border:'1px solid rgba(201,169,110,.22)', padding:'8px 18px', marginBottom:'32px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--gold)', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)' }}>Türkiye'nin İlk Psikolog Okulu</span>
          </div>
          <h2 style={{ fontSize:'clamp(2.6rem,5vw,4.6rem)', fontWeight:300, letterSpacing:'-.01em', marginBottom:'24px', maxWidth:'660px' }}>
            Bilgelik <em style={{ fontStyle:'italic', color:'var(--gold)' }}>aktarılır.</em><br />Deneyim kazanılır.
          </h2>
          <p style={{ fontSize:'1.12rem', color:'var(--text)', maxWidth:'520px', marginBottom:'44px', lineHeight:1.85 }}>
            Mekteb; yeni mezun psikologları ustalarıyla buluşturan, danışanları doğru terapistlere yönlendiren — komisyonsuz, topluluğa dayalı platform.
          </p>
          {/* Stats */}
          <div style={{ display:'flex', gap:'40px', paddingTop:'12px', borderTop:'1px solid var(--border)', maxWidth:'460px' }}>
            {[['%0','Komisyon'],['3','Kademe'],['₺299','den başlayan aidat']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.9rem', fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginTop:'5px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı 2 — Psikolog hero sonrası */}
      <QuoteBanner quote={QUOTES[3]} />

      {/* ── Neden Mekteb ── */}
      <section style={{ padding:'100px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'72px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Neden Mekteb?</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,3rem)', fontWeight:400 }}>Bir platform değil, <em style={{ fontStyle:'italic', color:'var(--gold)' }}>bir okul</em></h2>
            <p style={{ maxWidth:'520px', margin:'16px auto 0', fontSize:'1rem', color:'var(--text)' }}>Diğer platformlar danışan satarken, Mekteb bilgelik inşa eder.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
            {[
              { icon:'◈', title:'Sıfır Komisyon',          desc:'Her seansınızın karşılığı tamamen size aittir. Aylık sabit aidat — başka hiçbir kesinti yok.' },
              { icon:'⟁', title:'Canlı Topluluk',          desc:'Alanında köklü psikologlarla aynı çatı altında var olun. Vaka tartışmaları, süpervizyon grupları.' },
              { icon:'⬡', title:'Yapılandırılmış Mentörlük', desc:'Yeni mezunlar için ustadan öğrenmek, deneyimliler için iz bırakmak. Her kademede anlamlı bir rol.' },
            ].map(c => (
              <div key={c.title} style={{ background:'var(--bg2)', padding:'48px 40px', border:'1px solid var(--border)', transition:'border-color .3s, background .3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-h)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)'; }}>
                <div style={{ width:'50px', height:'50px', border:'1px solid var(--border-h)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', fontSize:'1.3rem', color:'var(--gold)' }}>{c.icon}</div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', fontWeight:400, color:'var(--cream)', marginBottom:'14px' }}>{c.title}</h3>
                <p style={{ fontSize:'.95rem', color:'var(--text)', lineHeight:1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Psikolog için Nasıl Çalışır ── */}
      <section style={{ padding:'100px 0', background:'var(--bg2)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'72px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Süreç</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,3rem)', fontWeight:400 }}>Üç adımda <em style={{ fontStyle:'italic', color:'var(--gold)' }}>büyüme</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', position:'relative' }}>
            <div style={{ position:'absolute', top:'38px', left:'calc(16.5% + 24px)', right:'calc(16.5% + 24px)', height:'1px', background:'linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold-d))' }} />
            {[
              { n:'I',   title:'Kayıt & Profil',     desc:'Diploma, uzmanlık alanı ve deneyim bilgilerinizle profilinizi oluşturun. Kademiz belirlenir, mentörünüzle eşleşirsiniz.' },
              { n:'II',  title:'Eşleşme & Randevu',  desc:'Deneyiminize ve uzmanlığınıza göre danışanlar size yönlendirilir. Takvim entegrasyonuyla randevularınızı yönetin.' },
              { n:'III', title:'Büyü & Rehber Ol',   desc:'Mesleğinizde ilerledikçe kademedeki yeriniz yükselir. Sizi yetiştirenlerin izinden gidin — sonra siz de iz bırakın.' },
            ].map(s => (
              <div key={s.n} style={{ textAlign:'center', padding:'0 44px' }}>
                <div style={{ width:'76px', height:'76px', borderRadius:'50%', border:'1px solid var(--gold-d)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontFamily:'Cormorant Garant,serif', fontSize:'1.7rem', color:'var(--gold)', background:'var(--bg2)', position:'relative', zIndex:1, boxShadow:'0 0 0 8px var(--bg2)' }}>{s.n}</div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.35rem', fontWeight:500, color:'var(--cream)', marginBottom:'12px' }}>{s.title}</h3>
                <p style={{ fontSize:'.92rem', color:'var(--text)', lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı 3 — Nasıl Çalışır (psikolog) sonrası */}
      <QuoteBanner quote={QUOTES[6]} />

      {/* ── Kademe Sistemi (tam versiyon) ── */}
      <section id="kademe" style={{ padding:'100px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Kademe Sistemi</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,3rem)', fontWeight:400 }}>Her psikolog için <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru yer</em></h2>
            <p style={{ maxWidth:'500px', margin:'16px auto 0', fontSize:'1rem', color:'var(--text)' }}>Kademeler deneyimi ödüllendirir, yeni mezunları korur, topluluğu dengeler.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'22px' }}>
            {[
              {
                roman:'I', name:'Aday', sub:'Yeni Mezun', price:'299₺', featured:false,
                features:['Kişisel mentör ataması','Sınırlı danışan kotası (3–5)','Süpervizyon seanslarına katılım','Vaka tartışma grupları','Üstatla ortak seans imkânı'],
              },
              {
                roman:'II', name:'Uzman', sub:'Deneyimli Psikolog', price:'599₺', featured:true,
                features:['Sınırsız danışan kabulü','Öncelikli danışan eşleşmesi','Öne çıkan profil rozeti','Topluluk etkinliklerine tam erişim','İsteğe bağlı mentörlük','Vaka süpervizyonu liderliği'],
              },
              {
                roman:'III', name:'Üstat', sub:'Mentor & Otorite', price:'999₺', featured:false,
                features:['Tüm Uzman özellikleri','Resmi mentörlük yetkisi','Aday psikologları seansa alma','Platform içi yayın & makale hakları','Karar komitesi üyeliği','Yönlendirme bonusu'],
              },
            ].map(t => (
              <div key={t.name} style={{ border:`1px solid ${t.featured ? 'rgba(201,169,110,.4)' : 'var(--border)'}`, background:t.featured ? 'var(--bg3)' : 'var(--bg2)', padding:'44px 36px', position:'relative', transition:'transform .3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                {t.featured && <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'#090f0c', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', padding:'3px 16px', whiteSpace:'nowrap' }}>Felsefe Okulu</div>}
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.8rem', color:'var(--gold)', marginBottom:'6px', lineHeight:1 }}>{t.roman}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', color:'var(--cream)', fontWeight:500, marginBottom:'4px' }}>{t.name}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'20px' }}>{t.sub}</div>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px', marginBottom:'28px' }}>
                  {t.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'.88rem', color:'var(--text)' }}>
                      <span style={{ color:t.featured ? 'var(--gold)' : 'var(--gold-d)', fontSize:'.5rem', marginTop:'7px', flexShrink:0 }}>◆</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <span style={{ padding:'4px 14px', border:'1px solid var(--border-h)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold-d)' }}>{t.price} / ay</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı 4 — Kademe sonrası */}
      <QuoteBanner quote={QUOTES[5]} />

      {/* ── Mentörlük ── */}
      <section style={{ padding:'100px 0', background:'var(--bg2)', overflow:'hidden' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom:'12px' }}>Yeni Mezunlar İçin</div>
              <div style={{ width:'40px', height:'1px', background:'var(--gold)', marginBottom:'20px' }} />
              <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,3rem)', fontWeight:400, marginBottom:'20px' }}>
                Tek başına değil, <em style={{ fontStyle:'italic', color:'var(--gold)' }}>yanında</em>
              </h2>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.85, marginBottom:'16px' }}>
                Mezuniyet sonrası en büyük korku: yalnız kalmak. İlk danışanınızı alırken, ilk zor vakayı yönetirken — bir üstatınız olsun.
              </p>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.85, marginBottom:'32px' }}>
                Mekteb'in mentörlük sistemi, deneyimi aktarır. Aday psikologlar sadece kitaptan değil; gerçek seanslardan, gerçek vakalardan öğrenir.
              </p>
              <div style={{ borderLeft:'2px solid var(--gold-d)', paddingLeft:'24px', marginBottom:'32px' }}>
                <blockquote style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.35rem', fontStyle:'italic', color:'var(--cream)', fontWeight:300, lineHeight:1.55 }}>
                  &ldquo;Bir psikologun yetişmesi on yıl alır. Doğru bir üstatla, bu yolculuk hem daha kısa hem daha derin olur.&rdquo;
                </blockquote>
                <cite style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginTop:'10px', fontStyle:'normal' }}>— Mekteb Felsefesi</cite>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {[
                { n:'1:3', label:'Üstat — Aday oranı' },
                { n:'6 ay', label:'Ortalama mentörlük süresi' },
                { n:'Ortak', label:'Seans imkânı — gerçek vakalar' },
              ].map((s,i) => (
                <div key={s.n} style={{ padding:'32px 40px', background: i % 2 === 0 ? 'var(--bg3)' : 'var(--bg4)', border:'1px solid var(--border)', borderTop: i > 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'3rem', color:'var(--gold)', fontWeight:300, lineHeight:1, marginBottom:'8px' }}>{s.n}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)', letterSpacing:'.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Psikolog CTA — Kayıt ── */}
      <section style={{ padding:'120px 0', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
        {/* Nefes halkası */}
        {[1, 1.5, 2.1, 2.8].map((s, i) => (
          <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:'360px', height:'360px', borderRadius:'50%', border:'1px solid rgba(201,169,110,.07)', animation:`breathe ${4.5 + i * .8}s ease-in-out ${i * .7}s infinite` }} />
        ))}
        <div style={{ maxWidth:'640px', margin:'0 auto', textAlign:'center', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Kurucu Üyelik</div>
          <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 24px' }} />
          <h2 style={{ fontSize:'clamp(2rem,4vw,3.6rem)', fontWeight:400, marginBottom:'20px' }}>
            Türkiye'nin psikoloji <em style={{ fontStyle:'italic', color:'var(--gold)' }}>okulunsunuz.</em>
          </h2>
          <p style={{ fontSize:'1.08rem', color:'var(--text)', marginBottom:'20px', lineHeight:1.8 }}>
            İlk 100 psikolog arasına girin. Kurucu üyeler fiyat garantisi, özel rozet ve topluluk kararlarında oy hakkı kazanır.
          </p>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold)', marginBottom:'40px', letterSpacing:'.06em' }}>
            ✦ &nbsp; Tek bir seansta aidatınızı karşılarsınız
          </p>
          <Link href="/kayit" className="btn btn-gold btn-lg invite-btn" style={{ fontSize:'1.1rem', padding:'16px 48px' }}>
            Psikolog Olarak Başvur →
          </Link>
          <p style={{ marginTop:'18px', fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>
            İlk 100 psikolog — kurucu üye fiyatı, ömür boyu geçerli
          </p>
        </div>
      </section>

      {/* Alıntı 5 — Psikolog CTA sonrası */}
      <QuoteBanner quote={QUOTES[1]} />

      {/* ════════════════ DAVET ET ════════════════ */}
      <section style={{ padding:'80px 0', background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'52px' }}>
            <div className="eyebrow" style={{ marginBottom:'8px' }}>Topluluk</div>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400 }}>
              Mekteb'i <em style={{ fontStyle:'italic', color:'var(--gold)' }}>büyütelim</em>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
            {/* Danışan için davet */}
            <div style={{ padding:'36px 40px', background:'var(--bg3)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:'2rem', marginBottom:'16px' }}>🤝</div>
              <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.3rem', color:'var(--cream)', marginBottom:'10px' }}>Arkadaşınızı Davet Edin</h3>
              <p style={{ fontSize:'.93rem', color:'var(--text)', lineHeight:1.7, marginBottom:'24px' }}>
                Psikolojik destek almayı düşünen biri var mı çevrenizde? Mekteb linkini paylaşın, doğru psikologu bulmalarına yardımcı olun.
              </p>
              <button
                onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard?.writeText('https://mekteb.vercel.app/danisan'); }}
                className="btn btn-outline invite-btn"
                style={{ fontSize:'.9rem', padding:'10px 22px' }}
              >
                🔗 Linki Kopyala
              </button>
            </div>
            {/* Psikolog için davet */}
            <div style={{ padding:'36px 40px', background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.2)' }}>
              <div style={{ fontSize:'2rem', marginBottom:'16px' }}>✦</div>
              <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.3rem', color:'var(--cream)', marginBottom:'10px' }}>Meslektaşınızı Davet Edin</h3>
              <p style={{ fontSize:'.93rem', color:'var(--text)', lineHeight:1.7, marginBottom:'24px' }}>
                Değer verdiğiniz bir psikolog var mı? Mekteb'e katılmaları için davet bağlantısını gönderin.
              </p>
              <button
                onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard?.writeText('https://mekteb.vercel.app/kayit'); }}
                className="btn btn-gold invite-btn"
                style={{ fontSize:'.9rem', padding:'10px 22px' }}
              >
                ✉ Davet Bağlantısı
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ CTA — Nefes halkası ════════════════ */}
      <section style={{ padding:'140px 0', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
        {/* Nefes alan konsantrik halkalar */}
        {[1, 1.4, 1.9, 2.5, 3.2].map((scale, i) => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%',
            width:'400px', height:'400px', borderRadius:'50%',
            border:'1px solid rgba(201,169,110,.08)',
            animation:`breathe ${5 + i}s ease-in-out ${i * .8}s infinite`,
          }} />
        ))}
        {/* Merkez ışık */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(201,169,110,.1) 0%,transparent 70%)', animation:'breathe 4s ease-in-out infinite' }} />

        <div style={{ maxWidth:'680px', margin:'0 auto', textAlign:'center', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Hazır mısınız?</div>
          <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 24px' }} />
          <h2 style={{ fontSize:'clamp(2rem,4vw,3.6rem)', fontWeight:400, marginBottom:'20px' }}>
            Doğru psikologla<br />
            <em style={{ fontStyle:'italic', color:'var(--gold)' }}>her şey değişir.</em>
          </h2>
          <p style={{ fontSize:'1.08rem', color:'var(--text)', marginBottom:'48px', lineHeight:1.8 }}>
            Aramanız burada başlıyor. Yüzlerce deneyimli, onaylanmış psikolog sizi bekliyor.
          </p>
          <Link href="/danisan" className="btn btn-gold btn-lg" style={{ fontSize:'1.1rem', padding:'16px 40px' }}>
            Psikolog Bul →
          </Link>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'52px 0 32px' }}>
        <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 20%,var(--gold) 50%,var(--gold-d) 80%,transparent)', marginBottom:'52px', opacity:.4 }} />
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'48px', marginBottom:'48px' }}>
            <div>
              <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none', display:'block', marginBottom:'14px' }}>
                Mek<span style={{ color:'var(--gold)' }}>teb</span>
              </Link>
              <p style={{ fontSize:'.88rem', color:'var(--muted)', lineHeight:1.7, maxWidth:'240px' }}>
                Psikologların büyüdüğü, danışanların iyileştiği, bilgeliğin aktarıldığı platform.
              </p>
            </div>
            {[
              { title:'Danışanlar', links:[['Psikolog Bul','/danisan'],['Nasıl Çalışır?','#nasil'],['Psikolog Nedir?','#']] },
              { title:'Psikologlar', links:[['Kayıt Ol','/kayit'],['Kademe Sistemi','#psikologlar'],['Giriş Yap','/giris']] },
              { title:'Mekteb', links:[['Hakkımızda','#'],['İletişim','#gorusiistek'],['Gizlilik','#']] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'16px' }}>{col.title}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {col.links.map(([l, h]) => (
                    <Link key={l} href={h} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)', textDecoration:'none', transition:'color .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:'24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>© 2026 Mekteb. Tüm hakları saklıdır.</p>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)', fontStyle:'italic' }}>Türkiye'nin Psikoloji Okulu</p>
          </div>
        </div>
      </footer>

      {/* ════════════════ GÖRÜŞ / İSTEK — Sabit buton ════════════════ */}
      <div id="gorusiistek" style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:500 }}>
        <a href="mailto:ozkaya.mrt@gmail.com?subject=Mekteb Görüş/İstek" style={{
          display:'flex', alignItems:'center', gap:'10px',
          background:'var(--bg2)', border:'1px solid var(--border-h)',
          padding:'12px 20px',
          fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)',
          textDecoration:'none',
          backdropFilter:'blur(12px)',
          transition:'all .3s',
          boxShadow:'0 4px 24px rgba(0,0,0,.4)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-h)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}
        >
          <span style={{ fontSize:'1rem' }}>💬</span>
          Görüş / İstek
        </a>
      </div>

      {/* Scroll reveal script */}
      <script dangerouslySetInnerHTML={{ __html: `
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add('in'), i * 80);
              obs.unobserve(e.target);
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      `}} />
    </div>
  )
}
