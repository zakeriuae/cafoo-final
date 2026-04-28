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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  Building2,
  Phone,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Share2,
  Heart,
  Calendar,
  Layers,
  Waves,
  Dumbbell,
  Car,
  Wind,
  Layout,
  ChevronRight,
  ChevronLeft,
  Link as LinkIcon,
  Home,
  Baby,
  ShieldCheck
} from "lucide-react"
import { useContent, useI18n } from "@/lib/i18n"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { PropertyCard } from "@/components/ui/property-card"

interface Tower {
  id: string
  name: string
  name_fa: string | null
  slug: string
  description: string | null
  description_fa: string | null
  cover_image_url: string | null
  gallery: string[] | null
  starting_price: number | null
  payment_plan: string | null
  handover_date: string | null
  video_url: string | null
  latitude: number | null
  longitude: number | null
  amenities: string[] | null
  area: {
    id: string
    name: string
    name_fa: string | null
    slug: string
  } | null
  developer: {
    id: string
    name: string
    name_fa: string | null
    logo_url: string | null
  } | null
  assigned_agent: {
    id: string
    name: string
    name_fa: string | null
    slug: string
    title: string
    title_fa: string | null
    avatar_url: string | null
    phone: string | null
    whatsapp: string | null
    email: string | null
  } | null
}

interface TowerProperty {
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

interface TowerDetailClientProps {
  tower: Tower
  properties: TowerProperty[]
  locale: string
}

export function TowerDetailClient({ tower, properties, locale }: TowerDetailClientProps) {
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

  const towerName = locale === 'fa' && tower.name_fa ? tower.name_fa : tower.name
  const towerDesc = locale === 'fa' && tower.description_fa ? tower.description_fa : tower.description
  const areaName = locale === 'fa' && tower.area?.name_fa ? tower.area?.name_fa : tower.area?.name

  const allImages = [tower.cover_image_url, ...(tower.gallery || [])].filter(Boolean) as string[]
  if (allImages.length === 0) allImages.push('/placeholder-property.jpg')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  // Amenities Icon Mapping
  const getAmenityIcon = (feature: string) => {
    const f = feature.toLowerCase()
    if (f.includes('pool') || f.includes('استخر')) return Waves
    if (f.includes('gym') || f.includes('ورزش')) return Dumbbell
    if (f.includes('security') || f.includes('نگهبان')) return ShieldCheck
    if (f.includes('parking') || f.includes('پارکینگ')) return Car
    if (f.includes('ac') || f.includes('هوا')) return Wind
    if (f.includes('balcony') || f.includes('تراس')) return Layout
    if (f.includes('kids') || f.includes('کودکان')) return Baby
    return Check
  }

  const amenitiesList = tower.amenities?.length ? tower.amenities : [
    locale === 'fa' ? 'استخر اختصاصی' : 'Swimming Pool',
    locale === 'fa' ? 'سالن ورزشی' : 'Gym',
    locale === 'fa' ? 'نگهبانی ۲۴ ساعته' : '24/7 Security',
    locale === 'fa' ? 'پارکینگ سرپوشیده' : 'Covered Parking',
    locale === 'fa' ? 'فضای بازی کودکان' : 'Kids Play Area',
    locale === 'fa' ? 'تهویه مرکزی' : 'Central A/C'
  ]

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-20 md:pb-0">

      {/* 1. Breadcrumbs */}
      <div className="bg-white pt-10 pb-2 border-b border-slate-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'خانه' : 'Home'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Link href={`/${locale}/projects`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'پروژه‌ها' : 'Projects'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {tower.area && (
              <>
                <Link href={`/${locale}/areas/${tower.area.slug}`} className="hover:text-primary transition-colors no-underline">{areaName}</Link>
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </>
            )}
            <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{towerName}</span>
          </nav>
        </div>
      </div>

      {/* 2. Gallery */}
      <div className="bg-white">
        <div className="container mx-auto py-4 md:py-6 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[400px] md:h-[500px] lg:h-[600px]">
            <div 
              className="lg:col-span-8 relative group overflow-hidden md:rounded-2xl shadow-sm cursor-zoom-in"
              onClick={() => openLightbox(activeImage)}
            >
              <SmartImage
                src={allImages[activeImage]}
                size="preview"
                alt={towerName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/5" />

              <div className="absolute top-4 start-4 flex gap-2">
                <Badge className="bg-primary/90 text-white border-0 px-4 py-1.5 rounded-lg shadow-lg backdrop-blur-md">
                  {locale === 'fa' ? 'پروژه اختصاصی' : 'Featured Project'}
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

            {/* Side Grid Images */}
            <div className="lg:col-span-4 hidden lg:grid grid-rows-2 gap-4">
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
        </div>

      <GalleryLightbox 
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        alt={towerName}
      />

      {/* 3. Main Content Container */}
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Unified Main Content Container */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 divide-y divide-slate-100/80 overflow-hidden">
            
            {/* 1. Header & Quick Stats */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2" dir="ltr">
                      {tower.starting_price ? (
                        <>
                          <span className="text-xl text-slate-400 font-medium">{locale === 'fa' ? 'از' : 'From'}</span>
                          <AedSymbol size={28} className="text-primary" /> {formatPrice(tower.starting_price)}
                        </>
                      ) : (
                        <span className="text-2xl text-slate-400">{locale === 'fa' ? 'قیمت نامشخص' : 'Price on Request'}</span>
                      )}
                    </p>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight tracking-tight">{towerName}</h1>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      <span className="text-sm font-medium">{areaName}, Dubai</span>
                    </div>
                  </div>

              {(() => {
                const devName = tower.developer?.name || '';
                const mapping: Record<string, string> = {
                  'emaar': '/images/developers/emaar.png',
                  'damac': '/images/developers/damac.png',
                  'sobha': '/images/developers/sobhan.png',
                  'sobhan': '/images/developers/sobhan.png',
                  'nakheel': '/images/developers/nakheel.png',
                  'binghatti': '/images/developers/binghati.png',
                  'arada': '/images/developers/arada.png',
                  'tiger': '/images/developers/tiger.png',
                  'aldar': '/images/developers/aldar.png',
                  'wasl': '/images/developers/wasl.png',
                  'danube': '/images/developers/danube.png',
                  'dubai properties': '/images/developers/dubai.png',
                  'meraas': '/images/developers/meraas.png',
                  'alef': '/images/developers/alef.png',
                  'imtiaz': '/images/developers/imtiaz.png',
                  'nshama': '/images/developers/nshama.png',
                  'beyond': '/images/developers/beyond.png',
                  'rak': '/images/developers/rak.png',
                };
                const searchName = devName.toLowerCase();
                const foundKey = Object.keys(mapping).find(key => searchName.includes(key));
                const logoUrl = foundKey ? mapping[foundKey] : tower.developer?.logo_url;

                if (logoUrl) {
                  return (
                    <div className="relative h-40 w-80 -my-12">
                      <Image
                        src={logoUrl}
                        alt={devName || 'Developer'}
                        fill
                        className="object-contain object-right"
                      />
                    </div>
                  );
                }
                return (
                  <Badge className="bg-green-50 text-green-600 border border-green-100 rounded-xl px-4 py-1 flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider mt-2">
                    <Building2 className="h-3.5 w-3.5" />
                    {locale === 'fa' ? 'پروژه تایید شده' : 'Verified Project'}
                  </Badge>
                );
              })()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><Calendar className="h-5 w-5" /></div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 leading-none">{tower.handover_date || 'TBA'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'زمان تحویل' : 'Handover'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-x border-slate-100 px-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><Layers className="h-5 w-5" /></div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 leading-none">{tower.payment_plan || 'Contact Us'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'برنامه پرداخت' : 'Payment Plan'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><Home className="h-5 w-5" /></div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 leading-none">{properties.length}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'واحد موجود' : 'Available Units'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Comprehensive Description */}
            <div className="p-6 md:p-8 bg-slate-50/10">
              <div className={cn("text-slate-600 leading-relaxed text-sm whitespace-pre-line", isRtl && "text-right")}>
                <p className="text-base font-black text-slate-900 mb-4 uppercase tracking-tight">
                  {locale === 'fa' ? 'زندگی لوکس در قلب دبی' : 'LUXURY LIVING IN THE HEART OF DUBAI'}
                </p>
                <div className="space-y-6">
                  <p className="text-base leading-loose">{towerDesc || `Experience luxury living at ${towerName}. This premium development offers world-class amenities and unparalleled views in the heart of ${areaName}.`}</p>
                  
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 italic text-primary font-medium text-center">
                    {locale === 'fa'
                      ? 'برای دریافت کاتالوگ کامل پروژه و هماهنگی جهت بازدید حضوری، با ما در تماس باشید.'
                      : 'For a full project brochure and private viewing arrangements, please contact us.'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Amenities - Dynamic Icons */}
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'ویژگی‌ها و امکانات رفاهی' : 'Features / Amenities'}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {amenitiesList.map((feature) => {
                  const Icon = getAmenityIcon(feature);
                  return (
                    <div key={feature} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-primary/20 transition-all group aspect-square text-center">
                      <div className="mb-2">
                        <Icon className="h-5 w-5 text-slate-900 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Floor Plans & Interactive Media */}
            {tower.video_url && (
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'رسانه‌های تعاملی' : 'Interactive Media'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a href={tower.video_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Waves className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'ویدیو پروژه' : 'Project Video'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Watch Now</span>
                  </a>
                </div>
              </div>
            )}

            </div>

            {/* Available Units Grid */}
            {properties.length > 0 && (
              <div className="mt-8 px-2 md:px-0">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'واحدهای در دسترس' : 'Available Units'}</h3>
                <div className="grid grid-cols-1 gap-6">
                  {properties.slice(0, 8).map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={{...prop, title: {en: prop.title, fa: prop.title_fa || prop.title}, image: prop.cover_image_url, type: prop.listing_type, location: {en: areaName || 'Dubai', fa: areaName || 'دبی'}}}
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

            {/* FAQ Section */}
            <div className="py-10 px-2 md:px-0">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary hover:no-underline">{locale === 'fa' ? 'زمان دقیق تحویل پروژه چه تاریخی است؟' : 'When is the exact handover date?'}</AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm">
                    {locale === 'fa' 
                      ? `پروژه ${towerName} طبق برنامه‌ریزی در تاریخ ${tower.handover_date || 'سه ماهه پایانی سال جاری'} به خریداران محترم تحویل داده خواهد شد.` 
                      : `The ${towerName} project is scheduled for handover in ${tower.handover_date || 'Q4 of this year'}.`}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary hover:no-underline">{locale === 'fa' ? 'شرایط و برنامه پرداخت به چه صورت است؟' : 'What is the payment plan structure?'}</AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm">
                    {locale === 'fa'
                      ? `شرایط پرداخت به صورت منعطف و متناسب با بودجه شما طراحی شده است. برنامه پیش‌فرض ${tower.payment_plan || '۶۰/۴۰'} می‌باشد.`
                      : `The payment plan is flexible. The standard plan is ${tower.payment_plan || '60/40'} during construction and on handover.`}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* 6. Location & Map Section (Wrapped in Card) */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 divide-y divide-slate-100/80 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">{locale === 'fa' ? 'موقعیت روی نقشه' : 'Location Map'}</h3>
                  <span className="text-xs text-primary font-bold bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">{areaName}</span>
                </div>
                <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-inner">
                  {(() => {
                    const lat = tower.latitude || 25.1972;
                    const lon = tower.longitude || 55.2744;
                    return (
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.005}%2C${lat - 0.005}%2C${lon + 0.005}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lon}`}
                        className="grayscale hover:grayscale-0 transition-all duration-700 contrast-[1.1]"
                      />
                    );
                  })()}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 z-10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">{areaName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (4 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* Agent Card */}
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group">
                <div className="p-8">
                  <div className="flex items-center gap-5 mb-8">
                    <Link 
                      href={tower.assigned_agent ? `/${locale}/agents/${tower.assigned_agent.slug}` : "#"} 
                      className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all duration-500 flex-shrink-0"
                    >
                      <Image 
                        src={tower.assigned_agent?.avatar_url || "/logoc.svg"} 
                        alt={tower.assigned_agent?.name || "Project Specialist"} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </Link>
                    <div>
                      <Link 
                        href={tower.assigned_agent ? `/${locale}/agents/${tower.assigned_agent.slug}` : "#"}
                        className="block hover:text-primary transition-colors"
                      >
                        <h4 className="text-lg font-bold text-slate-900 leading-none">
                          {tower.assigned_agent 
                            ? (locale === 'fa' && tower.assigned_agent.name_fa ? tower.assigned_agent.name_fa : tower.assigned_agent.name)
                            : (locale === 'fa' ? 'کارشناس پروژه' : 'Project Specialist')}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-primary font-bold text-[10px] uppercase tracking-widest">
                          {tower.assigned_agent 
                            ? (locale === 'fa' && tower.assigned_agent.title_fa ? tower.assigned_agent.title_fa : tower.assigned_agent.title)
                            : 'Cafoo Real Estate'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      className="h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center transition-all active:scale-95 shadow-sm"
                      onClick={() => performAction(() => {
                        window.location.href = `tel:${tower.assigned_agent?.phone || '+971503491050'}`
                      })}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-xs flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-green-100/20"
                      onClick={() => performAction(() => {
                        window.open(`https://wa.me/${(tower.assigned_agent?.whatsapp || '971503491050').replace(/\D/g, '')}`, '_blank')
                      })}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95"
                      onClick={() => performAction(() => {
                        // For now just show a toast or open a modal
                        // This will be replaced with real lead capture later
                        console.log('Inquiry submitted')
                      })}
                    >
                      {locale === 'fa' ? 'درخواست' : 'Inquire'}
                    </Button>
                  </div>
                </div>
              </div>

              {tower.area && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group mt-4">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500"><MapPin className="h-6 w-6" /></div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{areaName}</h4>
                      <p className="text-slate-400 text-xs font-medium mt-1">{locale === 'fa' ? 'راهنمای منطقه' : 'Community Guide'}</p>
                    </div>
                  </div>
                  <Link href={`/${locale}/for-sale/property/dubai/${tower.area.slug}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-white transition-all font-bold text-xs">
                    <span>{locale === 'fa' ? 'بررسی املاک' : 'Explore Properties'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mt-4">
                <h4 className="text-sm font-bold text-slate-900 mb-4">{locale === 'fa' ? 'لینک‌های مرتبط' : 'Related Links'}</h4>
                <div className="space-y-3">
                  <Link href={`/${locale}/projects`} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                    <LinkIcon className="h-3 w-3" />
                    {locale === 'fa' ? 'تمام پروژه‌های دبی' : 'All Dubai Projects'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-50 shadow-lg">
        <div className="grid grid-cols-3 gap-2">
          <Button className="h-12 bg-slate-900"><Phone className="h-5 w-5" /></Button>
          <Button className="h-12 bg-[#25D366]"><MessageCircle className="h-5 w-5" /></Button>
          <Button className="h-12 bg-primary font-black uppercase text-xs">{locale === 'fa' ? 'مشاوره' : 'Inquire'}</Button>
        </div>
      </div>
    </div>
  )
}
