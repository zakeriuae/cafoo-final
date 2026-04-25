"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Building2, 
  Home, 
  Phone, 
  MessageCircle, 
  Mail,
  Bed, 
  Bath, 
  Maximize,
  ArrowLeft,
  ArrowRight,
  Check,
  Share2,
  Heart,
  Calendar
} from "lucide-react"
import { useContent } from "@/lib/i18n"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"

interface Property {
  id: string
  title: string
  title_fa: string | null
  slug: string
  description: string | null
  description_fa: string | null
  cover_image_url: string | null
  gallery: string[] | null
  price: number
  bedrooms: number | null
  bathrooms: number | null
  size: number | null
  listing_type: string
  property_type: string
  features: string[] | null
  features_fa: string[] | null
  furnishing: string | null
  completion_date: string | null
  area: { id: string; name: string; name_fa: string | null; slug: string } | null
  tower: { id: string; name: string; name_fa: string | null; slug: string } | null
  developer: { id: string; name: string; name_fa: string | null; logo_url: string | null } | null
  assigned_agent: {
    id: string
    name: string
    name_fa: string | null
    slug: string
    title: string | null
    title_fa: string | null
    avatar_url: string | null
    phone: string | null
    whatsapp: string | null
    email: string | null
  } | null
}

interface SimilarProperty {
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
}

interface PropertyDetailClientProps {
  property: Property
  similarProperties: SimilarProperty[]
  locale: string
}

export function PropertyDetailClient({ property, similarProperties, locale }: PropertyDetailClientProps) {
  const content = useContent()
  const isRtl = locale === 'fa'
  const [activeImage, setActiveImage] = useState(0)
  
  const propTitle = locale === 'fa' && property.title_fa ? property.title_fa : property.title
  const propDesc = locale === 'fa' && property.description_fa ? property.description_fa : property.description
  const features = locale === 'fa' && property.features_fa ? property.features_fa : property.features
  const areaName = property.area 
    ? (locale === 'fa' && property.area.name_fa ? property.area.name_fa : property.area.name)
    : null
  const towerName = property.tower
    ? (locale === 'fa' && property.tower.name_fa ? property.tower.name_fa : property.tower.name)
    : null

  const allImages = [property.cover_image_url, ...(property.gallery || [])].filter(Boolean) as string[]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  const listingTypeLabels: Record<string, string> = {
    sale: locale === 'fa' ? 'فروش' : 'For Sale',
    rent: locale === 'fa' ? 'اجاره' : 'For Rent',
    off_plan: locale === 'fa' ? 'پیش‌فروش' : 'Off Plan',
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: locale === 'fa' ? 'آپارتمان' : 'Apartment',
    villa: locale === 'fa' ? 'ویلا' : 'Villa',
    townhouse: locale === 'fa' ? 'تاون‌هاوس' : 'Townhouse',
    penthouse: locale === 'fa' ? 'پنت‌هاوس' : 'Penthouse',
    studio: locale === 'fa' ? 'استودیو' : 'Studio',
  }

  return (
    <div>
      {/* Image Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-muted">
        <Image
          src={allImages[activeImage] || "/images/placeholder.jpg"}
          alt={propTitle}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Link href={`/${locale}/properties`}>
            <Button variant="secondary" className="gap-2">
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {locale === 'fa' ? 'بازگشت' : 'Back'}
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Thumbnails */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {allImages.slice(0, 5).map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all",
                  activeImage === index ? "border-white" : "border-white/50 opacity-70"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
            {allImages.length > 5 && (
              <div className="w-16 h-12 md:w-20 md:h-14 rounded-lg bg-black/50 flex items-center justify-center text-white text-sm">
                +{allImages.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary text-lg px-4 py-1">
                  {listingTypeLabels[property.listing_type]}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {propertyTypeLabels[property.property_type] || property.property_type}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{propTitle}</h1>
              
              {/* Location */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                {areaName && (
                  <Link href={`/${locale}/areas/${property.area?.slug}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MapPin className="h-5 w-5" />
                    {areaName}
                  </Link>
                )}
                {towerName && (
                  <Link href={`/${locale}/towers/${property.tower?.slug}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Building2 className="h-5 w-5" />
                    {towerName}
                  </Link>
                )}
              </div>

              {/* Price */}
              <div className="bg-primary/5 rounded-2xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'fa' ? 'قیمت' : 'Price'}
                </p>
                <p className="text-4xl font-bold text-primary" dir="ltr">
                  <AedSymbol size={32} className="mr-1 -mt-1" /> {formatPrice(property.price)}
                  {property.listing_type === 'rent' && (
                    <span className="text-lg font-normal text-muted-foreground">/year</span>
                  )}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms !== null && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-bold text-lg">
                        {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'fa' ? 'اتاق خواب' : 'Bedrooms'}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {property.bathrooms && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-bold text-lg">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'fa' ? 'حمام' : 'Bathrooms'}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {property.size && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Maximize className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-bold text-lg" dir="ltr">{property.size}</p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'fa' ? 'فوت مربع' : 'Sq.Ft'}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {property.furnishing && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-bold text-lg capitalize">{property.furnishing}</p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'fa' ? 'وضعیت مبلمان' : 'Furnishing'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Description */}
            {propDesc && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'توضیحات' : 'Description'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {propDesc}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'امکانات و ویژگی‌ها' : 'Features & Amenities'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Developer */}
            {property.developer && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'سازنده' : 'Developer'}
                  </h2>
                  <div className="flex items-center gap-4">
                    {property.developer.logo_url && (
                      <div className="relative w-20 h-20">
                        <Image
                          src={property.developer.logo_url}
                          alt={property.developer.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-lg">
                        {locale === 'fa' && property.developer.name_fa 
                          ? property.developer.name_fa 
                          : property.developer.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {locale === 'fa' ? 'املاک مشابه' : 'Similar Properties'}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {similarProperties.map((prop) => {
                    const title = locale === 'fa' && prop.title_fa ? prop.title_fa : prop.title
                    return (
                      <Link key={prop.id} href={`/${locale}/properties/${prop.slug}`}>
                        <Card className="group overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative h-40">
                            <Image
                              src={prop.cover_image_url || "/images/placeholder.jpg"}
                              alt={title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-2 left-2">
                              {listingTypeLabels[prop.listing_type]}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                              {title}
                            </h3>
                            <p className="text-lg font-bold text-primary" dir="ltr">
                              <AedSymbol size={16} className="mr-1 -mt-0.5" /> {formatPrice(prop.price)}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Agent Card */}
              {property.assigned_agent && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">
                      {locale === 'fa' ? 'مشاور ملک' : 'Property Agent'}
                    </h3>
                    <Link href={`/${locale}/agents/${property.assigned_agent.slug}`}>
                      <div className="flex items-center gap-4 mb-6 group">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={property.assigned_agent.avatar_url || "/images/placeholder-agent.jpg"}
                            alt={locale === 'fa' && property.assigned_agent.name_fa 
                              ? property.assigned_agent.name_fa 
                              : property.assigned_agent.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {locale === 'fa' && property.assigned_agent.name_fa 
                              ? property.assigned_agent.name_fa 
                              : property.assigned_agent.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'fa' && property.assigned_agent.title_fa 
                              ? property.assigned_agent.title_fa 
                              : property.assigned_agent.title}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="space-y-3">
                      {property.assigned_agent.phone && (
                        <Button className="w-full" variant="outline" asChild>
                          <a href={`tel:${property.assigned_agent.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            {content.agents.contact}
                          </a>
                        </Button>
                      )}
                      {property.assigned_agent.whatsapp && (
                        <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
                          <a href={`https://wa.me/${property.assigned_agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                      {property.assigned_agent.email && (
                        <Button className="w-full" variant="secondary" asChild>
                          <a href={`mailto:${property.assigned_agent.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            {locale === 'fa' ? 'ایمیل' : 'Email'}
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">
                    {locale === 'fa' ? 'اطلاعات سریع' : 'Quick Info'}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{locale === 'fa' ? 'نوع آگهی' : 'Listing Type'}</span>
                      <span className="font-medium">{listingTypeLabels[property.listing_type]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{locale === 'fa' ? 'نوع ملک' : 'Property Type'}</span>
                      <span className="font-medium capitalize">{propertyTypeLabels[property.property_type] || property.property_type}</span>
                    </div>
                    {property.furnishing && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{locale === 'fa' ? 'مبلمان' : 'Furnishing'}</span>
                        <span className="font-medium capitalize">{property.furnishing}</span>
                      </div>
                    )}
                    {property.completion_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{locale === 'fa' ? 'تحویل' : 'Completion'}</span>
                        <span className="font-medium">{property.completion_date}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Viewing */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-10 w-10 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">
                    {locale === 'fa' ? 'درخواست بازدید' : 'Schedule a Viewing'}
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    {locale === 'fa' 
                      ? 'با ما تماس بگیرید تا بازدید ترتیب دهیم'
                      : 'Contact us to arrange a property viewing'
                    }
                  </p>
                  <Button variant="secondary" className="w-full">
                    {locale === 'fa' ? 'رزرو بازدید' : 'Book Now'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
