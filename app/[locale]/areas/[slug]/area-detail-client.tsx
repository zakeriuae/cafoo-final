"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Building, 
  Home, 
  TrendingUp, 
  Phone, 
  MessageCircle, 
  Bed, 
  Bath, 
  Maximize,
  ArrowLeft,
  ArrowRight 
} from "lucide-react"
import { useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Area {
  id: string
  name: string
  name_fa: string | null
  slug: string
  short_description: string | null
  short_description_fa: string | null
  full_description: string | null
  full_description_fa: string | null
  cover_image_url: string | null
  gallery: string[] | null
  total_properties: number
  average_price: number | null
  price_growth_percent: number | null
  location_highlights: string[] | null
  location_highlights_fa: string[] | null
  assigned_agent: {
    id: string
    name: string
    name_fa: string | null
    avatar_url: string | null
    phone: string | null
    whatsapp: string | null
    title: string | null
    title_fa: string | null
  } | null
}

interface Property {
  id: string
  title: string
  title_fa: string | null
  slug: string
  cover_image_url: string | null
  price: number
  bedrooms: number | null
  bathrooms: number | null
  size: number | null
  listing_type: string
  property_type: string
}

interface Tower {
  id: string
  name: string
  name_fa: string | null
  slug: string
  cover_image_url: string | null
  starting_price: number | null
  total_units: number | null
}

interface AreaDetailClientProps {
  area: Area
  properties: Property[]
  towers: Tower[]
  locale: string
}

export function AreaDetailClient({ area, properties, towers, locale }: AreaDetailClientProps) {
  const content = useContent()
  const isRtl = locale === 'fa'
  
  const areaName = locale === 'fa' && area.name_fa ? area.name_fa : area.name
  const areaDesc = locale === 'fa' && area.full_description_fa ? area.full_description_fa : area.full_description
  const highlights = locale === 'fa' && area.location_highlights_fa ? area.location_highlights_fa : area.location_highlights

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat('en-US').format(price)
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={area.cover_image_url || "/images/placeholder.jpg"}
          alt={areaName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <Link href={`/${locale}/areas`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {locale === 'fa' ? 'بازگشت به مناطق' : 'Back to Areas'}
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{areaName}</h1>
          
          <div className="flex flex-wrap items-center gap-4">
            {area.price_growth_percent && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-bold">+{area.price_growth_percent}% {content.areas.growth}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Home className="h-5 w-5 text-white" />
              <span className="text-white">{area.total_properties}+ {content.areas.properties}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Building className="h-5 w-5 text-white" />
              <span className="text-white" dir="ltr">{formatPrice(area.average_price)} AED {content.areas.avgPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {areaDesc && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'درباره منطقه' : 'About the Area'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {areaDesc}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'ویژگی‌های منطقه' : 'Location Highlights'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="px-4 py-2 text-sm">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Properties */}
            {properties.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {locale === 'fa' ? 'املاک در این منطقه' : 'Properties in this Area'}
                  </h2>
                  <Link href={`/${locale}/properties?area=${area.slug}`}>
                    <Button variant="outline">
                      {content.common.viewAll}
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {properties.slice(0, 4).map((property) => {
                    const propTitle = locale === 'fa' && property.title_fa ? property.title_fa : property.title
                    return (
                      <Link key={property.id} href={`/${locale}/properties/${property.slug}`}>
                        <Card className="group overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative h-48">
                            <Image
                              src={property.cover_image_url || "/images/placeholder.jpg"}
                              alt={propTitle}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-3 left-3">
                              {property.listing_type}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                              {propTitle}
                            </h3>
                            <p className="text-lg font-bold text-primary mb-3" dir="ltr">
                              AED {formatPrice(property.price)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {property.bedrooms && (
                                <span className="flex items-center gap-1">
                                  <Bed className="h-4 w-4" />
                                  {property.bedrooms}
                                </span>
                              )}
                              {property.bathrooms && (
                                <span className="flex items-center gap-1">
                                  <Bath className="h-4 w-4" />
                                  {property.bathrooms}
                                </span>
                              )}
                              {property.size && (
                                <span className="flex items-center gap-1">
                                  <Maximize className="h-4 w-4" />
                                  {property.size} sqft
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Towers */}
            {towers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {locale === 'fa' ? 'برج‌ها و پروژه‌ها' : 'Towers & Projects'}
                  </h2>
                  <Link href={`/${locale}/towers?area=${area.slug}`}>
                    <Button variant="outline">
                      {content.common.viewAll}
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {towers.map((tower) => {
                    const towerName = locale === 'fa' && tower.name_fa ? tower.name_fa : tower.name
                    return (
                      <Link key={tower.id} href={`/${locale}/towers/${tower.slug}`}>
                        <Card className="group overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative h-40">
                            <Image
                              src={tower.cover_image_url || "/images/placeholder.jpg"}
                              alt={towerName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {towerName}
                            </h3>
                            {tower.starting_price && (
                              <p className="text-sm text-muted-foreground" dir="ltr">
                                From AED {formatPrice(tower.starting_price)}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Agent */}
          <div className="lg:col-span-1">
            {area.assigned_agent && (
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">
                    {locale === 'fa' ? 'مشاور منطقه' : 'Area Specialist'}
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={area.assigned_agent.avatar_url || "/images/placeholder-agent.jpg"}
                        alt={locale === 'fa' && area.assigned_agent.name_fa ? area.assigned_agent.name_fa : area.assigned_agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {locale === 'fa' && area.assigned_agent.name_fa ? area.assigned_agent.name_fa : area.assigned_agent.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'fa' && area.assigned_agent.title_fa ? area.assigned_agent.title_fa : area.assigned_agent.title}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {area.assigned_agent.phone && (
                      <Button className="w-full" variant="outline" asChild>
                        <a href={`tel:${area.assigned_agent.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {content.agents.contact}
                        </a>
                      </Button>
                    )}
                    {area.assigned_agent.whatsapp && (
                      <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
                        <a href={`https://wa.me/${area.assigned_agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
