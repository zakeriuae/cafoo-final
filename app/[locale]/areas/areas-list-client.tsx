"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Building, Home, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"

interface Area {
  id: string
  name: string
  name_fa: string | null
  slug: string
  short_description: string | null
  short_description_fa: string | null
  cover_image_url: string | null
  total_properties: number
  average_price: number | null
  price_growth_percent: number | null
}

interface AreasListClientProps {
  areas: Area[]
}

export function AreasListClient({ areas }: AreasListClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isRtl, locale } = useI18n()
  const content = useContent()

  const filteredAreas = areas.filter(area => {
    const name = locale === 'fa' && area.name_fa ? area.name_fa : area.name
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat('en-US').format(price)
  }

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
          <MapPin className="w-4 h-4" />
          {content.areas.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {content.areas.title}{" "}
          <span className="text-secondary">{content.areas.titleHighlight}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
          {content.areas.subtitle}
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={locale === 'fa' ? "جستجوی منطقه..." : "Search areas..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => {
          const areaName = locale === 'fa' && area.name_fa ? area.name_fa : area.name
          const areaDesc = locale === 'fa' && area.short_description_fa ? area.short_description_fa : area.short_description

          return (
            <Link
              key={area.id}
              href={`/${locale}/areas/${area.slug}`}
              className="group"
            >
              <div className="relative h-80 rounded-3xl overflow-hidden border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <Image
                  src={area.cover_image_url || "/images/placeholder.jpg"}
                  alt={areaName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Growth Badge */}
                {area.price_growth_percent && (
                  <div className="absolute top-4 end-4">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-bold">+{area.price_growth_percent}%</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                    {areaName}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {areaDesc}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-white/70" />
                      <span className="text-white/90 text-sm">{area.total_properties}+ {content.areas.properties}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-white/70" />
                      <span className="text-white/90 text-sm" dir="ltr"><AedSymbol size={13} className="mr-0.5" /> {formatPrice(area.average_price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredAreas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {locale === 'fa' ? "منطقه‌ای یافت نشد" : "No areas found"}
          </p>
        </div>
      )}
    </div>
  )
}
