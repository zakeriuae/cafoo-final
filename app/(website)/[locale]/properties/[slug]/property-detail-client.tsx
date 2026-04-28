"use client"

import { SmartImage } from "@/components/ui/smart-image"
import { GalleryLightbox } from "@/components/ui/gallery-lightbox"
import { useAuthAction } from "@/hooks/use-auth-action"
import Link from "next/link"
import Image from "next/image"
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
  ArrowUpRight,
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
  ShieldCheck,
  Briefcase,
  Waves,
  Dumbbell,
  Car,
  Baby,
  Wind,
  Layout
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
  ad_code: string | null
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
  status: string
  furnishing: string | null
  completion_date: string | null
  handover_date: string | null
  parking_spaces: number
  is_off_plan: boolean
  verified: boolean
  created_at: string
  area: { 
    id: string; 
    name: string; 
    name_fa: string | null; 
    slug: string;
    total_towers: number;
    total_properties: number;
  } | null
  tower: { 
    id: string; 
    name: string; 
    name_fa: string | null; 
    slug: string;
    floors_count: number | null;
    total_units: number | null;
    developer: { id: string; name: string; name_fa: string | null; logo_url: string | null } | null
  } | null
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
  video_url: string | null
  floor_plan_url: string | null
  tour_360_url: string | null
  service_charge: string | null
  payment_plan: any | null
  latitude: number | null
  longitude: number | null
  address: string | null
  view_type: string | null
  is_upgraded: boolean | null
  vacant_status: string | null
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

  // Smart Developer Mapping Logic
  const getDetectedDeveloper = () => {
    let dev = property.developer || property.tower?.developer || null;
    const towerNameLower = (property.tower?.name || "").toLowerCase();

    // If no dev in DB, try to detect from tower name
    if (!dev) {
      if (towerNameLower.includes('address') || towerNameLower.includes('creek') || towerNameLower.includes('marina sands')) {
        dev = { id: 'emaar', name: 'Emaar Properties', name_fa: 'اعمار', logo_url: null };
      } else if (towerNameLower.includes('aykon') || towerNameLower.includes('damac')) {
        dev = { id: 'damac', name: 'DAMAC Properties', name_fa: 'داماک', logo_url: null };
      } else if (towerNameLower.includes('sobha')) {
        dev = { id: 'sobha', name: 'Sobha Realty', name_fa: 'سبها', logo_url: null };
      } else if (towerNameLower.includes('binghatti')) {
        dev = { id: 'binghatti', name: 'Binghatti', name_fa: 'بن غاطی', logo_url: null };
      } else if (towerNameLower.includes('danube')) {
        dev = { id: 'danube', name: 'Danube Properties', name_fa: 'دانوب', logo_url: null };
      }
    }

    if (!dev) return null;

    // Apply local image mapping
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

    const searchName = dev.name.toLowerCase();
    const foundKey = Object.keys(mapping).find(key => searchName.includes(key));
    
    if (foundKey) {
      return { ...dev, logo_url: mapping[foundKey] };
    }
    
    return dev;
  };

  const detectedDeveloper = getDetectedDeveloper();

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-20 md:pb-0">

      {/* 1. Breadcrumbs - Bayut Style */}
      <div className="bg-white pt-10 pb-2 border-b border-slate-50">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'خانه' : 'Home'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Link href={`/${locale}/properties`} className="hover:text-primary transition-colors no-underline">{locale === 'fa' ? 'املاک دبی' : 'Dubai Properties'}</Link>
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {areaName && (
              <>
                <Link href={`/${locale}/areas/${property.area?.slug}`} className="hover:text-primary transition-colors no-underline">{areaName}</Link>
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </>
            )}
            {towerName && (
              <>
                <Link href={`/${locale}/towers/${property.tower?.slug}`} className="hover:text-primary transition-colors no-underline">{towerName}</Link>
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
            <div 
              className="lg:col-span-8 relative group overflow-hidden md:rounded-2xl shadow-sm cursor-zoom-in"
              onClick={() => openLightbox(activeImage)}
            >
              <SmartImage
                src={allImages[activeImage] || "/images/placeholder.jpg"}
                size="preview"
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
        alt={propTitle}
      />

      {/* 3. Main Content Container */}
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Unified Main Content Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 divide-y divide-slate-100/80 overflow-hidden">
            
            {/* 1. Header & Quick Stats */}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex flex-col gap-2">
                  <p className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2" dir="ltr">
                    <AedSymbol size={28} className="text-primary" /> {formatPrice(property.price)}
                    {property.listing_type === 'rent' && <span className="text-xl text-slate-400 font-medium lowercase">/ year</span>}
                  </p>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight tracking-tight">{propTitle}</h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span className="text-sm font-medium">{areaName}{towerName ? `, ${towerName}` : ''}, Dubai</span>
                  </div>
                </div>

                {detectedDeveloper?.logo_url ? (
                  <div className="relative h-40 w-80 -my-12">
                    <Image
                      src={detectedDeveloper.logo_url}
                      alt={detectedDeveloper.name || 'Developer'}
                      fill
                      className="object-contain object-right"
                    />
                  </div>
                ) : property.verified && (
                  <Badge className="bg-green-50 text-green-600 border border-green-100 rounded-xl px-4 py-1 flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider mt-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {locale === 'fa' ? 'تایید شده' : 'Verified'}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center"><Bed className="h-5 w-5 text-slate-600" /></div>
                  <div><p className="text-lg font-bold text-slate-900 leading-none">{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'خواب' : 'Beds'}</p></div>
                </div>
                <div className="flex items-center gap-3 border-x border-slate-100 px-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center"><Bath className="h-5 w-5 text-slate-600" /></div>
                  <div><p className="text-lg font-bold text-slate-900 leading-none">{property.bathrooms}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'حمام' : 'Baths'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div><p className="text-lg font-bold text-slate-900 leading-none" dir="ltr">{formatPrice(property.size || 0)}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{locale === 'fa' ? 'متراژ' : 'Sq. Ft.'}</p></div>
                </div>
              </div>
            </div>

            {/* 2. Comprehensive Description - Merged Property & Project */}
            <div className="p-6 md:p-8 bg-slate-50/10">
              <div className={cn("text-slate-600 leading-relaxed text-sm whitespace-pre-line", isRtl && "text-right")}>
                <p className="text-base font-black text-slate-900 mb-4 uppercase tracking-tight">
                  {locale === 'fa' ? 'ویو دریا و استخر | سبک زندگی تفرجگاهی | گزینه‌های متعدد موجود' : 'SEA & POOL VIEW | RESORT STYLE LIVING | MULTIPLE OPTIONS AVAILABLE'}
                </p>
                <div className="space-y-6">
                  <p className="text-base leading-loose">{propDesc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-100">
                    <div>
                      <h4 className="text-slate-900 font-bold mb-3">{locale === 'fa' ? 'جزئیات معماری و متریال' : 'Architectural & Material Excellence'}</h4>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {locale === 'fa' 
                          ? 'این واحد با استفاده از بهترین متریال‌های اروپایی، کف‌پوش‌های مرمر ایتالیایی و سیستم‌های هوشمند خانگی برندهای برتر دنیا تجهیز شده است. پنجره‌های تمام قد از کف تا سقف، نور طبیعی بی‌نظیری را به فضای داخلی هدایت کرده و دید پانوراما به افق دبی را تضمین می‌کنند.'
                          : 'This unit is fitted with premium European materials, including Italian marble flooring and state-of-the-art smart home systems. Floor-to-ceiling windows flood the interior with natural light while ensuring a breathtaking panoramic view of the Dubai skyline.'
                        }
                      </p>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold mb-3">{locale === 'fa' ? 'پتانسیل سرمایه‌گذاری' : 'Investment Potential'}</h4>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {locale === 'fa'
                          ? 'با توجه به موقعیت استراتژیک در منطقه و کیفیت ساخت بی‌نظیر، این ملک پتانسیل بالایی برای بازگشت سرمایه (ROI) چه از طریق اجاره کوتاه‌مدت و چه بلندمدت دارد. تقاضای بالا در این منطقه، رشد سرمایه شما را در بازار پویای دبی تضمین می‌کند.'
                          : 'Given its strategic location and exceptional build quality, this property offers high ROI potential through both short-term and long-term rentals. High demand in this district guarantees capital appreciation in Dubai\'s dynamic real estate market.'
                        }
                      </p>
                    </div>
                  </div>

                  <p className="font-medium text-slate-900 pt-2">
                    {locale === 'fa' 
                      ? `این واحد در پروژه مجلل ${towerName} واقع شده است. این پروژه یکی از شاخص‌ترین نمادهای معماری در منطقه ${areaName} است که توسط سازنده معتبر ${detectedDeveloper?.name} با بالاترین استانداردهای جهانی پیاده‌سازی شده است. ساکنین این مجموعه از دسترسی مستقیم به مراکز رفاهی برتر، فضاهای سبز وسیع، استخرهای اینفینیتی و لایف‌استایل لوکس دبی بهره‌مند خواهند بود. طراحی داخلی واحدها با دقت میلی‌متری انجام شده تا بیشترین بهره‌وری از فضا و راحتی را برای ساکنین فراهم آورد.`
                      : `Located in the prestigious ${towerName}, this residence offers a unique living experience in the heart of ${areaName}. Developed by the renowned ${detectedDeveloper?.name}, the project stands as a testament to modern architectural excellence and premium craftsmanship. Residents enjoy world-class amenities including infinity pools, lush green landscapes, and seamless connectivity to Dubai's key commercial and leisure destinations. Every square inch has been meticulously designed to provide maximum space efficiency and comfort.`
                    }
                  </p>

                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 italic text-primary font-medium text-center">
                    {locale === 'fa'
                      ? 'برای دریافت کاتالوگ کامل پروژه و هماهنگی جهت بازدید حضوری، با مشاور اختصاصی این ملک تماس بگیرید.'
                      : 'For a full project brochure and private viewing arrangements, please contact the dedicated property consultant.'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Amenities - Dynamic Icons & Full List */}
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'ویژگی‌ها و امکانات رفاهی' : 'Features / Amenities'}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {(features && features.length > 0 ? features : [
                  locale === 'fa' ? 'استخر اختصاصی' : 'Swimming Pool',
                  locale === 'fa' ? 'سالن ورزشی' : 'Gym',
                  locale === 'fa' ? 'نگهبانی ۲۴ ساعته' : '24/7 Security',
                  locale === 'fa' ? 'پارکینگ سرپوشیده' : 'Covered Parking',
                  locale === 'fa' ? 'فضای بازی کودکان' : 'Kids Play Area',
                  locale === 'fa' ? 'تهویه مرکزی' : 'Central A/C'
                ]).map((feature) => {
                  const featureLower = feature.toLowerCase();
                  let Icon = Check;
                  if (featureLower.includes('pool') || featureLower.includes('استخر')) Icon = Waves;
                  else if (featureLower.includes('gym') || featureLower.includes('ورزشی')) Icon = Dumbbell;
                  else if (featureLower.includes('security') || featureLower.includes('نگهبانی')) Icon = ShieldCheck;
                  else if (featureLower.includes('parking') || featureLower.includes('پارکینگ')) Icon = Car;
                  else if (featureLower.includes('kids') || featureLower.includes('کودکان')) Icon = Baby;
                  else if (featureLower.includes('a/c') || featureLower.includes('تهویه')) Icon = Wind;
                  else if (featureLower.includes('balcony') || featureLower.includes('تراس')) Icon = Layout;

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
            {(property.floor_plan_url || property.video_url || property.tour_360_url) && (
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{locale === 'fa' ? 'نقشه و رسانه‌های تعاملی' : 'Floor Plans & Media'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {property.floor_plan_url && (
                    <a href={property.floor_plan_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layout className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'نقشه طبقه' : 'Floor Plan'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">View PDF</span>
                    </a>
                  )}
                  {property.video_url && (
                    <a href={property.video_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Waves className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'ویدیو ملک' : 'Video Tour'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Watch Now</span>
                    </a>
                  )}
                  {property.tour_360_url && (
                    <a href={property.tour_360_url} target="_blank" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all group">
                      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Compass className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{locale === 'fa' ? 'تور ۳۶۰ درجه' : '360° View'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Explore Space</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 5. Payment Plan (If Off-plan) */}
            {property.is_off_plan && (
              <div className="p-6 md:p-8 bg-primary/5">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-slate-900">{locale === 'fa' ? 'برنامه پرداخت و اقساط' : 'Payment Plan'}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{locale === 'fa' ? 'پیش‌پرداخت' : 'Down Payment'}</p>
                    <p className="text-lg font-black text-primary">20%</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{locale === 'fa' ? 'در حین ساخت' : 'During Const.'}</p>
                    <p className="text-lg font-black text-slate-900">40%</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{locale === 'fa' ? 'زمان تحویل' : 'On Handover'}</p>
                    <p className="text-lg font-black text-slate-900">40%</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{locale === 'fa' ? 'تحویل کلید' : 'Handover'}</p>
                    <p className="text-lg font-black text-slate-900">Q4 2026</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Technical & Pricing Information */}
            <div className="p-6 md:p-8 bg-slate-50/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Property Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-bold text-slate-900">{locale === 'fa' ? 'جزئیات تکمیلی ملک' : 'Property Details'}</h3>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: locale === 'fa' ? 'نوع ملک' : 'Type', value: propertyTypeLabels[property.property_type] || property.property_type },
                      { label: locale === 'fa' ? 'هدف' : 'Purpose', value: listingTypeLabels[property.listing_type] },
                      { label: locale === 'fa' ? 'ویو' : 'View', value: property.view_type || (locale === 'fa' ? 'نامشخص' : 'City View') },
                      { label: locale === 'fa' ? 'وضعیت' : 'Condition', value: property.is_upgraded ? (locale === 'fa' ? 'نوسازی شده' : 'Upgraded') : (locale === 'fa' ? 'استاندارد' : 'Standard') },
                      { label: locale === 'fa' ? 'سرویس شارژ' : 'Service Charge', value: property.service_charge || '15 AED / sqft' },
                      { label: locale === 'fa' ? 'مرجع' : 'Ref no.', value: property.ad_code || property.id.slice(0, 8).toUpperCase() },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100/50">
                        <span className="text-slate-400 text-xs font-medium">{item.label}</span>
                        <span className="text-slate-900 font-bold text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Building/Project Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-bold text-slate-900">{locale === 'fa' ? 'اطلاعات ساختمان' : 'Building Stats'}</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between py-2 border-b border-slate-100/50"><span className="text-slate-400 text-xs font-medium">{locale === 'fa' ? 'سازنده' : 'Developer'}</span><span className="text-slate-900 font-bold text-xs uppercase">{detectedDeveloper?.name}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100/50"><span className="text-slate-400 text-xs font-medium">{locale === 'fa' ? 'برج' : 'Tower'}</span><span className="text-slate-900 font-bold text-xs uppercase">{towerName}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100/50"><span className="text-slate-400 text-xs font-medium">{locale === 'fa' ? 'تحویل' : 'Completion'}</span><span className="text-slate-900 font-bold text-xs">{property.handover_date || '--'}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100/50"><span className="text-slate-400 text-xs font-medium">{locale === 'fa' ? 'پارکینگ' : 'Parking'}</span><span className="text-slate-900 font-bold text-xs">{property.parking_spaces || '0'}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100/50"><span className="text-slate-400 text-xs font-medium">{locale === 'fa' ? 'تاریخ ثبت' : 'Listed On'}</span><span className="text-slate-900 font-bold text-xs">{new Date(property.created_at).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Location & Map Section */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">{locale === 'fa' ? 'موقعیت مکانی' : 'Location & Address'}</h3>
                <span className="text-xs text-primary font-bold bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">{areaName}</span>
              </div>
              <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-inner">
                {(() => {
                  const lat = property.latitude || 25.1972;
                  const lon = property.longitude || 55.2744;
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
                {/* Branding Overlay */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 z-10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">{areaName}</span>
                </div>
              </div>
            </div>

            {/* 8. Regulatory Information */}
            <div className="p-6 md:p-8 bg-slate-900 text-white">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">{locale === 'fa' ? 'اطلاعات قانونی' : 'Regulatory'}</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 w-full">
                   <div className="flex justify-between items-center py-2 border-b border-white/10"><span className="text-white/40 text-[10px] font-bold uppercase">Permit Number</span><span className="text-white font-bold text-xs uppercase">{property.ad_code?.split('-')[0] || '71835444815'}</span></div>
                   <div className="flex justify-between items-center py-2 border-b border-white/10"><span className="text-white/40 text-[10px] font-bold uppercase">Agency</span><span className="text-white font-bold text-xs">OB LUX PROPERTIES</span></div>
                   <div className="flex justify-between items-center py-2 border-b border-white/10"><span className="text-white/40 text-[10px] font-bold uppercase">RERA ORN</span><span className="text-white font-bold text-xs">57397</span></div>
                   <div className="flex justify-between items-center py-2 border-b border-white/10"><span className="text-white/40 text-[10px] font-bold uppercase">Area</span><span className="text-white font-bold text-xs uppercase">{areaName}</span></div>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="bg-white p-2 rounded-xl">
                    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://dubailand.gov.ae/en/`} alt="QR" width={80} height={80} />
                  </div>
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] text-center">Trakheesi Permit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (4 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">

              {/* 1. Agent Card - Trust & Conversion */}
              {property.assigned_agent && (
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200/60 group">
                  <div className="p-8">
                    <div className="flex items-center gap-5 mb-8">
                      <Link href={`/${locale}/agents/${property.assigned_agent.slug}`} className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all duration-500 flex-shrink-0">
                        <Image
                          src={property.assigned_agent.avatar_url || "/images/placeholder-agent.jpg"}
                          alt={property.assigned_agent.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>
                      <div>
                        <Link href={`/${locale}/agents/${property.assigned_agent.slug}`} className="block hover:text-primary transition-colors">
                          <h4 className="text-lg font-bold text-slate-900 leading-none">
                            {locale === 'fa' && property.assigned_agent.name_fa ? property.assigned_agent.name_fa : property.assigned_agent.name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <p className="text-primary font-bold text-[10px] uppercase tracking-widest">
                            {locale === 'fa' && property.assigned_agent.title_fa ? property.assigned_agent.title_fa : property.assigned_agent.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        className="h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                        onClick={() => performAction(() => {
                          window.location.href = `tel:${property.assigned_agent?.phone || '+971503491050'}`
                        })}
                      >
                        <Phone className="h-4 w-4" />
                        {locale === 'fa' ? 'تماس' : 'Call'}
                      </Button>
                      <Button 
                        className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-100/20"
                        onClick={() => performAction(() => {
                          window.open(`https://wa.me/${(property.assigned_agent?.whatsapp || '971503491050').replace(/\D/g, '')}`, '_blank')
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
              )}


              {/* 3. Tower Card - Building Insight (Area Style) */}
              {property.tower && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group cursor-pointer hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {towerName}
                      </h4>
                      <p className="text-slate-400 text-xs font-medium mt-1">
                        {property.completion_date ? (locale === 'fa' ? 'آماده تحویل' : 'Ready to Move') : (locale === 'fa' ? 'پروژه در حال ساخت' : 'Off-Plan Project')}
                      </p>
                    </div>
                  </div>

                  {/* Developer Info - Massive Overflowing Logo with Z-Index fix */}
                  {detectedDeveloper && (
                    <div className="relative mb-2 flex items-center gap-0 pt-6 border-t border-slate-100/50 group/dev">
                      <div className="relative h-36 w-64 -ms-10 -my-10 flex-shrink-0 transition-transform duration-700 group-hover/dev:scale-110 z-0">
                        <Image
                          src={detectedDeveloper.logo_url || "/images/placeholder.jpg"}
                          alt={detectedDeveloper.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="space-y-0.5 relative z-10">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none mb-1">{locale === 'fa' ? 'سازنده پروژه' : 'Developed By'}</p>
                        <p className="text-sm font-bold text-slate-900 group-hover/dev:text-primary transition-colors leading-tight">
                          {locale === 'fa' && detectedDeveloper.name_fa ? detectedDeveloper.name_fa : detectedDeveloper.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link href={`/${locale}/for-sale/property/dubai/${property.area?.slug}/${property.tower.slug}`} className="relative z-10 flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-white transition-all font-bold text-xs">
                    <span>{locale === 'fa' ? 'مشاهده تمام واحدهای این برج' : 'View all units in tower'}</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </div>
              )}


              {/* 4. Area Card - Location Insight */}
              {property.area && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group cursor-pointer hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {areaName}
                      </h4>
                      <p className="text-slate-400 text-xs font-medium mt-1">{locale === 'fa' ? 'راهنمای منطقه' : 'Community Guide'}</p>
                    </div>
                  </div>

                  <Link href={`/${locale}/for-sale/property/dubai/${property.area.slug}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-white transition-all font-bold text-xs">
                    <span>{locale === 'fa' ? 'بررسی املاک و لایف‌استایل' : 'Explore Properties & Lifestyle'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Similar Properties - Matched Alignment */}
      {similarProperties.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/30">
          <div className="max-w-[1440px] mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-none">
                  {locale === 'fa' ? 'املاک مشابه' : 'Similar Listings'}
                </h2>
                <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">{locale === 'fa' ? 'شاید این موارد را بپسندید' : 'You might also be interested in these'}</p>
              </div>
              <Link href={`/${locale}/properties`}>
                <Button variant="outline" className="rounded-full px-6 h-11 border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all gap-2 group font-bold">
                  {locale === 'fa' ? 'مشاهده همه' : 'View All Properties'}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.slice(0, 4).map((prop) => {
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
                    hideLabels={true}
                  />
                )
              })}
              {/* Placeholder Cards */}
              {similarProperties.slice(0, 4).length < 4 && Array.from({ length: 4 - similarProperties.slice(0, 4).length }).map((_, i) => (
                <div key={`similar-placeholder-${i}`} className="hidden lg:block border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 min-h-[400px] flex flex-col items-center justify-center p-8 text-slate-300">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <div className="w-6 h-6 border-2 border-slate-200 rounded-md" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">{locale === 'fa' ? 'بزودی' : 'Coming Soon'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Mobile Contact Bar - Bayut Style */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-2">
          <Button 
            className="h-12 bg-slate-900 rounded-xl"
            onClick={() => performAction(() => {
              window.location.href = `tel:${property.assigned_agent?.phone}`
            })}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            className="h-12 bg-[#25D366] rounded-xl"
            onClick={() => performAction(() => {
              window.open(`https://wa.me/${property.assigned_agent?.whatsapp?.replace(/\D/g, '')}`, '_blank')
            })}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button 
            className="h-12 bg-primary rounded-xl font-black uppercase text-xs"
            onClick={() => performAction(() => {
              console.log('Mobile inquiry/email')
            })}
          >
            {locale === 'fa' ? 'پیام' : 'Email'}
          </Button>
        </div>
      </div>
    </div>
  )
}
