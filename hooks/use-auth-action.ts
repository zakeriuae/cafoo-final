'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { useAuthModal } from './use-auth-modal'
import { toast } from 'sonner'
import { trackUserAction } from '@/app/(website)/[locale]/actions'
import { LeadSource } from '@/lib/database.types'

export function useAuthAction() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useI18n()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pendingSource, setPendingSource] = useState<LeadSource | null>(null)
  const [pendingAction, setPendingAction] = useState<{ action: any, trackingParams: any } | null>(null)
  const authModal = useAuthModal()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (err) {
        console.error('Session check failed:', err)
      } finally {
        setLoading(false)
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Resume pending action once user is authenticated
  useEffect(() => {
    if (user && pendingAction) {
      const { action, trackingParams } = pendingAction
      setPendingAction(null)
      performAction(action, trackingParams, false)
    }
  }, [user, pendingAction])

  /**
   * Wraps an action with an authentication check.
   */
  const performAction = async (
    action: () => void | Promise<void>, 
    trackingParams?: {
      source: LeadSource
      property_id?: string
      tower_id?: string
      area_id?: string
      agent_id?: string
      notes?: string
    },
    required: boolean = true
  ) => {
    // Don't block on loading anymore to avoid "dead" buttons
    if (pendingSource && !required) return

    // If login is required and user is not present, store the intent and open modal
    // We only block if we are ABSOLUTELY SURE there is no user (loading is false)
    // or if we want to be safe and just open the modal.
    if (required && !user && !loading) {
      setPendingAction({ action, trackingParams })
      authModal.onOpen(pathname)
      return
    }

    // If still loading, we might want to wait a bit or just assume no user
    if (required && !user && loading) {
      // Small wait to see if session arrives
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setPendingAction({ action, trackingParams })
        authModal.onOpen(pathname)
        return
      }
      // If session arrived, continue...
    }

    try {
      if (trackingParams) {
        setPendingSource(trackingParams.source)
        trackUserAction({
          ...trackingParams,
          source_url: pathname
        }).catch(err => console.error('Tracking failed:', err))
      }

      // Execute the action immediately
      await action()
    } catch (err) {
      console.error('Error performing action:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setTimeout(() => setPendingSource(null), 500)
    }
  }

  return {
    user,
    loading,
    pendingSource,
    performAction,
    isAuthenticated: !!user
  }
}
