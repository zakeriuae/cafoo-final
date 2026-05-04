'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDeveloper(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('developers')
    .update({ status: 'archived' })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/developers')
  revalidatePath('/')
  return { success: true }
}

export async function createDeveloper(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const name_fa = formData.get('name_fa') as string
  const slug = formData.get('slug') as string
  const logo_url = formData.get('logo_url') as string
  const description = formData.get('description') as string
  const description_fa = formData.get('description_fa') as string
  const website = formData.get('website') as string
  const established_year = formData.get('established_year') as string
  const total_projects = formData.get('total_projects') as string
  const status = formData.get('status') as string
  const sort_order = formData.get('sort_order') as string

  const { data, error } = await supabase
    .from('developers')
    .insert({
      name,
      name_fa: name_fa || null,
      slug,
      logo_url: logo_url || null,
      description: description || null,
      description_fa: description_fa || null,
      website: website || null,
      established_year: established_year ? parseInt(established_year) : null,
      total_projects: total_projects ? parseInt(total_projects) : 0,
      status: status as 'draft' | 'published' | 'archived',
      sort_order: sort_order ? parseInt(sort_order) : 0,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/developers')
  revalidatePath('/')
  return { success: true, data }
}

export async function updateDeveloper(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const name_fa = formData.get('name_fa') as string
  const slug = formData.get('slug') as string
  const logo_url = formData.get('logo_url') as string
  const description = formData.get('description') as string
  const description_fa = formData.get('description_fa') as string
  const website = formData.get('website') as string
  const established_year = formData.get('established_year') as string
  const total_projects = formData.get('total_projects') as string
  const status = formData.get('status') as string
  const sort_order = formData.get('sort_order') as string

  const { error } = await supabase
    .from('developers')
    .update({
      name,
      name_fa: name_fa || null,
      slug,
      logo_url: logo_url || null,
      description: description || null,
      description_fa: description_fa || null,
      website: website || null,
      established_year: established_year ? parseInt(established_year) : null,
      total_projects: total_projects ? parseInt(total_projects) : 0,
      status: status as 'draft' | 'published' | 'archived',
      sort_order: sort_order ? parseInt(sort_order) : 0,
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/developers')
  revalidatePath('/')
  return { success: true }
}
