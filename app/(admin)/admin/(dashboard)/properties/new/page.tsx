import { createClient } from '@/lib/supabase/server'
import { PropertyForm } from '@/components/admin/property-form'

export default async function NewPropertyPage() {
  const supabase = await createClient()
  
  const [
    { data: areas },
    { data: towers },
    { data: developers },
    { data: agents },
  ] = await Promise.all([
    supabase.from('areas').select('*').eq('status', 'published').order('name'),
    supabase.from('towers').select('*').eq('status', 'published').order('name'),
    supabase.from('developers').select('*').eq('status', 'published').order('name'),
    supabase.from('agents').select('*').eq('status', 'published').order('name'),
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  return (
    <PropertyForm
      areas={areas || []}
      towers={towers || []}
      developers={developers || []}
      agents={agents || []}
      isAdmin={isAdmin}
      currentAgentId={currentAgentId}
    />
  )
}
