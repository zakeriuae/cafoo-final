"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart, 
  ArrowRight,
  MessageCircle,
  Eye,
  TrendingUp
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

const properties = [
  {
    id: 1,
    title: "Luxurious 3BR Apartment in Downtown",
    location: "Downtown Dubai",
    project: "Boulevard Crescent",
    price: "2,850,000",
    rentPrice: "180,000",
    pricePerSqft: "2,100",
    bedrooms: 3,
    bathrooms: 4,
    size: "1,357",
    type: "sale",
    image: "/images/luxury-apartment.jpg",
    featured: true,
    roi: "7.2%",
  },
  {
    id: 2,
    title: "Stunning 2BR with Marina View",
    location: "Dubai Marina",
    project: "Marina Promenade",
    price: "1,950,000",
    rentPrice: "120,000",
    pricePerSqft: "1,800",
    bedrooms: 2,
    bathrooms: 3,
    size: "1,083",
    type: "sale",
    image: "/images/dubai-marina.jpg",
    featured: true,
    roi: "6.8%",
  },
  {
    id: 3,
    title: "Premium 1BR in Business Bay",
    location: "Business Bay",
    project: "The Opus",
    price: "1,100,000",
    rentPrice: "95,000",
    pricePerSqft: "1,294",
    bedrooms: 1,
    bathrooms: 2,
    size: "850",
    type: "both",
    image: "/images/downtown-dubai.jpg",
    featured: false,
    roi: "8.6%",
  },
  {
    id: 4,
    title: "Elegant 4BR Penthouse",
    location: "Palm Jumeirah",
    project: "Atlantis The Royal",
    price: "15,500,000",
    rentPrice: "850,000",
    pricePerSqft: "3,500",
    bedrooms: 4,
    bathrooms: 5,
    size: "4,428",
    type: "sale",
    image: "/images/luxury-apartment.jpg",
    featured: true,
    roi: "5.5%",
  },
  {
    id: 5,
    title: "Modern 2BR with Burj View",
    location: "Downtown Dubai",
    project: "Address Sky View",
    price: "2,400,000",
    rentPrice: "145,000",
    pricePerSqft: "2,000",
    bedrooms: 2,
    bathrooms: 2,
    size: "1,200",
    type: "both",
    image: "/images/downtown-dubai.jpg",
    featured: false,
    roi: "6.0%",
  },
  {
    id: 6,
    title: "Spacious 3BR Villa",
    location: "Emirates Hills",
    project: "Emirates Hills Villas",
    price: "8,200,000",
    rentPrice: "450,000",
    pricePerSqft: "1,950",
    bedrooms: 3,
    bathrooms: 4,
    size: "4,205",
    type: "sale",
    image: "/images/dubai-marina.jpg",
    featured: false,
    roi: "5.4%",
  },
]

export function PropertiesSection() {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")
  const [favorites, setFavorites] = useState<number[]>([])
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

  const filteredProperties = activeTab === "all" 
    ? properties 
    : properties.filter(p => p.type === activeTab || p.type === "both")

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    )
  }

  return (
    <section ref={sectionRef} id="properties" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div 
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Premium Listings
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Properties for Sale & Rent
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg">
              Browse our curated collection of exclusive properties in Dubai's most 
              sought-after locations.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1.5 bg-card rounded-2xl border border-border shadow-sm">
            {[
              { key: "all", label: "All" },
              { key: "sale", label: "For Sale" },
              { key: "rent", label: "For Rent" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "all" | "sale" | "rent")}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <div 
              key={property.id} 
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Top Actions */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="flex gap-2">
                      <Badge className="bg-primary/90 backdrop-blur-sm text-white border-0 px-3 py-1">
                        {activeTab === "rent" || (activeTab === "all" && property.type === "both") 
                          ? "For Rent" 
                          : "For Sale"}
                      </Badge>
                      {property.featured && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${
                          favorites.includes(property.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-foreground"
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Bottom Price Tag */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {activeTab === "rent" || (activeTab === "all" && property.type === "both")
                            ? `${property.rentPrice} AED`
                            : `${property.price} AED`
                          }
                        </p>
                        <p className="text-white/70 text-sm">
                          {activeTab === "rent" ? "/year" : `${property.pricePerSqft} AED/sqft`}
                        </p>
                      </div>
                      {property.roi && activeTab !== "rent" && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm font-semibold">{property.roi} ROI</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <div className="p-1.5 rounded-lg bg-secondary/10">
                      <MapPin className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-sm truncate">{property.location} - {property.project}</span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-6 py-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Bed className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Bath className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Maximize className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{property.size} sqft</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold group/btn">
                      <Eye className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      View Details
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
            Browse All Properties
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
