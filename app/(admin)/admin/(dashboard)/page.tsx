import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp,
  Eye,
  MessageSquare,
  DollarSign
} from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  
  if (!user) return { properties: 0, towers: 0, areas: 0, agents: 0, leads: 0, newLeads: 0 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  let propertiesQuery = supabase.from('properties').select('*', { count: 'exact', head: true })
  let towersQuery = supabase.from('towers').select('*', { count: 'exact', head: true })
  let areasQuery = supabase.from('areas').select('*', { count: 'exact', head: true })
  let leadsQuery = supabase.from('leads').select('*', { count: 'exact', head: true })
  let newLeadsQuery = supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new')
  
  // Also count agents, but agents only see themselves (so count 1) if they are an agent
  let agentsQuery = supabase.from('agents').select('*', { count: 'exact', head: true })

  if (!isAdmin && currentAgentId) {
    propertiesQuery = propertiesQuery.eq('agent_id', currentAgentId)
    towersQuery = towersQuery.eq('assigned_agent_id', currentAgentId)
    areasQuery = areasQuery.eq('assigned_agent_id', currentAgentId)
    leadsQuery = leadsQuery.eq('agent_id', currentAgentId)
    newLeadsQuery = newLeadsQuery.eq('agent_id', currentAgentId)
    agentsQuery = agentsQuery.eq('id', currentAgentId)
  }

  const [
    { count: propertiesCount },
    { count: towersCount },
    { count: areasCount },
    { count: agentsCount },
    { count: leadsCount },
    { count: newLeadsCount },
  ] = await Promise.all([
    propertiesQuery,
    towersQuery,
    areasQuery,
    agentsQuery,
    leadsQuery,
    newLeadsQuery,
  ])

  return {
    properties: propertiesCount || 0,
    towers: towersCount || 0,
    areas: areasCount || 0,
    agents: agentsCount || 0,
    leads: leadsCount || 0,
    newLeads: newLeadsCount || 0,
  }
}

async function getRecentLeads() {
  const supabase = await createClient()
  
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  
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
    .select('*, property:properties(title), agent:agents(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  if (!isAdmin && currentAgentId) {
    query = query.eq('agent_id', currentAgentId)
  }

  const { data } = await query

  return data || []
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentLeads = await getRecentLeads()

  const statCards = [
    { 
      title: 'Total Properties', 
      value: stats.properties, 
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Total Towers', 
      value: stats.towers, 
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Areas', 
      value: stats.areas, 
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Agents', 
      value: stats.agents, 
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      title: 'Total Leads', 
      value: stats.leads, 
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    },
    { 
      title: 'New Leads', 
      value: stats.newLeads, 
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Cafoo admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No leads yet</p>
          ) : (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{lead.name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.email || lead.phone || 'No contact info'}
                    </p>
                    {lead.property && (
                      <p className="text-sm text-muted-foreground">
                        Property: {lead.property.title}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-green-100 text-green-800' :
                      lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'won' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
