'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function PublicNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/danisan',  label: 'Psikolog Bul' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/giris',    label: 'Psikolog Girişi' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(9,15,12,.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '14px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.6rem', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none', flexShrink: 0 }}>
            Mek<span style={{ color: 'var(--gold)' }}>teb</span>
          </Link>

          {/* Desktop links */}
          <div className="r-nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: 'Cormorant Garant,serif', fontSize: '1rem',
                color: pathname === href ? 'var(--cream)' : 'var(--text)',
                textDecoration: 'none', transition: 'color .2s',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link href="/psikolog" className="r-nav-links" style={{
            display: 'flex', fontFamily: 'Cormorant Garant,serif', fontSize: '.88rem',
            color: 'var(--gold)', border: '1px solid rgba(201,169,110,.35)',
            padding: '8px 18px', textDecoration: 'none', transition: 'all .25s', whiteSpace: 'nowrap',
          }}>
            Psikolog musunuz? →
          </Link>

          {/* Hamburger butonu (sadece mobilde görünür) */}
          <button
            className="r-nav-mobile-btn"
            onClick={() => setOpen(!open)}
            style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text)', cursor: 'pointer', padding: '8px 12px',
              flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color .2s',
            }}>
            <span style={{ display: 'block', width: '22px', height: '1.5px', background: open ? 'var(--gold)' : 'var(--text)', transition: 'all .3s', transform: open ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '1.5px', background: open ? 'transparent' : 'var(--text)', transition: 'all .3s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '1.5px', background: open ? 'var(--gold)' : 'var(--text)', transition: 'all .3s', transform: open ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      {open && (
        <div className="nav-mobile-overlay" style={{ top: '57px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.7rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>Menü</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
          </div>

          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}

          <Link href="/psikolog" onClick={() => setOpen(false)} style={{ color: 'var(--gold)', borderColor: 'rgba(201,169,110,.2)' }}>
            Psikolog musunuz? →
          </Link>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <Link href="/kayit" onClick={() => setOpen(false)} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}>
              Psikolog Kaydı →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
