import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AreaForm } from '@/components/admin/area-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAreaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const [{ data: area }, { data: agents }] = await Promise.all([
    supabase.from('areas').select('*').eq('id', id).single(),
    supabase.from('agents').select('*').eq('status', 'published').order('name'),
  ])

  if (!area) {
    notFound()
  }

  const { data } = await supabase.auth.getUser()
  const user = data?.user
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  const isAdmin = profile?.role === 'admin'
  
  let currentAgentId = null
  if (!isAdmin && user) {
    const { data: agent } = await supabase.from('agents').select('id').eq('user_id', user.id).single()
    currentAgentId = agent?.id
  }

  return <AreaForm area={area} agents={agents || []} isAdmin={isAdmin} currentAgentId={currentAgentId} />
}
