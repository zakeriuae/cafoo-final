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
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-black pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/herophoto.jpg"
          alt="Dubai Luxury Real Estate"
          fill
          className="object-cover"
          priority
          unoptimized={true}
        />
        {/* Gradient Overlay - reduced for more clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      </div>

      {/* Content */}
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center">
          {/* Main Heading */}
          <h1 
            className={cn(
              "text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight transition-all duration-1000 delay-200 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Luxury Living <br />
            <span className="text-primary drop-shadow-[1px_1px_0px_rgba(0,0,0,0.2)]">Redefined</span>
          </h1>

          <p 
            className={cn(
              "text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-2xl transition-all duration-1000 delay-400 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)] font-light tracking-wide mx-auto",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Exclusive Real Estate in Dubai
          </p>

          {/* Minimal Glass Search Box */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-6 transition-all duration-1000 delay-500",
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
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
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
                      ? "bg-primary text-secondary-foreground shadow-lg shadow-primary/20"
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
                      className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-white focus:ring-1 focus:ring-primary appearance-none cursor-pointer font-medium hover:bg-white/10 transition-all ps-12 pe-10 text-sm"
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
              "flex items-center justify-center gap-10 mt-16 transition-all duration-1000 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {[
              { value: "560+", label: content.hero.stats.properties },
              { value: "1280+", label: content.hero.stats.clients },
              { value: "12+", label: content.hero.stats.years },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white mb-1" dir="ltr">{stat.value}</p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{stat.label}</p>
              </div>
            ))}
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
