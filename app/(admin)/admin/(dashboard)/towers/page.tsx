import { createClient } from '@/lib/supabase/server'
import { TowersTable } from './towers-table'

async function getTowers() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return []
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  let query = supabase
    .from('towers')
    .select('*, area:areas(name), developer:developers(name)')
    .neq('status', 'archived')
    .order('sort_order', { ascending: true })

  if (!isAdmin && currentAgentId) {
    query = query.eq('assigned_agent_id', currentAgentId)
  }

  const { data } = await query
  return data || []
}

export default async function TowersPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin'
  }

  const towers = await getTowers()

  return <TowersTable towers={towers} isAdmin={isAdmin} />
}
