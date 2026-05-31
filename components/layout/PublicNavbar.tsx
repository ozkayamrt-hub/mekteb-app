'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function PublicNavbar() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/danisan',  label: 'Psikolog Bul' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/giris',    label: 'Psikolog Girişi' },
  ]

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(9,15,12,.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'14px 0' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>

          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.6rem', fontWeight:500, color:'var(--cream)', textDecoration:'none', flexShrink:0 }}>
            Mek<span style={{ color:'var(--gold)' }}>teb</span>
          </Link>

          {/* Desktop linkler — CSS ile mobilde gizlenir */}
          <div className="nav-desktop">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1rem', color: pathname === href ? 'var(--cream)' : 'var(--text)', textDecoration:'none', transition:'color .2s' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA — CSS ile mobilde gizlenir */}
          <Link href="/psikolog" className="nav-desktop-cta" style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.88rem', color:'var(--gold)', border:'1px solid rgba(201,169,110,.35)', padding:'8px 18px', textDecoration:'none', whiteSpace:'nowrap' }}>
            Psikolog musunuz? →
          </Link>

          {/* Hamburger — CSS ile masaüstünde gizlenir */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(!open)}
            style={{ background:'none', border:'1px solid var(--border)', color:'var(--text)', cursor:'pointer', padding:'8px 12px', transition:'border-color .2s' }}
          >
            <span style={{ display:'block', width:'22px', height:'1.5px', background: open ? 'var(--gold)' : 'var(--text)', transition:'all .3s', transform: open ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
            <span style={{ display:'block', width:'22px', height:'1.5px', background:'var(--text)', transition:'opacity .3s', opacity: open ? 0 : 1, marginTop:'5px', marginBottom:'5px' }} />
            <span style={{ display:'block', width:'22px', height:'1.5px', background: open ? 'var(--gold)' : 'var(--text)', transition:'all .3s', transform: open ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobil açılır menü */}
      {open && (
        <div style={{ position:'fixed', top:'57px', left:0, right:0, bottom:0, background:'rgba(9,15,12,.98)', zIndex:99, display:'flex', flexDirection:'column', padding:'8px 28px 40px', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'flex-end', padding:'12px 0 4px', borderBottom:'1px solid var(--border)', marginBottom:'4px' }}>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'1.3rem' }}>✕</button>
          </div>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', color:'var(--text)', textDecoration:'none', padding:'18px 0', borderBottom:'1px solid var(--border)', display:'block' }}>
              {label}
            </Link>
          ))}
          <Link href="/psikolog" onClick={() => setOpen(false)} style={{ fontFamily:'Cormorant Garant,serif', fontSize:'1.5rem', color:'var(--gold)', textDecoration:'none', padding:'18px 0', borderBottom:'1px solid var(--border)', display:'block' }}>
            Psikolog musunuz? →
          </Link>
          <div style={{ marginTop:'28px' }}>
            <Link href="/kayit" onClick={() => setOpen(false)} className="btn btn-gold" style={{ width:'100%', justifyContent:'center', fontSize:'1.1rem', padding:'16px', display:'flex' }}>
              Psikolog Kaydı →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
