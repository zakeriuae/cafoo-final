"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building, Home, TrendingUp } from "lucide-react"

const areas = [
  {
    id: 1,
    name: "Downtown Dubai",
    description: "Home to Burj Khalifa and Dubai Mall, the heart of modern Dubai living",
    properties: 245,
    avgPrice: "2,500,000 AED",
    growth: "+12%",
    image: "/images/downtown-dubai.jpg",
    highlights: ["Burj Khalifa Views", "Dubai Mall Access", "Metro Connected"],
  },
  {
    id: 2,
    name: "Dubai Marina",
    description: "Waterfront living with stunning marina views and vibrant lifestyle",
    properties: 189,
    avgPrice: "1,800,000 AED",
    growth: "+8%",
    image: "/images/dubai-marina.jpg",
    highlights: ["Marina Walk", "Beach Access", "JBR Proximity"],
  },
  {
    id: 3,
    name: "Palm Jumeirah",
    description: "Iconic man-made island offering exclusive beachfront properties",
    properties: 156,
    avgPrice: "4,500,000 AED",
    growth: "+15%",
    image: "/images/dubai-skyline.jpg",
    highlights: ["Private Beaches", "5-Star Hotels", "Luxury Villas"],
  },
  {
    id: 4,
    name: "Business Bay",
    description: "Dubai's thriving business district with modern residential towers",
    properties: 178,
    avgPrice: "1,500,000 AED",
    growth: "+10%",
    image: "/images/luxury-apartment.jpg",
    highlights: ["Canal Views", "Business Hub", "Modern Living"],
  },
]

export function AreasSection() {
  return (
    <section id="areas" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-medium mb-2 tracking-wider uppercase">
            Prime Locations
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Dubai Areas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover Dubai's most prestigious neighborhoods and find the perfect 
            location that matches your lifestyle and investment goals.
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {areas.map((area, index) => (
            <div
              key={area.id}
              className={`group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-2xl transition-all duration-500 ${
                index === 0 ? "md:col-span-2 md:row-span-1" : ""
              }`}
            >
              <div className={`flex flex-col ${index === 0 ? "md:flex-row" : ""}`}>
                {/* Image */}
                <div className={`relative ${index === 0 ? "md:w-1/2 h-64 md:h-auto" : "h-56"} overflow-hidden`}>
                  <Image
                    src={area.image}
                    alt={area.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  
                  {/* Growth Badge */}
                  <div className="absolute top-4 right-4 bg-green-600/90 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{area.growth} YoY</span>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-6 ${index === 0 ? "md:w-1/2 md:p-8" : ""}`}>
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {area.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {area.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Properties</p>
                        <p className="font-semibold text-foreground">{area.properties}+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Building className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. Price</p>
                        <p className="font-semibold text-foreground">{area.avgPrice}</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group/btn">
                    Explore Area
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
