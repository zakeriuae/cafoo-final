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
import { useProfileModal } from "@/hooks/use-profile-modal"

export function ProfileCompletionModal() {
  const { locale } = useI18n()
  const content = useContent()
  const t = content.profile
  const isRtl = locale === 'fa'
  
  const { isOpen, onOpen, onClose } = useProfileModal()
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
          onOpen()
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
          onOpen()
        }
      } else if (event === 'SIGNED_OUT') {
        onClose()
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
      onClose()
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
      if (!open) onClose()
    }}>
      <DialogContent className="sm:max-w-md border-none rounded-[2.5rem] overflow-hidden bg-white p-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className={cn("pt-12 pb-10 px-10 flex flex-col items-center", isRtl && "font-vazir text-right")}>
          <div className="mb-8 h-16 w-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10">
            <UserIcon className="h-7 w-7" />
          </div>
          
          <DialogHeader className="space-y-3 w-full">
            <DialogTitle className={cn("text-2xl font-black text-slate-900 tracking-tight", isRtl && "text-center")}>
              {t.title}
            </DialogTitle>
            <DialogDescription className={cn("text-slate-400 text-sm font-medium leading-relaxed", isRtl && "text-center")}>
              {t.description}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="w-full mt-10 space-y-8">
            <div className="space-y-2.5">
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                {t.fullName}
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  id="fullName"
                  placeholder={t.placeholderName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    "h-14 bg-slate-50/50 border-slate-100/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all pl-11 text-sm font-semibold text-slate-700",
                    isRtl && "pr-4 pl-11 text-right"
                  )}
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                {t.phone}
              </Label>
              <div className="flex items-stretch bg-slate-50/50 border border-slate-100/80 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/20 transition-all overflow-hidden">
                <div className="w-[110px] shrink-0 border-r border-slate-100/80">
                  <Select 
                    value={selectedCountry.code} 
                    onValueChange={(val) => setSelectedCountry(countries.find(c => c.code === val) || countries[0])}
                  >
                    <SelectTrigger className="h-14 bg-transparent border-none focus:ring-0 rounded-none px-4 shadow-none">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="text-xl leading-none grayscale-[0.2]">{selectedCountry.flag}</span>
                          <span className="text-xs font-black text-slate-600">{selectedCountry.dialCode}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl max-h-[300px]">
                      {sortedCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="cursor-pointer focus:bg-slate-50 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl leading-none">{country.flag}</span>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-slate-800">{country.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold">{country.dialCode}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <PhoneIcon className="w-4 h-4 text-slate-300 transition-colors" />
                  </div>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder={t.placeholderPhone}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className={cn(
                      "h-14 bg-transparent border-none focus:ring-0 rounded-none pl-11 text-sm font-semibold text-slate-700 shadow-none",
                      isRtl && "pl-11 text-right ltr"
                    )}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-15 py-4 bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-[0_12px_24px_-8px_rgba(var(--primary-rgb),0.4)] transition-all active:scale-[0.98] mt-4"
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
