"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building2, ArrowRight, MessageCircle, Sparkles, TrendingUp } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const projects = [
  {
    id: 1,
    name: "Ocean 2",
    developer: "Danube Properties",
    location: "Dubai Mina Rashid",
    launchPrice: "900,000 AED",
    paymentPlan: "70/30",
    deliveryTime: "2027 Q1",
    type: "Apartment",
    status: "Off-Plan",
    image: "/images/downtown-dubai.jpg",
    featured: true,
    roi: "8.5%",
  },
  {
    id: 2,
    name: "340 Riverside Crescent",
    developer: "SOBHA REALTY",
    location: "Sobha Hartland",
    launchPrice: "1,320,000 AED",
    paymentPlan: "50/50",
    deliveryTime: "2027",
    type: "Apartment",
    status: "Off-Plan",
    image: "/images/dubai-marina.jpg",
    featured: true,
    roi: "7.2%",
  },
  {
    id: 3,
    name: "Trump Tower",
    developer: "DAR AL ARKAN",
    location: "Dubai Za'abeel",
    launchPrice: "3,800,000 AED",
    paymentPlan: "90/10",
    deliveryTime: "2031 Q3",
    type: "Apartment",
    status: "Off-Plan",
    image: "/images/luxury-apartment.jpg",
    featured: true,
    roi: "6.8%",
  },
  {
    id: 4,
    name: "The Address Sky View",
    developer: "EMAAR PROPERTIES",
    location: "Dubai Downtown",
    launchPrice: "2,500,000 AED",
    paymentPlan: "0/100",
    deliveryTime: "Ready",
    type: "Hotel Apartment",
    status: "Ready",
    image: "/images/downtown-dubai.jpg",
    featured: false,
    roi: "5.5%",
  },
  {
    id: 5,
    name: "Boulevard Crescent",
    developer: "EMAAR PROPERTIES",
    location: "Dubai Downtown",
    launchPrice: "2,000,000 AED",
    paymentPlan: "0/100",
    deliveryTime: "Ready",
    type: "Apartment",
    status: "Ready",
    image: "/images/dubai-marina.jpg",
    featured: false,
    roi: "6.0%",
  },
  {
    id: 6,
    name: "THE OPUS",
    developer: "OMNIYAT",
    location: "Dubai Business Bay",
    launchPrice: "3,000,000 AED",
    paymentPlan: "100/0",
    deliveryTime: "2025",
    type: "Apartment",
    status: "Ready",
    image: "/images/luxury-apartment.jpg",
    featured: false,
    roi: "5.8%",
  },
]

const filters = ["All", "Off-Plan", "Ready", "Apartment", "Villa", "Penthouse"]

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.status === activeFilter || p.type === activeFilter)

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-14 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Exclusive Developments
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover the most prestigious real estate projects in Dubai from 
            world-renowned developers.
          </p>
        </div>

        {/* Filters */}
        <div 
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-card text-foreground hover:bg-muted border border-border"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
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
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`${project.status === "Off-Plan" ? "bg-secondary/90" : "bg-green-500/90"} backdrop-blur-sm text-white border-0 px-3 py-1`}>
                      {project.status}
                    </Badge>
                    {project.featured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* ROI Badge */}
                  {project.roi && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-semibold">{project.roi}</span>
                    </div>
                  )}

                  {/* Developer & Name */}
                  <div className="absolute bottom-4 left-4 right-4">
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
                        <span className="text-sm text-muted-foreground">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{project.type}</span>
                      </div>
                    </div>

                    {/* Price & Payment */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Starting Price</p>
                        <p className="font-bold text-primary">{project.launchPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Payment Plan</p>
                        <p className="font-bold text-foreground">{project.paymentPlan}</p>
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Calendar className="h-4 w-4 text-foreground" />
                      </div>
                      <span className="text-sm text-foreground font-medium">Delivery: {project.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold group/btn">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
          className={`text-center mt-14 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button 
            size="lg" 
            className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
