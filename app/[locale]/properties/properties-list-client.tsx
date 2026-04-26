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
  BedDouble, 
  Ruler, 
  Calendar, 
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ArrowRight,
  ChevronDown,
  Briefcase,
  DollarSign,
  Trash2,
  Loader2
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { buildSeoUrl } from "@/lib/seo-router"
import { createClient } from "@/lib/supabase/client"

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

interface PropertiesListClientProps {
  properties: Property[]
  initialFilters: any
}

export function PropertiesListClient({ properties: initialProperties, initialFilters }: PropertiesListClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isRtl, locale } = useI18n()
  const content = useContent()
  const fa = locale === 'fa'
  const supabase = createClient()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [localFilters, setLocalFilters] = useState(initialFilters)
  
  // Infinite Scroll States
  const [displayProperties, setDisplayProperties] = useState<Property[]>(initialProperties)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialProperties.length === 50)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // Sync with initial properties when filters change (server-side refresh)
  useEffect(() => {
    setDisplayProperties(initialProperties)
    setLocalFilters(initialFilters)
    setPage(0)
    setHasMore(initialProperties.length === 50)
  }, [initialProperties, initialFilters])

  const updateLocalFilter = (key: string, value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, [key]: value }
      if (value === 'all' || value === '' || value === 'any') delete (next as any)[key]
      return next
    })
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.set(key, value as string)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setLocalFilters({})
    router.push(pathname)
  }

  const removeTag = (key: string) => {
    const next = { ...localFilters }
    delete (next as any)[key]
    setLocalFilters(next)
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v as string) })
    router.push(`${pathname}?${params.toString()}`)
  }

  // ── LOAD MORE FUNCTION ───────────────────────────────────────────────────
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    
    const nextPage = page + 1
    const from = nextPage * 50
    const to = from + 49

    let query = supabase
      .from("properties")
      .select("*, area:areas(name, name_fa, slug), tower:towers(name, name_fa)")
      .eq("content_status", "published")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to)

    // Re-apply same filters for client-side fetch
    if (initialFilters.listing) query = query.eq("listing_type", initialFilters.listing)
    if (initialFilters.type && initialFilters.type !== 'any') query = query.eq("property_type", initialFilters.type)
    if (initialFilters.bedrooms && initialFilters.bedrooms !== 'any') {
      if (initialFilters.bedrooms === 'studio') query = query.eq("bedrooms", 0)
      else if (parseInt(initialFilters.bedrooms) >= 4) query = query.gte("bedrooms", 4)
      else query = query.eq("bedrooms", parseInt(initialFilters.bedrooms))
    }
    if (initialFilters.priceMin) query = query.gte("price", parseInt(initialFilters.priceMin))
    if (initialFilters.priceMax) query = query.lte("price", parseInt(initialFilters.priceMax))
    if (initialFilters.area) query = query.or(`title.ilike.%${initialFilters.area}%,description.ilike.%${initialFilters.area}%`)

    const { data, error } = await query
    
    if (data && data.length > 0) {
      setDisplayProperties(prev => [...prev, ...data])
      setPage(nextPage)
      setHasMore(data.length === 50)
    } else {
      setHasMore(false)
    }
    
    setIsLoadingMore(false)
  }

  // Intersection Observer Effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore) loadMore() },
      { threshold: 0.5 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, page, isLoadingMore])

  const [category, setCategory] = useState<"residential" | "commercial">(
    (initialFilters.type === 'office' || initialFilters.type === 'shop' || initialFilters.type === 'warehouse') 
    ? "commercial" : "residential"
  )

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">HOME</Link>
              <ArrowRight className="w-2.5 h-2.5" />
              <span className="text-slate-600">PROPERTIES</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 leading-none">
              {fa ? "جستجوی ملک" : "Property Search"}
              <span className="text-primary ml-2 opacity-20">/</span>
              <span className="text-primary/60 ml-2 text-2xl font-sans font-bold">
                {displayProperties.length} {fa ? "ملک" : "Results"}
              </span>
            </h1>
          </div>

          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shrink-0">
            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}><Grid3X3 className="h-4 w-4" /></button>
            <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}><List className="h-4 w-4" /></button>
          </div>
        </div>

        {/* ══ SEARCH BAR ══ */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
          <div className="flex flex-wrap items-center">
            <div className="flex border-r border-slate-100 bg-slate-50/50">
              {['sale', 'rent', 'off_plan'].map((t) => (
                <button
                  key={t}
                  onClick={() => updateLocalFilter('listing', t)}
                  className={cn(
                    "px-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2",
                    localFilters.listing === t ? "text-primary border-primary bg-white" : "text-slate-400 border-transparent hover:text-slate-600"
                  )}
                >
                  {t === 'sale' ? (fa?'خرید':'Sale') : t === 'rent' ? (fa?'اجاره':'Rent') : (fa?'پیش‌فروش':'Off-Plan')}
                </button>
              ))}
            </div>

            <div className="flex items-center px-4 border-r border-slate-100 gap-1">
              <button onClick={() => setCategory("residential")} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all", category==="residential"?"bg-primary/10 text-primary":"text-slate-400")}>
                {fa ? "مسکونی" : "RESIDENTIAL"}
              </button>
              <button onClick={() => setCategory("commercial")} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all", category==="commercial"?"bg-primary/10 text-primary":"text-slate-400")}>
                {fa ? "تجاری" : "COMMERCIAL"}
              </button>
            </div>

            <div className="border-r border-slate-100 min-w-[140px]">
              <Select value={localFilters.type || "any"} onValueChange={(v) => updateLocalFilter('type', v)}>
                <SelectTrigger className="h-14 border-none shadow-none font-bold text-xs text-slate-700 rounded-none focus:ring-0">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {(category === "residential" ? [
                    { value:"any", label: fa?"همه انواع":"All Types" },
                    { value:"apartment", label: fa?"آپارتمان":"Apartment" },
                    { value:"villa", label: fa?"ویلا":"Villa" },
                    { value:"townhouse", label: fa?"تاون‌هاوس":"Townhouse" },
                    { value:"studio", label: fa?"استودیو":"Studio" },
                  ] : [
                    { value:"any", label: fa?"همه انواع":"All Types" },
                    { value:"office", label: fa?"دفتر کار":"Office" },
                    { value:"shop", label: fa?"مغازه":"Shop" },
                    { value:"warehouse", label: fa?"انبار":"Warehouse" },
                  ]).map(t => (
                    <SelectItem key={t.value} value={t.value} className="text-xs font-bold">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 px-4 border-r border-slate-100">
              <DollarSign className="w-3 h-3 text-slate-300" />
              <input placeholder="Min" className="w-16 h-10 bg-transparent text-[11px] font-bold outline-none" value={localFilters.priceMin || ""} onChange={e => updateLocalFilter('priceMin', e.target.value)} />
              <span className="text-slate-200">|</span>
              <input placeholder="Max" className="w-16 h-10 bg-transparent text-[11px] font-bold outline-none" value={localFilters.priceMax || ""} onChange={e => updateLocalFilter('priceMax', e.target.value)} />
            </div>

            <div className="flex-1 flex items-center px-4 relative min-w-[200px]">
              <MapPin className="w-4 h-4 text-primary mr-3" />
              <input 
                placeholder={fa ? "جستجوی مکان..." : "Area, tower or project..."}
                className="w-full h-14 bg-transparent text-xs font-bold outline-none placeholder:text-slate-400"
                value={localFilters.area || ""}
                onChange={(e) => updateLocalFilter('area', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <button onClick={applyFilters} className="h-14 px-8 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center gap-2">
              <Search className="w-4 h-4" strokeWidth={3} />
              {fa ? "جستجو" : "SEARCH"}
            </button>
          </div>
        </div>

        {/* Chips */}
        {Object.keys(localFilters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === 'any') return null
              return (
                <Badge key={key} variant="secondary" className="px-3 py-1.5 rounded-lg gap-2 bg-white border border-slate-200 text-slate-600 shadow-none">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{key}</span>
                  <span className="font-bold text-[10px]">{value}</span>
                  <button onClick={() => removeTag(key)}><X className="w-3 h-3 text-slate-300 hover:text-primary" /></button>
                </Badge>
              )
            })}
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest border border-transparent hover:border-red-100">
              <Trash2 className="w-3 h-3" />
              {fa ? "حذف همه" : "CLEAR ALL"}
            </button>
          </div>
        )}

        {/* Results Grid */}
        <div className={cn(
          "grid gap-8",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-5xl mx-auto"
        )}>
          {displayProperties.map((property) => {
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

        {/* Loading Indicator / Observer Target */}
        <div ref={observerRef} className="py-12 flex justify-center">
          {isLoadingMore && (
            <div className="flex items-center gap-3 text-primary animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-black uppercase tracking-widest">{fa ? "در حال بارگذاری..." : "Loading More..."}</span>
            </div>
          )}
          {!hasMore && displayProperties.length > 0 && (
            <div className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] border-t border-slate-100 pt-8 w-full text-center">
              {fa ? "پایان لیست" : "END OF LIST"}
            </div>
          )}
        </div>

        {/* Empty State */}
        {displayProperties.length === 0 && !isLoadingMore && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-200 rounded-3xl">
            <Search className="w-12 h-12 text-slate-100 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">{fa ? "نتیجه‌ای یافت نشد" : "No Properties Found"}</h3>
            <p className="text-slate-500 max-w-xs mb-8 text-sm font-bold">
              {fa ? "فیلترها را تغییر دهید یا منطقه دیگری را جستجو کنید." : "Try adjusting your filters to find what you're looking for."}
            </p>
            <Button onClick={clearFilters} variant="outline" className="rounded-xl px-10 h-12 font-black border-slate-200">
              {fa ? "نمایش همه" : "Show All"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
