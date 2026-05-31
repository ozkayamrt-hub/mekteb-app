'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Group {
  id: string; title: string; description: string | null; specialty: string | null
  max_members: number; price_per_session: number | null; schedule: string | null
  session_type: string; group_type: string; status: string; leader_id: string
  leader: { id: string; tier: string; profiles: { full_name: string; city: string } | null } | null
  supervision_group_members: { id: string; member_id: string; status: string }[]
}

interface Props {
  userId: string; tier: string
  groups: Group[]; myGroupIds: string[]
}

export default function SupervizyonClient({ userId, tier, groups, myGroupIds }: Props) {
  const router   = useRouter()
  const [tab, setTab]         = useState<'supervizyon' | 'akran'>('supervizyon')
  const [showCreate, setShow] = useState(false)
  const [openChat, setChat]   = useState<string | null>(null)

  const formalGroups = groups.filter(g => g.group_type === 'formal')
  const peerGroups   = groups.filter(g => g.group_type === 'peer')
  const isUstat = tier === 'ustat'

  return (
    <div>
      {/* Tab seçimi */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        {[
          { val: 'supervizyon', label: '⬡ Süpervizyon Grupları', count: formalGroups.length },
          { val: 'akran',       label: '⟁ Akran Grupları',       count: peerGroups.length },
        ].map(t => (
          <button key={t.val} onClick={() => setTab(t.val as any)} style={{
            padding: '10px 24px', fontFamily: 'Cormorant Garant,serif', fontSize: '.9rem',
            background: 'none', border: 'none', cursor: 'pointer', marginBottom: '-1px',
            color: tab === t.val ? 'var(--gold)' : 'var(--muted)',
            borderBottom: `2px solid ${tab === t.val ? 'var(--gold)' : 'transparent'}`,
          }}>
            {t.label}
            {t.count > 0 && <span style={{ marginLeft: '8px', background: 'var(--border)', color: 'var(--muted)', fontSize: '.68rem', padding: '2px 7px', borderRadius: '10px', fontFamily: 'Lora,serif' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Açıklama + Oluştur butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--text)', maxWidth: '500px', lineHeight: 1.65 }}>
          {tab === 'supervizyon'
            ? '🎓 Üstat psikologların yönettiği yapılandırılmış süpervizyon grupları. Aday psikologlar katılır, vaka sunumu ve rehberlik alır.'
            : '🤝 Uzman psikologların eşit düzeyde buluştuğu akran istişare kanalları. Vaka paylaşımı, mesleki destek, fikir alışverişi.'
          }
        </div>
        {((tab === 'supervizyon' && isUstat) || tab === 'akran') && (
          <button onClick={() => setShow(true)} className="btn btn-gold btn-sm" style={{ flexShrink: 0 }}>
            + {tab === 'supervizyon' ? 'Grup Oluştur' : 'Kanal Oluştur'}
          </button>
        )}
      </div>

      {/* Grup listesi */}
      {(tab === 'supervizyon' ? formalGroups : peerGroups).length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tab === 'supervizyon' ? '⬡' : '⟁'}</div>
          <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.2rem', marginBottom: '8px' }}>
            {tab === 'supervizyon' ? 'Henüz süpervizyon grubu yok' : 'Henüz akran kanalı yok'}
          </h3>
          <p style={{ fontFamily: 'Cormorant Garant,serif', color: 'var(--muted)', fontSize: '.88rem' }}>
            {tab === 'supervizyon'
              ? isUstat ? 'İlk grubu oluşturun, Aday psikologlar katılsın.' : 'Üstat psikologlar grup oluşturduğunda burada görünecek.'
              : 'İlk akran kanalını oluşturun, meslektaşlarınızla buluşun.'
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(tab === 'supervizyon' ? formalGroups : peerGroups).map(group => {
            const isMember   = myGroupIds.includes(group.id) || group.leader_id === userId
            const isLeader   = group.leader_id === userId
            const approved   = group.supervision_group_members.filter(m => m.status === 'approved').length
            const pending    = group.supervision_group_members.filter(m => m.status === 'pending').length

            return (
              <div key={group.id} className="card" style={{ padding: '0' }}>
                <div style={{ padding: '18px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.05rem', color: 'var(--cream)', fontWeight: 500 }}>{group.title}</h3>
                      <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', color: 'var(--muted)', border: '1px solid var(--border)', padding: '2px 8px' }}>
                        {group.session_type === 'online' ? 'Online' : group.session_type === 'yuz_yuze' ? 'Yüz Yüze' : 'Karma'}
                      </span>
                      {group.specialty && (
                        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', color: 'var(--gold-d)', border: '1px solid rgba(201,169,110,.25)', padding: '2px 8px' }}>
                          {group.specialty}
                        </span>
                      )}
                      {group.status === 'full' && <span className="badge badge-muted">Dolu</span>}
                      {isMember && <span className="badge badge-green">Üyesiniz</span>}
                      {isLeader && <span className="badge badge-gold">Kurucu</span>}
                    </div>
                    {group.description && (
                      <p style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.85rem', color: 'var(--text)', marginBottom: '8px', lineHeight: 1.65 }}>{group.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                      {group.leader?.profiles?.full_name && (
                        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
                          👤 {group.leader.profiles.full_name}
                        </span>
                      )}
                      {group.schedule && (
                        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
                          📅 {group.schedule}
                        </span>
                      )}
                      <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--muted)' }}>
                        👥 {approved}/{group.max_members} üye
                      </span>
                      {group.price_per_session && (
                        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.82rem', color: 'var(--gold)', fontWeight: 500 }}>
                          {group.price_per_session.toLocaleString('tr-TR')}₺/kişi/seans
                        </span>
                      )}
                      {!group.price_per_session && tab === 'akran' && (
                        <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.78rem', color: 'var(--green)' }}>Ücretsiz</span>
                      )}
                    </div>
                  </div>

                  {/* Aksiyonlar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {isMember && (
                      <button onClick={() => setChat(openChat === group.id ? null : group.id)}
                        className="btn btn-gold btn-sm">
                        {openChat === group.id ? 'Kapat' : '💬 Kanal'}
                      </button>
                    )}
                    {!isMember && group.status === 'open' && (
                      <JoinButton groupId={group.id} onJoined={() => router.refresh()} />
                    )}
                    {isLeader && pending > 0 && (
                      <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', color: 'var(--gold)', textAlign: 'center' }}>
                        {pending} başvuru bekliyor
                      </span>
                    )}
                  </div>
                </div>

                {/* Bekleyen üye onayları (Lider için) */}
                {isLeader && group.supervision_group_members.filter(m => m.status === 'pending').length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px', background: 'rgba(201,169,110,.03)' }}>
                    <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-d)', marginBottom: '8px' }}>
                      Başvurular ({pending})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {group.supervision_group_members.filter(m => m.status === 'pending').map(m => (
                        <MemberApproval key={m.id} groupId={group.id} memberId={m.member_id} onUpdate={() => router.refresh()} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Kanal / mesajlaşma */}
                {openChat === group.id && isMember && (
                  <GroupChat groupId={group.id} userId={userId} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Grup/Kanal oluşturma modal */}
      {showCreate && (
        <CreateGroupModal
          groupType={tab === 'supervizyon' ? 'formal' : 'peer'}
          onClose={() => setShow(false)}
          onCreated={() => { setShow(false); router.refresh() }}
        />
      )}
    </div>
  )
}

/* ── Join Button ── */
function JoinButton({ groupId, onJoined }: { groupId: string; onJoined: () => void }) {
  const [loading, setLoading] = useState(false)
  const [note, setNote]       = useState('')
  const [open, setOpen]       = useState(false)

  async function join() {
    setLoading(true)
    await fetch(`/api/supervision-groups/${groupId}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    setLoading(false)
    onJoined()
  }

  if (!open) return <button onClick={() => setOpen(true)} className="btn btn-outline btn-sm">Katıl →</button>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Kısa tanıtım (opsiyonel)"
        style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', padding: '7px 10px', color: 'var(--cream)', fontFamily: 'Lora,serif', fontSize: '.82rem', outline: 'none' }} />
      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={() => setOpen(false)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>İptal</button>
        <button onClick={join} disabled={loading} className="btn btn-gold btn-sm" style={{ flex: 2, justifyContent: 'center' }}>
          {loading ? '…' : 'Başvur'}
        </button>
      </div>
    </div>
  )
}

/* ── Member Approval ── */
function MemberApproval({ groupId, memberId, onUpdate }: { groupId: string; memberId: string; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false)
  async function decide(status: string) {
    setLoading(true)
    await fetch(`/api/supervision-groups/${groupId}/members`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId, status }),
    })
    setLoading(false)
    onUpdate()
  }
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.8rem', color: 'var(--text)', flex: 1 }}>
        Psikolog başvurusu
      </span>
      <button onClick={() => decide('approved')} disabled={loading} className="btn btn-gold btn-sm">Onayla</button>
      <button onClick={() => decide('rejected')}  disabled={loading} className="btn btn-outline btn-sm" style={{ color: 'var(--red)', borderColor: 'rgba(201,110,110,.3)' }}>Reddet</button>
    </div>
  )
}

/* ── Group Chat ── */
function GroupChat({ groupId, userId }: { groupId: string; userId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [body, setBody]         = useState('')
  const [sending, setSending]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/supervision-groups/${groupId}/messages`)
      .then(r => r.json()).then(setMessages)
  }, [groupId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!body.trim()) return
    setSending(true)
    const res = await fetch(`/api/supervision-groups/${groupId}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    const msg = await res.json()
    setMessages(prev => [...prev, msg])
    setBody('')
    setSending(false)
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 && (
          <p style={{ fontFamily: 'Cormorant Garant,serif', color: 'var(--muted)', fontSize: '.85rem', textAlign: 'center', padding: '20px 0' }}>
            Henüz mesaj yok. İlk mesajı siz yazın.
          </p>
        )}
        {messages.map((msg: any) => (
          <div key={msg.id} style={{ alignSelf: msg.sender_id === userId ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
            <div style={{ padding: '8px 12px', background: msg.sender_id === userId ? 'rgba(201,169,110,.1)' : 'var(--bg2)', border: `1px solid ${msg.sender_id === userId ? 'rgba(201,169,110,.25)' : 'var(--border)'}` }}>
              {msg.sender_id !== userId && (
                <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.68rem', color: 'var(--gold-d)', marginBottom: '3px' }}>
                  {msg.sender?.profiles?.full_name || 'Psikolog'}
                </div>
              )}
              <p style={{ fontSize: '.88rem', color: 'var(--cream)', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
              <div style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '.65rem', color: 'var(--muted)', marginTop: '3px', textAlign: 'right' }}>
                {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '10px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
        <input value={body} onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Mesaj yazın… (Enter)"
          style={{ flex: 1, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', padding: '9px 12px', color: 'var(--cream)', fontFamily: 'Lora,serif', fontSize: '.88rem', outline: 'none' }} />
        <button onClick={send} disabled={sending || !body.trim()} className="btn btn-gold btn-sm">Gönder</button>
      </div>
    </div>
  )
}

/* ── Create Group Modal ── */
function CreateGroupModal({ groupType, onClose, onCreated }: { groupType: string; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', specialty: '', max_members: '5',
    price_per_session: '', schedule: '', session_type: 'online',
  })
  const [loading, setLoading] = useState(false)
  const isFormal = groupType === 'formal'

  async function create() {
    if (!form.title.trim()) return
    setLoading(true)
    await fetch('/api/supervision-groups', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, max_members: parseInt(form.max_members), price_per_session: form.price_per_session ? parseInt(form.price_per_session) : null, group_type: groupType }),
    })
    setLoading(false)
    onCreated()
  }

  const iSt: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', padding: '10px 14px', color: 'var(--cream)', fontFamily: 'Lora,serif', fontSize: '.88rem', outline: 'none' }
  const lSt: React.CSSProperties = { display: 'block', fontFamily: 'Cormorant Garant,serif', fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--gold-d)', marginBottom: '5px' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg2)', border: '1px solid var(--border-h)', width: 'min(520px,100%)', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
        <h3 style={{ fontFamily: 'Cormorant Garant,serif', fontSize: '1.3rem', fontWeight: 400, marginBottom: '20px' }}>
          {isFormal ? 'Süpervizyon Grubu Oluştur' : 'Akran Kanalı Oluştur'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div><label style={lSt}>Başlık *</label><input style={iSt} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={isFormal ? 'BDT Süpervizyon Grubu' : 'Travma Uzmanları Akran Grubu'} /></div>
          <div><label style={lSt}>Açıklama</label><textarea style={{ ...iSt, resize: 'vertical', minHeight: '70px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Grup hakkında kısa bilgi…" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={lSt}>Uzmanlık</label><input style={iSt} value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="BDT, EMDR, vb." /></div>
            <div><label style={lSt}>Maks Üye</label><input style={iSt} type="number" value={form.max_members} onChange={e => setForm({ ...form, max_members: e.target.value })} min="2" max="12" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {isFormal && <div><label style={lSt}>Kişi Başı Fiyat (₺)</label><input style={iSt} type="number" value={form.price_per_session} onChange={e => setForm({ ...form, price_per_session: e.target.value })} placeholder="Boş = ücretsiz" /></div>}
            <div><label style={lSt}>Program</label><input style={iSt} value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="Çarşamba 18:00" /></div>
          </div>
          <div>
            <label style={lSt}>Seans Türü</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['online','Online'],['yuz_yuze','Yüz Yüze'],['karma','Karma']].map(([v,l]) => (
                <button key={v} onClick={() => setForm({ ...form, session_type: v })}
                  style={{ flex: 1, padding: '8px', fontFamily: 'Cormorant Garant,serif', fontSize: '.82rem', border: `1px solid ${form.session_type === v ? 'var(--gold)' : 'var(--border)'}`, background: form.session_type === v ? 'rgba(201,169,110,.1)' : 'transparent', color: form.session_type === v ? 'var(--gold)' : 'var(--text)', cursor: 'pointer' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>İptal</button>
          <button onClick={create} disabled={loading || !form.title.trim()} className="btn btn-gold btn-sm" style={{ flex: 2, justifyContent: 'center' }}>
            {loading ? 'Oluşturuluyor…' : 'Oluştur →'}
          </button>
        </div>
      </div>
    </div>
  )
}
