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
  const authModal = useAuthModal()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

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
    }
  ) => {
    if (loading || pendingSource) return

    if (!user) {
      // Open the modal instead of redirecting
      authModal.onOpen(pathname)
      return
    }

    try {
      if (trackingParams) {
        setPendingSource(trackingParams.source)
        // Trigger tracking in background so UI remains responsive
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
      setPendingSource(null)
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
