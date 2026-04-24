import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PropertyForm } from '@/components/admin/property-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const [
    { data: property },
    { data: areas },
    { data: towers },
    { data: developers },
    { data: agents },
  ] = await Promise.all([
    supabase.from('properties').select('*').eq('id', id).single(),
    supabase.from('areas').select('*').eq('status', 'published').order('name'),
    supabase.from('towers').select('*').eq('status', 'published').order('name'),
    supabase.from('developers').select('*').eq('status', 'published').order('name'),
    supabase.from('agents').select('*').eq('status', 'published').order('name'),
  ])

  if (!property) {
    notFound()
  }

  return (
    <PropertyForm
      property={property}
      areas={areas || []}
      towers={towers || []}
      developers={developers || []}
      agents={agents || []}
    />
  )
}
