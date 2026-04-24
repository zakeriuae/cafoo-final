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
  const { isRtl } = useI18n()
  const content = useContent()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dubai-hero.jpg"
          alt="Dubai Skyline"
          fill
          className="object-cover scale-105"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-secondary/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Badge */}
          <div 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-white/90 font-medium">{content.hero.badge}</span>
          </div>

          {/* Main Heading */}
          <h1 
            className={cn(
              "text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-balance">{content.hero.title}</span>
            <br />
            <span className="text-secondary drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
              {content.hero.titleHighlight}
            </span>
          </h1>

          <p 
            className={cn(
              "text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {content.hero.description}
          </p>

          {/* Premium Search Box */}
          <div 
            className={cn(
              "transition-all duration-1000 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="relative max-w-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/50 via-primary/50 to-secondary/50 rounded-2xl blur-lg opacity-50" />
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-2 md:p-3">
                {/* Search Type Toggle */}
                <div className="flex items-center gap-1 mb-3 px-2">
                  <button
                    onClick={() => setSearchType("buy")}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
                      searchType === "buy"
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Home className="w-4 h-4" />
                    {content.properties.tabs.sale}
                  </button>
                  <button
                    onClick={() => setSearchType("rent")}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
                      searchType === "rent"
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Key className="w-4 h-4" />
                    {content.properties.tabs.rent}
                  </button>
                </div>

                {/* Search Fields */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                  {/* Location */}
                  <div className="flex-1 relative group">
                    <div className="absolute top-1/2 -translate-y-1/2 start-4 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <select 
                      className="w-full h-14 rounded-xl border-0 bg-muted/30 text-foreground focus:ring-2 focus:ring-secondary appearance-none cursor-pointer font-medium hover:bg-muted/50 transition-colors ps-16 pe-10"
                    >
                      <option value="">{content.hero.locations.all}</option>
                      <option value="downtown">{content.hero.locations.downtown}</option>
                      <option value="marina">{content.hero.locations.marina}</option>
                      <option value="palm">{content.hero.locations.palm}</option>
                      <option value="creek">{content.hero.locations.creek}</option>
                      <option value="hills">{content.hero.locations.hills}</option>
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-4 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px bg-border mx-2 my-3" />

                  {/* Property Type */}
                  <div className="flex-1 relative group">
                    <div className="absolute top-1/2 -translate-y-1/2 start-4 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <select 
                      className="w-full h-14 rounded-xl border-0 bg-muted/30 text-foreground focus:ring-2 focus:ring-secondary appearance-none cursor-pointer font-medium hover:bg-muted/50 transition-colors ps-16 pe-10"
                    >
                      <option value="">{content.hero.propertyTypes.all}</option>
                      <option value="apartment">{content.hero.propertyTypes.apartment}</option>
                      <option value="villa">{content.hero.propertyTypes.villa}</option>
                      <option value="townhouse">{content.hero.propertyTypes.townhouse}</option>
                      <option value="penthouse">{content.hero.propertyTypes.penthouse}</option>
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-4 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Search Button */}
                  <div className="md:ps-2">
                    <Button className="w-full md:w-auto h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base font-bold rounded-xl shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-all duration-300 hover:scale-105">
                      <Search className="h-5 w-5 me-2" />
                      {content.hero.search}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div 
            className={cn(
              "flex flex-wrap gap-8 md:gap-12 mt-12 transition-all duration-1000 delay-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {[
              { value: "500+", label: content.hero.stats.properties },
              { value: "1000+", label: content.hero.stats.clients },
              { value: "10+", label: content.hero.stats.years },
              { value: "50+", label: content.hero.stats.developers },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-2 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative">
                  <p className="text-4xl md:text-5xl font-bold text-white mb-1" dir="ltr">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
