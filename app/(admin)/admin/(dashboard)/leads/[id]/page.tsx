import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { LeadCRMView } from '@/components/admin/lead-crm-view'

interface Props {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      property:properties(
        id, 
        title, 
        cover_image_url, 
        price, 
        listing_type,
        area:areas(name)
      ),
      tower:towers(id, name),
      area:areas(id, name),
      agent:agents(id, name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (!lead) {
    notFound()
  }

  // Fetch unified history from lead_messages
  const { data: messages } = await supabase
    .from('lead_messages')
    .select(`
      *,
      sender:profiles(full_name, avatar_url)
    `)
    .eq('lead_id', id)
    .order('created_at', { ascending: true })

  // Fetch all agents for reassignment
  const { data: allAgents } = await supabase
    .from('agents')
    .select('id, name, avatar_url')
    .eq('status', 'published')
    .order('name')

  return (
    <div className="container mx-auto py-6">
      <LeadCRMView 
        lead={lead} 
        messages={messages || []} 
        agents={allAgents || []}
      />
    </div>
  )
}
