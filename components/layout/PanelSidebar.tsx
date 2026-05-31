'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Tier } from '@/types/database'

const TIER_LABEL: Record<Tier, string> = {
  aday:  'I — Aday',
  uzman: 'II — Uzman',
  ustat: 'III — Üstat',
}

const NAV = [
  { href: '/panel',                  icon: '◈', label: 'Genel Bakış' },
  { href: '/panel/randevular',       icon: '◷', label: 'Randevular' },
  { href: '/panel/danisanlar',       icon: '⟁', label: 'Danışanlar' },
  { href: '/panel/mentorluk',        icon: '⬡', label: 'Mentörlük' },
  { href: '/panel/takvim',           icon: '◷', label: 'Takvimim' },
  { href: '/panel/kademe-yukselt',   icon: '↑', label: 'Kademe Yükselt' },
  { href: '/panel/profil',           icon: '◎', label: 'Profilim' },
]

interface Props {
  fullName: string
  tier: Tier
  isAdmin?: boolean
}

export default function PanelSidebar({ fullName, tier, isAdmin }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const initials = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside style={{
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
    }}>
      {/* Top */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{
          fontFamily: 'Cormorant Garant,serif', fontSize: '1.5rem', fontWeight: 500,
          color: 'var(--cream)', textDecoration: 'none', display: 'block', marginBottom: '20px',
        }}>
          Mek<span style={{ color: 'var(--gold)' }}>teb</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: '#1e3d2a', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garant,serif', fontSize: '1rem', color: 'var(--cream)', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.95rem', color: 'var(--cream)', fontWeight: 500 }}>
              {fullName}
            </div>
            <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', color: 'var(--gold)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {TIER_LABEL[tier]}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', padding: '12px 24px 6px' }}>
          Ana Menü
        </div>
        {NAV.map(item => {
          const active = item.href === '/panel' ? pathname === '/panel' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href} href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 24px',
                fontFamily: 'Cormorant Garant,serif', fontSize: '.95rem',
                color: active ? 'var(--gold)' : 'var(--text)',
                background: active ? 'rgba(201,169,110,.08)' : 'transparent',
                textDecoration: 'none',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'color .2s, background .2s',
              }}
            >
              <span style={{ fontSize: '1rem', width: '18px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isAdmin && (
          <Link href="/admin" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ◈ Admin Paneli
          </Link>
        )}
        <Link href="/danisan" target="_blank" style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)', textDecoration: 'none' }}>
          ↗ Genel Dizin
        </Link>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)', cursor: 'pointer', textAlign: 'left', padding: 0 }}
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
