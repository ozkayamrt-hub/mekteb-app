'use client'

import { useState } from 'react'
import FeedbackModal from './FeedbackModal'

interface Props {
  userType?: 'visitor' | 'client' | 'psychologist'
}

export default function FeedbackButton({ userType = 'visitor' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position:'fixed', bottom:'28px', right:'28px', zIndex:500,
          display:'flex', alignItems:'center', gap:'9px',
          background:'rgba(13,24,17,.92)', border:'1px solid rgba(201,169,110,.3)',
          padding:'11px 20px', fontFamily:'Cormorant Garant,serif', fontSize:'.88rem',
          color:'var(--text)', cursor:'pointer', backdropFilter:'blur(12px)',
          boxShadow:'0 4px 24px rgba(0,0,0,.4)', transition:'all .3s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
      >
        💬 Görüş / İstek
      </button>

      <FeedbackModal open={open} onClose={() => setOpen(false)} userType={userType} />
    </>
  )
}
