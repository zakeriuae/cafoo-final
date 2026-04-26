"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react"

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
        setError(error.message)
        setIsGoogleLoading(false)
      }
    } catch (err: any) {
      setError("An unexpected error occurred.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-black/20 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-none rounded-[2.5rem] overflow-hidden relative z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pt-14 pb-8">
          <div className="mx-auto mb-6 h-16 w-16 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Secure Login</CardTitle>
          <CardDescription className="font-bold text-slate-500 mt-2">Access the Cafoo Real Estate platform</CardDescription>
        </CardHeader>
        
        <CardContent className="px-10 pb-14">
          <div className="space-y-8">
            {error && (
              <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50">
                <AlertDescription className="font-bold text-xs text-center">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button 
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 rounded-2xl gap-4 font-black text-sm group border-none transition-all duration-300 active:scale-95" 
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white/50" />
                ) : (
                  <div className="bg-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  </div>
                )}
                Continue with Google
              </Button>
              
              <p className="text-center text-[11px] text-slate-400 font-bold px-6 leading-relaxed">
                By continuing, you agree to our security protocols and privacy policy.
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-6">
              <div className="h-px w-16 bg-slate-100" />
              <Link href="/" className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-all uppercase tracking-[0.2em]">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Branding Footer */}
      <div className="fixed bottom-8 left-0 w-full text-center z-10">
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
          Cafoo Real Estate &copy; 2026
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary p-4">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
