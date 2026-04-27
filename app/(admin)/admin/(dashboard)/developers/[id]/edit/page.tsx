import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeveloperForm } from '@/components/admin/developer-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditDeveloperPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: developer } = await supabase
    .from('developers')
    .select('*')
    .eq('id', id)
    .single()

  if (!developer) {
    notFound()
  }

  return <DeveloperForm developer={developer} />
}
