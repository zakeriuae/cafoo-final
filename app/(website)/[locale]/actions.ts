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
  
  let userData: any = {
    source: params.source,
    property_id: params.property_id || null,
    tower_id: params.tower_id || null,
    area_id: params.area_id || null,
    agent_id: params.agent_id || null,
    source_url: params.source_url || null,
    notes: params.notes || `User performed action: ${params.source}`
  }

  if (user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .maybeSingle()

    userData = {
      ...userData,
      user_id: user.id,
      name: profile?.full_name || user.user_metadata?.full_name || 'Authenticated User',
      email: profile?.email || user.email,
      phone: profile?.phone || null,
    }
  } else {
    // Anonymous user
    userData = {
      ...userData,
      user_id: null,
      name: 'Anonymous Guest',
      email: null,
      phone: null,
    }
  }

  // 1. Always record the event in user_actions
  const { error: actionError } = await supabase
    .from('user_actions')
    .insert(userData)

  if (actionError) {
    console.error('CRITICAL: Error tracking action in user_actions:', actionError)
    return { success: false, error: `Action log failed: ${actionError.message}` }
  }

  // 2. Automatically create a Lead if the source is significant
  const significantSources: LeadSource[] = ['call', 'whatsapp', 'register_viewing']
  
  if (significantSources.includes(params.source)) {
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

  // 3. Log to lead_messages for unified history if lead exists
  try {
    const { data: currentLead } = await supabase
      .from('leads')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (currentLead) {
      await supabase.from('lead_messages').insert({
        lead_id: currentLead.id,
        content: params.notes || `User performed action: ${params.source}`,
        type: 'action',
        metadata: {
          source: params.source,
          property_id: params.property_id,
          tower_id: params.tower_id,
          agent_id: params.agent_id
        }
      })
    }
  } catch (logError) {
    console.error('Non-critical: Error logging to lead_messages:', logError)
    // We don't return failure here because the primary action (user_actions) was recorded
  }

  return { success: true }
}
