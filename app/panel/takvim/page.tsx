import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AvailabilityManager from './AvailabilityManager'

export default async function TakvimPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: blocks } = await supabase
    .from('availability_blocks')
    .select('*')
    .eq('psychologist_id', user.id)
    .order('block_type')
    .order('day_of_week')
    .order('specific_date')

  return (
    <div style={{ padding:'32px 40px', maxWidth:'960px' }}>
      <div style={{ marginBottom:'32px' }}>
        <div className="eyebrow" style={{ marginBottom:'6px' }}>Çalışma Takvimi</div>
        <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Kapalı <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Günlerim</em></h1>
        <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--text)', marginTop:'10px', maxWidth:'600px', lineHeight:1.7 }}>
          Takviminiz varsayılan olarak tamamen açıktır. Müsait olmadığınız günleri veya belirli saat aralıklarını aşağıdan kapatın.
        </p>
      </div>
      <AvailabilityManager initialBlocks={blocks ?? []} />
    </div>
  )
}
