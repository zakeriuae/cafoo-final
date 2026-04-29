'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { useAuthModal } from './use-auth-modal'
import { trackUserAction } from '@/app/(website)/[locale]/actions'
import { LeadSource } from '@/lib/database.types'

export function useAuthAction() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useI18n()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
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
    if (loading || isPending) return

    if (!user) {
      // Open the modal instead of redirecting
      authModal.onOpen(pathname)
      return
    }

    try {
      setIsPending(true)
      // If authenticated, track the action if params provided
      if (trackingParams) {
        await trackUserAction({
          ...trackingParams,
          source_url: pathname
        })
      }

      // Execute the action
      await action()
    } catch (err) {
      console.error('Error performing action:', err)
    } finally {
      setIsPending(false)
    }
  }

  return {
    user,
    loading,
    isPending,
    performAction,
    isAuthenticated: !!user
  }
}
