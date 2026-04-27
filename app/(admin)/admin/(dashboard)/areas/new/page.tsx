import { createClient } from '@/lib/supabase/server'
import { AreaForm } from '@/components/admin/area-form'

export default async function NewAreaPage() {
  const supabase = await createClient()
  
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('status', 'published')
    .order('name')

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  return <AreaForm agents={agents || []} isAdmin={isAdmin} currentAgentId={currentAgentId} />
}
