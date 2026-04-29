'use server'

import { createClient } from '@/lib/supabase/server'
import { LeadSource } from '@/lib/database.types'

interface TrackActionParams {
  source: LeadSource
  property_id?: string
  tower_id?: string
  area_id?: string
  agent_id?: string
  source_url?: string
  notes?: string
}

export async function trackUserAction(params: TrackActionParams) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Get user profile to get name/email/phone
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone')
    .eq('id', user.id)
    .single()

  const { error } = await supabase
    .from('leads')
    .insert({
      user_id: user.id,
      name: profile?.full_name || user.user_metadata?.full_name,
      email: profile?.email || user.email,
      phone: profile?.phone,
      source: params.source,
      property_id: params.property_id,
      tower_id: params.tower_id,
      area_id: params.area_id,
      agent_id: params.agent_id,
      source_url: params.source_url,
      notes: params.notes || `User performed action: ${params.source}`,
      status: 'new'
    })

  if (error) {
    console.error('Error tracking action:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
