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
  ChevronRight, 
  DollarSign, 
  Euro, 
  IndianRupee,
  Trash2
} from "lucide-react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/hooks/use-currency"
import { AedSymbol } from "@/components/ui/aed-symbol"
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// Dynamic imports for Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const MarkerClusterGroup = dynamic(() => import('react-leaflet-cluster'), { ssr: false })

// Custom Marker Helper
let L: any;
let customIcon: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-pin-container">
            <div class="marker-pin"></div>
            <div class="marker-dot"></div>
          </div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
}

interface MapClientProps {
  initialProperties: any[]
}

export default function MapClient({ initialProperties }: MapClientProps) {
  const { locale } = useI18n()
  const fa = locale === 'fa'
  const { currency, convert } = useCurrency()
  const [properties] = useState(initialProperties)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  // Filter States
  const [filters, setFilters] = useState<any>({
    listing: 'any',
    type: 'any',
    priceMin: '',
    priceMax: '',
    area: ''
  })
  const [category, setCategory] = useState<"residential" | "commercial">("residential")

  const isFiltered = useMemo(() => {
    return filters.listing !== 'any' || 
           filters.type !== 'any' || 
           filters.priceMin !== '' || 
           filters.priceMax !== '' || 
           filters.area !== '' ||
           category !== "residential"
  }, [filters, category])

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

  const getCoords = (p: any): [number, number] | null => {
    if (p.latitude && p.longitude) return [p.latitude, p.longitude]
    if (p.tower?.latitude && p.tower?.longitude) return [p.tower.latitude, p.tower.longitude]
    if (p.area?.latitude && p.area?.longitude) return [p.area.latitude, p.area.longitude]
    return null
  }

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (!getCoords(p)) return false
      if (filters.listing && filters.listing !== 'any' && p.listing_type !== filters.listing) return false
      if (filters.type && filters.type !== 'any' && p.property_type !== filters.type) return false
      if (filters.priceMin && p.price < parseInt(filters.priceMin)) return false
      if (filters.priceMax && p.price > parseInt(filters.priceMax)) return false
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

  const center: [number, number] = [25.2048, 55.2708]

  return (
    <div className="flex flex-col h-screen pt-16 bg-white overflow-hidden">
      
      {/* ══ STYLES FOR CUSTOM PIN ══ */}
      <style jsx global>{`
        .marker-pin-container { position: relative; width: 30px; height: 42px; }
        .marker-pin {
          width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
          background: #0ea5e9; position: absolute; transform: rotate(-45deg);
          left: 50%; top: 50%; margin: -20px 0 0 -15px;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
          border: 2px solid white;
        }
        .marker-dot {
          background: white; width: 10px; height: 10px; border-radius: 50%;
          position: absolute; left: 50%; top: 50%; margin: -10px 0 0 -5px;
        }
        .marker-pin-container:hover .marker-pin { background: #0284c7; transform: rotate(-45deg) scale(1.1); transition: all 0.2s; }
        
        .cluster-icon {
          background: rgba(14, 165, 233, 0.9); border: 3px solid white;
          color: white; font-weight: 800; display: flex; align-items: center;
          justify-content: center; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* ══ ADVANCED SEARCH HEADER ══ */}
      <div className="z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center h-20 px-4">
          {/* Listing Type Tabs */}
          <div className="flex h-12 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 self-center">
            {['any', 'sale', 'rent', 'off_plan'].map((t) => (
              <button
                key={t}
                onClick={() => updateFilter('listing', t)}
                className={cn(
                  "px-6 text-[11px] font-bold uppercase tracking-widest transition-all",
                  filters.listing === t ? "text-white bg-sky-500 shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
              >
                {t === 'any' ? (fa?'همه':'All') : t === 'sale' ? (fa?'خرید':'Sale') : t === 'rent' ? (fa?'اجاره':'Rent') : (fa?'پیش‌فروش':'Off-Plan')}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-100 mx-6 self-center" />

          {/* Category Toggle */}
          <div className="flex items-center gap-2 h-full self-center">
            <button 
              onClick={() => setCategory("residential")} 
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-tight border",
                category === "residential" ? "bg-sky-50 text-sky-600 border-sky-200" : "text-slate-400 border-transparent hover:text-slate-600"
              )}
            >
              {fa ? "مسکونی" : "RESIDENTIAL"}
            </button>
            <button 
              onClick={() => setCategory("commercial")} 
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-tight border",
                category === "commercial" ? "bg-sky-50 text-sky-600 border-sky-200" : "text-slate-400 border-transparent hover:text-slate-600"
              )}
            >
              {fa ? "تجاری" : "COMMERCIAL"}
            </button>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-6 self-center" />

          {/* Property Type */}
          <div className="min-w-[160px] self-center">
            <Select value={filters.type} onValueChange={(v) => updateFilter('type', v)}>
              <SelectTrigger className="h-12 border-slate-100 bg-slate-50/30 font-bold text-[12px] text-slate-700 rounded-xl focus:ring-sky-100 focus:border-sky-300">
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
                  <SelectItem key={t.value} value={t.value} className="text-xs font-semibold py-2.5 px-4">{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2 px-6 self-center">
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-sky-500" />
              <input 
                placeholder="Min" 
                className="w-24 h-11 bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 text-[11px] font-bold outline-none focus:border-sky-300 focus:bg-white transition-all" 
                value={filters.priceMin} 
                onChange={e => updateFilter('priceMin', e.target.value)} 
              />
            </div>
            <span className="text-slate-200 font-bold">-</span>
            <div className="relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-sky-500" />
              <input 
                placeholder="Max" 
                className="w-24 h-11 bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 text-[11px] font-bold outline-none focus:border-sky-300 focus:bg-white transition-all" 
                value={filters.priceMax} 
                onChange={e => updateFilter('priceMax', e.target.value)} 
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center px-6 relative min-w-[200px] h-11 bg-slate-50 border border-slate-100 rounded-xl self-center group focus-within:border-sky-300 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-300 mr-3 group-focus-within:text-sky-500" />
            <input 
              placeholder={fa ? "جستجوی منطقه یا پروژه..." : "Search areas or projects..."}
              className="w-full h-full bg-transparent text-[12px] font-bold outline-none placeholder:text-slate-300"
              value={filters.area}
              onChange={(e) => updateFilter('area', e.target.value)}
            />
          </div>

          {/* Clear Action */}
          <div className="flex items-center pl-6 h-full self-center">
            {isFiltered && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-11 px-6 rounded-xl text-[10px] font-bold text-red-400 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest gap-2 border border-red-50"
              >
                <Trash2 className="w-4 h-4" />
                {fa ? "پاکسازی" : "Clear"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Property List */}
        <div className="w-full lg:w-[420px] bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300 hidden lg:flex">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                  selectedProperty?.id === p.id && "bg-sky-50/30 border-l-4 border-l-sky-500"
                )}
              >
                <div className="relative w-32 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <Image 
                    src={p.cover_image_url || "/images/placeholder.jpg"} 
                    alt={p.title[locale] || p.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-sky-600 transition-colors">
                    {p.title[locale] || p.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{p.area?.name || p.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 mb-2">
                    <div className="flex items-center gap-1"><Bed className="w-3 h-3 text-sky-500/60" /> {p.bedrooms}</div>
                    <div className="flex items-center gap-1"><Bath className="w-3 h-3 text-sky-500/60" /> {p.bathrooms}</div>
                    <div className="flex items-center gap-1"><Maximize className="w-3 h-3 text-sky-500/60" /> {p.size}</div>
                  </div>
                  <p className="text-sm font-bold text-sky-600 flex items-center gap-1" dir="ltr">
                    <CurrencyIconSmall /> {Math.round(convert(p.price || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Map */}
        <div className="flex-1 relative bg-slate-100">
          {typeof window !== 'undefined' && (
            <MapContainer center={center} zoom={11} className="h-full w-full z-10" zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={(cluster: any) => {
                  return L.divIcon({
                    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
                    className: 'custom-cluster-icon',
                    iconSize: L.point(40, 40)
                  });
                }}
              >
                {filteredProperties.map((p) => (
                  <Marker 
                    key={p.id} 
                    position={getCoords(p)!}
                    icon={customIcon}
                    eventHandlers={{ click: () => setSelectedProperty(p) }}
                  >
                    <Popup className="property-popup">
                      <div className="w-48 p-0">
                        <div className="relative h-28 rounded-t-xl overflow-hidden mb-2">
                          <Image src={p.cover_image_url || "/images/placeholder.jpg"} alt="Property" fill className="object-cover" />
                          <Badge className="absolute top-2 right-2 bg-sky-500 text-white border-none font-bold text-[9px] flex items-center gap-1">
                            <CurrencyIconSmall /> {Math.round(convert(p.price || 0)).toLocaleString()}
                          </Badge>
                        </div>
                        <div className="p-2">
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{p.title[locale] || p.title}</h5>
                          <Link href={`/${locale}/properties/${p.slug}`} className="text-[10px] font-bold text-sky-600 flex items-center gap-1 hover:gap-2 transition-all">
                            {fa ? "مشاهده جزئیات" : "View Details"} <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}

          <div className="absolute top-6 right-6 z-[1000]">
            <Button size="icon" variant="white" className="w-10 h-10 rounded-xl shadow-xl shadow-black/10 border-slate-100" onClick={() => window.location.reload()}>
              <Home className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
