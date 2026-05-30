import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

const ADMIN_EMAIL = 'ozkaya.mrt@gmail.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/giris')
  if (user.email !== ADMIN_EMAIL) redirect('/')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar />
      <main style={{ overflow: 'auto', background: 'var(--bg)', padding: '36px 40px' }}>
        {children}
      </main>
    </div>
  )
}
