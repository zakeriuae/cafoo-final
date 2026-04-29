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

  // Fetch last 10 actions for this user if available
  let actions = []
  if (lead.user_id) {
    const { data: userActions } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', lead.user_id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    actions = userActions || []
  }

  return (
    <div className="container mx-auto py-6">
      <LeadCRMView lead={lead} actions={actions} />
    </div>
  )
}
