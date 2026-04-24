"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Building2, Home, Key, ChevronDown, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [searchType, setSearchType] = useState<"buy" | "rent">("buy")
  const [isVisible, setIsVisible] = useState(false)
  const { isRtl, locale } = useI18n()
  const content = useContent()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-bg.png"
          alt="Dubai Skyline Luxury"
          fill
          className="object-cover opacity-80"
          priority
          quality={100}
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs text-white/80 font-bold uppercase tracking-widest">{content.hero.badge}</span>
          </div>

          {/* Main Heading */}
          <h1 
            className={cn(
              "text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight transition-all duration-1000 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {content.hero.title}
            <br />
            <span className="text-secondary drop-shadow-2xl">
              {content.hero.titleHighlight}
            </span>
          </h1>

          <p 
            className={cn(
              "text-lg md:text-xl text-white/70 mb-12 max-w-xl leading-relaxed transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {content.hero.description}
          </p>

          {/* Minimal Glass Search Box */}
          <div 
            className={cn(
              "transition-all duration-1000 delay-500 max-w-3xl",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] p-3 border border-white/10 shadow-2xl">
              {/* Search Type Toggle */}
              <div className="flex items-center gap-2 mb-4 px-3">
                <button
                  onClick={() => setSearchType("buy")}
                  className={cn(
                    "px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300",
                    searchType === "buy"
                      ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {content.properties.tabs.sale}
                </button>
                <button
                  onClick={() => setSearchType("rent")}
                  className={cn(
                    "px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300",
                    searchType === "rent"
                      ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {content.properties.tabs.rent}
                </button>
              </div>

              {/* Search Fields */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative group">
                    <MapPin className="absolute start-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <select 
                      className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-white focus:ring-1 focus:ring-secondary appearance-none cursor-pointer font-medium hover:bg-white/10 transition-all ps-12 pe-10 text-sm"
                    >
                      <option value="" className="bg-neutral-900">{content.hero.locations.all}</option>
                      <option value="downtown" className="bg-neutral-900">{content.hero.locations.downtown}</option>
                      <option value="marina" className="bg-neutral-900">{content.hero.locations.marina}</option>
                    </select>
                    <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                  </div>

                  <div className="relative group">
                    <Building2 className="absolute start-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <select 
                      className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-white focus:ring-1 focus:ring-secondary appearance-none cursor-pointer font-medium hover:bg-white/10 transition-all ps-12 pe-10 text-sm"
                    >
                      <option value="" className="bg-neutral-900">{content.hero.propertyTypes.all}</option>
                      <option value="apartment" className="bg-neutral-900">{content.hero.propertyTypes.apartment}</option>
                      <option value="villa" className="bg-neutral-900">{content.hero.propertyTypes.villa}</option>
                    </select>
                    <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                  </div>
                </div>

                <Button className="h-14 px-10 bg-white text-black hover:bg-white/90 font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  <Search className="h-4 w-4 me-2" />
                  {content.hero.search}
                </Button>
              </div>
            </div>
          </div>

          {/* Minimal Stats */}
          <div 
            className={cn(
              "flex items-center gap-10 mt-16 transition-all duration-1000 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {[
              { value: "500+", label: content.hero.stats.properties },
              { value: "1000+", label: content.hero.stats.clients },
              { value: "10+", label: content.hero.stats.years },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white mb-1" dir="ltr">{stat.value}</p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-10 left-10 z-10 flex items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        <span className="text-[10px] text-white/40 uppercase font-bold tracking-[0.3em] vertical-text">Scroll</span>
      </div>
    </section>
  )
}
