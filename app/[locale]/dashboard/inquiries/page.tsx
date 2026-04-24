"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, MessageSquare } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  status: string
  lead_type: string
  created_at: string
  property: {
    title: string
    title_fa: string
    slug: string
  } | null
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  negotiation: "bg-purple-100 text-purple-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, { en: string; fa: string }> = {
  new: { en: "New", fa: "جدید" },
  contacted: { en: "Contacted", fa: "تماس گرفته شده" },
  qualified: { en: "Qualified", fa: "واجد شرایط" },
  negotiation: { en: "Negotiation", fa: "در حال مذاکره" },
  won: { en: "Won", fa: "موفق" },
  lost: { en: "Lost", fa: "از دست رفته" },
}

export default function InquiriesPage() {
  const { locale, isRTL } = useLocale()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data } = await supabase
        .from("leads")
        .select(`
          id,
          name,
          email,
          phone,
          message,
          status,
          lead_type,
          created_at,
          property:properties(title, title_fa, slug)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setLeads(data as Lead[])
      }
      setLoading(false)
    }

    fetchLeads()
  }, [])

  const t = {
    title: locale === "fa" ? "درخواست‌های من" : "My Inquiries",
    subtitle: locale === "fa" ? "تاریخچه درخواست‌ها و استعلام‌های شما" : "History of your property inquiries",
    noInquiries: locale === "fa" ? "هنوز درخواستی ثبت نکرده‌اید" : "You haven't made any inquiries yet",
    property: locale === "fa" ? "ملک" : "Property",
    date: locale === "fa" ? "تاریخ" : "Date",
    status: locale === "fa" ? "وضعیت" : "Status",
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.noInquiries}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {lead.property && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {locale === "fa" ? lead.property.title_fa || lead.property.title : lead.property.title}
                        </span>
                      </div>
                    )}
                    {lead.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{lead.message}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(lead.created_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={statusColors[lead.status] || "bg-gray-100 text-gray-800"}>
                    {statusLabels[lead.status]?.[locale] || lead.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
