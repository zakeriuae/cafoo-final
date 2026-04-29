'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLead(id: string, formData: FormData) {
  const supabase = await createClient()

  const data: Record<string, unknown> = {}
  
  // Only include fields that are present in the form
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const status = formData.get('status')
  const agent_id = formData.get('agent_id')
  const notes = formData.get('notes')

  if (name !== null) data.name = name as string || null
  if (email !== null) data.email = email as string || null
  if (phone !== null) data.phone = phone as string || null
  
  if (status !== null) {
    // Check if status actually changed to update status_updated_at
    const { data: currentLead } = await supabase
      .from('leads')
      .select('status')
      .eq('id', id)
      .single()

    if (currentLead?.status !== status) {
      data.status_updated_at = new Date().toISOString()
    }
    data.status = status as string
  }

  if (agent_id !== null) {
    data.agent_id = agent_id === 'none' ? null : agent_id as string
  }
  if (notes !== null) data.notes = notes as string || null

  // If status is changing to contacted, update contacted_at
  if (status === 'contacted') {
    const { data: leadForContact } = await supabase
      .from('leads')
      .select('status, contacted_at')
      .eq('id', id)
      .single()
    
    if (leadForContact?.status !== 'contacted' && !leadForContact?.contacted_at) {
      data.contacted_at = new Date().toISOString()
    }
  }

  const { error } = await supabase
    .from('leads')
    .update(data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function createLead(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string || null,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    source: formData.get('source') as string || 'contact_form',
    source_url: formData.get('source_url') as string || null,
    property_id: formData.get('property_id') as string || null,
    tower_id: formData.get('tower_id') as string || null,
    area_id: formData.get('area_id') as string || null,
    agent_id: formData.get('agent_id') as string || null,
    referral_code: formData.get('referral_code') as string || null,
    status: 'new' as const,
    status_updated_at: new Date().toISOString(),
    notes: formData.get('notes') as string || null,
  }

  // Handle empty UUID fields
  if (data.property_id === 'none' || data.property_id === '') data.property_id = null
  if (data.tower_id === 'none' || data.tower_id === '') data.tower_id = null
  if (data.area_id === 'none' || data.area_id === '') data.area_id = null
  if (data.agent_id === 'none' || data.agent_id === '') data.agent_id = null

  const { error } = await supabase.from('leads').insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function convertActionToLead(actionId: string, agentId?: string) {
  const supabase = await createClient()

  // 1. Fetch action data
  const { data: action, error: fetchError } = await supabase
    .from('user_actions')
    .select('*')
    .eq('id', actionId)
    .single()

  if (fetchError || !action) {
    return { success: false, error: 'Action not found' }
  }

  // 2. Insert into leads table
  const { error: insertError } = await supabase
    .from('leads')
    .insert({
      user_id: action.user_id,
      name: action.name,
      email: action.email,
      phone: action.phone,
      source: action.source,
      source_url: action.source_url,
      property_id: action.property_id,
      tower_id: action.tower_id,
      area_id: action.area_id,
      agent_id: agentId || action.agent_id,
      notes: `Converted from action. Original notes: ${action.notes}`,
      status: 'new',
      status_updated_at: new Date().toISOString()
    })

  if (insertError) {
    return { success: false, error: insertError.message }
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin/actions')
  return { success: true }
}

export async function addLeadMessage(leadId: string, content: string, type: 'note' | 'system' = 'note') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('lead_messages')
    .insert({
      lead_id: leadId,
      sender_id: user?.id,
      content,
      type
    })

  if (error) return { success: false, error: error.message }
  
  revalidatePath(`/admin/leads/${leadId}`)
  return { success: true }
}

export async function reassignLead(leadId: string, agentId: string | 'none') {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('leads')
    .update({ 
      agent_id: agentId === 'none' ? null : agentId,
      status_updated_at: new Date().toISOString() 
    })
    .eq('id', leadId)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function toggleLeadAgent(leadId: string, agentId: string) {
  const supabase = await createClient()
  
  // 1. Get current lead to find existing agent_ids
  const { data: lead } = await supabase
    .from('leads')
    .select('agent_ids')
    .eq('id', leadId)
    .single()
  
  let currentIds: string[] = lead?.agent_ids || []
  
  if (currentIds.includes(agentId)) {
    // Remove it
    currentIds = currentIds.filter(id => id !== agentId)
  } else {
    // Add it
    currentIds = [...currentIds, agentId]
  }

  const { error } = await supabase
    .from('leads')
    .update({ 
      agent_ids: currentIds,
      // For backward compatibility we can also keep the first one in agent_id
      agent_id: currentIds.length > 0 ? currentIds[0] : null,
      status_updated_at: new Date().toISOString() 
    })
    .eq('id', leadId)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/leads')
  return { success: true }
}
