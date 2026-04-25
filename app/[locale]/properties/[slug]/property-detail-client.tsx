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
  Calendar,
  Layers,
  FileText,
  Clock,
  Compass,
  Info,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ShieldCheck
} from "lucide-react"
import { useContent, useI18n } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { PropertyCard } from "@/components/ui/property-card"

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
  created_at?: string
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
  const { isRtl } = useI18n()
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
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
    <div className="bg-[#f7f7f7] min-h-screen pb-20 md:pb-0">
      
      {/* 1. Breadcrumbs - Bayut Style */}
      <div className="bg-white py-3">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'خانه' : 'Home'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Link href={`/${locale}/properties`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'املاک دبی' : 'Dubai Properties'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {areaName && (
              <>
                <Link href={`/${locale}/for-sale/property/dubai/${property.area?.slug}`} className="hover:text-primary transition-colors no-underline">{areaName}</Link>
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </>
            )}
            {towerName && (
              <>
                <Link href={`/${locale}/for-sale/property/dubai/${property.area?.slug}/${property.tower?.slug}`} className="hover:text-primary transition-colors no-underline">{towerName}</Link>
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </>
            )}
            <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{propTitle}</span>
          </nav>
        </div>
      </div>

      {/* 2. Enhanced Gallery - Bayut Style */}
      <div className="bg-white">
        <div className="container mx-auto py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[400px] md:h-[500px] lg:h-[600px]">
            {/* Main Image (Large) */}
            <div className="lg:col-span-8 relative group overflow-hidden md:rounded-2xl shadow-sm">
              <Image
                src={allImages[activeImage] || "/images/placeholder.jpg"}
                alt={propTitle}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/5" />
              
              <div className="absolute top-4 start-4 flex gap-2">
                <Badge className="bg-primary/90 text-white border-0 px-4 py-1.5 rounded-lg shadow-lg backdrop-blur-md">
                  {listingTypeLabels[property.listing_type]}
                </Badge>
                {property.featured && (
                  <Badge className="bg-secondary/90 text-white border-0 px-4 py-1.5 rounded-lg shadow-lg backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 me-1.5" />
                    {locale === 'fa' ? 'ویژه' : 'Verified'}
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-4 end-4 flex gap-2 z-10">
                <Button variant="secondary" className="bg-white/90 backdrop-blur-sm rounded-lg border-0 shadow-lg gap-2 h-10 px-4 font-bold text-slate-900 hover:bg-white transition-all">
                  <Share2 className="h-4 w-4" />
                  {locale === 'fa' ? 'اشتراک' : 'Share'}
                </Button>
                <Button 
                  variant="secondary" 
                  className={cn(
                    "bg-white/90 backdrop-blur-sm rounded-lg border-0 shadow-lg gap-2 h-10 px-4 font-bold transition-all hover:bg-white",
                    isFavorite ? "text-red-500" : "text-slate-900"
                  )}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500")} />
                  {locale === 'fa' ? 'ذخیره' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Side Grid Images */}
            <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-4 h-full">
              <div className="relative overflow-hidden rounded-2xl group shadow-sm">
                <Image
                  src={allImages[(activeImage + 1) % allImages.length] || allImages[0]}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button onClick={() => setActiveImage((activeImage + 1) % allImages.length)} className="absolute inset-0 hover:bg-black/10 transition-colors" />
              </div>
              <div className="relative overflow-hidden rounded-2xl group shadow-sm">
                <Image
                  src={allImages[(activeImage + 2) % allImages.length] || allImages[0]}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px] cursor-pointer hover:bg-black/50 transition-all">
                   <span className="text-3xl font-black">{allImages.length}+</span>
                   <span className="font-bold text-sm uppercase tracking-widest">{locale === 'fa' ? 'عکس ها' : 'Photos'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 3.1 Header Info Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center justify-between">
                  <p className="text-3xl md:text-5xl font-black text-slate-900 flex items-center gap-2" dir="ltr">
                    <AedSymbol size={36} className="text-primary" /> {formatPrice(property.price)}
                    {property.listing_type === 'rent' && <span className="text-xl text-slate-400 font-medium lowercase">/ year</span>}
                  </p>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                  {propTitle}
                </h1>

                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-5 w-5 text-primary/70" />
                  <span className="text-lg font-medium">{areaName}{towerName ? `, ${towerName}` : ''}, Dubai</span>
                </div>
              </div>

              {/* Specs Bar - Bayut Icon Style */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Bed className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 leading-none">{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase mt-1">{locale === 'fa' ? 'خواب' : 'Beds'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-x border-slate-100 px-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Bath className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 leading-none">{property.bathrooms}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase mt-1">{locale === 'fa' ? 'حمام' : 'Baths'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Maximize className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 leading-none" dir="ltr">{formatPrice(property.size || 0)}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase mt-1">{locale === 'fa' ? 'متراژ' : 'Sq. Ft.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.2 Property Details Grid - Bayut Table Style */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                {locale === 'fa' ? 'مشخصات کامل ملک' : 'Property Details'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                {[
                  { label: locale === 'fa' ? 'نوع آگهی' : 'Listing Type', value: listingTypeLabels[property.listing_type] },
                  { label: locale === 'fa' ? 'نوع ملک' : 'Property Type', value: propertyTypeLabels[property.property_type] || property.property_type },
                  { label: locale === 'fa' ? 'شناسه آگهی' : 'Reference No.', value: property.id.slice(0, 8).toUpperCase() },
                  { label: locale === 'fa' ? 'وضعیت مبلمان' : 'Furnishing Status', value: property.furnishing || (locale === 'fa' ? 'نامشخص' : 'Not Specified') },
                  { label: locale === 'fa' ? 'تاریخ ثبت' : 'Posted on', value: property.created_at ? new Date(property.created_at).toLocaleDateString() : '-' },
                  { label: locale === 'fa' ? 'زمان تحویل' : 'Completion Status', value: property.completion_date || (locale === 'fa' ? 'آماده تحویل' : 'Ready to Move') },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-50">
                    <span className="text-slate-500 font-medium text-sm">{item.label}</span>
                    <span className="text-slate-900 font-bold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3.3 Description Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {locale === 'fa' ? 'توضیحات تکمیلی' : 'Description'}
              </h3>
              <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {propDesc}
              </div>
            </div>

            {/* 3.4 Amenities - Modern Icon Grid */}
            {features && features.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  {locale === 'fa' ? 'امکانات و ویژگی‌ها' : 'Amenities & Features'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-all group">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary transition-all">
                        <Check className="h-4 w-4 text-primary group-hover:text-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (4 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              {/* 4. Agent Card - Bayut Sidebar Style */}
              {property.assigned_agent && (
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-50">
                        <Image
                          src={property.assigned_agent.avatar_url || "/images/placeholder-agent.jpg"}
                          alt={property.assigned_agent.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 leading-none">
                          {locale === 'fa' && property.assigned_agent.name_fa ? property.assigned_agent.name_fa : property.assigned_agent.name}
                        </h4>
                        <p className="text-primary font-bold text-xs uppercase tracking-widest mt-2">
                          {locale === 'fa' && property.assigned_agent.title_fa ? property.assigned_agent.title_fa : property.assigned_agent.title}
                        </p>
                        {property.developer && (
                          <div className="mt-2 flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase">
                            <Building2 className="h-3 w-3" />
                            {property.developer.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg gap-3 shadow-lg shadow-slate-200" asChild>
                        <a href={`tel:${property.assigned_agent.phone}`}>
                          <Phone className="h-5 w-5" />
                          {locale === 'fa' ? 'تماس تلفنی' : 'Call'}
                        </a>
                      </Button>
                      <Button className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-black text-lg gap-3 shadow-lg shadow-green-100" asChild>
                        <a href={`https://wa.me/${property.assigned_agent.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-6 w-6" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-900 font-bold text-lg gap-3 hover:bg-slate-50 transition-all" variant="outline" asChild>
                        <a href={`mailto:${property.assigned_agent.email}`}>
                          <Mail className="h-5 w-5 text-primary" />
                          {locale === 'fa' ? 'ارسال ایمیل' : 'Email'}
                        </a>
                      </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                         {locale === 'fa' ? 'درخواست بازدید' : 'Inquire Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Related Links Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h4 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  {locale === 'fa' ? 'پیوندهای مفید' : 'Nearby & More'}
                </h4>
                <div className="space-y-3">
                  {property.area && (
                    <Link href={`/${locale}/areas/${property.area.slug}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 group transition-all">
                      <span className="font-bold text-slate-600 group-hover:text-primary transition-colors text-sm">{areaName} Properties</span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </Link>
                  )}
                  {property.tower && (
                    <Link href={`/${locale}/towers/${property.tower.slug}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 group transition-all">
                      <span className="font-bold text-slate-600 group-hover:text-primary transition-colors text-sm">{towerName} Units</span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </Link>
                  )}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{locale === 'fa' ? 'خدمات ما' : 'Our Services'}</p>
                    <p className="text-slate-600 text-sm leading-tight">{locale === 'fa' ? 'مشاوره رایگان برای خرید ملک در دبی' : 'Free consultation for property investment in Dubai'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-none">
                  {locale === 'fa' ? 'املاک مشابه' : 'Similar Listings'}
                </h2>
                <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest">{locale === 'fa' ? 'شاید این موارد را بپسندید' : 'You might also be interested in these'}</p>
              </div>
              <Link href={`/${locale}/properties`}>
                <Button className="rounded-full bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all h-12 px-8 font-black gap-2">
                  {locale === 'fa' ? 'مشاهده همه' : 'View All Properties'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((prop) => {
                const mappedProp = {
                  ...prop,
                  title: { en: prop.title, fa: prop.title_fa || prop.title },
                  image: prop.cover_image_url,
                  type: prop.listing_type,
                  location: { en: areaName || 'Dubai', fa: areaName || 'دبی' }
                };
                return (
                  <PropertyCard 
                    key={prop.id}
                    property={mappedProp}
                    locale={locale}
                    content={content}
                    propertyUrl={`/${locale}/properties/${prop.slug}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. Mobile Contact Bar - Bayut Style */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-2">
           <Button className="h-12 bg-slate-900 rounded-xl" asChild>
             <a href={`tel:${property.assigned_agent?.phone}`}><Phone className="h-5 w-5" /></a>
           </Button>
           <Button className="h-12 bg-[#25D366] rounded-xl" asChild>
             <a href={`https://wa.me/${property.assigned_agent?.whatsapp?.replace(/\D/g, '')}`}><MessageCircle className="h-5 w-5" /></a>
           </Button>
           <Button className="h-12 bg-primary rounded-xl font-black uppercase text-xs">
             {locale === 'fa' ? 'پیام' : 'Email'}
           </Button>
        </div>
      </div>
    </div>
  )
}
