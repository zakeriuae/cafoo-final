'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAmenity(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('amenities')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}

export async function createAmenity(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const name_fa = formData.get('name_fa') as string || null
  const icon = formData.get('icon') as string || null
  const category = formData.get('category') as string || null
  const sort_order = formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { error } = await supabase.from('amenities').insert({
    name,
    name_fa,
    slug,
    icon,
    category,
    sort_order
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}

export async function updateAmenity(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const name_fa = formData.get('name_fa') as string || null
  const icon = formData.get('icon') as string || null
  const category = formData.get('category') as string || null
  const sort_order = formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0

  const { error } = await supabase
    .from('amenities')
    .update({
      name,
      name_fa,
      icon,
      category,
      sort_order
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/amenities')
  return { success: true }
}
