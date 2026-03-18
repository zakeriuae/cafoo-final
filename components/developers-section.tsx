"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Award, ExternalLink } from "lucide-react"
import { useRef, useState, useEffect } from "react"

const developers = [
  {
    id: 1,
    name: "EMAAR Properties",
    logo: "/images/developers/emaar-logo.jpg",
    description: "The largest real estate developer in the UAE, known for iconic projects like Burj Khalifa and Dubai Mall.",
    projects: 42,
    established: "1997",
    signature: ["Burj Khalifa", "Dubai Mall", "Downtown Dubai"],
  },
  {
    id: 2,
    name: "DAMAC Properties",
    logo: "/images/developers/damac-logo.jpg",
    description: "Luxury real estate developer delivering exceptional branded residences and lifestyle experiences.",
    projects: 35,
    established: "2002",
    signature: ["DAMAC Hills", "Aykon City", "Paramount Tower"],
  },
  {
    id: 3,
    name: "SOBHA Realty",
    logo: "/images/developers/sobha-logo.jpg",
    description: "Premium developer known for superior quality and craftsmanship in every project.",
    projects: 18,
    established: "1976",
    signature: ["Sobha Hartland", "One Park Avenue", "Creek Vistas"],
  },
  {
    id: 4,
    name: "Danube Properties",
    logo: "/images/developers/danube-logo.jpg",
    description: "Pioneering affordable luxury with innovative payment plans and quality developments.",
    projects: 24,
    established: "2014",
    signature: ["Lawnz", "Elz", "Jewelz"],
  },
  {
    id: 5,
    name: "MERAAS",
    logo: "/images/developers/meraas-logo.jpg",
    description: "Creating unique lifestyle destinations that define Dubai's urban landscape.",
    projects: 15,
    established: "2007",
    signature: ["Bluewaters", "City Walk", "La Mer"],
  },
  {
    id: 6,
    name: "Dar Al Arkan",
    logo: "/images/developers/dar-al-arkan-logo.jpg",
    description: "Leading Saudi developer expanding into Dubai with ultra-luxury branded residences.",
    projects: 8,
    established: "1994",
    signature: ["Trump Tower", "Aida", "Les Vagues"],
  },
]

export function DevelopersSection() {
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

  return (
    <section ref={sectionRef} id="developers" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Trusted Partners
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premier Developers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We partner with the UAE's most reputable developers to bring you 
            exceptional properties with guaranteed quality and delivery.
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((developer, index) => (
            <div 
              key={developer.id} 
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                {/* Logo */}
                <div className="relative w-full h-20 mb-6 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-4">
                  <Image
                    src={developer.logo}
                    alt={developer.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Name & Established */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {developer.name}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Est. {developer.established}
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                  {developer.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{developer.projects}</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                  </div>
                </div>

                {/* Signature Projects */}
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1 font-medium uppercase tracking-wider">
                    <Award className="h-3 w-3" />
                    Signature Projects
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {developer.signature.map((project) => (
                      <span
                        key={project}
                        className="px-3 py-1.5 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5 p-4 h-auto rounded-xl group/btn"
                >
                  <span className="font-semibold">View All Projects</span>
                  <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          className={`text-center mt-14 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button 
            size="lg" 
            variant="outline"
            className="h-14 px-10 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105"
          >
            Explore All Developers
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
