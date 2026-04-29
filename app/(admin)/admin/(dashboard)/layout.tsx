import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  
  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'agent'].includes(profile.role)) {
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <div className="fixed inset-0 flex bg-slate-100 overflow-hidden">
      <AdminSidebar role={profile.role} />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6 pb-20">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
