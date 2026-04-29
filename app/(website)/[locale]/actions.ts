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

  // Prevent duplicate actions of the same type on the same target within 24 hours
  // This avoids spamming the CRM with multiple clicks from the same user
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id')
    .eq('user_id', user.id)
    .eq('source', params.source)
    .match({
      ...(params.property_id ? { property_id: params.property_id } : {}),
      ...(params.tower_id ? { tower_id: params.tower_id } : {}),
      ...(params.area_id ? { area_id: params.area_id } : {}),
      ...(params.agent_id ? { agent_id: params.agent_id } : {}),
    })
    .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1)
    .maybeSingle()

  if (existingLead) {
    return { success: true, message: 'Action already recorded today' }
  }

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
