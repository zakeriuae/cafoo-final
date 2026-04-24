import { createClient } from '@/lib/supabase/server'
import { AreaForm } from '@/components/admin/area-form'

export default async function NewAreaPage() {
  const supabase = await createClient()
  
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('status', 'published')
    .order('name')

  return <AreaForm agents={agents || []} />
}
