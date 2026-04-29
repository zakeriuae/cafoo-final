'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTower(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('towers')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/towers')
  revalidatePath('/')
  return { success: true }
}

export async function createTower(formData: FormData) {
  const supabase = await createClient()

  const amenityIds = formData.get('amenity_ids') ? JSON.parse(formData.get('amenity_ids') as string) : []

  const data = {
    name: formData.get('name') as string,
    name_fa: formData.get('name_fa') as string || null,
    slug: formData.get('slug') as string,
    area_id: formData.get('area_id') as string || null,
    developer_id: formData.get('developer_id') as string || null,
    assigned_agent_id: formData.get('assigned_agent_id') as string || null,
    short_description: formData.get('short_description') as string || null,
    short_description_fa: formData.get('short_description_fa') as string || null,
    full_description: formData.get('full_description') as string || null,
    full_description_fa: formData.get('full_description_fa') as string || null,
    starting_price: formData.get('starting_price') ? parseFloat(formData.get('starting_price') as string) : null,
    currency: formData.get('currency') as string || 'AED',
    payment_plan: formData.get('payment_plan') as string || null,
    payment_plan_fa: formData.get('payment_plan_fa') as string || null,
    delivery_date: formData.get('delivery_date') as string || null,
    delivery_date_fa: formData.get('delivery_date_fa') as string || null,
    total_units: formData.get('total_units') ? parseInt(formData.get('total_units') as string) : null,
    floors_count: formData.get('floors_count') ? parseInt(formData.get('floors_count') as string) : null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    gallery: formData.get('gallery') ? JSON.parse(formData.get('gallery') as string) : [],
    video_url: formData.get('video_url') as string || null,
    brochure_url: formData.get('brochure_url') as string || null,
    floor_plan_url: formData.get('floor_plan_url') as string || null,
    address: formData.get('address') as string || null,
    address_fa: formData.get('address_fa') as string || null,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    is_off_plan: formData.get('is_off_plan') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
    payment_plan_details: formData.get('payment_plan_details') ? JSON.parse(formData.get('payment_plan_details') as string) : [],
    payment_plan_details_fa: formData.get('payment_plan_details_fa') ? JSON.parse(formData.get('payment_plan_details_fa') as string) : [],
    connectivity: formData.get('connectivity') ? JSON.parse(formData.get('connectivity') as string) : [],
    connectivity_fa: formData.get('connectivity_fa') ? JSON.parse(formData.get('connectivity_fa') as string) : [],
    faq: formData.get('faq') ? JSON.parse(formData.get('faq') as string) : [],
    faq_fa: formData.get('faq_fa') ? JSON.parse(formData.get('faq_fa') as string) : [],
    additional_media: formData.get('additional_media') ? JSON.parse(formData.get('additional_media') as string) : [],
    highlights: formData.get('highlights') as string || null,
    highlights_fa: formData.get('highlights_fa') as string || null,
    architectural_details: formData.get('architectural_details') as string || null,
    architectural_details_fa: formData.get('architectural_details_fa') as string || null,
    investment_potential: formData.get('investment_potential') as string || null,
    investment_potential_fa: formData.get('investment_potential_fa') as string || null,
  }

  // Handle empty UUID fields
  if (data.area_id === 'none') data.area_id = null
  if (data.developer_id === 'none') data.developer_id = null
  if (data.assigned_agent_id === 'none') data.assigned_agent_id = null

  const { data: tower, error } = await supabase.from('towers').insert(data).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Insert amenities
  if (tower && amenityIds.length > 0) {
    const amenitiesData = amenityIds.map((amenityId: string) => ({
      tower_id: tower.id,
      amenity_id: amenityId,
    }))
    const { error: amenityError } = await supabase.from('tower_amenities').insert(amenitiesData)
    if (amenityError) {
      console.error('Error inserting amenities:', amenityError)
    }
  }

  revalidatePath('/admin/towers')
  revalidatePath('/')
  return { success: true }
}

export async function updateTower(id: string, formData: FormData) {
  const supabase = await createClient()

  const amenityIds = formData.get('amenity_ids') ? JSON.parse(formData.get('amenity_ids') as string) : []

  const data = {
    name: formData.get('name') as string,
    name_fa: formData.get('name_fa') as string || null,
    slug: formData.get('slug') as string,
    area_id: formData.get('area_id') as string || null,
    developer_id: formData.get('developer_id') as string || null,
    assigned_agent_id: formData.get('assigned_agent_id') as string || null,
    short_description: formData.get('short_description') as string || null,
    short_description_fa: formData.get('short_description_fa') as string || null,
    full_description: formData.get('full_description') as string || null,
    full_description_fa: formData.get('full_description_fa') as string || null,
    starting_price: formData.get('starting_price') ? parseFloat(formData.get('starting_price') as string) : null,
    currency: formData.get('currency') as string || 'AED',
    payment_plan: formData.get('payment_plan') as string || null,
    payment_plan_fa: formData.get('payment_plan_fa') as string || null,
    delivery_date: formData.get('delivery_date') as string || null,
    delivery_date_fa: formData.get('delivery_date_fa') as string || null,
    total_units: formData.get('total_units') ? parseInt(formData.get('total_units') as string) : null,
    floors_count: formData.get('floors_count') ? parseInt(formData.get('floors_count') as string) : null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    gallery: formData.get('gallery') ? JSON.parse(formData.get('gallery') as string) : [],
    video_url: formData.get('video_url') as string || null,
    brochure_url: formData.get('brochure_url') as string || null,
    floor_plan_url: formData.get('floor_plan_url') as string || null,
    address: formData.get('address') as string || null,
    address_fa: formData.get('address_fa') as string || null,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    status: formData.get('status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    is_off_plan: formData.get('is_off_plan') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
    payment_plan_details: formData.get('payment_plan_details') ? JSON.parse(formData.get('payment_plan_details') as string) : [],
    payment_plan_details_fa: formData.get('payment_plan_details_fa') ? JSON.parse(formData.get('payment_plan_details_fa') as string) : [],
    connectivity: formData.get('connectivity') ? JSON.parse(formData.get('connectivity') as string) : [],
    connectivity_fa: formData.get('connectivity_fa') ? JSON.parse(formData.get('connectivity_fa') as string) : [],
    faq: formData.get('faq') ? JSON.parse(formData.get('faq') as string) : [],
    faq_fa: formData.get('faq_fa') ? JSON.parse(formData.get('faq_fa') as string) : [],
    additional_media: formData.get('additional_media') ? JSON.parse(formData.get('additional_media') as string) : [],
    highlights: formData.get('highlights') as string || null,
    highlights_fa: formData.get('highlights_fa') as string || null,
    architectural_details: formData.get('architectural_details') as string || null,
    architectural_details_fa: formData.get('architectural_details_fa') as string || null,
    investment_potential: formData.get('investment_potential') as string || null,
    investment_potential_fa: formData.get('investment_potential_fa') as string || null,
  }

  // Handle empty UUID fields
  if (data.area_id === 'none') data.area_id = null
  if (data.developer_id === 'none') data.developer_id = null
  if (data.assigned_agent_id === 'none') data.assigned_agent_id = null

  const { error } = await supabase
    .from('towers')
    .update(data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  // Update amenities: delete old ones and insert new ones
  await supabase.from('tower_amenities').delete().eq('tower_id', id)
  
  if (amenityIds.length > 0) {
    const amenitiesData = amenityIds.map((amenityId: string) => ({
      tower_id: id,
      amenity_id: amenityId,
    }))
    const { error: amenityError } = await supabase.from('tower_amenities').insert(amenitiesData)
    if (amenityError) {
      console.error('Error updating amenities:', amenityError)
    }
  }

  revalidatePath('/admin/towers')
  revalidatePath('/')
  return { success: true }
}
