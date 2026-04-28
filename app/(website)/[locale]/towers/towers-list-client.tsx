"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { 
  Search, 
  MapPin, 
  Building2, 
  Grid3X3, 
  List as ListIcon, 
  ArrowRight,
  Loader2,
  X,
  Building,
  Trash2,
  TrendingUp,
  Calendar
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { SmartImage } from "@/components/ui/smart-image"

interface Tower {
  id: string
  name: string
  name_fa: string | null
  slug: string
  cover_image_url: string | null
  short_description: string | null
  short_description_fa: string | null
  featured: boolean
  status: string
  starting_price: string | number | null
  payment_plan: string | null
  payment_plan_fa: string | null
  delivery_date: string | null
  delivery_date_fa: string | null
  is_off_plan: boolean
  area: { id: string; name: string; name_fa: string | null; slug: string } | null
  developer: { id: string; name: string; logo_url: string | null } | null
}

interface TowersListClientProps {
  initialTowers: Tower[]
  areas: any[]
}

export function TowersListClient({ initialTowers, areas }: TowersListClientProps) {
  const { locale, isRtl } = useI18n()
  const content = useContent()
  const fa = locale === 'fa'
  const supabase = createClient()
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState("all")
  
  // States for data
  const [displayTowers, setDisplayTowers] = useState<Tower[]>(initialTowers)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialTowers.length === 50)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // Helper to get developer logo mapping (local assets)
  const getDeveloperLogo = (name: string, logoFromDb?: string | null) => {
    if (!name) return logoFromDb || null;
    const mapping: Record<string, string> = {
      'emaar': '/images/developers/emaar.png',
      'damac': '/images/developers/damac.png',
      'sobha': '/images/developers/sobhan.png',
      'nakheel': '/images/developers/nakheel.png',
      'binghatti': '/images/developers/binghati.png',
      'tiger': '/images/developers/tiger.png',
      'aldar': '/images/developers/aldar.png',
      'danube': '/images/developers/danube.png',
      'dubai properties': '/images/developers/dubai.png',
      'meraas': '/images/developers/meraas.png',
    };
    const searchName = name.toLowerCase();
    const foundKey = Object.keys(mapping).find(key => searchName.includes(key));
    if (foundKey) return mapping[foundKey];
    if (logoFromDb && logoFromDb.startsWith('http')) return logoFromDb;
    return logoFromDb || null;
  };

  // ── SEARCH LOGIC ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    setIsLoading(true)
    setPage(0)
    let query = supabase
      .from("towers")
      .select("*, area:areas(id, name, name_fa, slug), developer:developers(id, name, logo_url)")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("name", { ascending: true })
      .range(0, 49)

    if (searchTerm) {
      const p = `%${searchTerm}%`
      query = query.or(`name.ilike.${p},name_fa.ilike.${p}`)
    }
    if (selectedArea !== "all") {
      const areaId = areas.find(a => a.slug === selectedArea)?.id
      if (areaId) query = query.eq("area_id", areaId)
    }

    const { data } = await query
    setDisplayTowers(data || [])
    setHasMore((data?.length || 0) === 50)
    setIsLoading(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedArea("all")
    setDisplayTowers(initialTowers)
    setPage(0)
    setHasMore(initialTowers.length === 50)
  }

  const loadMore = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    const nextPage = page + 1
    const from = nextPage * 50
    const to = from + 49
    let query = supabase
      .from("towers")
      .select("*, area:areas(id, name, name_fa, slug), developer:developers(id, name, logo_url)")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("name", { ascending: true })
      .range(from, to)

    if (searchTerm) {
      const p = `%${searchTerm}%`
      query = query.or(`name.ilike.${p},name_fa.ilike.${p}`)
    }
    if (selectedArea !== "all") {
      const areaId = areas.find(a => a.slug === selectedArea)?.id
      if (areaId) query = query.eq("area_id", areaId)
    }

    const { data } = await query
    if (data && data.length > 0) {
      setDisplayTowers(prev => [...prev, ...data])
      setPage(nextPage)
      setHasMore(data.length === 50)
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore) loadMore() },
      { threshold: 0.5 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, page, isLoading])

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">HOME</Link>
              <ArrowRight className="w-2.5 h-2.5" />
              <span className="text-slate-600">TOWERS & PROJECTS</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 leading-none">
              {fa ? "برج‌ها و پروژه‌ها" : "Towers & Districts"}
              <span className="text-primary ml-2 opacity-20">/</span>
              <span className="text-primary/60 ml-2 text-2xl font-sans font-bold">
                {displayTowers.length} {fa ? "مورد" : "Results"}
              </span>
            </h1>
          </div>
        </div>

        {/* ══ FLAT FILTER BAR ══ */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className="flex flex-wrap items-center">
            <div className="flex border-r border-slate-100 bg-slate-50/50">
              <div className="px-6 py-4 flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest border-b-2 border-primary bg-white">
                <Building className="w-4 h-4" />
                {fa ? "همه برج‌ها" : "All Developments"}
              </div>
            </div>

            <div className="border-r border-slate-100 min-w-[200px]">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="h-14 border-none shadow-none font-bold text-xs text-slate-700 rounded-none focus:ring-0">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-bold">{fa ? "همه مناطق" : "All Areas"}</SelectItem>
                  {areas.map(a => (
                    <SelectItem key={a.id} value={a.slug} className="text-xs font-bold">{fa ? a.name_fa || a.name : a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex items-center px-4 relative min-w-[300px]">
              <Search className="w-4 h-4 text-primary mr-3" />
              <input 
                placeholder={fa ? "جستجوی برج، منطقه یا پروژه..." : "Search tower, area or project name..."}
                className="w-full h-14 bg-transparent text-xs font-bold outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <button onClick={handleSearch} className="h-14 px-8 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center gap-2">
              <Search className="w-4 h-4" strokeWidth={3} />
              {fa ? "جستجو" : "SEARCH"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTowers.map((tower, index) => {
            const towerName = fa ? tower.name_fa || tower.name : tower.name;
            const areaName = fa ? tower.area?.name_fa || tower.area?.name : tower.area?.name;
            const devLogo = tower.developer ? getDeveloperLogo(tower.developer.name, tower.developer.logo_url) : null;
            
            // Manual image replacement for requested towers
            let towerImage = tower.cover_image_url || "/images/placeholder.jpg";
            
            return (
              <Link 
                key={tower.id} 
                href={`/${locale}/towers/${tower.slug}`}
                className="group transition-all duration-700 block"
              >
                <div className="relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <SmartImage
                      src={towerImage}
                      size="card"
                      alt={towerName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 start-4 flex gap-2">
                      <Badge className={cn(
                        "backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold",
                        tower.is_off_plan ? "bg-secondary/80" : "bg-green-500/80"
                      )}>
                        {tower.is_off_plan ? (fa ? "در حال ساخت" : "Off-Plan") : (fa ? "آماده تحویل" : "Ready")}
                      </Badge>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between">
                      <div>
                        <p className="text-white/70 text-xs font-medium mb-1">{fa ? "شروع قیمت از" : "Starting From"}</p>
                        <p className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5" dir="ltr">
                          <AedSymbol size={22} className="flex-shrink-0" /> {tower.starting_price || "TBA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {towerName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground/60" />
                      <span className="text-sm font-medium">{areaName}</span>
                    </div>
                    
                    {/* Stats Box */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 mb-5">
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                          {fa ? "زمان تحویل" : "Handover"}
                        </p>
                        <p className="text-sm font-bold text-foreground leading-none">
                          {fa ? tower.delivery_date_fa || tower.delivery_date : tower.delivery_date || "TBA"}
                        </p>
                      </div>
                      <div className="border-s border-border/40 ps-4">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                          {fa ? "طرح پرداخت" : "Payment Plan"}
                        </p>
                        <p className="text-sm font-bold text-foreground leading-none">
                          {fa ? tower.payment_plan_fa || tower.payment_plan : tower.payment_plan || "TBA"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <div className="relative h-6 w-32">
                        {devLogo ? (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-20 w-32 grayscale-0 opacity-100 transition-all duration-500">
                            <Image
                              src={devLogo}
                              alt={tower.developer?.name || "Developer"}
                              fill
                              className="object-contain object-left"
                            />
                          </div>
                        ) : tower.developer?.name ? (
                          <div className="flex items-center gap-2 h-full">
                            <Building2 className="h-4 w-4 text-primary/70" />
                            <span className="text-xs font-bold text-foreground/80 uppercase tracking-wide truncate">
                              {tower.developer.name}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all cursor-pointer">
                        {fa ? "مشاهده جزئیات" : "View Details"}
                        <ArrowRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Loader */}
        <div ref={observerRef} className="py-20 flex justify-center">
          {isLoading && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
          {!hasMore && displayTowers.length > 0 && (
            <div className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] border-t border-slate-100 pt-8 w-full text-center">
              {fa ? "پایان لیست" : "END OF LIST"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
