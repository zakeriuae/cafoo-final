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

  const userData = {
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
    notes: params.notes || `User performed action: ${params.source}`
  }

  // 1. Always record the event in user_actions
  // We don't use the 24h throttle here because we want a complete log
  const { error: actionError } = await supabase
    .from('user_actions')
    .insert(userData)

  if (actionError) {
    console.error('Error tracking action:', actionError)
    // We continue even if action log fails, as the Lead is more important for business
  }

  // 2. Automaticaly create a Lead if the source is significant
  const significantSources: LeadSource[] = ['call', 'whatsapp', 'register_viewing']
  
  if (significantSources.includes(params.source)) {
    // Lead logic: one per user per agent per month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('user_id', user.id)
      .eq('agent_id', params.agent_id || '')
      .gt('created_at', startOfMonth.toISOString())
      .limit(1)
      .maybeSingle()

    if (!existingLead) {
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          ...userData,
          status: 'new'
        })
      
      if (leadError) {
        console.error('Error creating automatic lead:', leadError)
      }
    }
  }

  return { success: true }
}
