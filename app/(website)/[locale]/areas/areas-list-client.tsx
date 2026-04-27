"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { 
  Search, 
  MapPin, 
  Grid3X3, 
  List as ListIcon, 
  ArrowRight,
  Loader2,
  X,
  Compass,
  Trash2,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface Area {
  id: string
  name: string
  name_fa: string | null
  slug: string
  cover_image_url: string | null
  short_description: string | null
  short_description_fa: string | null
  featured: boolean
}

interface AreasListClientProps {
  initialAreas: Area[]
}

export function AreasListClient({ initialAreas }: AreasListClientProps) {
  const { locale, isRtl } = useI18n()
  const fa = locale === 'fa'
  const supabase = createClient()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [displayAreas, setDisplayAreas] = useState<Area[]>(initialAreas)
  const [isLoading, setIsLoading] = useState(false)

  // ── SEARCH LOGIC ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    setIsLoading(true)
    let query = supabase
      .from("areas")
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("name", { ascending: true })

    if (searchTerm) {
      const p = `*${searchTerm}*`
      query = query.or(`name.ilike.${p},name_fa.ilike.${p},short_description.ilike.${p},short_description_fa.ilike.${p}`)
    }

    const { data } = await query
    setDisplayAreas(data || [])
    setIsLoading(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDisplayAreas(initialAreas)
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">HOME</Link>
              <ArrowRight className="w-2.5 h-2.5" />
              <span className="text-slate-600">COMMUNITIES</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 leading-none">
              {fa ? "محله‌های دبی" : "Dubai Communities"}
              <span className="text-primary ml-2 opacity-20">/</span>
              <span className="text-primary/60 ml-2 text-2xl font-sans font-bold">
                {displayAreas.length} {fa ? "منطقه" : "Areas"}
              </span>
            </h1>
          </div>
        </div>

        {/* ══ FLAT SEARCH BAR ══ */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className="flex flex-wrap items-center">
            <div className="flex border-r border-slate-100 bg-slate-50/50">
              <div className="px-6 py-4 flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest border-b-2 border-primary bg-white">
                <Compass className="w-4 h-4" />
                {fa ? "همه مناطق" : "All Communities"}
              </div>
            </div>

            <div className="flex-1 flex items-center px-4 relative min-w-[300px]">
              <Search className="w-4 h-4 text-primary mr-3" />
              <input 
                placeholder={fa ? "جستجوی منطقه یا محله..." : "Search community name, highlights..."}
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

        {/* Active Filters */}
        {searchTerm && (
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
              <span className="text-[9px] font-black text-slate-300 uppercase">SEARCH</span>
              <span className="text-[10px] font-bold text-slate-600">{searchTerm}</span>
              <button onClick={() => {setSearchTerm(""); setDisplayAreas(initialAreas);}}><X className="w-3 h-3 text-slate-300 hover:text-red-500" /></button>
            </div>
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest">
              <Trash2 className="w-3 h-3" />
              {fa ? "حذف همه" : "CLEAR ALL"}
            </button>
          </div>
        )}

        {/* Grid - Premium Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayAreas.map((area) => (
            <Link 
              key={area.id} 
              href={`/${locale}/areas/${area.slug}`}
              className="group relative h-[450px] rounded-[2.5rem] overflow-hidden bg-slate-100 hover:shadow-2xl transition-all duration-700"
            >
              <Image 
                src={area.cover_image_url || "/images/placeholder.jpg"} 
                alt={area.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">DUBAI COMMUNITY</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {fa ? area.name_fa || area.name : area.name}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-8 font-medium leading-relaxed group-hover:text-white transition-colors">
                  {fa ? area.short_description_fa || area.short_description : area.short_description}
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                  {fa ? "مشاهده جزئیات محله" : "Explore Community"}
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {area.featured && (
                <div className="absolute top-8 right-8 px-5 py-2 rounded-full bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
                  Featured
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {displayAreas.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-200 rounded-[3rem]">
            <Search className="w-12 h-12 text-slate-100 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">{fa ? "نتیجه‌ای یافت نشد" : "No Areas Found"}</h3>
            <p className="text-slate-500 max-w-xs mb-8 text-sm font-bold">
              {fa ? "نام محله را تغییر دهید." : "Try searching for a different community name."}
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
