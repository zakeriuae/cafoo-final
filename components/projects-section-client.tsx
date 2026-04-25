"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building2, ArrowRight, ArrowLeft, MessageCircle, Sparkles, TrendingUp } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Project {
  id: string | number
  name: string
  developer: string
  developerLogo?: string
  location: { en: string; fa: string }
  launchPrice: string
  paymentPlan: string
  deliveryTime: string
  type: { en: string; fa: string }
  status: string
  image: string
  featured: boolean
  roi?: string
}

interface ProjectsSectionClientProps {
  projects: Project[]
}

export default function ProjectsSectionClient({ projects }: ProjectsSectionClientProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()
  
  const filters = [
    { key: "all", label: content.projects.filters.all },
    { key: "Off-Plan", label: content.projects.filters.offPlan },
    { key: "Ready", label: content.projects.filters.readyToMove },
  ]

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

  const getDeveloperLogo = (name: string, logoFromDb?: string) => {
    if (logoFromDb && logoFromDb.startsWith('http')) return logoFromDb;
    
    const mapping: Record<string, string> = {
      'emaar': '/images/developers/emaar.png',
      'damac': '/images/developers/damac.png',
      'sobha': '/images/developers/sobhan.png',
      'nakheel': '/images/developers/nakheel.png',
      'binghatti': '/images/developers/binghati.png',
      'arada': '/images/developers/arada.png',
      'tiger': '/images/developers/tiger.png',
      'aldar': '/images/developers/aldar.png',
      'wasl': '/images/developers/wasl.png',
      'dubai properties': '/images/developers/dubai.png',
      'meraas': '/images/developers/meraas.png',
      'alef': '/images/developers/alef.png',
      'imtiaz': '/images/developers/imtiaz.png',
      'nshama': '/images/developers/nshama.png',
      'beyond': '/images/developers/beyond.png',
      'rak': '/images/developers/rak.png',
    };

    const foundKey = Object.keys(mapping).find(key => name.toLowerCase().includes(key));
    return foundKey ? mapping[foundKey] : (logoFromDb || null);
  };

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === activeFilter)

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-[#F0F7FF] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="max-w-2xl">
            <p className="text-primary font-medium mb-3 text-sm tracking-wide">
              {content.projects.badge}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {content.projects.title} {content.projects.titleHighlight}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.projects.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-end gap-6">
            <Link href={`/${locale}/projects`}>
              <Button variant="outline" className="rounded-full px-6 h-11 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all gap-2 group font-bold">
                {content.projects.viewAll}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            {/* Filters */}
            <div className="flex p-1 bg-muted/30 rounded-full border border-border/40">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    "px-5 py-2 rounded-full font-medium text-sm transition-all duration-300",
                    activeFilter === filter.key
                      ? "bg-primary text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className={cn(
                "group transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 start-4 flex gap-2">
                    <Badge className={cn(
                      "backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold",
                      project.status === "Off-Plan" ? "bg-secondary/80" : "bg-green-500/80"
                    )}>
                      {project.status === "Off-Plan" ? content.projects.filters.offPlan : content.projects.filters.readyToMove}
                    </Badge>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between">
                    <div>
                      <p className="text-white/70 text-xs font-medium mb-1">{content.projects.startingFrom}</p>
                      <p className="text-2xl font-bold text-white tracking-tight" dir="ltr">
                        {content.common.aed} {project.launchPrice}
                      </p>
                    </div>
                    {project.roi && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-semibold" dir="ltr">{project.roi} ROI</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  {/* Top Row: Name */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>

                  {/* Location - Property Style */}
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
                    <MapPin className="h-4 w-4 text-muted-foreground/60" />
                    <span className="text-sm font-medium">
                      {project.location[locale as 'en' | 'fa']}
                    </span>
                  </div>
                  
                  {/* Stats Box: Handover and Payment Plan */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40 mb-6">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                        {content.projects.handover}
                      </p>
                      <p className="text-sm font-bold text-foreground leading-none">
                        {project.deliveryTime}
                      </p>
                    </div>
                    <div className="border-s border-border/40 ps-4">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                        {content.projects.paymentPlan}
                      </p>
                      <p className="text-sm font-bold text-foreground leading-none">
                        {project.paymentPlan}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Developer and View Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeveloperLogo(project.developer, project.developerLogo) ? (
                        <div className="relative h-20 w-48 -my-6">
                          <Image
                            src={getDeveloperLogo(project.developer, project.developerLogo)!}
                            alt={project.developer}
                            fill
                            className="object-contain object-left filter grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      ) : (
                        <>
                          <Building2 className="h-4 w-4 text-primary/70" />
                          <span className="text-xs font-bold text-foreground/80 uppercase tracking-wide">
                            {project.developer}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all cursor-pointer">
                      {content.projects.viewDetails}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
