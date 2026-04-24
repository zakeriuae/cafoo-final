"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Building, Home, TrendingUp, MapPin } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const areas = [
  {
    id: 1,
    name: { en: "Downtown Dubai", fa: "داون‌تاون دبی" },
    description: { 
      en: "Home to Burj Khalifa and Dubai Mall, the heart of modern Dubai living",
      fa: "خانه برج خلیفه و دبی مال، قلب زندگی مدرن دبی"
    },
    properties: 245,
    avgPrice: "2,500,000",
    growth: "+12%",
    image: "/images/downtown-dubai.jpg",
    highlights: { 
      en: ["Burj Khalifa Views", "Dubai Mall Access", "Metro Connected"],
      fa: ["نمای برج خلیفه", "دسترسی دبی مال", "متصل به مترو"]
    },
  },
  {
    id: 2,
    name: { en: "Dubai Marina", fa: "دبی مارینا" },
    description: { 
      en: "Waterfront living with stunning marina views and vibrant lifestyle",
      fa: "زندگی ساحلی با چشم‌انداز خیره‌کننده مارینا و سبک زندگی پویا"
    },
    properties: 189,
    avgPrice: "1,800,000",
    growth: "+8%",
    image: "/images/dubai-marina.jpg",
    highlights: { 
      en: ["Marina Walk", "Beach Access", "JBR Proximity"],
      fa: ["پیاده‌روی مارینا", "دسترسی ساحل", "نزدیکی JBR"]
    },
  },
  {
    id: 3,
    name: { en: "Palm Jumeirah", fa: "پالم جمیرا" },
    description: { 
      en: "Iconic man-made island offering exclusive beachfront properties",
      fa: "جزیره نمادین مصنوعی با املاک ساحلی اختصاصی"
    },
    properties: 156,
    avgPrice: "4,500,000",
    growth: "+15%",
    image: "/images/dubai-hero.jpg",
    highlights: { 
      en: ["Private Beaches", "5-Star Hotels", "Luxury Villas"],
      fa: ["ساحل خصوصی", "هتل‌های ۵ ستاره", "ویلاهای لوکس"]
    },
  },
  {
    id: 4,
    name: { en: "Business Bay", fa: "بیزینس بی" },
    description: { 
      en: "Dubai's thriving business district with modern residential towers",
      fa: "منطقه تجاری پویا دبی با برج‌های مسکونی مدرن"
    },
    properties: 178,
    avgPrice: "1,500,000",
    growth: "+10%",
    image: "/images/luxury-apartment.jpg",
    highlights: { 
      en: ["Canal Views", "Business Hub", "Modern Living"],
      fa: ["نمای کانال", "مرکز تجاری", "زندگی مدرن"]
    },
  },
]

export function AreasSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredArea, setHoveredArea] = useState<number | null>(null)
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

  return (
    <section ref={sectionRef} id="areas" className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 end-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 start-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "text-center mb-14 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            {content.areas.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.areas.title}{" "}
            <span className="text-secondary">{content.areas.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {content.areas.subtitle}
          </p>
        </div>

        {/* Areas Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <div
              key={area.id}
              className={cn(
                "group transition-all duration-700",
                index === 0 ? "lg:col-span-2 lg:row-span-2" : "",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredArea(area.id)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <div className={cn(
                "relative overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/10",
                index === 0 ? "h-full min-h-[500px]" : "h-[280px]"
              )}>
                {/* Image */}
                <Image
                  src={area.image}
                  alt={area.name[locale as 'en' | 'fa']}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className={cn(
                  "absolute inset-0 transition-all duration-500",
                  hoveredArea === area.id 
                    ? "bg-gradient-to-t from-black/90 via-black/50 to-black/20" 
                    : "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                )} />
                
                {/* Growth Badge - End side */}
                <div className="absolute top-4 end-4 z-10">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm font-bold">{area.growth} {content.areas.growth}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <div className={cn(
                    "transition-all duration-500",
                    hoveredArea === area.id ? "translate-y-0" : "translate-y-4"
                  )}>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                      {area.name[locale as 'en' | 'fa']}
                    </h3>
                    <p className={cn(
                      "text-white/80 mb-4 transition-all duration-500",
                      index === 0 ? "text-base max-w-md" : "text-sm line-clamp-2"
                    )}>
                      {area.description[locale as 'en' | 'fa']}
                    </p>

                    {/* Highlights */}
                    <div className={cn(
                      "flex flex-wrap gap-2 mb-4 transition-all duration-500",
                      hoveredArea === area.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                      {area.highlights[locale as 'en' | 'fa'].map((highlight) => (
                        <span
                          key={highlight}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-xs font-medium border border-white/20"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                          <Home className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60">{content.areas.properties}</p>
                          <p className="font-bold text-white">{area.properties}+</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                          <Building className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60">{content.areas.avgPrice}</p>
                          <p className="font-bold text-white" dir="ltr">{area.avgPrice} {content.common.aed}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button 
                      className={cn(
                        "bg-white/10 backdrop-blur-sm hover:bg-secondary text-white border border-white/20 hover:border-secondary rounded-xl transition-all duration-500",
                        hoveredArea === area.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                    >
                      {content.areas.explore}
                      {isRtl ? (
                        <ArrowLeft className="h-4 w-4 ms-2 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="h-4 w-4 ms-2 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div 
          className={cn(
            "text-center mt-14 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Button 
            size="lg" 
            variant="outline"
            className="h-14 px-10 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105"
          >
            {content.common.viewAll}
            {isRtl ? (
              <ArrowLeft className="h-5 w-5 ms-2" />
            ) : (
              <ArrowRight className="h-5 w-5 ms-2" />
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
