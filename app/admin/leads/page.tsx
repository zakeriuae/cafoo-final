import { createClient } from '@/lib/supabase/server'
import { LeadsTable } from '@/components/admin/leads-table'

async function getLeads() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  let query = supabase
    .from('leads')
    .select(`
      *,
      property:properties(id, title),
      tower:towers(id, name),
      area:areas(id, name),
      agent:agents(id, name)
    `)
    .order('created_at', { ascending: false })

  if (!isAdmin && currentAgentId) {
    query = query.eq('agent_id', currentAgentId)
  }

  const { data } = await query
  return data || []
}

async function getAgents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('agents')
    .select('id, name')
    .eq('status', 'published')
    .order('name')
  return data || []
}

export default async function LeadsPage() {
  const [leads, agents] = await Promise.all([getLeads(), getAgents()])

  return <LeadsTable leads={leads} agents={agents} />
}
