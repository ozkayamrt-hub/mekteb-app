import { createAdminClient } from '@/lib/supabase/server'
import VercelStats from './VercelStats'

export default async function IstatistiklerPage() {
  const supabase = await createAdminClient()

  // Tüm verileri paralel çek
  const [
    { count: totalPsy },
    { count: activePsy },
    { count: pendingPsy },
    { count: adayPsy },
    { count: uzmanPsy },
    { count: ustatPsy },
    { count: totalRequests },
    { count: pendingRequests },
    { count: totalFeedback },
    { count: unreadFeedback },
    { count: totalComplaints },
    { count: openComplaints },
    { count: totalDocs },
    { count: pendingDocs },
    { count: totalMentorships },
    { count: totalUpgrades },
  ] = await Promise.all([
    supabase.from('psychologists').select('*', { count:'exact', head:true }),
    supabase.from('psychologists').select('*', { count:'exact', head:true }).eq('status','active'),
    supabase.from('psychologists').select('*', { count:'exact', head:true }).eq('status','pending'),
    supabase.from('psychologists').select('*', { count:'exact', head:true }).eq('tier','aday'),
    supabase.from('psychologists').select('*', { count:'exact', head:true }).eq('tier','uzman'),
    supabase.from('psychologists').select('*', { count:'exact', head:true }).eq('tier','ustat'),
    supabase.from('appointment_requests').select('*', { count:'exact', head:true }),
    supabase.from('appointment_requests').select('*', { count:'exact', head:true }).eq('status','pending'),
    supabase.from('feedback').select('*', { count:'exact', head:true }),
    supabase.from('feedback').select('*', { count:'exact', head:true }).eq('status','unread'),
    supabase.from('complaints').select('*', { count:'exact', head:true }),
    supabase.from('complaints').select('*', { count:'exact', head:true }).eq('status','open'),
    supabase.from('psychologist_documents').select('*', { count:'exact', head:true }),
    supabase.from('psychologist_documents').select('*', { count:'exact', head:true }).eq('status','pending'),
    supabase.from('mentorships').select('*', { count:'exact', head:true }).eq('status','active'),
    supabase.from('tier_upgrade_requests').select('*', { count:'exact', head:true }).eq('status','pending'),
  ])

  // Son 7 günlük randevu talepleri
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: recentRequests } = await supabase
    .from('appointment_requests')
    .select('*', { count:'exact', head:true })
    .gte('created_at', sevenDaysAgo)

  const { count: recentPsy } = await supabase
    .from('psychologists')
    .select('*', { count:'exact', head:true })
    .gte('created_at', sevenDaysAgo)

  function StatCard({ label, value, sub, color = 'var(--gold)', alert = false }: {
    label: string; value: number | null; sub?: string; color?: string; alert?: boolean
  }) {
    return (
      <div style={{ background:'var(--bg2)', border:`1px solid ${alert && (value ?? 0) > 0 ? 'rgba(201,169,110,.4)' : 'var(--border)'}`, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
        {alert && (value ?? 0) > 0 && (
          <div style={{ position:'absolute', top:'10px', right:'12px', width:'8px', height:'8px', borderRadius:'50%', background:'var(--gold)', animation:'pulse 2s ease-in-out infinite' }} />
        )}
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.68rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>{label}</div>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'2.2rem', fontWeight:300, color, lineHeight:1, marginBottom:'4px' }}>{value ?? 0}</div>
        {sub && <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.72rem', color:'var(--muted)' }}>{sub}</div>}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom:'32px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom:'6px' }}>Platform</div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>İstatistik<em style={{ fontStyle:'italic', color:'var(--gold)' }}>ler</em></h1>
        </div>
        <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.8rem', color:'var(--muted)' }}>
          Son güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit' })}
        </div>
      </div>

      {/* Bu hafta */}
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>
        Bu Hafta (son 7 gün)
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'28px' }}>
        <StatCard label="Yeni Psikolog Başvurusu" value={recentPsy} color="var(--green)" />
        <StatCard label="Yeni Randevu Talebi" value={recentRequests} color="var(--green)" />
        <StatCard label="Okunmamış Görüş" value={unreadFeedback} alert />
        <StatCard label="Açık Şikayet" value={openComplaints} color="var(--red)" alert />
      </div>

      {/* Psikologlar */}
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>
        Psikologlar
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'12px', marginBottom:'28px' }}>
        <StatCard label="Toplam" value={totalPsy} />
        <StatCard label="Aktif" value={activePsy} color="var(--green)" />
        <StatCard label="Onay Bekleyen" value={pendingPsy} alert />
        <StatCard label="Aday (I)" value={adayPsy} color="var(--text)" />
        <StatCard label="Uzman (II)" value={uzmanPsy} color="var(--gold-d)" />
        <StatCard label="Üstat (III)" value={ustatPsy} color="var(--gold)" />
      </div>

      {/* Randevular & Belgeler */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'28px' }}>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>
            Randevu Talepleri
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <StatCard label="Toplam Talep" value={totalRequests} />
            <StatCard label="Yanıt Bekleyen" value={pendingRequests} alert />
          </div>
        </div>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>
            Belgeler & Kademe
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <StatCard label="Toplam Belge" value={totalDocs} />
            <StatCard label="İnceleme Bekleyen" value={pendingDocs} alert />
          </div>
        </div>
      </div>

      {/* Topluluk */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginBottom:'36px' }}>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>Mentörlük</div>
          <StatCard label="Aktif Mentörlük" value={totalMentorships} color="var(--green)" />
        </div>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>Kademe Yükseltme</div>
          <StatCard label="Bekleyen Başvuru" value={totalUpgrades} alert />
        </div>
        <div>
          <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>Görüş & Şikayet</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <StatCard label="Toplam Görüş" value={totalFeedback} />
            <StatCard label="Şikayet" value={totalComplaints} color="var(--red)" />
          </div>
        </div>
      </div>

      {/* Vercel Analytics */}
      <div style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:'12px' }}>
        Ziyaretçi Analitiği (Vercel)
      </div>
      <VercelStats />
    </div>
  )
}
