import { createClient } from '@/lib/supabase/server'
import { TowerForm } from '@/components/admin/tower-form'

export default async function NewTowerPage() {
  const supabase = await createClient()
  
  const [
    { data: areas },
    { data: developers },
    { data: agents },
  ] = await Promise.all([
    supabase.from('areas').select('*').eq('status', 'published').order('name'),
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
    <TowerForm
      areas={areas || []}
      developers={developers || []}
      agents={agents || []}
      isAdmin={isAdmin}
      currentAgentId={currentAgentId}
    />
  )
}
