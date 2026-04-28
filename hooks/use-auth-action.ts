'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { toast } from 'sonner'

/**
 * Hook to wrap actions that require authentication.
 * If the user is not logged in, it redirects them to the login page
 * and saves the current page as a 'returnTo' parameter.
 */
export function useAuthAction() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useI18n()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
   * @param action The function to execute if authenticated
   * @param message Optional toast message to show if not authenticated
   */
  const performAction = async (action: () => void | Promise<void>, message?: string) => {
    if (loading) return

    if (!user) {
      if (message) {
        toast.error(message)
      } else {
        toast.info(locale === 'fa' ? 'لطفاً ابتدا وارد حساب کاربری خود شوید' : 'Please log in to continue')
      }
      
      // Save current path to redirect back after login
      const loginUrl = `/${locale}/login?returnTo=${encodeURIComponent(pathname)}`
      router.push(loginUrl)
      return
    }

    // If authenticated, execute the action
    await action()
  }

  return {
    user,
    loading,
    performAction,
    isAuthenticated: !!user
  }
}
