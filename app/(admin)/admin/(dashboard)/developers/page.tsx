import { createClient } from '@/lib/supabase/server'
import { DevelopersTable } from './developers-table'

async function getDevelopers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('developers')
    .select('*')
    .order('sort_order', { ascending: true })
  return data || []
}

export default async function DevelopersPage() {
  const developers = await getDevelopers()

  return <DevelopersTable developers={developers} />
}
