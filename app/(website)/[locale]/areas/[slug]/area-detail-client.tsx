"use client"

import { SmartImage } from "@/components/ui/smart-image"
import { GalleryLightbox } from "@/components/ui/gallery-lightbox"
import { useAuthAction } from "@/hooks/use-auth-action"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MapPin,
  Building2,
  Phone,
  MessageCircle,
  Maximize,
  ArrowRight,
  ArrowUpRight,
  Check,
  Share2,
  Heart,
  Calendar,
  Layers,
  FileText,
  Clock,
  Compass,
  Download,
  ShieldCheck,
  Briefcase,
  Waves,
  Dumbbell,
  Car,
  Wind,
  Layout,
  Info,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Link as LinkIcon,
  Home,
  Baby,
  TrendingUp
} from "lucide-react"
import { useContent, useI18n } from "@/lib/i18n"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { PropertyCard } from "@/components/ui/property-card"

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
  handover_date: string | null
  payment_plan: string | null
  is_off_plan: boolean
  featured: boolean
  developer: {
    name: string
    name_fa: string | null
    logo_url: string | null
  } | null
}

interface AreaDetailClientProps {
  area: Area
  properties: Property[]
  towers: Tower[]
  locale: string
}

export function AreaDetailClient({ area, properties, towers, locale }: AreaDetailClientProps) {
  const { performAction } = useAuthAction()
  const content = useContent()
  const { isRtl } = useI18n()
  const [activeImage, setActiveImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }
  const [isFavorite, setIsFavorite] = useState(false)

  const areaName = locale === 'fa' && area.name_fa ? area.name_fa : area.name
  const areaDesc = locale === 'fa' && area.full_description_fa ? area.full_description_fa : area.full_description
  const areaShortDesc = locale === 'fa' && area.short_description_fa ? area.short_description_fa : area.short_description
  const highlights = locale === 'fa' && area.location_highlights_fa ? area.location_highlights_fa : area.location_highlights

  const allImages = [area.cover_image_url, ...(area.gallery || [])].filter(Boolean) as string[]
  if (allImages.length === 0) allImages.push('/placeholder.jpg')

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat('en-US').format(price)
  }

  const getDeveloperLogo = (name: string, logoFromDb?: string | null) => {
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

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-20 md:pb-0">


      {/* 1. Breadcrumbs */}
      <div className="bg-white pt-10 pb-2 border-b border-slate-50">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'خانه' : 'Home'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Link href={`/${locale}/areas`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'مناطق دبی' : 'Dubai Areas'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{areaName}</span>
          </nav>
        </div>
      </div>

      {/* 2. Gallery Section */}
      <div className="bg-white">
        <div className="container mx-auto py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[400px] md:h-[500px] lg:h-[600px]">
              <div 
                className="lg:col-span-8 relative group overflow-hidden md:rounded-2xl shadow-sm cursor-zoom-in"
                onClick={() => openLightbox(activeImage)}
              >
                <SmartImage
                  src={allImages[activeImage]}
                  size="preview"
                  alt={areaName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              <div className="absolute inset-0 bg-black/5" />
              
              <div className="absolute top-4 start-4 flex gap-2">
                <Badge className="bg-primary/90 text-white border-0 px-4 py-1.5 rounded-lg shadow-lg backdrop-blur-md">
                  {locale === 'fa' ? 'منطقه محبوب' : 'Trending Area'}
                </Badge>
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

            {/* Side Grid */}
              <div 
                className="relative overflow-hidden rounded-2xl group shadow-sm cursor-zoom-in"
                onClick={() => openLightbox((activeImage + 1) % allImages.length)}
              >
                <SmartImage
                  src={allImages[(activeImage + 1) % allImages.length] || allImages[0]}
                  size="card"
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 hover:bg-black/10 transition-colors" />
              </div>
              <div 
                className="relative overflow-hidden rounded-2xl group shadow-sm cursor-zoom-in"
                onClick={() => openLightbox((activeImage + 2) % allImages.length)}
              >
                <SmartImage
                  src={allImages[(activeImage + 2) % allImages.length] || allImages[0]}
                  size="card"
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

      <GalleryLightbox 
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        alt={areaName}
      />

      {/* 3. Content Section */}
      <div className="container mx-auto py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="lg:w-[65%] space-y-6">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 divide-y divide-slate-100/80 overflow-hidden">
              
              {/* Header */}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-1">
                      {area.price_growth_percent && (
                        <Badge className="bg-green-50 text-green-600 border border-green-100 rounded-lg px-2 py-0.5 flex items-center gap-1 font-bold text-[10px] uppercase">
                          <TrendingUp className="h-3 w-3" />
                          +{area.price_growth_percent}% {locale === 'fa' ? 'رشد قیمت' : 'Growth'}
                        </Badge>
                      )}
                      <Badge className="bg-slate-50 text-slate-600 border border-slate-100 rounded-lg px-2 py-0.5 flex items-center gap-1 font-bold text-[10px] uppercase">
                        <Home className="h-3 w-3" />
                        {area.total_properties}+ {locale === 'fa' ? 'ملک فعال' : 'Properties'}
                      </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">{areaName}</h1>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      <span className="text-sm font-medium">{areaName}, Dubai, UAE</span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{locale === 'fa' ? 'میانگین قیمت' : 'Average Price'}</p>
                    <p className="text-2xl font-black text-slate-900 flex items-center gap-2" dir="ltr">
                      <AedSymbol size={20} className="text-primary" /> {formatPrice(area.average_price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><Building2 className="h-5 w-5" /></div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 leading-none">{towers.length}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'پروژه و برج' : 'Towers/Projects'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-x border-slate-100 px-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><Compass className="h-5 w-5" /></div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 leading-none">{locale === 'fa' ? 'مرکزی' : 'Central'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'موقعیت' : 'Location'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><TrendingUp className="h-5 w-5" /></div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 leading-none">High</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'پتانسیل سود' : 'ROI Potential'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="p-6 md:p-8 bg-slate-50/10">
                <div className={cn("text-slate-600 leading-relaxed text-sm whitespace-pre-line", isRtl && "text-right")}>
                  <p className="text-base font-black text-slate-900 mb-4 uppercase tracking-tight">
                    {locale === 'fa' ? `درباره ${areaName}` : `EXPLORE ${areaName.toUpperCase()}`}
                  </p>
                  <div className="space-y-6">
                    <p className="text-base leading-loose font-medium text-slate-700">{areaShortDesc}</p>
                    <p className="text-base leading-loose">{areaDesc || `Discover the vibrant lifestyle of ${areaName}. A community known for its premium residential options, world-class amenities, and strategic location in Dubai.`}</p>
                    
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 italic text-primary font-medium text-center">
                      {locale === 'fa'
                        ? `برای دریافت اطلاعات کامل از تمام فرصت‌های سرمایه‌گذاری در ${areaName}، با کارشناسان ما در تماس باشید.`
                        : `For complete information on all investment opportunities in ${areaName}, please contact our area specialists.`
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {highlights && highlights.length > 0 && (
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'ویژگی‌های کلیدی منطقه' : 'Area Highlights'}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-primary/20 transition-all group">
                        <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Towers & Projects List */}
            {towers.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{locale === 'fa' ? 'برج‌ها و پروژه‌های منطقه' : "Area's Towers & Projects"}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{locale === 'fa' ? `یافت شده ${towers.length} پروژه در این منطقه` : `${towers.length} projects found in this area`}</p>
                  </div>
                  <Link href={`/${locale}/towers?area=${area.slug}`}>
                    <Button variant="outline" className="rounded-full font-bold text-xs px-6 h-10 border-slate-200 hover:bg-primary hover:text-white transition-all">
                      {locale === 'fa' ? 'مشاهده همه' : 'View All'}
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {towers.map((tower) => {
                    const towerName = locale === 'fa' && tower.name_fa ? tower.name_fa : tower.name
                    const devName = locale === 'fa' && tower.developer?.name_fa ? tower.developer?.name_fa : tower.developer?.name
                    const devLogo = getDeveloperLogo(tower.developer?.name || "", tower.developer?.logo_url)
                    
                    return (
                      <Link key={tower.id} href={`/${locale}/towers/${tower.slug}`} className="group block">
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row h-full md:h-56">
                          {/* Image Section */}
                          <div className="relative w-full md:w-[40%] h-64 md:h-full shrink-0 overflow-hidden">
                            <SmartImage
                              src={tower.cover_image_url}
                              size="card"
                              alt={towerName}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            
                            {/* Top Badges */}
                            <div className="absolute top-4 start-4">
                              <Badge className={cn(
                                "backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold",
                                tower.is_off_plan ? "bg-secondary/80" : "bg-green-500/80"
                              )}>
                                {tower.is_off_plan ? (locale === 'fa' ? 'در حال ساخت' : 'Off-Plan') : (locale === 'fa' ? 'آماده تحویل' : 'Ready')}
                              </Badge>
                            </div>

                            {/* Price Overlay */}
                            <div className="absolute bottom-5 inset-x-5 z-10">
                              <p className="text-white/70 text-xs font-medium mb-1">{locale === 'fa' ? 'شروع قیمت از' : 'Starting From'}</p>
                              <p className="text-3xl font-bold text-white tracking-tight flex items-center gap-1.5" dir="ltr">
                                <AedSymbol size={28} className="flex-shrink-0" /> {formatPrice(tower.starting_price)}
                              </p>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                            <div>
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{towerName}</h4>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/5">
                                  <TrendingUp className="h-3.5 w-3.5" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider">8.5% ROI</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                                <MapPin className="h-4 w-4 text-muted-foreground/60" />
                                <span className="text-sm font-medium">{areaName}, Dubai</span>
                              </div>

                              {/* Stats Box */}
                              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40 mb-5">
                                <div>
                                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                                    {locale === 'fa' ? 'زمان تحویل' : 'Handover'}
                                  </p>
                                  <p className="text-sm font-bold text-foreground leading-none">
                                    {tower.handover_date || "2026"}
                                  </p>
                                </div>
                                <div className="border-s border-border/40 ps-6">
                                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                                    {locale === 'fa' ? 'برنامه پرداخت' : 'Payment Plan'}
                                  </p>
                                  <p className="text-sm font-bold text-foreground leading-none">
                                    {tower.payment_plan || "70/30"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              {/* Developer */}
                              <div className="flex items-center gap-2">
                                {devLogo ? (
                                  <div className="relative h-20 w-44 -my-5">
                                    <SmartImage
                                      src={devLogo}
                                      size="thumb"
                                      alt={devName || "Developer"}
                                      fill
                                      className="object-contain object-left grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground font-medium">
                                    {locale === 'fa' ? 'توسط ' : 'by '}
                                    <span className="text-foreground/80 font-bold uppercase tracking-wide">{devName || "Developer"}</span>
                                  </p>
                                )}
                              </div>

                              {/* View Details Link */}
                              <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                                {locale === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Area's Properties List */}
            {properties.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{locale === 'fa' ? 'املاک موجود در منطقه' : "Area's Properties"}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{locale === 'fa' ? `یافت شده ${properties.length} ملک در این منطقه` : `${properties.length} properties found in this area`}</p>
                  </div>
                  <Link href={`/${locale}/for-sale/property/dubai/${area.slug}`}>
                    <Button variant="outline" className="rounded-full font-bold text-xs px-6 h-10 border-slate-200 hover:bg-primary hover:text-white transition-all">
                      {locale === 'fa' ? 'مشاهده همه' : 'View All'}
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {properties.slice(0, 10).map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={{
                        ...prop,
                        title: { en: prop.title, fa: prop.title_fa || prop.title },
                        image: prop.cover_image_url,
                        type: prop.listing_type,
                        location: { en: areaName || 'Dubai', fa: areaName || 'دبی' }
                      }}
                      locale={locale}
                      content={content}
                      propertyUrl={`/${locale}/properties/${prop.slug}`}
                      hideLabels={true}
                      viewMode="list"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Area FAQ */}
            <div className="py-10">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? `سوالات متداول درباره ${areaName}` : `FAQs about ${areaName}`}</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary hover:no-underline">{locale === 'fa' ? `آیا ${areaName} برای سرمایه‌گذاری مناسب است؟` : `Is ${areaName} a good investment?`}</AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm">
                    {locale === 'fa' 
                      ? `${areaName} یکی از مناطق با رشد سریع در دبی است که پتانسیل بالایی برای بازگشت سرمایه (ROI) و افزایش قیمت در بلندمدت دارد.`
                      : `${areaName} is one of Dubai's fastest-growing areas with high potential for ROI and long-term capital appreciation.`}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary hover:no-underline">{locale === 'fa' ? 'وضعیت دسترسی به حمل و نقل عمومی چگونه است؟' : 'How is the public transport access?'}</AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm">
                    {locale === 'fa'
                      ? 'این منطقه دارای دسترسی عالی به بزرگراه‌های اصلی دبی و سیستم حمل و نقل عمومی مدرن از جمله مترو و اتوبوس می‌باشد.'
                      : 'The area features excellent access to Dubai\'s main highways and a modern public transport system including metro and bus links.'}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:w-[35%] sticky top-28 space-y-4 z-10 self-start">
              
              {/* Agent Card */}
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group">
                <div className="p-8">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all duration-500">
                      <Image
                        src={"/logoc.svg"}
                        alt={"Area Specialist"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-none">
                        {locale === 'fa' ? 'کارشناس منطقه' : 'Area Specialist'}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-primary font-bold text-[10px] uppercase tracking-widest">
                          Cafoo Real Estate
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      className="h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                      onClick={() => performAction(() => {
                        window.location.href = `tel:+971503491050`
                      })}
                    >
                      <Phone className="h-4 w-4" />
                      {locale === 'fa' ? 'تماس' : 'Call'}
                    </Button>
                    <Button 
                      className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-100/20"
                      onClick={() => performAction(() => {
                        window.open(`https://wa.me/971503491050`, '_blank')
                      })}
                    >
                      <MessageCircle className="h-4 w-4" />
                      WA
                    </Button>
                    <Button 
                      className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 group/btn"
                      onClick={() => performAction(() => {
                        console.log('Inquiry submitted')
                      })}
                    >
                      <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      {locale === 'fa' ? 'درخواست' : 'Inquire'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4">{locale === 'fa' ? 'لینک‌های مرتبط' : 'Related Links'}</h4>
                <div className="space-y-3">
                  <Link href={`/${locale}/for-sale/property/dubai/${area.slug}`} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                    <LinkIcon className="h-3 w-3" />
                    {locale === 'fa' ? `آپارتمان‌های ${areaName}` : `Apartments in ${areaName}`}
                  </Link>
                  <Link href={`/${locale}/for-sale/villa/dubai/${area.slug}`} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                    <LinkIcon className="h-3 w-3" />
                    {locale === 'fa' ? `ویلاهای ${areaName}` : `Villas in ${areaName}`}
                  </Link>
                  <Link href={`/${locale}/towers?area=${area.slug}`} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                    <LinkIcon className="h-3 w-3" />
                    {locale === 'fa' ? `پروژه‌های جدید در ${areaName}` : `Off-plan projects in ${areaName}`}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Contact Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-2">
          <Button className="h-12 bg-slate-900 rounded-xl">
            <Phone className="h-5 w-5" />
          </Button>
          <Button className="h-12 bg-[#25D366] rounded-xl">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button className="h-12 bg-primary rounded-xl font-black uppercase text-xs">
            {locale === 'fa' ? 'مشاوره' : 'Inquire'}
          </Button>
        </div>
      </div>
    </div>
  )
}
