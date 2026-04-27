"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/use-locale"
import { Loader2, Save, User } from "lucide-react"

interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  full_name_fa: string | null
  phone: string | null
  whatsapp: string | null
  preferred_language: string
}

export default function ProfilePage() {
  const { locale, isRTL } = useLocale()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    full_name_fa: "",
    phone: "",
    whatsapp: "",
    preferred_language: "en",
  })

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || "",
          full_name_fa: data.full_name_fa || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          preferred_language: data.preferred_language || "en",
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setMessage({ type: "error", text: locale === "fa" ? "لطفا وارد شوید" : "Please log in" })
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        full_name: formData.full_name || null,
        full_name_fa: formData.full_name_fa || null,
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        preferred_language: formData.preferred_language,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      setMessage({ 
        type: "error", 
        text: locale === "fa" ? "خطا در ذخیره تغییرات" : "Error saving changes" 
      })
    } else {
      setMessage({ 
        type: "success", 
        text: locale === "fa" ? "تغییرات با موفقیت ذخیره شد" : "Changes saved successfully" 
      })
    }
    setSaving(false)
  }

  const t = {
    title: locale === "fa" ? "پروفایل من" : "My Profile",
    subtitle: locale === "fa" ? "اطلاعات شخصی و تنظیمات حساب" : "Personal information and account settings",
    fullName: locale === "fa" ? "نام کامل (انگلیسی)" : "Full Name (English)",
    fullNameFa: locale === "fa" ? "نام کامل (فارسی)" : "Full Name (Persian)",
    email: locale === "fa" ? "ایمیل" : "Email",
    phone: locale === "fa" ? "شماره تلفن" : "Phone Number",
    whatsapp: locale === "fa" ? "واتساپ" : "WhatsApp",
    language: locale === "fa" ? "زبان ترجیحی" : "Preferred Language",
    english: locale === "fa" ? "انگلیسی" : "English",
    persian: locale === "fa" ? "فارسی" : "Persian",
    save: locale === "fa" ? "ذخیره تغییرات" : "Save Changes",
    saving: locale === "fa" ? "در حال ذخیره..." : "Saving...",
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <CardDescription>{profile?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t.fullName}</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name_fa">{t.fullNameFa}</Label>
                <Input
                  id="full_name_fa"
                  value={formData.full_name_fa}
                  onChange={(e) => setFormData({ ...formData, full_name_fa: e.target.value })}
                  placeholder="نام و نام خانوادگی"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+971 50 XXX XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">{t.whatsapp}</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+971 50 XXX XXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t.language}</Label>
              <Select
                value={formData.preferred_language}
                onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t.english}</SelectItem>
                  <SelectItem value="fa">{t.persian}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t.save}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
