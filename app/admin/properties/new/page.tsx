import { createClient } from '@/lib/supabase/server'
import { PropertyForm } from '@/components/admin/property-form'

export default async function NewPropertyPage() {
  const supabase = await createClient()
  
  const [
    { data: areas },
    { data: towers },
    { data: developers },
    { data: agents },
  ] = await Promise.all([
    supabase.from('areas').select('*').eq('status', 'published').order('name'),
    supabase.from('towers').select('*').eq('status', 'published').order('name'),
    supabase.from('developers').select('*').eq('status', 'published').order('name'),
    supabase.from('agents').select('*').eq('status', 'published').order('name'),
  ])

  return (
    <PropertyForm
      areas={areas || []}
      towers={towers || []}
      developers={developers || []}
      agents={agents || []}
    />
  )
}
