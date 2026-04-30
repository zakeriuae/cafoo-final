'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck } from "lucide-react"
import { useAuthModal } from "@/hooks/use-auth-modal"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function AuthModal() {
  const { isOpen, onClose, nextUrl } = useAuthModal()
  const { locale } = useI18n()
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl || '/'}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })

      if (error) {
        setError(error.message)
        setIsGoogleLoading(false)
      }
    } catch (err: any) {
      setError("An unexpected error occurred.")
      setIsGoogleLoading(false)
    }
  }

  const isRtl = locale === 'fa'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none rounded-[2rem] overflow-hidden bg-white p-0 shadow-2xl">
        <div className={cn("pt-12 pb-10 px-8 flex flex-col items-center text-center", isRtl && "font-vazir")}>
          <div className="mb-8 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              {locale === 'fa' ? 'ورود به حساب کاربری' : 'Sign in to Cafoo'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm font-medium">
              {locale === 'fa' 
                ? 'برای دسترسی به تمام امکانات لطفاً وارد شوید' 
                : 'Welcome back! Please sign in to continue.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full mt-10 space-y-6">
            {error && (
              <Alert variant="destructive" className="rounded-xl border-red-100 bg-red-50/50 py-3">
                <AlertDescription className="text-xs font-medium text-center">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button 
                variant="outline"
                className="w-full h-14 border-slate-200 hover:bg-slate-50 rounded-xl gap-3 font-medium text-sm transition-all active:scale-[0.98]" 
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.49 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {locale === 'fa' ? 'ورود با حساب گوگل' : 'Continue with Google'}
              </Button>
              
              <p className="text-center text-[10px] text-slate-400 font-medium px-4 leading-relaxed">
                {locale === 'fa' 
                  ? 'با ورود به سایت، شما شرایط استفاده و حریم خصوصی را می‌پذیرید.' 
                  : 'By signing in, you agree to our Terms of Service and Privacy Policy.'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
