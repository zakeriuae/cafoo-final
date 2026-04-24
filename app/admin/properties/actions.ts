'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  return { success: true }
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    title_fa: formData.get('title_fa') as string || null,
    slug: formData.get('slug') as string,
    ad_code: formData.get('ad_code') as string || null,
    area_id: formData.get('area_id') as string || null,
    tower_id: formData.get('tower_id') as string || null,
    developer_id: formData.get('developer_id') as string || null,
    agent_id: formData.get('agent_id') as string || null,
    listing_type: formData.get('listing_type') as 'sale' | 'rent' | 'off_plan',
    property_type: formData.get('property_type') as string,
    status: formData.get('status') as string,
    furnishing: formData.get('furnishing') as string || null,
    price: parseFloat(formData.get('price') as string),
    currency: formData.get('currency') as string || 'AED',
    price_per_sqft: formData.get('price_per_sqft') ? parseFloat(formData.get('price_per_sqft') as string) : null,
    service_charge: formData.get('service_charge') ? parseFloat(formData.get('service_charge') as string) : null,
    bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null,
    bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null,
    size: formData.get('size') ? parseFloat(formData.get('size') as string) : null,
    size_unit: formData.get('size_unit') as string || 'sqft',
    floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : null,
    total_floors: formData.get('total_floors') ? parseInt(formData.get('total_floors') as string) : null,
    parking_spaces: formData.get('parking_spaces') ? parseInt(formData.get('parking_spaces') as string) : 0,
    balcony: formData.get('balcony') === 'true',
    view_type: formData.get('view_type') as string || null,
    view_type_fa: formData.get('view_type_fa') as string || null,
    short_description: formData.get('short_description') as string || null,
    short_description_fa: formData.get('short_description_fa') as string || null,
    full_description: formData.get('full_description') as string || null,
    full_description_fa: formData.get('full_description_fa') as string || null,
    address: formData.get('address') as string || null,
    address_fa: formData.get('address_fa') as string || null,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    video_url: formData.get('video_url') as string || null,
    floor_plan_url: formData.get('floor_plan_url') as string || null,
    virtual_tour_url: formData.get('virtual_tour_url') as string || null,
    is_off_plan: formData.get('is_off_plan') === 'true',
    handover_date: formData.get('handover_date') as string || null,
    is_vacant: formData.get('is_vacant') === 'true',
    content_status: formData.get('content_status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    verified: formData.get('verified') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
  }

  // Handle empty UUID fields
  if (data.area_id === 'none') data.area_id = null
  if (data.tower_id === 'none') data.tower_id = null
  if (data.developer_id === 'none') data.developer_id = null
  if (data.agent_id === 'none') data.agent_id = null

  const { error } = await supabase.from('properties').insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  return { success: true }
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    title_fa: formData.get('title_fa') as string || null,
    slug: formData.get('slug') as string,
    ad_code: formData.get('ad_code') as string || null,
    area_id: formData.get('area_id') as string || null,
    tower_id: formData.get('tower_id') as string || null,
    developer_id: formData.get('developer_id') as string || null,
    agent_id: formData.get('agent_id') as string || null,
    listing_type: formData.get('listing_type') as 'sale' | 'rent' | 'off_plan',
    property_type: formData.get('property_type') as string,
    status: formData.get('status') as string,
    furnishing: formData.get('furnishing') as string || null,
    price: parseFloat(formData.get('price') as string),
    currency: formData.get('currency') as string || 'AED',
    price_per_sqft: formData.get('price_per_sqft') ? parseFloat(formData.get('price_per_sqft') as string) : null,
    service_charge: formData.get('service_charge') ? parseFloat(formData.get('service_charge') as string) : null,
    bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null,
    bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null,
    size: formData.get('size') ? parseFloat(formData.get('size') as string) : null,
    size_unit: formData.get('size_unit') as string || 'sqft',
    floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : null,
    total_floors: formData.get('total_floors') ? parseInt(formData.get('total_floors') as string) : null,
    parking_spaces: formData.get('parking_spaces') ? parseInt(formData.get('parking_spaces') as string) : 0,
    balcony: formData.get('balcony') === 'true',
    view_type: formData.get('view_type') as string || null,
    view_type_fa: formData.get('view_type_fa') as string || null,
    short_description: formData.get('short_description') as string || null,
    short_description_fa: formData.get('short_description_fa') as string || null,
    full_description: formData.get('full_description') as string || null,
    full_description_fa: formData.get('full_description_fa') as string || null,
    address: formData.get('address') as string || null,
    address_fa: formData.get('address_fa') as string || null,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    video_url: formData.get('video_url') as string || null,
    floor_plan_url: formData.get('floor_plan_url') as string || null,
    virtual_tour_url: formData.get('virtual_tour_url') as string || null,
    is_off_plan: formData.get('is_off_plan') === 'true',
    handover_date: formData.get('handover_date') as string || null,
    is_vacant: formData.get('is_vacant') === 'true',
    content_status: formData.get('content_status') as 'draft' | 'published' | 'archived',
    featured: formData.get('featured') === 'true',
    verified: formData.get('verified') === 'true',
    sort_order: formData.get('sort_order') ? parseInt(formData.get('sort_order') as string) : 0,
    seo_title: formData.get('seo_title') as string || null,
    seo_title_fa: formData.get('seo_title_fa') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    seo_description_fa: formData.get('seo_description_fa') as string || null,
  }

  // Handle empty UUID fields
  if (data.area_id === 'none') data.area_id = null
  if (data.tower_id === 'none') data.tower_id = null
  if (data.developer_id === 'none') data.developer_id = null
  if (data.agent_id === 'none') data.agent_id = null

  const { error } = await supabase
    .from('properties')
    .update(data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  return { success: true }
}
