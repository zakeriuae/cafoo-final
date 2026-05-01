"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
import Image from "next/image"
import Link from "next/link"
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Maximize, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  X, 
  DollarSign, 
  Euro, 
  IndianRupee,
  Briefcase,
  Trash2
} from "lucide-react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/hooks/use-currency"
import { AedSymbol } from "@/components/ui/aed-symbol"
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// Dynamic imports for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const MarkerClusterGroup = dynamic(() => import('react-leaflet-cluster'), { ssr: false })

// Helper to fix Leaflet icon issue
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

interface MapClientProps {
  initialProperties: any[]
}

export default function MapClient({ initialProperties }: MapClientProps) {
  const { locale, isRtl } = useI18n()
  const content = useContent()
  const fa = locale === 'fa'
  const { currency, convert } = useCurrency()
  const [properties] = useState(initialProperties)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  // Filter States
  const [filters, setFilters] = useState<any>({
    listing: 'any',
    type: 'any',
    priceMin: '',
    priceMax: '',
    area: ''
  })
  const [category, setCategory] = useState<"residential" | "commercial">("residential")

  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      listing: 'any',
      type: 'any',
      priceMin: '',
      priceMax: '',
      area: ''
    })
    setCategory("residential")
  }

  const CurrencyIconSmall = () => {
    if (currency === 'AED') return <AedSymbol size={14} />
    if (currency === 'USD') return <DollarSign className="w-3 h-3" />
    if (currency === 'EUR') return <Euro className="w-3 h-3" />
    if (currency === 'INR') return <IndianRupee className="w-3 h-3" />
    if (currency === 'CNY') return <span className="text-[10px] font-bold">¥</span>
    if (currency === 'IRR') return <span className="text-[8px] font-bold">IRR</span>
    return null
  }

  // Helper to get best available coordinates (Property -> Tower -> Area)
  const getCoords = (p: any): [number, number] | null => {
    if (p.latitude && p.longitude) return [p.latitude, p.longitude]
    if (p.tower?.latitude && p.tower?.longitude) return [p.tower.latitude, p.tower.longitude]
    if (p.area?.latitude && p.area?.longitude) return [p.area.latitude, p.area.longitude]
    return null
  }

  // Client-side filtering logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Must have at least some coordinates to show on map
      if (!getCoords(p)) return false

      // Listing Type
      if (filters.listing && filters.listing !== 'any' && p.listing_type !== filters.listing) return false
      
      // Property Type
      if (filters.type && filters.type !== 'any' && p.property_type !== filters.type) return false
      
      // Price
      if (filters.priceMin && p.price < parseInt(filters.priceMin)) return false
      if (filters.priceMax && p.price > parseInt(filters.priceMax)) return false
      
      // Search / Area
      if (filters.area) {
        const search = filters.area.toLowerCase()
        const title = (p.title[locale] || p.title || "").toLowerCase()
        const address = (p.address || "").toLowerCase()
        const areaName = (p.area?.name || "").toLowerCase()
        if (!title.includes(search) && !address.includes(search) && !areaName.includes(search)) return false
      }
      
      return true
    })
  }, [properties, filters, locale])

  // Default center of Dubai
  const center: [number, number] = [25.2048, 55.2708]

  return (
    <div className="flex flex-col h-screen pt-16 bg-white overflow-hidden">
      
      {/* ══ ADVANCED SEARCH HEADER ══ */}
      <div className="z-30 bg-white border-b border-slate-100 shadow-md">
        <div className="flex flex-wrap items-center h-20">
          {/* Listing Type Tabs */}
          <div className="flex h-full border-r border-slate-50 bg-slate-50/50">
            {['any', 'sale', 'rent', 'off_plan'].map((t) => (
              <button
                key={t}
                onClick={() => updateFilter('listing', t)}
                className={cn(
                  "px-8 text-[11px] font-black uppercase tracking-widest transition-all border-b-4 h-full",
                  filters.listing === t ? "text-primary border-primary bg-white" : "text-slate-400 border-transparent hover:text-slate-600"
                )}
              >
                {t === 'any' ? (fa?'همه':'All') : t === 'sale' ? (fa?'خرید':'Sale') : t === 'rent' ? (fa?'اجاره':'Rent') : (fa?'پیش‌فروش':'Off-Plan')}
              </button>
            ))}
          </div>

          {/* Category Toggle */}
          <div className="flex items-center px-6 border-r border-slate-50 gap-2 h-full">
            <button 
              onClick={() => setCategory("residential")} 
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-tighter",
                category === "residential" ? "bg-primary/10 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {fa ? "مسکونی" : "RESIDENTIAL"}
            </button>
            <button 
              onClick={() => setCategory("commercial")} 
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-tighter",
                category === "commercial" ? "bg-primary/10 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {fa ? "تجاری" : "COMMERCIAL"}
            </button>
          </div>

          {/* Property Type Dropdown */}
          <div className="border-r border-slate-50 min-w-[180px]">
            <Select value={filters.type} onValueChange={(v) => updateFilter('type', v)}>
              <SelectTrigger className="h-20 border-none shadow-none font-black text-[13px] text-slate-800 rounded-none focus:ring-0 px-6">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
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
                  <SelectItem key={t.value} value={t.value} className="text-xs font-bold py-3 px-4">{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2 px-6 border-r border-slate-50 h-full">
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 group-focus-within:text-primary" />
              <input 
                placeholder="Min" 
                className="w-24 h-12 bg-slate-50 rounded-xl pl-8 pr-3 text-[12px] font-bold outline-none border border-transparent focus:border-primary/20 focus:bg-white transition-all" 
                value={filters.priceMin} 
                onChange={e => updateFilter('priceMin', e.target.value)} 
              />
            </div>
            <span className="text-slate-200 font-bold">-</span>
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 group-focus-within:text-primary" />
              <input 
                placeholder="Max" 
                className="w-24 h-12 bg-slate-50 rounded-xl pl-8 pr-3 text-[12px] font-bold outline-none border border-transparent focus:border-primary/20 focus:bg-white transition-all" 
                value={filters.priceMax} 
                onChange={e => updateFilter('priceMax', e.target.value)} 
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center px-8 relative min-w-[250px] h-full group">
            <Search className="w-5 h-5 text-primary/40 mr-4 group-focus-within:text-primary transition-colors" />
            <input 
              placeholder={fa ? "جستجوی منطقه یا پروژه..." : "Search areas or projects..."}
              className="w-full h-full bg-transparent text-[13px] font-bold outline-none placeholder:text-slate-300"
              value={filters.area}
              onChange={(e) => updateFilter('area', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 px-6 h-full">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-12 px-5 rounded-2xl text-[11px] font-black text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {fa ? "پاکسازی" : "Clear"}
            </Button>
            
            <div className="hidden lg:flex p-1.5 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setViewMode('map')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'map' ? "bg-white text-primary shadow-md" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {fa ? "نقشه" : "Map"}
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'list' ? "bg-white text-primary shadow-md" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {fa ? "لیست" : "List"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Property List */}
        <div className={cn(
          "w-full lg:w-[420px] bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300",
          viewMode === 'map' ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filteredProperties.length} {fa ? "ملک یافت شد" : "Properties Found"}
            </p>
          </div>
          
          <div className="divide-y divide-slate-50">
            {filteredProperties.map((p) => (
              <div 
                key={p.id}
                onMouseEnter={() => setSelectedProperty(p)}
                className={cn(
                  "p-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-all group",
                  selectedProperty?.id === p.id && "bg-primary/[0.03] border-l-4 border-l-primary"
                )}
              >
                <div className="relative w-32 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <Image 
                    src={p.cover_image_url || "/images/placeholder.jpg"} 
                    alt={p.title[locale] || p.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-slate-900 border-none text-[8px] px-2 py-0.5 font-bold uppercase tracking-tighter">
                    {p.listing_type}
                  </Badge>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                    {p.title[locale] || p.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{p.area?.name || p.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3 h-3 text-primary/60" /> {p.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3 h-3 text-primary/60" /> {p.bathrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-3 h-3 text-primary/60" /> {p.size}
                    </div>
                  </div>
                  
                  <p className="text-sm font-black text-primary flex items-center gap-1" dir="ltr">
                    <CurrencyIconSmall /> {Math.round(convert(p.price || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {filteredProperties.length === 0 && (
              <div className="p-12 text-center">
                <Search className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-400">{fa ? "نتیجه‌ای یافت نشد" : "No results found"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Map */}
        <div className={cn(
          "flex-1 relative bg-slate-100",
          viewMode === 'list' ? "hidden lg:block" : "block"
        )}>
          {typeof window !== 'undefined' && (
            <MapContainer 
              center={center} 
              zoom={11} 
              className="h-full w-full z-10"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <MarkerClusterGroup
                chunkedLoading
                polygonOptions={{
                  fillColor: '#6366f1',
                  color: '#6366f1',
                  weight: 0.5,
                  opacity: 1,
                  fillOpacity: 0.1,
                }}
              >
                {filteredProperties.map(p => {
                  const coords = getCoords(p)
                  if (!coords) return null
                  
                  return (
                    <Marker 
                      key={p.id} 
                      position={coords}
                      eventHandlers={{
                        click: () => setSelectedProperty(p),
                      }}
                    >
                      <Popup className="property-popup">
                        <div className="w-48 p-0">
                          <div className="relative h-28 rounded-t-xl overflow-hidden mb-2">
                            <Image src={p.cover_image_url || "/images/placeholder.jpg"} alt="Property" fill className="object-cover" />
                            <Badge className="absolute top-2 right-2 bg-primary text-white border-none font-black text-[9px] flex items-center gap-1">
                              <CurrencyIconSmall /> {Math.round(convert(p.price || 0)).toLocaleString()}
                            </Badge>
                          </div>
                          <div className="p-2">
                            <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{p.title[locale] || p.title}</h5>
                            <Link href={`/${locale}/properties/${p.slug}`} className="text-[10px] font-black text-primary flex items-center gap-1 hover:gap-2 transition-all">
                              {fa ? "مشاهده جزئیات" : "View Details"} <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}

          {/* Map Controls */}
          <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
            <Button size="icon" variant="white" className="w-10 h-10 rounded-xl shadow-xl shadow-black/10 border-slate-100" onClick={() => window.location.reload()}>
              <Home className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
          
          {/* Mobile Overlay Toggle */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] lg:hidden">
            <Button 
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className="rounded-full h-12 px-8 bg-slate-900 text-white shadow-2xl font-black text-[10px] uppercase tracking-widest gap-2"
            >
              {viewMode === 'map' ? (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {fa ? "نمایش لیست" : "Show List"}
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  {fa ? "نمایش نقشه" : "Show Map"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
