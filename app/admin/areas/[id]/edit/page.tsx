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

  return <AreaForm area={area} agents={agents || []} />
}
