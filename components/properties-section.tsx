"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart, 
  ArrowRight,
  MessageCircle,
  Eye
} from "lucide-react"
import { useState } from "react"

const properties = [
  {
    id: 1,
    title: "Luxurious 3BR Apartment in Downtown",
    location: "Downtown Dubai",
    project: "Boulevard Crescent",
    price: "2,850,000 AED",
    pricePerSqft: "2,100 AED/sqft",
    bedrooms: 3,
    bathrooms: 4,
    size: "1,357",
    type: "Sale",
    image: "/images/luxury-apartment.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Stunning 2BR with Marina View",
    location: "Dubai Marina",
    project: "Marina Promenade",
    price: "1,950,000 AED",
    pricePerSqft: "1,800 AED/sqft",
    bedrooms: 2,
    bathrooms: 3,
    size: "1,083",
    type: "Sale",
    image: "/images/dubai-marina.jpg",
    featured: true,
  },
  {
    id: 3,
    title: "Premium 1BR in Business Bay",
    location: "Business Bay",
    project: "The Opus",
    price: "95,000 AED/year",
    pricePerSqft: "",
    bedrooms: 1,
    bathrooms: 2,
    size: "850",
    type: "Rent",
    image: "/images/downtown-dubai.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Elegant 4BR Penthouse",
    location: "Palm Jumeirah",
    project: "Atlantis The Royal",
    price: "15,500,000 AED",
    pricePerSqft: "3,500 AED/sqft",
    bedrooms: 4,
    bathrooms: 5,
    size: "4,428",
    type: "Sale",
    image: "/images/luxury-apartment.jpg",
    featured: true,
  },
  {
    id: 5,
    title: "Modern 2BR with Burj View",
    location: "Downtown Dubai",
    project: "Address Sky View",
    price: "145,000 AED/year",
    pricePerSqft: "",
    bedrooms: 2,
    bathrooms: 2,
    size: "1,200",
    type: "Rent",
    image: "/images/downtown-dubai.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Spacious 3BR Villa",
    location: "Emirates Hills",
    project: "Emirates Hills Villas",
    price: "8,200,000 AED",
    pricePerSqft: "1,950 AED/sqft",
    bedrooms: 3,
    bathrooms: 4,
    size: "4,205",
    type: "Sale",
    image: "/images/dubai-marina.jpg",
    featured: false,
  },
]

export function PropertiesSection() {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredProperties = activeTab === "all" 
    ? properties 
    : properties.filter(p => p.type.toLowerCase() === activeTab)

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    )
  }

  return (
    <section id="properties" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-secondary font-medium mb-2 tracking-wider uppercase">
              Premium Listings
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Properties for Sale & Rent
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Browse our curated collection of exclusive properties in Dubai's most 
              sought-after locations.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            {[
              { key: "all", label: "All Properties" },
              { key: "sale", label: "For Sale" },
              { key: "rent", label: "For Rent" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "all" | "sale" | "rent")}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow"
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
          {filteredProperties.map((property) => (
            <Card key={property.id} className="group overflow-hidden border border-border hover:border-secondary/50 shadow-sm hover:shadow-xl transition-all duration-300 bg-card">
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Badges & Actions */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge className={`${property.type === "Sale" ? "bg-primary" : "bg-secondary"} text-white`}>
                      For {property.type}
                    </Badge>
                    {property.featured && (
                      <Badge className="bg-amber-500 text-white">Featured</Badge>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
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

                {/* Quick View */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm" className="w-full bg-white/90 hover:bg-white text-foreground">
                    <Eye className="mr-2 h-4 w-4" />
                    Quick View
                  </Button>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <div className="space-y-3">
                  {/* Price */}
                  <div className="flex items-baseline justify-between">
                    <p className="text-xl font-bold text-primary">{property.price}</p>
                    {property.pricePerSqft && (
                      <p className="text-sm text-muted-foreground">{property.pricePerSqft}</p>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
                    <span className="text-sm truncate">{property.location} - {property.project}</span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border text-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-secondary" />
                      <span className="text-sm">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-secondary" />
                      <span className="text-sm">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4 text-secondary" />
                      <span className="text-sm">{property.size} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Details
                  </Button>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Browse All Properties
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
