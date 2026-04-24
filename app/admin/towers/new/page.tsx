import { createClient } from '@/lib/supabase/server'
import { TowerForm } from '@/components/admin/tower-form'

export default async function NewTowerPage() {
  const supabase = await createClient()
  
  const [
    { data: areas },
    { data: developers },
    { data: agents },
  ] = await Promise.all([
    supabase.from('areas').select('*').eq('status', 'published').order('name'),
    supabase.from('developers').select('*').eq('status', 'published').order('name'),
    supabase.from('agents').select('*').eq('status', 'published').order('name'),
  ])

  return (
    <TowerForm
      areas={areas || []}
      developers={developers || []}
      agents={agents || []}
    />
  )
}
