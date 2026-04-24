import { createClient } from '@/lib/supabase/server'
import { LeadsTable } from '@/components/admin/leads-table'

async function getLeads() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leads')
    .select(`
      *,
      property:properties(id, title),
      tower:towers(id, name),
      area:areas(id, name),
      agent:agents(id, name)
    `)
    .order('created_at', { ascending: false })
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
