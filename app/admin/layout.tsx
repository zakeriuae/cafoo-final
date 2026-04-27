import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { Toaster } from '@/components/ui/sonner'
import '../globals.css'

export const metadata = {
  title: 'Admin Panel | Cafoo Real Estate',
  description: 'Manage your real estate platform',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // If we are on the login page, just render children without sidebar/header
  if (pathname === '/admin/login') {
    return (
      <html lang="en">
        <body className="font-sans antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'agent'].includes(profile.role)) {
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex h-screen bg-muted/30">
          <AdminSidebar role={profile.role} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <AdminHeader user={user} />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
