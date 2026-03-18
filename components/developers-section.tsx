"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Building2, MapPin, Award } from "lucide-react"

const developers = [
  {
    id: 1,
    name: "EMAAR Properties",
    logo: "EMAAR",
    description: "The largest real estate developer in the UAE, known for iconic projects like Burj Khalifa and Dubai Mall.",
    projects: 42,
    established: "1997",
    headquarters: "Dubai, UAE",
    signature: ["Burj Khalifa", "Dubai Mall", "Downtown Dubai"],
    color: "bg-blue-600",
  },
  {
    id: 2,
    name: "DAMAC Properties",
    logo: "DAMAC",
    description: "Luxury real estate developer delivering exceptional branded residences and lifestyle experiences.",
    projects: 35,
    established: "2002",
    headquarters: "Dubai, UAE",
    signature: ["DAMAC Hills", "Aykon City", "Paramount Tower"],
    color: "bg-amber-600",
  },
  {
    id: 3,
    name: "SOBHA Realty",
    logo: "SOBHA",
    description: "Premium developer known for superior quality and craftsmanship in every project.",
    projects: 18,
    established: "1976",
    headquarters: "Dubai, UAE",
    signature: ["Sobha Hartland", "One Park Avenue", "Creek Vistas"],
    color: "bg-emerald-600",
  },
  {
    id: 4,
    name: "Danube Properties",
    logo: "DANUBE",
    description: "Pioneering affordable luxury with innovative payment plans and quality developments.",
    projects: 24,
    established: "2014",
    headquarters: "Dubai, UAE",
    signature: ["Lawnz", "Elz", "Jewelz"],
    color: "bg-cyan-600",
  },
  {
    id: 5,
    name: "MERAAS",
    logo: "MERAAS",
    description: "Creating unique lifestyle destinations that define Dubai's urban landscape.",
    projects: 15,
    established: "2007",
    headquarters: "Dubai, UAE",
    signature: ["Bluewaters", "City Walk", "La Mer"],
    color: "bg-indigo-600",
  },
  {
    id: 6,
    name: "Dar Al Arkan",
    logo: "DAR",
    description: "Leading Saudi developer expanding into Dubai with ultra-luxury branded residences.",
    projects: 8,
    established: "1994",
    headquarters: "Riyadh, KSA",
    signature: ["Trump Tower", "Aida", "Les Vagues"],
    color: "bg-rose-600",
  },
]

export function DevelopersSection() {
  return (
    <section id="developers" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-medium mb-2 tracking-wider uppercase">
            Trusted Partners
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Premier Developers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner with the UAE's most reputable developers to bring you 
            exceptional properties with guaranteed quality and delivery.
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer) => (
            <Card 
              key={developer.id} 
              className="group border border-border hover:border-secondary/50 bg-card hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* Logo & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 ${developer.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                    {developer.logo.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {developer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Est. {developer.established}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {developer.description}
                </p>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-foreground">{developer.projects} Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-foreground">{developer.headquarters}</span>
                  </div>
                </div>

                {/* Signature Projects */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Signature Projects
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {developer.signature.map((project) => (
                      <span
                        key={project}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto"
                >
                  View Projects
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
