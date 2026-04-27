import { createClient } from '@/lib/supabase/server'
import { UsersTable } from './users-table'
import { redirect } from 'next/navigation'

async function getUsers() {
  const supabase = await createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return []
  
  // Verify if current user is admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return []
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    
  return data || []
}

export default async function UsersPage() {
  const users = await getUsers()
  
  if (users.length === 0) {
    // Check if it's because not authorized
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData?.user?.id).single()
    if (profile?.role !== 'admin') {
      redirect('/admin')
    }
  }

  return <UsersTable users={users} />
}
