import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni — Mekteb',
}

export default function KVKKPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'rgba(9,15,12,.95)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.4rem', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none' }}>
            Mek<span style={{ color: 'var(--gold)' }}>teb</span>
          </Link>
          <span style={{ color: 'var(--border-h)' }}>/</span>
          <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--muted)' }}>KVKK Aydınlatma Metni</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 32px 100px', fontSize: '.97rem', color: 'var(--text)', lineHeight: 1.85 }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>6698 Sayılı KVKK Uyarınca</div>
          <h1 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 300, marginBottom: '16px' }}>
            Kişisel Verilerin Korunması<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Aydınlatma Metni</em>
          </h1>
        </div>

        {[
          {
            title: 'Veri Sorumlusu',
            content: 'Mekteb platformu, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla hareket etmektedir. İletişim: kvkk@mekteb.com.tr'
          },
          {
            title: 'İşlenen Kişisel Veriler',
            items: [
              'Kimlik bilgileri: Ad, soyad (psikologlar için zorunlu; danışanlar için isteğe bağlı)',
              'İletişim bilgileri: E-posta adresi, telefon numarası (isteğe bağlı)',
              'Mesleki bilgiler: Mezuniyet, uzmanlık, deneyim (yalnızca psikologlar)',
              'Özel nitelikli kişisel veriler: Sağlıkla ilgili bilgiler (yalnızca terapötik süreç kapsamında, psikolog dışında hiçbir kişiyle paylaşılmaz)',
            ]
          },
          {
            title: 'Kişisel Verilerin İşlenme Amaçları',
            items: [
              'Danışan-psikolog eşleştirme hizmetinin sunulması',
              'Randevu taleplerinin iletilmesi',
              'Platform güvenliğinin sağlanması',
              'Yasal yükümlülüklerin yerine getirilmesi',
            ]
          },
          {
            title: 'Kişisel Verilerin Aktarılması',
            content: 'Kişisel verileriniz; yargı mercileri ve yetkili kamu kuruluşlarının talepleri dışında hiçbir üçüncü tarafla paylaşılmamaktadır. Veriler, KVKK\'nın 8. ve 9. maddeleri çerçevesinde yurt içi ve yurt dışına aktarılmaz. Platform altyapısı AB/Frankfurt sunucularında (Supabase) barındırılmakta olup bu sunucular GDPR uyumludur.'
          },
          {
            title: 'Kişisel Veri Saklama Süreleri',
            items: [
              'Aktif hesap verileri: Hesap silinene kadar',
              'Randevu talep kayıtları: 2 yıl',
              'Yasal zorunluluk gerektiren veriler: İlgili mevzuatta öngörülen süreler',
            ]
          },
          {
            title: 'KVKK Kapsamındaki Haklarınız',
            content: 'KVKK\'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, düzeltilmesini isteme, silinmesini talep etme ve zararınızın giderilmesini isteme haklarına sahipsiniz. Bu haklarınızı kvkk@mekteb.com.tr adresine yazılı başvuru yaparak kullanabilirsiniz.'
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.25rem', fontWeight: 500, color: 'var(--cream)', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              {s.title}
            </h2>
            {'content' in s && s.content && <p>{s.content}</p>}
            {'items' in s && s.items && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {s.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: 'var(--gold-d)', fontSize: '.55rem', marginTop: '8px', flexShrink: 0 }}>◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '28px', display: 'flex', gap: '20px' }}>
          <Link href="/gizlilik" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--gold)', textDecoration: 'none' }}>← Gizlilik Politikası</Link>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--muted)', textDecoration: 'none' }}>Ana Sayfa</Link>
        </div>
      </div>
    </div>
  )
}
