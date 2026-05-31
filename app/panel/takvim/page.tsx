import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AvailabilityManager from './AvailabilityManager'

export default async function TakvimPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: slots } = await supabase
    .from('availability_slots')
    .select('*')
    .eq('psychologist_id', user.id)
    .order('day_of_week')
    .order('start_time')

  return (
    <div style={{ padding:'32px 40px', maxWidth:'900px' }}>
      <div style={{ marginBottom:'32px' }}>
        <div className="eyebrow" style={{ marginBottom:'6px' }}>Çalışma Takvimi</div>
        <h1 style={{ fontSize:'1.8rem', fontWeight:400 }}>Müsait <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Saatlerim</em></h1>
        <p style={{ fontFamily:'Cormorant Garant,serif', fontSize:'.9rem', color:'var(--text)', marginTop:'10px', maxWidth:'560px', lineHeight:1.7 }}>
          Danışanlar randevu talep ederken müsait saatlerinizi görebilir. Haftalık tekrarlayan saatler veya belirli günlere özel slotlar ekleyebilirsiniz.
        </p>
      </div>
      <AvailabilityManager initialSlots={slots ?? []} />
    </div>
  )
}
