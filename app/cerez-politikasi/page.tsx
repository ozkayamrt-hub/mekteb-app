import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Çerez Politikası — Mekteb' }

export default function CerezPolitikasiPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'rgba(9,15,12,.95)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none' }}>
            Mek<span style={{ color: 'var(--gold)' }}>teb</span>
          </Link>
          <span style={{ color: 'var(--border-h)' }}>/</span>
          <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--muted)' }}>Çerez Politikası</span>
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px 100px' }}>
        <div className="eyebrow" style={{ marginBottom: '10px' }}>Yasal</div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 300, marginBottom: '40px' }}>
          Çerez <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Politikası</em>
        </h1>

        {[
          {
            title: '1. Çerez Nedir?',
            content: 'Çerezler, ziyaret ettiğiniz web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. Oturum bilgilerini, tercihlerinizi ve site kullanım istatistiklerini saklamak için kullanılırlar.',
          },
          {
            title: '2. Kullandığımız Çerez Türleri',
            content: `**Zorunlu Çerezler:** Platformun çalışması için mutlaka gereklidir. Oturum yönetimi (giriş/çıkış) ve güvenlik amaçlıdır. Bu çerezler için onay gerekmez.

**Fonksiyonel Çerezler:** Dil tercihi, tema gibi ayarlarınızı hatırlamak için kullanılır. Onayınız dahilinde aktifleşir.

**Analitik Çerezler:** Site trafiğini ve kullanım alışkanlıklarını ölçmek amacıyla kullanılabilir. Henüz aktif değildir; aktifleştirilmeden önce onayınız alınacaktır.`,
          },
          {
            title: '3. Çerezleri Nasıl Kontrol Edebilirsiniz?',
            content: 'Tarayıcı ayarlarından çerezleri tamamen devre dışı bırakabilir veya silebilirsiniz. Ancak zorunlu çerezlerin devre dışı bırakılması durumunda platform işlevlerini yerine getiremeyebilir. Onayınızı site alt kısmındaki çerez banner\'ından her zaman değiştirebilirsiniz.',
          },
          {
            title: '4. Üçüncü Taraf Çerezler',
            content: 'Mekteb şu an herhangi bir reklam ağı veya üçüncü taraf izleme aracı kullanmamaktadır. İleride eklenecek entegrasyonlar bu politikaya yansıtılacaktır.',
          },
          {
            title: '5. 5651 Sayılı Kanun Uyarınca Log Tutma',
            content: 'İlgili mevzuat gereği, platforma erişim kayıtları (IP adresi, erişim zamanı) zaman damgasıyla birlikte en az 1, en fazla 2 yıl süreyle saklanmaktadır. Bu veriler yetkili mercilerin talebi dışında üçüncü taraflarla paylaşılmaz.',
          },
          {
            title: '6. İletişim',
            content: 'Çerez uygulamalarımıza ilişkin sorularınız için: info@mekteb.com.tr',
          },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.2rem', fontWeight: 500, color: 'var(--cream)', marginBottom: '12px' }}>
              {title}
            </h2>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.92rem', color: 'var(--text)', lineHeight: 1.8 }}>
              {content.split('\n\n').map((p, i) => (
                <p key={i} style={{ marginBottom: '10px' }}>
                  {p.replace(/\*\*(.*?)\*\*/g, '$1').split(/\*\*(.*?)\*\*/).map((part, j) =>
                    j % 2 === 1 ? <strong key={j} style={{ color: 'var(--cream)' }}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--border)', fontFamily: 'Cormorant Garant,serif', fontSize: '.82rem', color: 'var(--muted)', marginTop: '20px' }}>
          Son güncelleme: Haziran 2026
        </div>

        <div style={{ marginTop: '32px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/gizlilik" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--gold-d)', textDecoration: 'none' }}>Gizlilik Politikası →</Link>
          <Link href="/kvkk" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--gold-d)', textDecoration: 'none' }}>KVKK Metni →</Link>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)', textDecoration: 'none' }}>← Ana Sayfa</Link>
        </div>
      </div>
    </div>
  )
}
