'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(9,15,12,.97)', borderTop: '1px solid var(--border-h)',
      padding: '16px 24px', display: 'flex', alignItems: 'center',
      gap: '16px', flexWrap: 'wrap', backdropFilter: 'blur(8px)',
    }}>
      <p style={{
        flex: 1, minWidth: '260px', fontFamily: 'Cormorant Garant,serif',
        fontSize: '.88rem', color: 'var(--text)', lineHeight: 1.65, margin: 0,
      }}>
        🍪 Bu site, temel işlevler için zorunlu çerezler kullanmaktadır. Analitik ve iyileştirme amaçlı çerezler için onayınıza ihtiyacımız var.{' '}
        <Link href="/cerez-politikasi" style={{ color: 'var(--gold-d)', textDecoration: 'underline' }}>
          Çerez Politikası
        </Link>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button onClick={reject} style={{
          background: 'none', border: '1px solid var(--border-h)', padding: '8px 18px',
          fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--muted)',
          cursor: 'pointer', transition: 'border-color .2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-h)')}
        >
          Reddet
        </button>
        <button onClick={accept} style={{
          background: 'var(--gold)', border: '1px solid var(--gold)', padding: '8px 22px',
          fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: '#090f0c',
          cursor: 'pointer', fontWeight: 600,
        }}>
          Kabul Et
        </button>
      </div>
    </div>
  )
}
