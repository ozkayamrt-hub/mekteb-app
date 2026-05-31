'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  currentUrl?: string | null
  size?: number
  onUploaded?: (url: string) => void
}

export default function AvatarUpload({ userId, currentUrl, size = 80, onUploaded }: Props) {
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)
  const [preview, setPreview]   = useState<string | null>(currentUrl || null)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')

  const initials = userId.slice(0, 2).toUpperCase()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Maksimum 2MB'); return }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setError('JPG, PNG veya WebP'); return }

    // Anlık önizleme
    setPreview(URL.createObjectURL(file))
    setLoading(true); setError('')

    const ext  = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    // Eski avatarı sil, yenisini yükle
    await supabase.storage.from('avatars').remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`])

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadErr) { setError(uploadErr.message); setLoading(false); return }

    // Public URL al
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

    // Profile güncelle
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)

    setPreview(publicUrl)
    setLoading(false)
    onUploaded?.(publicUrl)
  }

  return (
    <div style={{ position:'relative', display:'inline-block', cursor:'pointer' }} onClick={() => !loading && fileRef.current?.click()}>
      {/* Avatar */}
      <div style={{
        width:`${size}px`, height:`${size}px`, borderRadius:'50%',
        background: preview ? 'transparent' : '#1e3d2a',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Cormorant Garant,serif', fontSize:`${size * 0.3}px`,
        color:'var(--cream)', overflow:'hidden', flexShrink:0,
        border: loading ? '2px solid var(--gold)' : '2px solid transparent',
        transition:'border-color .3s',
      }}>
        {preview
          ? <img src={preview} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : initials
        }
      </div>

      {/* Kamera ikonu */}
      {!loading && (
        <div style={{
          position:'absolute', bottom:'0', right:'0',
          width:`${size * 0.32}px`, height:`${size * 0.32}px`,
          borderRadius:'50%', background:'var(--gold)', border:'2px solid var(--bg2)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:`${size * 0.16}px`, color:'#090f0c',
        }}>
          📷
        </div>
      )}

      {loading && (
        <div style={{
          position:'absolute', inset:0, borderRadius:'50%',
          background:'rgba(9,15,12,.6)', display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:`${size * 0.2}px`,
        }}>⟳</div>
      )}

      <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFile} style={{ display:'none' }} />

      {error && (
        <div style={{
          position:'absolute', top:`${size + 6}px`, left:'50%', transform:'translateX(-50%)',
          whiteSpace:'nowrap', fontFamily:'Cormorant Garant,serif', fontSize:'.72rem',
          color:'var(--red)', background:'rgba(9,15,12,.9)', padding:'4px 8px',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
