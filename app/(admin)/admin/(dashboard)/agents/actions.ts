'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAgent(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/agents')
  return { success: true }
}

export async function createAgent(formData: FormData) {
  const supabase = await createClient()

  const languagesRaw = formData.get('languages') as string
  const specializationsRaw = formData.get('specializations') as string

  const data = {
    name: formData.get('name') as string,
    name_fa: formData.get('name_fa') as string || null,
    slug: formData.get('slug') as string,
    title: formData.get('title') as string || null,
    title_fa: formData.get('title_fa') as string || null,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    bio: formData.get('bio') as string || null,
    bio_fa: formData.get('bio_fa') as string || null,
    avatar_url: formData.get('avatar_url') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    languages: languagesRaw ? languagesRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    specializations: specializationsRaw ? specializationsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    experience_years: formData.get('experience_years') ? parseInt(formData.get('experience_years') as string) : 0,
    social_instagram: formData.get('social_instagram') as string || null,
    social_linkedin: formData.get('social_linkedin') as string || null,
    social_twitter: formData.get('social_twitter') as string || null,
    social_facebook: formData.get('social_facebook') as string || null,
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
  }

  const { error } = await supabase.from('agents').insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/agents')
  return { success: true }
}

export async function updateAgent(id: string, formData: FormData) {
  const supabase = await createClient()

  const languagesRaw = formData.get('languages') as string
  const specializationsRaw = formData.get('specializations') as string

  const data = {
    name: formData.get('name') as string,
    name_fa: formData.get('name_fa') as string || null,
    slug: formData.get('slug') as string,
    title: formData.get('title') as string || null,
    title_fa: formData.get('title_fa') as string || null,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    bio: formData.get('bio') as string || null,
    bio_fa: formData.get('bio_fa') as string || null,
    avatar_url: formData.get('avatar_url') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    languages: languagesRaw ? languagesRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    specializations: specializationsRaw ? specializationsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    experience_years: formData.get('experience_years') ? parseInt(formData.get('experience_years') as string) : 0,
    social_instagram: formData.get('social_instagram') as string || null,
    social_linkedin: formData.get('social_linkedin') as string || null,
    social_twitter: formData.get('social_twitter') as string || null,
    social_facebook: formData.get('social_facebook') as string || null,
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
  }

  const { error } = await supabase
    .from('agents')
    .update(data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/agents')
  return { success: true }
}
