'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PublicNavbar() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(9,15,12,.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)', padding: '16px 0',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.6rem', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none' }}>
          Mek<span style={{ color: 'var(--gold)' }}>teb</span>
        </Link>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[
            { href: '/danisan', label: 'Psikolog Bul' },
            { href: '/#kademe', label: 'Kademe Sistemi' },
            { href: '/giris', label: 'Psikolog Girişi' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'Cormorant Garant,serif', fontSize: '1rem',
              color: pathname === href ? 'var(--cream)' : 'var(--text)',
              textDecoration: 'none', transition: 'color .2s',
            }}>
              {label}
            </Link>
          ))}
        </div>
        <Link href="/kayit" className="btn btn-gold btn-sm">Psikolog Olarak Katıl</Link>
      </div>
    </nav>
  )
}
