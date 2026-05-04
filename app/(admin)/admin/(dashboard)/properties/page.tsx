import { createClient } from '@/lib/supabase/server'
import { PropertiesTable } from './properties-table'

async function getProperties() {
  const supabase = await createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return []
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  let query = supabase
    .from('properties')
    .select('*, area:areas(name), tower:towers(name), agent:agents(name)')
    .neq('content_status', 'archived')
    .order('created_at', { ascending: false })

  if (!isAdmin && currentAgentId) {
    query = query.eq('agent_id', currentAgentId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export default async function PropertiesPage() {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user
    
    let isAdmin = false
    if (user) {
      if (user.email === 'zakeriuae@gmail.com' || user.email === 'mynameismehdihasan@gmail.com') {
        isAdmin = true
      } else {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        isAdmin = profile?.role === 'admin'
      }
    }

    const properties = await getProperties()

    return <PropertiesTable properties={properties} isAdmin={isAdmin} />
  } catch (error: any) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h1 className="text-red-700 font-bold text-xl mb-4">Server Error:</h1>
        <pre className="bg-white p-4 rounded border overflow-auto text-sm">
          {error.message}
        </pre>
      </div>
    )
  }
}
