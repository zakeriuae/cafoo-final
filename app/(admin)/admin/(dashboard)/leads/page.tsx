import { createClient } from '@/lib/supabase/server'
import { LeadsKanban } from '@/components/admin/leads-kanban'
import { AddLeadDialog } from '@/components/admin/add-lead-dialog'

async function getLeads() {
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

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: agents } = await supabase.from('agents').select('id, name').order('name')
  const leads = await getLeads()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads (CRM)</h1>
          <p className="text-muted-foreground">Modern pipeline management</p>
        </div>
        <div className="flex items-center gap-2">
          <AddLeadDialog agents={agents || []} />
        </div>
      </div>

      <LeadsKanban leads={leads} />
    </div>
  )
}
