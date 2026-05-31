import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — Mekteb',
  description: 'Mekteb platformu gizlilik politikası ve KVKK aydınlatma metni.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--cream)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      <div style={{ fontSize: '.97rem', color: 'var(--text)', lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: '14px' }}>{children}</p>
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--gold-d)', fontSize: '.6rem', marginTop: '8px', flexShrink: 0 }}>◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function GizlilikPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(9,15,12,.95)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.4rem', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none' }}>
            Mek<span style={{ color: 'var(--gold)' }}>teb</span>
          </Link>
          <span style={{ color: 'var(--border-h)', fontSize: '1rem' }}>/</span>
          <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--muted)' }}>Gizlilik Politikası</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 32px 100px' }}>

        {/* Başlık */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Son güncelleme: Mayıs 2026</div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, marginBottom: '16px' }}>
            Gizlilik <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Politikası</em>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, maxWidth: '600px' }}>
            Mekteb olarak psikolojik destek almanın kişisel ve hassas bir süreç olduğunu biliyoruz. Bu nedenle gizliliğiniz bizim için en yüksek önceliktir.
          </p>

          {/* Güvence rozetleri */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '28px' }}>
            {[
              { icon: '🔒', text: 'KVKK Uyumlu' },
              { icon: '🛡', text: 'Şifreli Bağlantı' },
              { icon: '👁', text: 'Verileriniz Satılmaz' },
              { icon: '✦', text: 'Seans Gizliliği' },
            ].map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(201,169,110,.07)', border: '1px solid rgba(201,169,110,.18)', padding: '8px 16px', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--text)' }}>
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </div>

        <Section title="1. Veri Sorumlusu">
          <P>
            Mekteb platformu kapsamında kişisel verilerinizin işlenmesinden sorumlu veri sorumlusu, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) çerçevesinde <strong style={{ color: 'var(--cream)' }}>Mekteb</strong>'dir.
          </P>
          <P>İletişim: <a href="mailto:kvkk@mekteb.com.tr" style={{ color: 'var(--gold)', textDecoration: 'none' }}>kvkk@mekteb.com.tr</a></P>
        </Section>

        <Section title="2. Danışanlara İlişkin Özel Taahhütler">
          <div style={{ background: 'rgba(110,201,138,.05)', border: '1px solid rgba(110,201,138,.2)', padding: '24px 28px', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--green)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡 &nbsp; Danışan Gizlilik Güvenceleri
            </div>
            <Ul items={[
              'Telefon numaranızı ve e-posta adresinizi vermek zorunda değilsiniz. Bu bilgiler isteğe bağlıdır.',
              'Randevu talebinde yalnızca takma ad veya ilk adınızı kullanabilirsiniz.',
              'İletişim bilgilerinizi verirseniz, bunlara yalnızca görüşme yaptığınız psikolog erişebilir.',
              'Seans notları ve görüşme içerikleri kesinlikle üçüncü taraflarla paylaşılmaz.',
              'Psikologlar mesleki sır yükümlülüğü altındadır; paylaştığınız bilgiler platform dışına çıkmaz.',
              'Verileriniz hiçbir koşulda satılmaz, kiralanmaz veya pazarlama amacıyla kullanılmaz.',
            ]} />
          </div>
          <P>
            Psikolojik destek almak, son derece kişisel bir süreçtir. Bu süreçte paylaştığınız her bilgi yalnızca terapötik amaçlarla kullanılır ve yasal zorunluluk dışında hiçbir kurumla paylaşılmaz.
          </P>
        </Section>

        <Section title="3. Toplanan Kişisel Veriler">
          <P><strong style={{ color: 'var(--cream)' }}>Danışanlardan toplanan veriler (hepsi isteğe bağlı):</strong></P>
          <Ul items={[
            'Ad / takma ad (zorunlu değil)',
            'E-posta adresi (zorunlu değil — yalnızca bildirim için)',
            'Randevu talebi notu (zorunlu değil — sadece psikolog görür)',
            'Tercih ettiğiniz seans tarihleri',
          ]} />
          <P><strong style={{ color: 'var(--cream)' }}>Psikologlardan toplanan veriler:</strong></P>
          <Ul items={[
            'Ad, soyad, e-posta, telefon (hesap oluşturma için zorunlu)',
            'Mezuniyet bilgileri, uzmanlık alanları, terapötik yaklaşım (profil için)',
            'Şehir bilgisi (eşleştirme için)',
            'Kısa bio (profilde yayınlanır — psikolog onayıyla)',
          ]} />
        </Section>

        <Section title="4. Verilerin İşlenme Amaçları ve Hukuki Dayanakları">
          <Ul items={[
            'Psikolog — danışan eşleştirmesi yapmak (KVKK m.5/2-c: sözleşmenin ifası)',
            'Randevu taleplerini ilgili psikologla paylaşmak (KVKK m.5/2-c)',
            'Platform güvenliğini sağlamak (KVKK m.5/2-ç: meşru menfaat)',
            'Yasal yükümlülüklerin yerine getirilmesi (KVKK m.5/2-a)',
          ]} />
          <P>
            Verileriniz, işlenme amacının gerektirdiği süre boyunca saklanır. Psikolog ile görüşmenizi sonlandırdıktan sonra kişisel verilerinizin silinmesini talep edebilirsiniz.
          </P>
        </Section>

        <Section title="5. Veri Güvenliği">
          <Ul items={[
            'Tüm veri transferleri SSL/TLS şifreli bağlantı üzerinden gerçekleşir.',
            'Veritabanı erişimi Satır Düzeyi Güvenlik (Row Level Security) ile korunur.',
            'Her psikolog yalnızca kendi danışanlarına ait verilere erişebilir.',
            'Sistem yöneticileri seans notlarına ve kişisel görüşme içeriklerine erişemez.',
            'Şifreler tek yönlü hashlenerek saklanır; hiçbir çalışan şifrenizi göremez.',
          ]} />
        </Section>

        <Section title="6. Üçüncü Taraflarla Paylaşım">
          <P>Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:</P>
          <Ul items={[
            'Yasal zorunluluk: Mahkeme kararı, savcılık talebi gibi resmi mercilerin hukuki talepleri.',
            'Altyapı hizmetleri: Veriler, güvenli sunucularda barındırılır (Supabase — AB/Frankfurt sunucuları). Bu hizmet sağlayıcıları verilere erişemez.',
            'Acil durum: Kendinize veya başkasına zarar verme riski söz konusuysa psikolog yasal yükümlülüğü gereği bildirimde bulunabilir.',
          ]} />
          <div style={{ background: 'rgba(201,110,110,.05)', border: '1px solid rgba(201,110,110,.18)', padding: '16px 20px', marginTop: '16px', fontFamily: 'Cormorant Garant,serif', fontSize: '.92rem', color: 'var(--text)' }}>
            ⚠ &nbsp; Verileriniz <strong style={{ color: 'var(--cream)' }}>hiçbir koşulda</strong> reklam, pazarlama veya veri analizi şirketleriyle paylaşılmaz.
          </div>
        </Section>

        <Section title="7. KVKK Kapsamındaki Haklarınız">
          <P>6698 sayılı KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</P>
          <Ul items={[
            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
            'İşlenmişse bilgi talep etme',
            'Amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
            'Yurt içinde veya dışında aktarıldığı üçüncü kişileri öğrenme',
            'Eksik veya yanlış işlenmişse düzeltilmesini talep etme',
            'Verilerinizin silinmesini veya yok edilmesini talep etme',
            'Otomatik sistemlere dayalı aleyhte bir sonuca itiraz etme',
            'Zararınızın giderilmesini talep etme',
          ]} />
          <P>
            Haklarınızı kullanmak için: <a href="mailto:kvkk@mekteb.com.tr" style={{ color: 'var(--gold)', textDecoration: 'none' }}>kvkk@mekteb.com.tr</a> adresine e-posta gönderebilirsiniz. Talepler 30 gün içinde yanıtlanır.
          </P>
        </Section>

        <Section title="8. Psikolojik Seans Gizliliği">
          <P>
            Platformumuzdaki psikologlar, Türk Psikologlar Derneği etik ilkeleri ve ilgili mevzuat kapsamında <strong style={{ color: 'var(--cream)' }}>mesleki sır yükümlülüğü</strong> altındadır.
          </P>
          <Ul items={[
            'Seans içerikleri hiçbir koşulda başkalarıyla paylaşılamaz.',
            'Platform çalışanları seans notlarına erişemez.',
            'Psikologlar yalnızca yasal zorunluluk (mahkeme kararı, acil tehlike) durumunda bildirimde bulunabilir.',
            'Online seanslar şifreli bağlantı üzerinden gerçekleştirilmelidir.',
          ]} />
        </Section>

        <Section title="9. Çerezler (Cookies)">
          <P>
            Mekteb, platform işlevselliği için yalnızca zorunlu oturum çerezleri kullanır. Pazarlama veya izleme amacıyla çerez kullanılmaz.
          </P>
        </Section>

        <Section title="10. İletişim ve Şikâyetler">
          <P>Gizlilik politikamıza ilişkin sorularınız için:</P>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '20px 24px', fontFamily: 'Cormorant Garant,serif' }}>
            <div style={{ color: 'var(--cream)', marginBottom: '6px' }}>Mekteb Gizlilik Birimi</div>
            <div style={{ color: 'var(--muted)', fontSize: '.88rem' }}>E-posta: <a href="mailto:kvkk@mekteb.com.tr" style={{ color: 'var(--gold)', textDecoration: 'none' }}>kvkk@mekteb.com.tr</a></div>
          </div>
          <p style={{ marginTop: '16px', marginBottom: '14px' }}>
            Şikâyetlerinizi ayrıca <strong style={{ color: 'var(--cream)' }}>Kişisel Verileri Koruma Kurumu</strong>'na (<a href="https://www.kvkk.gov.tr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>kvkk.gov.tr</a>) iletebilirsiniz.
          </p>
        </Section>

        {/* Alt linkler */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/kvkk" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--gold)', textDecoration: 'none' }}>KVKK Aydınlatma Metni →</Link>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem', color: 'var(--muted)', textDecoration: 'none' }}>← Ana Sayfa</Link>
        </div>
      </div>
    </div>
  )
}
