'use client'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2, User as UserIcon, Phone as PhoneIcon } from "lucide-react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { countries } from "@/lib/countries"
import { updateUserProfile } from "@/app/(website)/[locale]/actions"
import { toast } from "sonner"

export function ProfileCompletionModal() {
  const { locale } = useI18n()
  const content = useContent()
  const t = content.profile
  const isRtl = locale === 'fa'
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [fullName, setFullName] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === 'AE') || countries[0])
  const [phoneNumber, setPhoneNumber] = useState("")
  
  const supabase = createClient()

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile && !profile.phone) {
          setFullName(profile.full_name || user.user_metadata?.full_name || "")
          setIsOpen(true)
        }
      }
    }

    checkProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile && !profile.phone) {
          setFullName(profile.full_name || session.user.user_metadata?.full_name || "")
          setIsOpen(true)
        }
      } else if (event === 'SIGNED_OUT') {
        setIsOpen(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast.error(isRtl ? 'لطفاً تمام موارد را تکمیل کنید' : 'Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    const fullPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/^0+/, '')}`
    
    const result = await updateUserProfile({
      full_name: fullName,
      phone: fullPhone
    })

    if (result.success) {
      toast.success(t.success)
      setIsOpen(false)
    } else {
      toast.error(result.error || (isRtl ? 'خطایی رخ داد' : 'An error occurred'))
    }
    setIsSubmitting(false)
  }

  // Sorted countries: Iran first, then others
  const sortedCountries = [...countries].sort((a, b) => {
    if (a.code === 'IR') return -1
    if (b.code === 'IR') return 1
    return 0
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Don't allow closing without completion unless specifically needed
      if (!isSubmitting) setIsOpen(open)
    }}>
      <DialogContent className="sm:max-w-md border-none rounded-[2rem] overflow-hidden bg-white p-0 shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className={cn("pt-12 pb-10 px-8 flex flex-col items-center", isRtl && "font-vazir text-right")}>
          <div className="mb-6 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <UserIcon className="h-6 w-6" />
          </div>
          
          <DialogHeader className="space-y-2 w-full">
            <DialogTitle className={cn("text-2xl font-bold text-slate-900", isRtl && "text-center")}>
              {t.title}
            </DialogTitle>
            <DialogDescription className={cn("text-slate-400 text-sm font-medium", isRtl && "text-center")}>
              {t.description}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
                {t.fullName}
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="fullName"
                  placeholder={t.placeholderName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    "h-14 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all pl-12",
                    isRtl && "pr-4 pl-12 text-right"
                  )}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
                {t.phone}
              </Label>
              <div className="flex gap-2">
                <div className="w-[120px] shrink-0">
                  <Select 
                    value={selectedCountry.code} 
                    onValueChange={(val) => setSelectedCountry(countries.find(c => c.code === val) || countries[0])}
                  >
                    <SelectTrigger className="h-14 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all px-3">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none">{selectedCountry.flag}</span>
                          <span className="text-xs font-bold">{selectedCountry.dialCode}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[300px]">
                      {sortedCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="cursor-pointer focus:bg-slate-50">
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-xl leading-none">{country.flag}</span>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">{country.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{country.dialCode}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder={t.placeholderPhone}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className={cn(
                      "h-14 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all pl-12",
                      isRtl && "pl-12 text-right ltr"
                    )}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t.submit
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
