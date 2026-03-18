"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Building2, Calendar } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [searchType, setSearchType] = useState<"buy" | "rent">("buy")

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dubai-skyline.jpg"
          alt="Dubai Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <p className="text-secondary font-medium mb-4 tracking-wider uppercase">
            Cafoo Real Estate Advisors
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Smart Choice,{" "}
            <span className="text-secondary">Pleasant Purchase</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
            Discover exclusive luxury properties in Dubai with years of expertise 
            in the UAE real estate market. Your trusted companion for buying, 
            selling, and investment.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-xl p-6 shadow-2xl max-w-2xl">
            {/* Search Type Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchType("buy")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  searchType === "buy"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSearchType("rent")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  searchType === "rent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Rent
              </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none cursor-pointer">
                  <option value="">Select Location</option>
                  <option value="downtown">Downtown Dubai</option>
                  <option value="marina">Dubai Marina</option>
                  <option value="palm">Palm Jumeirah</option>
                  <option value="business-bay">Business Bay</option>
                  <option value="jbr">JBR</option>
                </select>
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none cursor-pointer">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="office">Office</option>
                </select>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-auto py-3 text-base font-semibold">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            <div className="text-primary-foreground">
              <p className="text-3xl md:text-4xl font-bold">500+</p>
              <p className="text-primary-foreground/70">Properties Listed</p>
            </div>
            <div className="text-primary-foreground">
              <p className="text-3xl md:text-4xl font-bold">50+</p>
              <p className="text-primary-foreground/70">Premium Projects</p>
            </div>
            <div className="text-primary-foreground">
              <p className="text-3xl md:text-4xl font-bold">10+</p>
              <p className="text-primary-foreground/70">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
