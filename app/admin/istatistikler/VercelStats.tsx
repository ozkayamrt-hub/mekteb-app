'use client'

export default function VercelStats() {
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'28px 32px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color:'var(--cream)', fontWeight:500, marginBottom:'6px' }}>
            Sayfa Görüntülemeleri & Ziyaretçi Trafiği
          </div>
          <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.85rem', color:'var(--text)', lineHeight:1.65, maxWidth:'480px' }}>
            Kaç kişi siteye girdi, hangi sayfaları baktı, nereden geldi, hangi cihazı kullandı — bunları Vercel Analytics panelinde görebilirsiniz.
          </p>
        </div>
        <a
          href="https://vercel.com/mert-ozkaya-s-projects/mekteb-app/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold btn-sm"
          style={{ flexShrink:0, whiteSpace:'nowrap' }}
        >
          Analytics Paneli ↗
        </a>
      </div>

      {/* Ne göreceksiniz */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
        {[
          { icon:'👁', label:'Sayfa Görüntülemeleri', desc:'Hangi sayfa kaç kez açıldı' },
          { icon:'👥', label:'Benzersiz Ziyaretçi', desc:'Kaç farklı kişi geldi' },
          { icon:'🌍', label:'Traffic Kaynağı', desc:'Google, Instagram, direkt vb.' },
          { icon:'📱', label:'Cihaz Dağılımı', desc:'Telefon / bilgisayar / tablet' },
          { icon:'🏙', label:'Şehir & Ülke', desc:'Ziyaretçiler nereden geliyor' },
          { icon:'⚡', label:'Sayfa Hızı', desc:'Yükleme süreleri ve performans' },
        ].map(item => (
          <div key={item.label} style={{ padding:'14px 16px', background:'rgba(255,255,255,.02)', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'1.3rem', marginBottom:'6px' }}>{item.icon}</div>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--cream)', fontWeight:500, marginBottom:'3px' }}>{item.label}</div>
            <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.75rem', color:'var(--muted)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:'16px', padding:'12px 16px', background:'rgba(201,169,110,.05)', border:'1px solid rgba(201,169,110,.15)', fontFamily:'Cormorant Garant,serif', fontSize:'.78rem', color:'var(--muted)', lineHeight:1.65 }}>
        ◈ &nbsp; Veriler gerçek zamanlı toplanıyor. İlk ziyaretçiler geldikçe grafikler oluşacak.
        Kişisel veri toplanmıyor — KVKK uyumlu, tamamen anonim istatistik.
      </div>
    </div>
  )
}
