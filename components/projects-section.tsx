"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building2, ArrowRight, ArrowLeft, MessageCircle, Sparkles, TrendingUp } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: 1,
    name: "Ocean 2",
    developer: "Danube Properties",
    location: { en: "Dubai Mina Rashid", fa: "دبی مینا راشد" },
    launchPrice: "900,000",
    paymentPlan: "70/30",
    deliveryTime: "2027 Q1",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: "Off-Plan",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    featured: true,
    roi: "8.5%",
  },
  {
    id: 2,
    name: "340 Riverside Crescent",
    developer: "SOBHA REALTY",
    location: { en: "Sobha Hartland", fa: "سبحا هارتلند" },
    launchPrice: "1,320,000",
    paymentPlan: "50/50",
    deliveryTime: "2027",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: "Off-Plan",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    featured: true,
    roi: "7.2%",
  },
  {
    id: 3,
    name: "Trump Tower",
    developer: "DAR AL ARKAN",
    location: { en: "Dubai Za'abeel", fa: "دبی زعبیل" },
    launchPrice: "3,800,000",
    paymentPlan: "90/10",
    deliveryTime: "2031 Q3",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: "Off-Plan",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80",
    featured: true,
    roi: "6.8%",
  },
  {
    id: 4,
    name: "The Address Sky View",
    developer: "EMAAR PROPERTIES",
    location: { en: "Dubai Downtown", fa: "داون‌تاون دبی" },
    launchPrice: "2,500,000",
    paymentPlan: "0/100",
    deliveryTime: "Ready",
    type: { en: "Hotel Apartment", fa: "آپارتمان هتلی" },
    status: "Ready",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80",
    featured: false,
    roi: "5.5%",
  },
  {
    id: 5,
    name: "Boulevard Crescent",
    developer: "EMAAR PROPERTIES",
    location: { en: "Dubai Downtown", fa: "داون‌تاون دبی" },
    launchPrice: "2,000,000",
    paymentPlan: "0/100",
    deliveryTime: "Ready",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: "Ready",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80",
    featured: false,
    roi: "6.0%",
  },
  {
    id: 6,
    name: "THE OPUS",
    developer: "OMNIYAT",
    location: { en: "Dubai Business Bay", fa: "بیزینس بی دبی" },
    launchPrice: "3,000,000",
    paymentPlan: "100/0",
    deliveryTime: "2025",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: "Ready",
    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80",
    featured: false,
    roi: "5.8%",
  },
]

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()
  
  console.log("[v0] ProjectsSection rendering, content:", content?.projects ? "exists" : "missing")

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

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === activeFilter)

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 end-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 start-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "text-center mb-14 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {content.projects.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.projects.title}{" "}
            <span className="text-primary">{content.projects.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {content.projects.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
                activeFilter === filter.key
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-card text-foreground hover:bg-muted border border-border"
              )}
            >
              {filter.label}
            </button>
          ))}
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
              <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badges - Start side */}
                  <div className="absolute top-4 start-4 flex gap-2">
                    <Badge className={cn(
                      "backdrop-blur-sm text-white border-0 px-3 py-1",
                      project.status === "Off-Plan" ? "bg-secondary/90" : "bg-green-500/90"
                    )}>
                      {project.status === "Off-Plan" ? content.projects.filters.offPlan : content.projects.filters.readyToMove}
                    </Badge>
                    {project.featured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">
                        {content.properties.featured}
                      </Badge>
                    )}
                  </div>

                  {/* ROI Badge - End side */}
                  {project.roi && (
                    <div className="absolute top-4 end-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-semibold" dir="ltr">{project.roi}</span>
                    </div>
                  )}

                  {/* Developer & Name */}
                  <div className="absolute bottom-4 start-4 end-4">
                    <p className="text-white/80 text-sm font-medium mb-1">{project.developer}</p>
                    <h3 className="text-white text-xl font-bold">{project.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Location & Type */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-secondary/10">
                          <MapPin className="h-4 w-4 text-secondary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{project.location[locale as 'en' | 'fa']}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{project.type[locale as 'en' | 'fa']}</span>
                      </div>
                    </div>

                    {/* Price & Payment */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{content.projects.startingFrom}</p>
                        <p className="font-bold text-primary" dir="ltr">{project.launchPrice} {content.common.aed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{content.projects.paymentPlan}</p>
                        <p className="font-bold text-foreground" dir="ltr">{project.paymentPlan}</p>
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Calendar className="h-4 w-4 text-foreground" />
                      </div>
                      <span className="text-sm text-foreground font-medium">
                        {content.projects.handover}: {project.deliveryTime}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold group/btn">
                      {content.projects.viewDetails}
                      {isRtl ? (
                        <ArrowLeft className="h-4 w-4 ms-2 group-hover/btn:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="h-4 w-4 ms-2 group-hover/btn:translate-x-1 transition-transform" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 w-12 rounded-xl border-green-500 text-green-500 hover:bg-green-500 hover:text-white p-0"
                    >
                      <MessageCircle className="h-5 w-5" />
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
            className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            {content.projects.viewAll}
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
