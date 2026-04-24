import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TowerForm } from '@/components/admin/tower-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTowerPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const [
    { data: tower },
    { data: areas },
    { data: developers },
    { data: agents },
  ] = await Promise.all([
    supabase.from('towers').select('*').eq('id', id).single(),
    supabase.from('areas').select('*').eq('status', 'published').order('name'),
    supabase.from('developers').select('*').eq('status', 'published').order('name'),
    supabase.from('agents').select('*').eq('status', 'published').order('name'),
  ])

  if (!tower) {
    notFound()
  }

  return (
    <TowerForm
      tower={tower}
      areas={areas || []}
      developers={developers || []}
      agents={agents || []}
    />
  )
}
