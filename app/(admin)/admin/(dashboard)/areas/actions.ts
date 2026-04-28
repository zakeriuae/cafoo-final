'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteArea(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/areas')
  revalidatePath('/')
  return { success: true }
}

export async function createArea(formData: FormData) {
  const supabase = await createClient()

  const galleryRaw = formData.get('gallery') as string
  let gallery: string[] = []
  try { gallery = galleryRaw ? JSON.parse(galleryRaw) : [] } catch {}

  const data = {
    name: formData.get('name') as string,
    name_fa: formData.get('name_fa') as string || null,
    slug: formData.get('slug') as string,
    short_description: formData.get('short_description') as string || null,
    short_description_fa: formData.get('short_description_fa') as string || null,
    full_description: formData.get('full_description') as string || null,
    full_description_fa: formData.get('full_description_fa') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    gallery,
    assigned_agent_id: formData.get('assigned_agent_id') as string || null,
    average_price: formData.get('average_price') ? parseFloat(formData.get('average_price') as string) : null,
    price_growth_percent: formData.get('price_growth_percent') ? parseFloat(formData.get('price_growth_percent') as string) : null,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
  }

  const { error } = await supabase.from('areas').insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/areas')
  revalidatePath('/')
  return { success: true }
}

export async function updateArea(id: string, formData: FormData) {
  const supabase = await createClient()

  const galleryRaw2 = formData.get('gallery') as string
  let gallery2: string[] = []
  try { gallery2 = galleryRaw2 ? JSON.parse(galleryRaw2) : [] } catch {}

  const data = {
    name: formData.get('name') as string,
    name_fa: formData.get('name_fa') as string || null,
    slug: formData.get('slug') as string,
    short_description: formData.get('short_description') as string || null,
    short_description_fa: formData.get('short_description_fa') as string || null,
    full_description: formData.get('full_description') as string || null,
    full_description_fa: formData.get('full_description_fa') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    gallery: gallery2,
    assigned_agent_id: formData.get('assigned_agent_id') as string || null,
    average_price: formData.get('average_price') ? parseFloat(formData.get('average_price') as string) : null,
    price_growth_percent: formData.get('price_growth_percent') ? parseFloat(formData.get('price_growth_percent') as string) : null,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
  }

  const { error } = await supabase
    .from('areas')
    .update(data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/areas')
  revalidatePath('/')
  return { success: true }
}
