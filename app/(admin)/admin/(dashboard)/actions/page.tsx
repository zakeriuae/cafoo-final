import { createClient } from '@/lib/supabase/server'
import { LeadsTable } from '@/components/admin/leads-table'
import { Button } from '@/components/ui/button'
import { Plus, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'

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

async function getAgents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('agents')
    .select('id, name')
    .eq('status', 'published')
    .order('name')
  return data || []
}

export default async function ActionsPage() {
  const [leads, agents] = await Promise.all([getLeads(), getAgents()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Actions</h1>
          <p className="text-muted-foreground">Bulk management and tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mr-4">
            <Button variant="ghost" size="sm" asChild className="rounded-lg h-8 px-3 font-bold text-[10px] uppercase text-slate-500">
              <Link href="/admin/leads">
                <LayoutGrid className="w-3 h-3 mr-2" />
                Kanban
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-lg h-8 px-3 font-bold text-[10px] uppercase">
              <List className="w-3 h-3 mr-2" />
              Table
            </Button>
          </div>
          <Button className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <LeadsTable leads={leads} agents={agents} title="Actions" />
    </div>
  )
}
