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
import * as Icons from "lucide-react"
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
  payment_plan_fa: string | null
  payment_plan_details: { phase: string; percent: string }[] | null
  payment_plan_details_fa: { phase: string; percent: string }[] | null
  connectivity: { location: string; time: string }[] | null
  connectivity_fa: { location: string; time: string }[] | null
  handover_date: string | null
  video_url: string | null
  brochure_url: string | null
  floor_plan_url: string | null
  additional_media: { title: string; url: string }[] | null
  highlights: string | null
  highlights_fa: string | null
  architectural_details: string | null
  architectural_details_fa: string | null
  investment_potential: string | null
  investment_potential_fa: string | null
  latitude: number | null
  longitude: number | null
  tower_amenities?: { amenities: any }[]
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
  const amenitiesList = (tower.tower_amenities || []).map(a => ({
    name: locale === 'fa' && a.amenities.name_fa ? a.amenities.name_fa : a.amenities.name,
    icon: a.amenities.icon
  }))

  const finalAmenities = amenitiesList.length ? amenitiesList : [
    { name: locale === 'fa' ? 'استخر اختصاصی' : 'Swimming Pool', icon: 'Waves' },
    { name: locale === 'fa' ? 'سالن ورزشی' : 'Gym', icon: 'Dumbbell' },
    { name: locale === 'fa' ? 'نگهبانی ۲۴ ساعته' : '24/7 Security', icon: 'ShieldCheck' },
    { name: locale === 'fa' ? 'پارکینگ سرپوشیده' : 'Covered Parking', icon: 'Car' },
    { name: locale === 'fa' ? 'فضای بازی کودکان' : 'Kids Play Area', icon: 'Baby' },
    { name: locale === 'fa' ? 'تهویه مرکزی' : 'Central A/C', icon: 'Wind' }
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
                  onClick={() => performAction(
                    () => setIsFavorite(!isFavorite),
                    { 
                      source: 'like', 
                      tower_id: tower.id,
                      notes: `User liked tower: ${towerName}`
                    }
                  )}
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
                {(tower.highlights || tower.highlights_fa) && (
                  <p className="text-base font-black text-slate-900 mb-4 uppercase tracking-tight">
                    {locale === 'fa' && tower.highlights_fa ? tower.highlights_fa : tower.highlights}
                  </p>
                )}
                <div className="space-y-6">
                  <p className="text-base leading-loose">{towerDesc || `Experience luxury living at ${towerName}. This premium development offers world-class amenities and unparalleled views in the heart of ${areaName}.`}</p>
                  
                  {(tower.architectural_details || tower.architectural_details_fa || tower.investment_potential || tower.investment_potential_fa) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-100">
                      {(tower.architectural_details || tower.architectural_details_fa) && (
                        <div>
                          <h4 className="text-slate-900 font-bold mb-3">{locale === 'fa' ? 'جزئیات معماری و ساخت' : 'Architectural Excellence'}</h4>
                          <p className="text-xs leading-relaxed text-slate-500">
                            {locale === 'fa' && tower.architectural_details_fa ? tower.architectural_details_fa : tower.architectural_details}
                          </p>
                        </div>
                      )}
                      {(tower.investment_potential || tower.investment_potential_fa) && (
                        <div>
                          <h4 className="text-slate-900 font-bold mb-3">{locale === 'fa' ? 'پتانسیل سرمایه‌گذاری' : 'Investment Analysis'}</h4>
                          <p className="text-xs leading-relaxed text-slate-500">
                            {locale === 'fa' && tower.investment_potential_fa ? tower.investment_potential_fa : tower.investment_potential}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                {finalAmenities.map((feature, idx) => {
                  // @ts-ignore
                  const Icon = Icons[feature.icon] || Icons.Check;
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-primary/20 transition-all group aspect-square text-center">
                      <div className="mb-2">
                        <Icon className="h-5 w-5 text-slate-900 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{feature.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Payment Plan */}
            {(locale === 'fa' ? tower.payment_plan_details_fa : tower.payment_plan_details) && (locale === 'fa' ? tower.payment_plan_details_fa : tower.payment_plan_details)!.length > 0 && (
              <div className="p-6 md:p-8 bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'برنامه پرداخت دقیق' : 'Detailed Payment Plan'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {(locale === 'fa' ? tower.payment_plan_details_fa : tower.payment_plan_details)!.map((item, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <span className="text-2xl font-black text-primary mb-1">{item.percent}%</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.phase}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connectivity & Proximity */}
            {(locale === 'fa' ? tower.connectivity_fa : tower.connectivity) && (locale === 'fa' ? tower.connectivity_fa : tower.connectivity)!.length > 0 && (
              <div className="p-6 md:p-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'دسترسی به مکان‌های کلیدی' : 'Key Destinations & Proximity'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(locale === 'fa' ? tower.connectivity_fa : tower.connectivity)!.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400"><MapPin className="h-4 w-4" /></div>
                        <span className="text-xs font-bold text-slate-700">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-black">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Floor Plans & Interactive Media */}
            {(tower.video_url || tower.brochure_url || tower.floor_plan_url || (tower.additional_media && tower.additional_media.length > 0)) && (
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'رسانه‌های تعاملی و مستندات' : 'Interactive Media & Documents'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tower.video_url && (
                    <a href={tower.video_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group no-underline">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icons.Play className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'ویدیو پروژه' : 'Project Video'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Watch Now</span>
                    </a>
                  )}
                  {tower.brochure_url && (
                    <a href={tower.brochure_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group no-underline">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icons.Download className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'کاتالوگ پروژه' : 'Project Brochure'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">PDF - View</span>
                    </a>
                  )}
                  {tower.floor_plan_url && (
                    <a href={tower.floor_plan_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group no-underline">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icons.Map className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'نقشه طبقات' : 'Floor Plans'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">View PDF</span>
                    </a>
                  )}
                  {tower.additional_media?.map((media, idx) => (
                    <a key={idx} href={media.url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group no-underline">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icons.FileText className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900 truncate max-w-full px-2">{media.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Open Link</span>
                    </a>
                  ))}
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
            {((locale === 'fa' ? tower.faq_fa : tower.faq) || []).length > 0 && (
              <div className="py-10 px-2 md:px-0">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {((locale === 'fa' ? tower.faq_fa : tower.faq) || []).map((item, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                      <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary hover:no-underline text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 leading-relaxed text-sm">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

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
                      onClick={() => performAction(
                        () => {
                          window.location.href = `tel:${tower.assigned_agent?.phone || '+971503491050'}`
                        },
                        {
                          source: 'call',
                          tower_id: tower.id,
                          agent_id: tower.assigned_agent?.id,
                          notes: `User clicked call button for tower agent ${tower.assigned_agent?.name || 'Specialist'}`
                        }
                      )}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-xs flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-green-100/20"
                      onClick={() => performAction(
                        () => {
                          window.open(`https://wa.me/${(tower.assigned_agent?.whatsapp || '971503491050').replace(/\D/g, '')}`, '_blank')
                        },
                        {
                          source: 'whatsapp',
                          tower_id: tower.id,
                          agent_id: tower.assigned_agent?.id,
                          notes: `User clicked WhatsApp button for tower agent ${tower.assigned_agent?.name || 'Specialist'}`
                        }
                      )}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95"
                      onClick={() => performAction(
                        () => {
                          console.log('Inquiry submitted')
                        },
                        {
                          source: 'register_viewing',
                          tower_id: tower.id,
                          agent_id: tower.assigned_agent?.id,
                          notes: `User clicked Inquire for tower: ${towerName}`
                        }
                      )}
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
          <Button className="h-12 bg-slate-900" onClick={() => performAction(() => { window.location.href = `tel:${tower.assigned_agent?.phone || '+971503491050'}` }, { source: 'call', tower_id: tower.id, agent_id: tower.assigned_agent?.id })}><Phone className="h-5 w-5" /></Button>
          <Button className="h-12 bg-[#25D366]" onClick={() => performAction(() => { window.open(`https://wa.me/${(tower.assigned_agent?.whatsapp || '971503491050').replace(/\D/g, '')}`, '_blank') }, { source: 'whatsapp', tower_id: tower.id, agent_id: tower.assigned_agent?.id })}><MessageCircle className="h-5 w-5" /></Button>
          <Button className="h-12 bg-primary font-black uppercase text-xs" onClick={() => performAction(() => { console.log('Mobile Inquire') }, { source: 'register_viewing', tower_id: tower.id, agent_id: tower.assigned_agent?.id })}>{locale === 'fa' ? 'مشاوره' : 'Inquire'}</Button>
        </div>
      </div>
    </div>
  )
}
