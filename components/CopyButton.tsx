'use client'

import { useState } from 'react'

interface Props {
  text: string
  label?: string
  successLabel?: string
  className?: string
  style?: React.CSSProperties
}

export default function CopyButton({
  text,
  label = '🔗 Linki Kopyala',
  successLabel = '✓ Kopyalandı!',
  className = 'btn btn-outline',
  style,
}: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const el = document.createElement('textarea')
        el.value = text
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.focus()
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Kopyalama başarısız — URL'yi göster
      alert(`Link: ${text}`)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={className}
      style={{
        ...style,
        transition: 'all .3s',
        background: copied ? 'rgba(110,201,138,.1)' : undefined,
        borderColor: copied ? 'rgba(110,201,138,.4)' : undefined,
        color: copied ? 'var(--green)' : undefined,
      }}
    >
      {copied ? successLabel : label}
    </button>
  )
}
