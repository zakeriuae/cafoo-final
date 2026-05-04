import { createClient } from '@/lib/supabase/server'
import { AgentsTable } from './agents-table'

async function getAgents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('agents')
    .select('*')
    .neq('status', 'archived')
    .order('sort_order', { ascending: true })
  return data || []
}

export default async function AgentsPage() {
  const agents = await getAgents()

  return <AgentsTable agents={agents} />
}
