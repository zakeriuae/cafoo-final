"use client"

import Image from "next/image"
import Link from "next/link"
import { PropertyCard } from "@/components/ui/property-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Home, 
  Search, 
  Bed, 
  Bath, 
  Maximize, 
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List
} from "lucide-react"
import { useState } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { buildSeoUrl } from "@/lib/seo-router"

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
  featured: boolean
  area: { name: string; name_fa: string | null; slug: string } | null
  tower: { name: string; name_fa: string | null } | null
}

interface Area {
  id: string
  name: string
  name_fa: string | null
  slug: string
}

interface PropertiesListClientProps {
  properties: Property[]
  areas: Area[]
  initialFilters: {
    area?: string
    type?: string
    listing?: string
    bedrooms?: string
  }
}

export function PropertiesListClient({ properties, areas, initialFilters }: PropertiesListClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [listingType, setListingType] = useState(initialFilters.listing || "all")
  const [propertyType, setPropertyType] = useState(initialFilters.type || "all")
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || "all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { isRtl, locale } = useI18n()
  const content = useContent()

  const filteredProperties = properties.filter(property => {
    const title = locale === 'fa' && property.title_fa ? property.title_fa : property.title
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesListing = listingType === "all" || property.listing_type === listingType
    const matchesType = propertyType === "all" || property.property_type === propertyType
    const matchesBedrooms = bedrooms === "all" || property.bedrooms?.toString() === bedrooms
    
    return matchesSearch && matchesListing && matchesType && matchesBedrooms
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  const listingTypeLabels: Record<string, string> = {
    sale: locale === 'fa' ? 'فروش' : 'For Sale',
    rent: locale === 'fa' ? 'اجاره' : 'For Rent',
    off_plan: locale === 'fa' ? 'پیش‌فروش' : 'Off Plan',
  }

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Home className="w-4 h-4" />
          {content.properties.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {content.properties.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {content.properties.subtitle}
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={locale === 'fa' ? "جستجوی ملک..." : "Search properties..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Listing Type */}
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={locale === 'fa' ? 'نوع آگهی' : 'Listing Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'fa' ? 'همه' : 'All Types'}</SelectItem>
                <SelectItem value="sale">{locale === 'fa' ? 'فروش' : 'For Sale'}</SelectItem>
                <SelectItem value="rent">{locale === 'fa' ? 'اجاره' : 'For Rent'}</SelectItem>
                <SelectItem value="off_plan">{locale === 'fa' ? 'پیش‌فروش' : 'Off Plan'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Type */}
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={locale === 'fa' ? 'نوع ملک' : 'Property Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'fa' ? 'همه' : 'All Properties'}</SelectItem>
                <SelectItem value="apartment">{locale === 'fa' ? 'آپارتمان' : 'Apartment'}</SelectItem>
                <SelectItem value="villa">{locale === 'fa' ? 'ویلا' : 'Villa'}</SelectItem>
                <SelectItem value="townhouse">{locale === 'fa' ? 'تاون‌هاوس' : 'Townhouse'}</SelectItem>
                <SelectItem value="penthouse">{locale === 'fa' ? 'پنت‌هاوس' : 'Penthouse'}</SelectItem>
                <SelectItem value="studio">{locale === 'fa' ? 'استودیو' : 'Studio'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Bedrooms */}
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={locale === 'fa' ? 'اتاق خواب' : 'Bedrooms'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'fa' ? 'همه' : 'Any'}</SelectItem>
                <SelectItem value="0">{locale === 'fa' ? 'استودیو' : 'Studio'}</SelectItem>
                <SelectItem value="1">1 {locale === 'fa' ? 'خوابه' : 'BR'}</SelectItem>
                <SelectItem value="2">2 {locale === 'fa' ? 'خوابه' : 'BR'}</SelectItem>
                <SelectItem value="3">3 {locale === 'fa' ? 'خوابه' : 'BR'}</SelectItem>
                <SelectItem value="4">4+ {locale === 'fa' ? 'خوابه' : 'BR'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {locale === 'fa' 
            ? `${filteredProperties.length} ملک یافت شد`
            : `${filteredProperties.length} properties found`
          }
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {filteredProperties.map((property) => {
          const propTitle = locale === 'fa' && property.title_fa ? property.title_fa : property.title
          const areaName = property.area 
            ? (locale === 'fa' && property.area.name_fa ? property.area.name_fa : property.area.name)
            : null
          const propertyUrl = buildSeoUrl({
            transactionType: property.listing_type === 'rent' ? 'for-rent' : 'for-sale',
            propertyType: property.property_type || 'property',
            city: 'dubai',
            area: property.area?.slug || 'area',
            project: property.tower?.slug || 'project',
            unit: property.slug
          }, locale);

          return (
            <PropertyCard 
              key={property.id}
              property={property}
              locale={locale}
              content={content}
              propertyUrl={propertyUrl}
              viewMode={viewMode}
            />
          )
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16">
          <Home className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">
            {locale === 'fa' ? "ملکی یافت نشد" : "No properties found"}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            {locale === 'fa' ? "فیلترها را تغییر دهید" : "Try adjusting your filters"}
          </p>
        </div>
      )}
    </div>
  )
}
