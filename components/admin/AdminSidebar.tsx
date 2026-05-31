'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin',            icon: '◈', label: 'Genel Bakış' },
  { href: '/admin/basvurular', icon: '◷', label: 'Başvurular' },
  { href: '/admin/psikologlar',icon: '⟁', label: 'Psikologlar' },
  { href: '/admin/belgeler',    icon: '◉', label: 'Belgeler' },
  { href: '/admin/sikayetler',  icon: '⚑', label: 'Şikayetler' },
  { href: '/admin/yukseltmeler',icon: '↑', label: 'Yükseltmeler' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside style={{
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
    }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
          Mek<span style={{ color: 'var(--gold)' }}>teb</span>
        </Link>
        <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(201,169,110,.1)', border: '1px solid rgba(201,169,110,.2)', padding: '3px 10px', display: 'inline-block' }}>
          Admin Paneli
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {NAV.map(item => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 24px',
              fontFamily: 'Cormorant Garant,serif', fontSize: '.95rem',
              color: active ? 'var(--gold)' : 'var(--text)',
              background: active ? 'rgba(201,169,110,.08)' : 'transparent',
              borderLeft: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
              textDecoration: 'none', transition: 'all .2s',
            }}>
              <span style={{ fontSize: '1rem', width: '18px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/panel" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)', textDecoration: 'none' }}>
          ↗ Psikolog Paneli
        </Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
