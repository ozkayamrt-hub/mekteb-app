'use client'

import Link from 'next/link'
import FeedbackButton from '@/components/FeedbackButton'
import PublicNavbar from '@/components/layout/PublicNavbar'
import { DoveFlock, LaurelBranch, FloatingLeaves, OrnamentalDivider } from '@/components/effects/PageEffects'

const CLIENT_QUOTES = [
  { text: "İnsanlar nesnelerden değil, nesneler hakkındaki görüşlerden rahatsız olur.", author: "Epiktetos", field: "Stoacı Felsefe" },
  { text: "Kendini bil.", author: "Sokrates", field: "Antik Felsefe" },
  { text: "Acı kaçınılmazdır, ıstırap ise bir seçimdir.", author: "Viktor Frankl", field: "Logoterapist" },
]

function QuoteBanner({ q }: { q: typeof CLIENT_QUOTES[0] }) {
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

export default function DanisanPage() {
  return (
    <div style={{ overflowX:'hidden' }}>
      <style>{`
        @keyframes rotateRing { to { transform: rotate(360deg); } }
        @keyframes aurora { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes floatUp { 0%{transform:translateY(0) translateX(0) scale(1);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(-120vh) translateX(var(--dx,20px)) scale(.4);opacity:0} }
        @keyframes waveDrift { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes breathe { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.06} 50%{transform:translate(-50%,-50%) scale(1.18);opacity:.13} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        .ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.1); animation:rotateRing linear infinite; }
        .ring::before { content:''; position:absolute; width:5px; height:5px; background:var(--gold); border-radius:50%; top:0; left:50%; transform:translateX(-50%); }
        .particle { position:absolute; border-radius:50%; background:var(--gold); pointer-events:none; animation:floatUp var(--dur,12s) ease-in var(--delay,0s) infinite; }
        .hover-lift { transition:transform .3s ease, border-color .3s; }
        .hover-lift:hover { transform:translateY(-4px); }
      `}</style>

      <PublicNavbar />

      {/* ── HERO — Danışan ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:'80px', background:'var(--bg2)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)', width:'1000px', height:'800px', background:'radial-gradient(ellipse,rgba(20,60,35,.55) 0%,transparent 65%)', pointerEvents:'none' }} />

        {/* Sol: Güvercin sürüsü */}
        <DoveFlock side="left" />

        {/* Sol alt: Defne dalı */}
        <LaurelBranch position="bottomLeft" />

        {/* Partiküller */}
        {([
          [8,3,14,0,30],[18,2,18,3,-20],[30,4,12,1,15],[45,2,16,5,-30],
          [60,3,20,2,25],[72,2,15,7,-15],[82,4,13,4,20],[92,2,17,1,-25],
          [25,3,19,8,10],[55,2,11,6,-10],[68,3,22,3,35],[38,2,16,9,-18],
        ] as number[][]).map(([l,s,d,dl,dx], i) => (
          <div key={i} className="particle" style={{ left:`${l}%`, bottom:'-10px', width:`${s}px`, height:`${s}px`, opacity:.65, '--dur':`${d}s`, '--delay':`${dl}s`, '--dx':`${dx}px` } as React.CSSProperties} />
        ))}

        {/* Astrolabe */}
        <div className="astrolabe-rings" style={{ position:'absolute', right:'-60px', top:'50%', transform:'translateY(-50%)', width:'580px', height:'580px', pointerEvents:'none' }}>
          {([
            [0,.12,'62s','normal'],[9,.08,'88s','reverse'],[20,.16,'72s','normal'],
            [33,.08,'50s','reverse'],[44,.32,'38s','normal'],
          ] as [number,number,string,string][]).map(([ins,op,dur,dir],i) => (
            <div key={i} className="ring" style={{ inset:`${ins}%`, borderColor:`rgba(201,169,110,${op})`, animationDuration:dur, animationDirection:dir as 'normal'|'reverse' }} />
          ))}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'10px', height:'10px', borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 24px var(--gold), 0 0 60px rgba(201,169,110,.4)' }} />
        </div>

        <div style={{ maxWidth:'640px', margin:'0 auto', padding:'0 24px', position:'relative', zIndex:2 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(110,201,138,.07)', border:'1px solid rgba(110,201,138,.22)', padding:'8px 18px', marginBottom:'32px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--green)', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--green)' }}>Uzman Psikologlarla Tanışın</span>
          </div>
          <h1 style={{ fontSize:'clamp(2.6rem,5.5vw,5rem)', fontWeight:300, letterSpacing:'-.01em', marginBottom:'24px', lineHeight:1.1 }}>
            İyileşme<br />
            <em style={{ fontStyle:'italic', color:'var(--gold)' }}>yolculuğunuz</em><br />
            burada başlıyor.
          </h1>
          <p style={{ fontSize:'1.12rem', color:'var(--text)', maxWidth:'480px', marginBottom:'40px', lineHeight:1.85 }}>
            Kendinize uygun psikologu bulun. Güvenli, etik, gizli. Türkiye'nin en özenli terapist topluluğu sizi bekliyor.
          </p>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'52px' }}>
            <Link href="/danisan" className="btn btn-gold btn-lg">Psikolog Bul →</Link>
            <a href="#nasil" className="btn btn-outline btn-lg">Nasıl Çalışır?</a>
          </div>
          <div style={{ display:'flex', gap:'40px', borderTop:'1px solid var(--border)', paddingTop:'24px', marginBottom:'20px' }}>
            {[['%100','Gizlilik'],['%0','Komisyon'],['24s','Yanıt Süresi']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.7rem', fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.73rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginTop:'5px' }}>{l}</div>
              </div>
            ))}
          </div>
          {/* KVKK güvencesi */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px', fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>
            <span>🔒</span>
            <span>Kişisel verileriniz KVKK kapsamında korunur. Ad ve iletişim bilgisi vermek zorunda değilsiniz.</span>
            <Link href="/gizlilik" style={{ color:'var(--gold-d)', textDecoration:'none', whiteSpace:'nowrap' }}>Gizlilik →</Link>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 30%,var(--gold) 50%,var(--gold-d) 70%,transparent)' }} />
      </section>

      <OrnamentalDivider />
      {/* Alıntı 1 */}
      <QuoteBanner q={CLIENT_QUOTES[0]} />

      {/* ── NASIL ÇALIŞIR — Danışan ── */}
      <section id="nasil" style={{ padding:'110px 0', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'200px', opacity:.07, pointerEvents:'none', overflow:'hidden' }}>
          <svg viewBox="0 0 1440 200" style={{ width:'200%', animation:'waveDrift 20s linear infinite' }} preserveAspectRatio="none">
            <path d="M0,100 C240,30 480,170 720,100 C960,30 1200,170 1440,100 C1680,30 1920,170 2160,100 V200 H0Z" fill="var(--gold)" />
          </svg>
        </div>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'80px' }}>
            <div className="eyebrow" style={{ marginBottom:'12px' }}>Danışan Rehberi</div>
            <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 20px' }} />
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400 }}>Üç adımda <em style={{ fontStyle:'italic', color:'var(--gold)' }}>doğru psikolog</em></h2>
          </div>
          <div className="r-grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', position:'relative' }}>
            <div style={{ position:'absolute', top:'42px', left:'calc(16.5% + 24px)', right:'calc(16.5% + 24px)', height:'1px', background:'linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold-d))' }} />
            {[
              { n:'I',   icon:'◎', title:'Keşfet',  desc:'Uzmanlık alanı, yaklaşım ve şehre göre size uygun psikologları inceleyin. Her profil şeffaf ve detaylı.' },
              { n:'II',  icon:'◈', title:'Eşleş',   desc:'Beğendiğiniz psikologun profiline girin, randevu talep edin. 24 saat içinde yanıt alırsınız.' },
              { n:'III', icon:'⬡', title:'İyileş',  desc:'Online veya yüz yüze seanslarınıza başlayın. İlerlemenizi takip edin, gerekirse değişim yapın.' },
            ].map(s => (
              <div key={s.n} style={{ textAlign:'center', padding:'0 44px' }}>
                <div style={{ width:'80px', height:'80px', borderRadius:'50%', border:'1px solid var(--gold-d)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', color:'var(--gold)', background:'var(--bg)', position:'relative', zIndex:1, boxShadow:'0 0 0 8px var(--bg)' }}>
                  {s.n}
                </div>
                <div style={{ fontSize:'1.3rem', marginBottom:'10px' }}>{s.icon}</div>
                <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.35rem', fontWeight:500, color:'var(--cream)', marginBottom:'12px' }}>{s.title}</h3>
                <p style={{ fontSize:'.93rem', color:'var(--text)', lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'60px' }}>
            <Link href="/danisan" className="btn btn-gold btn-lg">Hemen Psikolog Bul →</Link>
          </div>
        </div>
      </section>

      {/* Alıntı 2 */}
      <QuoteBanner q={CLIENT_QUOTES[1]} />

      {/* ── DAVET ET ── */}
      <section style={{ padding:'80px 0', background:'var(--bg2)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 32px' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <div className="eyebrow" style={{ marginBottom:'8px' }}>Topluluk</div>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400 }}>
              Sevdiklerinizi <em style={{ fontStyle:'italic', color:'var(--gold)' }}>davet edin</em>
            </h2>
          </div>
          <div className="r-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <div className="card hover-lift" style={{ padding:'36px 36px' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:'14px' }}>🤝</div>
              <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.2rem', color:'var(--cream)', marginBottom:'10px' }}>Arkadaşınızı Davet Edin</h3>
              <p style={{ fontSize:'.9rem', color:'var(--text)', lineHeight:1.7, marginBottom:'22px' }}>
                Psikolojik destek almayı düşünen biri var mı? Linki paylaşın, doğru psikologu bulmalarına yardımcı olun.
              </p>
              <button onClick={() => navigator.clipboard?.writeText('https://mekteb.vercel.app/danisan')}
                className="btn btn-outline" style={{ fontSize:'.88rem', padding:'9px 20px' }}>
                🔗 Linki Kopyala
              </button>
            </div>
            <div style={{ padding:'36px 36px', background:'rgba(201,169,110,.04)', border:'1px solid rgba(201,169,110,.18)', transition:'transform .3s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize:'1.8rem', marginBottom:'14px' }}>✦</div>
              <h3 style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.2rem', color:'var(--cream)', marginBottom:'10px' }}>Psikolog Tanıyor musunuz?</h3>
              <p style={{ fontSize:'.9rem', color:'var(--text)', lineHeight:1.7, marginBottom:'22px' }}>
                Güvendiğiniz bir psikolog var mı? Mekteb'e katılmaları için davet bağlantısını gönderin.
              </p>
              <button onClick={() => navigator.clipboard?.writeText('https://mekteb.vercel.app/psikolog')}
                className="btn btn-gold" style={{ fontSize:'.88rem', padding:'9px 20px' }}>
                ✉ Psikolog Davet Et
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alıntı 3 */}
      <QuoteBanner q={CLIENT_QUOTES[2]} />

      {/* ── CTA ── */}
      <section style={{ padding:'130px 0', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
        {[1,1.5,2.1,2.8,3.5].map((s,i) => (
          <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:'400px', height:'400px', borderRadius:'50%', border:'1px solid rgba(201,169,110,.07)', animation:`breathe ${5+i}s ease-in-out ${i*.8}s infinite` }} />
        ))}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(201,169,110,.09) 0%,transparent 70%)', animation:'breathe 4s ease-in-out infinite' }} />
        <div style={{ maxWidth:'640px', margin:'0 auto', textAlign:'center', padding:'0 32px', position:'relative', zIndex:1 }}>
          <div className="eyebrow" style={{ marginBottom:'12px' }}>Hazır mısınız?</div>
          <div style={{ width:'40px', height:'1px', background:'var(--gold)', margin:'0 auto 24px' }} />
          <h2 style={{ fontSize:'clamp(2rem,4vw,3.6rem)', fontWeight:400, marginBottom:'20px' }}>
            Doğru psikologla<br /><em style={{ fontStyle:'italic', color:'var(--gold)' }}>her şey değişir.</em>
          </h2>
          <p style={{ fontSize:'1.05rem', color:'var(--text)', marginBottom:'44px', lineHeight:1.8 }}>
            Aramanız burada başlıyor. Onaylanmış, deneyimli psikologlar sizi bekliyor.
          </p>
          <Link href="/danisan" className="btn btn-gold btn-lg" style={{ fontSize:'1.1rem', padding:'16px 44px' }}>
            Psikolog Bul →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'48px 0 28px' }}>
        <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg,transparent,var(--gold-d) 20%,var(--gold) 50%,var(--gold-d) 80%,transparent)', marginBottom:'48px', opacity:.4 }} />
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
          <div className="r-grid-3" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'48px', marginBottom:'40px' }}>
            <div>
              <Link href="/" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', fontWeight:500, color:'var(--cream)', textDecoration:'none', display:'block', marginBottom:'12px' }}>
                Mek<span style={{ color:'var(--gold)' }}>teb</span>
              </Link>
              <p style={{ fontSize:'.87rem', color:'var(--muted)', lineHeight:1.7, maxWidth:'240px' }}>
                Psikologların büyüdüğü, danışanların iyileştiği platform.
              </p>
            </div>
            <div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px' }}>Danışanlar</div>
              {[['Psikolog Bul','/danisan'],['Nasıl Çalışır?','#nasil'],['İletişim','/iletisim'],['Giriş','/giris']].map(([l,h]) => (
                <div key={l} style={{ marginBottom:'9px' }}>
                  <Link href={h} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px' }}>Psikologlar</div>
              {[['Mekteb Nedir?','/psikolog'],['Kayıt Ol','/kayit'],['Kademe Sistemi','/psikolog#kademe'],['Şikayet Bildir','/sikayet']].map(([l,h]) => (
                <div key={l} style={{ marginBottom:'9px' }}>
                  <Link href={h} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--muted)', textDecoration:'none' }}>{l}</Link>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:'22px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
            <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)' }}>© 2026 Mekteb. Tüm hakları saklıdır.</p>
            <div style={{ display:'flex', gap:'20px' }}>
              <Link href="/gizlilik" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', textDecoration:'none' }}>🔒 Gizlilik Politikası</Link>
              <Link href="/kvkk" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', textDecoration:'none' }}>KVKK</Link>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackButton userType="visitor" />
    </div>
  )
}
