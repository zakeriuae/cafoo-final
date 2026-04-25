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
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Eye,
  TrendingUp
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const properties = [
  {
    id: 1,
    title: { en: "Luxurious 3BR Apartment in Downtown", fa: "آپارتمان لوکس ۳ خوابه در داون‌تاون" },
    location: { en: "Downtown Dubai", fa: "داون‌تاون دبی" },
    project: "Boulevard Crescent",
    price: "2,850,000",
    rentPrice: "180,000",
    pricePerSqft: "2,100",
    bedrooms: 3,
    bathrooms: 4,
    size: "1,357",
    type: "sale",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: true,
    roi: "7.2%",
    slug: "luxurious-3br-apartment-downtown",
  },
  {
    id: 2,
    title: { en: "Stunning 2BR with Marina View", fa: "آپارتمان ۲ خوابه با چشم‌انداز مارینا" },
    location: { en: "Dubai Marina", fa: "دبی مارینا" },
    project: "Marina Promenade",
    price: "1,950,000",
    rentPrice: "120,000",
    pricePerSqft: "1,800",
    bedrooms: 2,
    bathrooms: 3,
    size: "1,083",
    type: "sale",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    featured: true,
    roi: "6.8%",
    slug: "stunning-2br-marina-view",
  },
  {
    id: 3,
    title: { en: "Premium 1BR in Business Bay", fa: "آپارتمان ممتاز ۱ خوابه در بیزینس بی" },
    location: { en: "Business Bay", fa: "بیزینس بی" },
    project: "The Opus",
    price: "1,100,000",
    rentPrice: "95,000",
    pricePerSqft: "1,294",
    bedrooms: 1,
    bathrooms: 2,
    size: "850",
    type: "rent",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    featured: false,
    roi: "8.6%",
    slug: "premium-1br-business-bay",
  },
  {
    id: 4,
    title: { en: "Elegant 4BR Penthouse", fa: "پنت‌هاوس مجلل ۴ خوابه" },
    location: { en: "Palm Jumeirah", fa: "پالم جمیرا" },
    project: "Atlantis The Royal",
    price: "15,500,000",
    rentPrice: "850,000",
    pricePerSqft: "3,500",
    bedrooms: 4,
    bathrooms: 5,
    size: "4,428",
    type: "sale",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    featured: true,
    roi: "5.5%",
    slug: "elegant-4br-penthouse",
  },
  {
    id: 5,
    title: { en: "Modern 2BR with Burj View", fa: "آپارتمان مدرن ۲ خوابه با نمای برج خلیفه" },
    location: { en: "Downtown Dubai", fa: "داون‌تاون دبی" },
    project: "Address Sky View",
    price: "2,400,000",
    rentPrice: "145,000",
    pricePerSqft: "2,000",
    bedrooms: 2,
    bathrooms: 2,
    size: "1,200",
    type: "both",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    featured: false,
    roi: "6.0%",
    slug: "modern-2br-burj-view",
  },
  {
    id: 6,
    title: { en: "Spacious 3BR Villa", fa: "ویلای وسیع ۳ خوابه" },
    location: { en: "Emirates Hills", fa: "امارات هیلز" },
    project: "Emirates Hills Villas",
    price: "8,200,000",
    rentPrice: "450,000",
    pricePerSqft: "1,950",
    bedrooms: 3,
    bathrooms: 4,
    size: "4,205",
    type: "rent",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    featured: false,
    roi: "5.4%",
    slug: "spacious-3br-villa",
  },
]

interface Property {
  id: string | number
  title: { en: string; fa: string }
  location: { en: string; fa: string }
  project: string
  developerLogo?: string
  developerName?: string
  price: string
  rentPrice: string
  pricePerSqft: string
  bedrooms: number
  bathrooms: number
  size: string
  type: string
  image: string
  featured: boolean
  roi: string
  slug: string
}

interface PropertiesSectionClientProps {
  initialProperties: Property[]
}

export default function PropertiesSectionClient({ initialProperties }: PropertiesSectionClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")
  const [favorites, setFavorites] = useState<(string | number)[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()

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

  const filteredProperties = activeTab === "all" 
    ? initialProperties 
    : initialProperties.filter(p => p.type === activeTab || p.type === "both")

  const toggleFavorite = (id: string | number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    )
  }

  const tabs = [
    { key: "all" as const, label: content.projects.filters.all },
    { key: "sale" as const, label: content.properties.tabs.sale },
    { key: "rent" as const, label: content.properties.tabs.rent },
  ]

  const getPropertyType = (property: Property) => {
    if (activeTab === "rent") return content.properties.tabs.rent
    if (activeTab === "sale") return content.properties.tabs.sale
    if (property.type === "rent") return content.properties.tabs.rent
    if (property.type === "sale") return content.properties.tabs.sale
    return content.properties.tabs.sale
  }

  return (
    <section ref={sectionRef} id="properties" className="py-24 bg-[#F0F7FF]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div 
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="max-w-2xl">
            <p className="text-secondary font-medium mb-3 text-sm tracking-wide">
              {content.properties.badge}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {content.properties.title} {content.properties.titleHighlight}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.properties.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-end gap-6">
            <Link href={`/${locale}/properties`}>
              <Button variant="outline" className="rounded-full px-6 h-11 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all gap-2 group font-bold">
                {content.properties.viewAll}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            {/* Tabs */}
            <div className="flex p-1 bg-muted/30 rounded-full border border-border/40">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  suppressHydrationWarning
                  className={cn(
                    "px-5 py-2 rounded-full font-medium text-sm transition-all duration-300",
                    activeTab === tab.key
                      ? "bg-primary text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <Link 
              key={property.id} 
              href={`/${locale}/properties/${property.slug}`}
              className={cn(
                "group transition-all duration-700 block",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title[locale as 'en' | 'fa']}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Top Actions */}
                  <div className="absolute top-4 inset-x-4 flex items-start justify-between z-10">
                    <Badge className={cn(
                      "backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold",
                      property.type === 'rent' ? "bg-blue-500/80" : "bg-green-500/80"
                    )}>
                      {getPropertyType(property)}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(property.id);
                      }}
                      className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 shadow-sm"
                    >
                      <Heart 
                        className={cn(
                          "h-4 w-4 transition-colors",
                          favorites.includes(property.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-foreground"
                        )} 
                      />
                    </button>
                  </div>

                  {/* Bottom Price Overlay */}
                  <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white tracking-tight" dir="ltr">
                        {content.common.aed} {activeTab === "rent" || property.type === "rent" ? property.rentPrice : property.price}
                      </p>
                      <p className="text-white/70 text-xs font-medium mt-0.5">
                        {activeTab === "rent" || property.type === "rent" 
                          ? content.properties.perYear 
                          : `${content.common.aed} ${property.pricePerSqft}/${content.properties.sqft}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  {/* Title */}
                  <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                    {property.title[locale as 'en' | 'fa']}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
                    <MapPin className="h-4 w-4 text-muted-foreground/60" />
                    <span className="text-sm font-medium">
                      {property.location[locale as 'en' | 'fa']}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-6 pb-6 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-primary/70" />
                      <span className="text-sm font-semibold text-foreground/80">
                        {property.bedrooms} {content.properties.beds}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-primary/70" />
                      <span className="text-sm font-semibold text-foreground/80">
                        {property.bathrooms} {content.properties.baths}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="h-4 w-4 text-primary/70" />
                      <span className="text-sm font-semibold text-foreground/80" dir="ltr">
                        {property.size} {content.properties.sqft}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Info & Link */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      {getDeveloperLogo(property.developerName || property.project, property.developerLogo) ? (
                        <div className="relative h-20 w-48 -my-6">
                          <Image
                            src={getDeveloperLogo(property.developerName || property.project, property.developerLogo)!}
                            alt={property.developerName || property.project}
                            fill
                            className="object-contain object-left filter grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground font-medium">
                          by <span className="text-foreground/80">{property.developerName || property.project || "Developer"}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                      {content.properties.viewDetails}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
