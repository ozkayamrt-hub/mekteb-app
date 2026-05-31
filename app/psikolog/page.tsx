'use client'

import Link from 'next/link'
import type { Metadata } from 'next'

const PSY_QUOTES = [
  { text: "Sevgisiz geçen çocukluk yılları, hastalıkların çoğunun kaynağıdır.", author: "Sigmund Freud", field: "Psikanaliz" },
  { text: "Bilinçdışı, şuurlu zihnin red ettiği her şeyi içerir.", author: "Carl Gustav Jung", field: "Analitik Psikoloji" },
  { text: "Her şeyin bir anlamı olduğuna inanan insan, her şeye katlanabilir.", author: "Viktor Frankl", field: "Logoterapist" },
  { text: "İnsanı tanımak istiyorsan, ona ne söylediğini değil ne yaptığını izle.", author: "Alfred Adler", field: "Bireysel Psikoloji" },
  { text: "Karanlığı aydınlatmadan önce önce onu kabul etmelisin.", author: "Carl Gustav Jung", field: "Analitik Psikoloji" },
]

function QuoteBanner({ q }: { q: typeof PSY_QUOTES[0] }) {
  return (
    <div style={{ padding:'48px 0', position:'relative', overflow:'hidden', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(270deg,rgba(20,60,40,.5),rgba(10,25,40,.7),rgba(30,15,50,.35),rgba(10,35,25,.6))', backgroundSize:'400% 400%', animation:'aurora 16s ease infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', height:'180px', background:'radial-gradient(ellipse,rgba(201,169,110,.06) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'0 32px', textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:'2rem', color:'var(--gold-d)', opacity:.3, fontFamily:'Georgia,serif', lineHeight:1, marginBottom:'8px' }}>&ldquo;</div>
        <blockquote style={{ fontFamily:'Cormorant Garant,serif', fontSize:'clamp(1.1rem,2.2vw,1.45rem)', fontStyle:'italic', color:'var(--cream)', fontWeight:300, lineHeight:1.65, marginBottom:'18px' }}>
          {q.text}
        </blockquote>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'14px' }}>
          <div style={{ height:'1px', width:'28px', background:'var(--gold-d)' }} />
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--gold)', fontWeight:500 }}>{q.author}</span>
          <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', color:'var(--muted)', letterSpacing:'.08em' }}>{q.field}</span>
          <div style={{ height:'1px', width:'28px', background:'var(--gold-d)' }} />
        </div>
      </div>
    </div>
  )
}

export default function PsikologPage() {
  return (
    <div style={{ overflowX:'hidden' }}>
      <style>{`
        @keyframes rotateRing { to { transform: rotate(360deg); } }
        @keyframes aurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(-120vh) translateX(var(--dx,20px)) scale(.4);opacity:0} }
        @keyframes breathe { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.06} 50%{transform:translate(-50%,-50%) scale(1.18);opacity:.13} }
        @keyframes neuronPulse { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.75;transform:scale(1.7)} }
        @keyframes neuronLine  { 0%,100%{opacity:.05} 50%{opacity:.2} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        .ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.1); animation:rotateRing linear infinite; }
        .ring::before { content:''; position:absolute; width:5px; height:5px; background:var(--gold); border-radius:50%; top:0; left:50%; transform:translateX(-50%); }
        .particle { position:absolute; border-radius:50%; background:var(--gold); pointer-events:none; animation:floatUp var(--dur,12s) ease-in var(--delay,0s) infinite; }
        .tier-card { transition: transform .3s ease, border-color .3s; }
        .tier-card:hover { transform: translateY(-5px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, background:'rgba(9,15,12,.92)', backdropFilter:'blur(24px)', borderBottom:'1px solid var(--border)', padding:'14px 0' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <div style={{ display:'flex', gap:'28px', alignItems:'center' }}>
            <a href="#neden" style={{ fontFamily:'Cormorant Garant,serif', color:'var(--text)', textDecoration:'none' }}>Neden Mekteb?</a>
            <a href="#kademe" style={{ fontFamily:'Cormorant Garant,serif', color:'var(--text)', textDecoration:'none' }}>Kademe Sistemi</a>
            <a href="#fiyat" style={{ fontFamily:'Cormorant Garant,serif', color:'var(--text)', textDecoration:'none' }}>Üyelik</a>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)', textDecoration:'none', padding:'8px 14px' }}>← Danışan Sayfası</Link>
            <Link href="/kayit" className="btn btn-gold" style={{ fontSize:'.9rem', padding:'9px 22px' }}>Başvur →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO — Psikolog ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:'80px', background:'var(--bg2)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'800px', background:'radial-gradient(ellipse,rgba(30,70,40,.45) 0%,transparent 70%)', pointerEvents:'none' }} />

        {/* Partiküller */}
        {([
          [8,3,14,0,30],[20,2,18,2,-20],[35,4,12,1,15],[50,2,16,4,-28],
          [65,3,20,2,22],[78,2,15,6,-14],[88,4,13,3,18],[95,2,17,1,-22],
        ] as number[][]).map(([l,s,d,dl,dx], i) => (
          <div key={i} className="particle" style={{ left:`${l}%`, bottom:'-10px', width:`${s}px`, height:`${s}px`, opacity:.65, '--dur':`${d}s`, '--delay':`${dl}s`, '--dx':`${dx}px` } as React.CSSProperties} />
        ))}

        {/* Astrolabe — büyük */}
        <div style={{ position:'absolute', right:'-80px', top:'50%', transform:'translateY(-50%)', width:'640px', height:'640px', pointerEvents:'none' }}>
          {([
            [0,.12,'62s','normal'],[9,.08,'88s','reverse'],[19,.15,'72s','normal'],
            [32,.08,'52s','reverse'],[43,.3,'40s','normal'],
          ] as [number,number,string,string][]).map(([ins,op,dur,dir],i) => (
            <div key={i} className="ring" style={{ inset:`${ins}%`, borderColor:`rgba(201,169,110,${op})`, animationDuration:dur, animationDirection:dir as 'normal'|'reverse' }} />
          ))}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'10px', height:'10px', borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 24px var(--gold), 0 0 60px rgba(201,169,110,.4)' }} />
        </div>

        <div style={{ maxWidth:'640px', margin:'0 auto 0 calc((100vw - 1200px)/2)', paddingLeft:'32px', paddingRight:'32px', position:'relative', zIndex:2 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.08)', border:'1px solid rgba(201,169,110,.22)', padding:'8px 18px', marginBottom:'32px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--gold)', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--gold)' }}>Türkiye'nin İlk Psikolog Okulu</span>
          </div>
          <h1 style={{ fontSize:'clamp(2.8rem,5.5vw,5.2rem)', fontWeight:300, letterSpacing:'-.01em', marginBottom:'24px', lineHeight:1.1 }}>
            Bilgelik <em style={{ fontStyle:'italic', color:'var(--gold)' }}>aktarılır.</em><br />
            Deneyim kazanılır.
          </h1>
          <p style={{ fontSize:'1.12rem', color:'var(--text)', maxWidth:'500px', marginBottom:'40px', lineHeight:1.85 }}>
            Mekteb; yeni mezun psikologları ustalarıyla, danışanları doğru terapistleriyle buluşturan — komisyonsuz, topluluğa dayalı, büyümeyi esas alan bir platform.
          </p>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'52px' }}>
            <Link href="/kayit" className="btn btn-gold btn-lg">Psikolog Olarak Başvur →</Link>
            <a href="#neden" className="btn btn-outline btn-lg">Neden Mekteb?</a>
          </div>
          <div style={{ display:'flex', gap:'36px', borderTop:'1px solid var(--border)', paddingTop:'24px' }}>
            {[['%0','Komisyon'],['3','Kademe'],['1','Seansla Aidat']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.8rem', fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginTop:'5px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 30%,var(--gold) 50%,var(--gold-d) 70%,transparent)' }} />
      </section>

      {/* Alıntı 1 */}
      <QuoteBanner q={PSY_QUOTES[0]} />

      {/* ── NEDEN MEKTEB ── */}
      <section id="neden" style={{ padding:'110px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'72px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Neden Mekteb?</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400 }}>Bir platform değil, <em style={{ fontStyle:'italic', color:'var(--gold)' }}>bir okul</em></h2>
            <p style={{ maxWidth:'520px', margin:'16px auto 0', fontSize:'1rem', color:'var(--text)' }}>Diğer platformlar danışan satarken, Mekteb bilgelik inşa eder.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
            {[
              { icon:'◈', title:'Sıfır Komisyon',           desc:'Her seansınızın karşılığı tamamen size aittir. Aylık sabit aidat — başka hiçbir kesinti yok. Kazandıkça siz büyürsünüz, biz değil.' },
              { icon:'⟁', title:'Canlı Topluluk',           desc:'Alanında köklü psikologlarla aynı çatı altında var olun. Vaka tartışmaları, süpervizyon grupları, ortak yayınlar — mesleki yalnızlığın sonu.' },
              { icon:'⬡', title:'Yapılandırılmış Mentörlük', desc:'Yeni mezunlar için ustadan öğrenmek, deneyimliler için iz bırakmak. Her kademede anlamlı bir rol, her rolde anlamlı bir büyüme.' },
            ].map(c => (
              <div key={c.title} style={{ background:'var(--bg2)', padding:'52px 44px', border:'1px solid var(--border)', transition:'border-color .3s, background .3s, transform .3s' }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor='var(--border-h)'; d.style.background='var(--bg3)'; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor='var(--border)'; d.style.background='var(--bg2)'; }}>
                <div style={{ width:'52px', height:'52px', border:'1px solid var(--border-h)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'28px', fontSize:'1.4rem', color:'var(--gold)' }}>{c.icon}</div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:400, color:'var(--cream)', marginBottom:'14px' }}>{c.title}</h3>
                <p style={{ fontSize:'.95rem', color:'var(--text)', lineHeight:1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı 2 */}
      <QuoteBanner q={PSY_QUOTES[1]} />

      {/* ── NASIL ÇALIŞIR — Psikolog ── */}
      <section style={{ padding:'110px 0', background:'var(--bg2)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'72px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Süreç</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400 }}>Üç adımda <em style={{ fontStyle:'italic', color:'var(--gold)' }}>büyüme</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', position:'relative' }}>
            <div style={{ position:'absolute', top:'38px', left:'calc(16.5% + 24px)', right:'calc(16.5% + 24px)', height:'1px', background:'linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold-d))' }} />
            {[
              { n:'I',   title:'Kayıt & Profil',    desc:'Diploma, uzmanlık ve deneyim bilgilerinizle profilinizi oluşturun. Kademiz belirlenir, mentörünüzle eşleşirsiniz.' },
              { n:'II',  title:'Eşleşme & Randevu', desc:'Deneyiminize ve uzmanlığınıza göre danışanlar size yönlendirilir. Takvim entegrasyonuyla randevularınızı yönetin.' },
              { n:'III', title:'Büyü & Rehber Ol',  desc:'Mesleğinizde ilerledikçe kademedeki yeriniz yükselir. Sizi yetiştirenlerin izinden gidin — sonra siz de iz bırakın.' },
            ].map(s => (
              <div key={s.n} style={{ textAlign:'center', padding:'0 44px' }}>
                <div style={{ width:'76px', height:'76px', borderRadius:'50%', border:'1px solid var(--gold-d)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', color:'var(--gold)', background:'var(--bg2)', position:'relative', zIndex:1, boxShadow:'0 0 0 8px var(--bg2)' }}>
                  {s.n}
                </div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.35rem', fontWeight:500, color:'var(--cream)', marginBottom:'12px' }}>{s.title}</h3>
                <p style={{ fontSize:'.92rem', color:'var(--text)', lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı 3 */}
      <QuoteBanner q={PSY_QUOTES[2]} />

      {/* ── KADEME SİSTEMİ ── */}
      <section id="kademe" style={{ padding:'110px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Kademe Sistemi</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400 }}>Her psikolog için <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru yer</em></h2>
            <p style={{ maxWidth:'500px', margin:'16px auto 0', fontSize:'1rem', color:'var(--text)' }}>Kademeler deneyimi ödüllendirir, yeni mezunları korur, topluluğu dengeler.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'22px' }}>
            {[
              { roman:'I', name:'Aday', sub:'Yeni Mezun', price:'299₺', featured:false,
                features:['Kişisel mentör ataması','Sınırlı danışan kotası (3–5)','Süpervizyon seanslarına katılım','Vaka tartışma grupları','Üstatla ortak seans imkânı'] },
              { roman:'II', name:'Uzman', sub:'Deneyimli Psikolog', price:'599₺', featured:true,
                features:['Sınırsız danışan kabulü','Öncelikli danışan eşleşmesi','Öne çıkan profil rozeti','Topluluk etkinliklerine tam erişim','İsteğe bağlı mentörlük','Vaka süpervizyonu liderliği'] },
              { roman:'III', name:'Üstat', sub:'Mentor & Otorite', price:'999₺', featured:false,
                features:['Tüm Uzman özellikleri','Resmi mentörlük yetkisi','Aday psikologları seansa alma','Platform içi yayın & makale hakları','Karar komitesi üyeliği','Yönlendirme bonusu'] },
            ].map(t => (
              <div key={t.name} className="tier-card" style={{ border:`1px solid ${t.featured ? 'rgba(201,169,110,.4)' : 'var(--border)'}`, background:t.featured ? 'var(--bg3)' : 'var(--bg2)', padding:'44px 36px', position:'relative' }}>
                {t.featured && <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'#090f0c', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', padding:'3px 16px', whiteSpace:'nowrap' }}>Felsefe Okulu</div>}
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.8rem', color:'var(--gold)', lineHeight:1, marginBottom:'6px' }}>{t.roman}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', color:'var(--cream)', fontWeight:500, marginBottom:'4px' }}>{t.name}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'20px' }}>{t.sub}</div>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px', marginBottom:'28px' }}>
                  {t.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'.88rem', color:'var(--text)' }}>
                      <span style={{ color: t.featured ? 'var(--gold)' : 'var(--gold-d)', fontSize:'.5rem', marginTop:'7px', flexShrink:0 }}>◆</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ padding:'4px 14px', border:'1px solid var(--border-h)', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold-d)' }}>{t.price} / ay</span>
                  <Link href="/kayit" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--gold)', textDecoration:'none' }}>Başvur →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alıntı 4 */}
      <QuoteBanner q={PSY_QUOTES[3]} />

      {/* ── MENTÖRLÜK ── */}
      <section style={{ padding:'110px 0', background:'var(--bg2)', overflow:'hidden' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom:'12px' }}>Yeni Mezunlar İçin</div>
              <div style={{ width:'40px', height:'1px', background:'var(--gold)', marginBottom:'20px' }} />
              <h2 style={{ fontSize:'clamp(2rem,3.5vw,3rem)', fontWeight:400, marginBottom:'20px' }}>
                Tek başına değil, <em style={{ fontStyle:'italic', color:'var(--gold)' }}>yanında</em>
              </h2>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.85, marginBottom:'16px' }}>
                Mezuniyet sonrası en büyük korku: yalnız kalmak. İlk danışanınızı alırken, ilk zor vakayı yönetirken, ilk tükenmişlik hissinde — bir üstatınız olsun.
              </p>
              <p style={{ fontSize:'1rem', color:'var(--text)', lineHeight:1.85, marginBottom:'32px' }}>
                Mekteb'in mentörlük sistemi deneyimi aktarır. Aday psikologlar sadece kitaptan değil; gerçek seanslardan, gerçek vakalardan, gerçek insanlardan öğrenir.
              </p>
              <div style={{ borderLeft:'2px solid var(--gold-d)', paddingLeft:'24px', marginBottom:'36px' }}>
                <blockquote style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.35rem', fontStyle:'italic', color:'var(--cream)', fontWeight:300, lineHeight:1.55 }}>
                  &ldquo;Bir psikologun yetişmesi on yıl alır. Doğru bir üstatla, bu yolculuk hem daha kısa hem daha derin olur.&rdquo;
                </blockquote>
                <cite style={{ display:'block', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginTop:'10px', fontStyle:'normal' }}>— Mekteb Felsefesi</cite>
              </div>
              <Link href="/kayit" className="btn btn-gold btn-lg">Aday Olarak Başvur →</Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {[
                { n:'1:3',   label:'Üstat — Aday oranı' },
                { n:'6 ay',  label:'Ortalama mentörlük süresi' },
                { n:'Ortak', label:'Seans imkânı — gerçek vakalar' },
              ].map((s,i) => (
                <div key={s.n} style={{ padding:'32px 40px', background: i%2===0 ? 'var(--bg3)' : 'var(--bg4)', border:'1px solid var(--border)', borderTop: i>0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'3rem', color:'var(--gold)', fontWeight:300, lineHeight:1, marginBottom:'8px' }}>{s.n}</div>
                  <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', color:'var(--muted)', letterSpacing:'.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alıntı 5 */}
      <QuoteBanner q={PSY_QUOTES[4]} />

      {/* ── FİYATLANDIRMA ── */}
      <section id="fiyat" style={{ padding:'110px 0', background:'var(--bg)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Üyelik</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400 }}>Şeffaf. <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Adil.</em> Sabit.</h2>
            <p style={{ maxWidth:'460px', margin:'16px auto 0', fontSize:'1rem', color:'var(--text)' }}>Seans başına komisyon yok. Sürpriz ücret yok. Kazancınız tamamen size ait.</p>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(201,169,110,.07)', border:'1px solid rgba(201,169,110,.2)', padding:'10px 20px', marginTop:'20px', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold)' }}>
              ◆ &nbsp; Tek bir seansla aidatınızın tamamını karşılayabilirsiniz
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'22px' }}>
            {[
              { tier:'Aday', price:'299', features:['Mentör eşleştirmesi','3–5 danışan kabulü','Süpervizyon grupları','Platform profili'], featured:false },
              { tier:'Uzman', price:'599', features:['Sınırsız danışan kabulü','Öncelikli eşleştirme','Öne çıkan profil','Topluluk etkinlikleri','İsteğe bağlı mentörlük'], featured:true },
              { tier:'Üstat', price:'999', features:['Tüm Uzman özellikleri','Resmi mentörlük yetkisi','Ortak seans hakkı','Üstat rozeti','Komite üyeliği','Yönlendirme bonusu'], featured:false },
            ].map(p => (
              <div key={p.tier} className="tier-card" style={{ border:`1px solid ${p.featured ? 'rgba(201,169,110,.4)' : 'var(--border)'}`, background: p.featured ? 'var(--bg3)' : 'var(--bg2)', padding:'44px 36px', position:'relative' }}>
                {p.featured && <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'#090f0c', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', padding:'3px 16px', whiteSpace:'nowrap' }}>Önerilen</div>}
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.82rem', letterSpacing:'.14em', textTransform:'uppercase', color: p.featured ? 'var(--gold)' : 'var(--gold-d)', marginBottom:'16px' }}>{p.tier} Üyelik</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'6px' }}>
                  <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.2rem', color:'var(--gold)' }}>₺</span>
                  <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'3.4rem', fontWeight:300, color:'var(--cream)', lineHeight:1 }}>{p.price}</span>
                </div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)', marginBottom:'28px', letterSpacing:'.06em' }}>/ aylık · KDV dahil</div>
                <div style={{ height:'1px', background:'var(--border)', marginBottom:'24px' }} />
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'12px', marginBottom:'32px' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'.88rem', color:'var(--text)' }}>
                      <span style={{ color:'var(--gold)', fontSize:'.7rem' }}>✦</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/kayit" className="btn" style={{ width:'100%', justifyContent:'center', background: p.featured ? 'var(--gold)' : 'transparent', color: p.featured ? '#090f0c' : 'var(--cream)', border:`1px solid ${p.featured ? 'var(--gold)' : 'var(--border-h)'}`, padding:'12px' }}>
                  Başvur →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BAŞVURU CTA ── */}
      <section style={{ padding:'130px 0', background:'var(--bg2)', position:'relative', overflow:'hidden' }}>
        {[1,1.5,2.1,2.8,3.5].map((s,i) => (
          <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:'400px', height:'400px', borderRadius:'50%', border:'1px solid rgba(201,169,110,.07)', animation:`breathe ${5+i}s ease-in-out ${i*.8}s infinite` }} />
        ))}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(201,169,110,.1) 0%,transparent 70%)', animation:'breathe 4s ease-in-out infinite' }} />
        <div style={{ maxWidth:'660px', margin:'0 auto', textAlign:'center', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Kurucu Üyelik</div>
          <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 24px' }} />
          <h2 style={{ fontSize:'clamp(2rem,4vw,3.6rem)', fontWeight:400, marginBottom:'20px' }}>
            Türkiye'nin psikoloji <em style={{ fontStyle:'italic', color:'var(--gold)' }}>okulunsunuz.</em>
          </h2>
          <p style={{ fontSize:'1.05rem', color:'var(--text)', marginBottom:'16px', lineHeight:1.8 }}>
            İlk 100 psikolog arasına girin. Kurucu üyeler fiyat garantisi, özel rozet ve topluluk kararlarında oy hakkı kazanır.
          </p>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--gold)', marginBottom:'40px', letterSpacing:'.04em' }}>
            ✦ &nbsp; Tek bir seansta aidatınızı karşılarsınız
          </p>
          <Link href="/kayit" className="btn btn-gold btn-lg" style={{ fontSize:'1.1rem', padding:'16px 52px' }}>
            Psikolog Olarak Başvur →
          </Link>
          <p style={{ marginTop:'16px', fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>
            Kayıt formunuz 24 saat içinde incelenir
          </p>

          {/* Meslektaş davet */}
          <div style={{ marginTop:'48px', paddingTop:'36px', borderTop:'1px solid var(--border)' }}>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.95rem', color:'var(--text)', marginBottom:'16px' }}>
              Değer verdiğiniz bir meslektaşınız var mı?
            </p>
            <button onClick={() => navigator.clipboard?.writeText('https://mekteb.vercel.app/psikolog')}
              className="btn btn-outline" style={{ padding:'10px 24px', fontSize:'.9rem' }}>
              ✉ Meslektaşınızı Davet Edin
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'var(--bg)', borderTop:'1px solid var(--border)', padding:'48px 0 28px' }}>
        <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 20%,var(--gold) 50%,var(--gold-d) 80%,transparent)', marginBottom:'48px', opacity:.4 }} />
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.4rem', fontWeight:500, color:'var(--cream)', textDecoration:'none' }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>
          <div style={{ display:'flex', gap:'24px' }}>
            {[['Danışan Sayfası','/'],['Kayıt','/kayit'],['Giriş','/giris'],['Psikolog Bul','/danisan']].map(([l,h]) => (
              <Link key={h} href={h} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>© 2026 Mekteb</p>
        </div>
      </footer>

      {/* Görüş / İstek */}
      <a href="mailto:ozkaya.mrt@gmail.com?subject=Mekteb Görüş/İstek"
        style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:500, display:'flex', alignItems:'center', gap:'9px', background:'rgba(13,24,17,.92)', border:'1px solid rgba(201,169,110,.3)', padding:'11px 20px', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--text)', textDecoration:'none', backdropFilter:'blur(12px)', boxShadow:'0 4px 24px rgba(0,0,0,.4)', transition:'all .3s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor='var(--gold)'; (e.currentTarget as HTMLAnchorElement).style.color='var(--gold)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(201,169,110,.3)'; (e.currentTarget as HTMLAnchorElement).style.color='var(--text)'; }}>
        💬 Görüş / İstek
      </a>
    </div>
  )
}
