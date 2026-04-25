"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Building, Home, TrendingUp, MapPin } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

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
  location_highlights: string[] | null
  location_highlights_fa: string[] | null
}

interface AreasSectionClientProps {
  areas: Area[]
}

export function AreasSectionClientNew({ areas }: AreasSectionClientProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat('en-US').format(price)
  }

  return (
    <section ref={sectionRef} id="areas" className="py-24 bg-[#F0F7FF] relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="max-w-2xl">
            <p className="text-secondary font-medium mb-3 text-sm tracking-wide">
              {content.areas.badge}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {content.areas.title} {content.areas.titleHighlight}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.areas.subtitle}
            </p>
          </div>

          <Link href={`/${locale}/areas`}>
            <Button variant="outline" className="rounded-full px-6 h-11 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all gap-2 group font-bold">
              {content.common.viewAll}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Areas Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => {
            const areaName = locale === 'fa' && area.name_fa ? area.name_fa : area.name
            
            return (
              <Link
                href={`/${locale}/areas/${area.slug}`}
                key={area.id}
                className={cn(
                  "group transition-all duration-700 block",
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : "",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-secondary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5",
                  index === 0 ? "h-full min-h-[500px]" : "h-[300px]"
                )}>
                  {/* Image */}
                  <Image
                    src={area.slug === 'downtown-dubai' ? "/images/areas/downtown-user.jpg" : (area.cover_image_url || "/images/placeholder.jpg")}
                    alt={areaName}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <h3 className={cn(
                      "font-bold text-white mb-2 group-hover:text-secondary transition-colors",
                      index === 0 ? "text-3xl md:text-4xl" : "text-2xl"
                    )}>
                      {areaName}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-bold text-white/90">
                          {area.total_properties} {content.areas.properties}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary font-bold text-sm group-hover:gap-2 transition-all">
                        {content.areas.explore}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
