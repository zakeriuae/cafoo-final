"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, ShieldCheck } from "lucide-react"

import { Suspense } from "react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/"
  
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)
      console.log("Initiating Google Login...")
      
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })

      if (error) {
        console.error("Supabase OAuth Error:", error)
        setError(error.message)
        setIsGoogleLoading(false)
      }
    } catch (err: any) {
      console.error("Unexpected Login Error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white">
      <Card className="w-full max-w-md shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border-slate-200/60 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-12 pb-8 bg-white">
          <div className="mx-auto mb-6 h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl shadow-primary/5">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Secure Login</CardTitle>
          <CardDescription className="font-bold text-slate-500 mt-2">Access the Cafoo Real Estate platform</CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50">
                <AlertDescription className="font-bold text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <p className="text-center text-sm text-slate-400 font-medium px-4">
              To ensure the highest security, we exclusively use Google authentication.
            </p>

            <Button 
              className="w-full h-14 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl gap-4 font-black text-sm group" 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              ) : (
                <svg className="h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
              Continue with Google
            </Button>

            <div className="pt-4 flex flex-col items-center gap-4">
              <div className="h-px w-12 bg-slate-200" />
              <Link href="/" className="text-xs font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em]">
                Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
