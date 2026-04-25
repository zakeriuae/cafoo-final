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
import { AedSymbol } from "@/components/ui/aed-symbol"
import { buildSeoUrl } from "@/lib/seo-router"
import { PropertyCard } from "@/components/ui/property-card"

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
    areaSlug: "downtown-dubai",
    towerSlug: "boulevard-crescent",
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
    areaSlug: "dubai-marina",
    towerSlug: "marina-promenade",
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
    areaSlug: "business-bay",
    towerSlug: "the-opus",
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
    areaSlug: "palm-jumeirah",
    towerSlug: "atlantis-the-royal",
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
    areaSlug: "downtown-dubai",
    towerSlug: "address-sky-view",
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
    areaSlug: "emirates-hills",
    towerSlug: "emirates-hills-villas",
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
  areaSlug?: string
  towerSlug?: string
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
      <div className="container mx-auto">
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
          {filteredProperties.map((property, index) => {
            const propertyUrl = buildSeoUrl({
              transactionType: property.type === 'rent' ? 'for-rent' : 'for-sale',
              propertyType: 'property', // dummy data doesn't specify if it's villa or apartment explicitly except in title
              city: 'dubai',
              area: property.areaSlug || 'area',
              project: property.towerSlug || 'project',
              unit: property.slug
            }, locale);

            return (
              <PropertyCard
                key={property.id}
                property={property}
                locale={locale}
                content={content}
                propertyUrl={propertyUrl}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={(e) => {
                  e.preventDefault();
                  toggleFavorite(property.id);
                }}
                className={cn(
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
