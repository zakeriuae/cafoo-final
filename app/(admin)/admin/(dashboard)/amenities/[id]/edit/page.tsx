import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AmenityForm } from '@/components/admin/amenity-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAmenityPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: amenity } = await supabase
    .from('amenities')
    .select('*')
    .eq('id', id)
    .single()

  if (!amenity) {
    notFound()
  }

  return <AmenityForm amenity={amenity} />
}
