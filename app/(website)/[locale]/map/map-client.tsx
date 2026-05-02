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

  // Leaflet Icons (Internal to avoid SSR)
  let L: any;
  if (typeof window !== 'undefined') {
    L = require('leaflet');
  }

  const createPriceIcon = (price: number) => {
    const formattedPrice = Math.round(convert(price)).toLocaleString()
    const label = currency === 'AED' ? 'AED' : currency
    
    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div class="price-pill">
          <span class="currency-tag">${label}</span>
          <span class="price-value">${formattedPrice}</span>
          <div class="pill-tail"></div>
        </div>
      `,
      iconSize: [80, 32],
      iconAnchor: [40, 32]
    })
  }

  const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount()
    return L.divIcon({
      html: `
        <div class="modern-cluster">
          <div class="cluster-inner">${count}</div>
          <div class="cluster-ring"></div>
        </div>
      `,
      className: 'custom-cluster-marker',
      iconSize: [44, 44]
    })
  }

  return (
    <div className="flex flex-col h-screen pt-16 bg-white overflow-hidden">
      
      {/* ══ STYLES FOR PREMIUM MARKERS ══ */}
      <style jsx global>{`
        /* Price Pill Style */
        .price-pill {
          background: #0ea5e9;
          color: white;
          padding: 4px 10px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
          border: 1.5px solid white;
          white-space: nowrap;
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .price-pill .currency-tag { opacity: 0.7; font-size: 8px; font-weight: 900; }
        .price-pill .price-value { letter-spacing: -0.2px; }
        .pill-tail {
          position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
          width: 0; height: 0; border-left: 6px solid transparent;
          border-right: 6px solid transparent; border-top: 6px solid #0ea5e9;
        }
        .custom-price-marker:hover .price-pill {
          transform: scale(1.1) translateY(-4px);
          background: #0284c7;
          z-index: 1000;
        }

        /* Modern Cluster Style */
        .modern-cluster {
          position: relative; width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
        }
        .cluster-inner {
          width: 32px; height: 32px; background: #0f172a; color: white;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 900; z-index: 2;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #0ea5e9;
        }
        .cluster-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(14, 165, 233, 0.2);
          animation: cluster-pulse 2s infinite;
        }
        @keyframes cluster-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        /* Leaflet Overrides */
        .leaflet-popup-content-wrapper { border-radius: 20px; padding: 0; overflow: hidden; }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-tip-container { display: none; }
      `}</style>

      {/* ══ ADVANCED SEARCH HEADER ══ */}
      <div className="z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center h-20 px-6 gap-2">
          {/* Listing Type Tabs */}
          <div className="flex h-11 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 self-center">
            {['any', 'sale', 'rent', 'off_plan'].map((t) => (
              <button
                key={t}
                onClick={() => updateFilter('listing', t)}
                className={cn(
                  "px-6 text-[10px] font-bold uppercase tracking-widest transition-all",
                  filters.listing === t ? "text-white bg-slate-900" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
              >
                {t === 'any' ? (fa?'همه':'All') : t === 'sale' ? (fa?'خرید':'Sale') : t === 'rent' ? (fa?'اجاره':'Rent') : (fa?'پیش‌فروش':'Off-Plan')}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-100 mx-2 self-center" />

          {/* Category Toggle */}
          <div className="flex items-center gap-1.5 h-full self-center">
            {["residential", "commercial"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat as any)} 
                className={cn(
                  "px-5 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tight",
                  category === cat ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                )}
              >
                {cat === 'residential' ? (fa ? "مسکونی" : "RESIDENTIAL") : (fa ? "تجاری" : "COMMERCIAL")}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-100 mx-2 self-center" />

          {/* Property Type */}
          <div className="min-w-[150px] self-center">
            <Select value={filters.type} onValueChange={(v) => updateFilter('type', v)}>
              <SelectTrigger className="h-11 border-slate-100 bg-slate-50/30 font-bold text-[11px] text-slate-700 rounded-xl focus:ring-sky-100">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
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
                  <SelectItem key={t.value} value={t.value} className="text-[11px] font-semibold">{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center px-5 relative min-w-[200px] h-11 bg-slate-50 border border-slate-100 rounded-xl self-center group focus-within:border-sky-300 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-300 mr-3 group-focus-within:text-sky-500" />
            <input 
              placeholder={fa ? "جستجوی منطقه یا پروژه..." : "Search areas or projects..."}
              className="w-full h-full bg-transparent text-[12px] font-bold outline-none placeholder:text-slate-300"
              value={filters.area}
              onChange={(e) => updateFilter('area', e.target.value)}
            />
          </div>

          {/* Clear Action */}
          <div className="flex items-center self-center">
            {isFiltered && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-11 px-6 rounded-xl text-[10px] font-bold text-red-400 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest border border-red-50 gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {fa ? "پاکسازی" : "Clear"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Property List */}
        <div className="w-full lg:w-[400px] bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-slate-50 bg-slate-50/30">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {filteredProperties.length} {fa ? "ملک یافت شد" : "Properties Found"}
            </p>
          </div>
          
          <div className="divide-y divide-slate-50">
            {filteredProperties.map((p) => (
              <div 
                key={p.id}
                onMouseEnter={() => setSelectedProperty(p)}
                className={cn(
                  "p-5 flex gap-5 cursor-pointer hover:bg-slate-50/50 transition-all group border-l-4 border-transparent",
                  selectedProperty?.id === p.id && "bg-sky-50/30 border-l-sky-500"
                )}
              >
                <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <Image 
                    src={p.cover_image_url || "/images/placeholder.jpg"} 
                    alt={p.title[locale] || p.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-sky-600 transition-colors">
                    {p.title[locale] || p.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mb-2">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate uppercase tracking-tighter">{p.area?.name || p.address}</span>
                  </div>
                  <p className="text-sm font-black text-sky-600 flex items-center gap-1" dir="ltr">
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
                iconCreateFunction={createClusterIcon}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
              >
                {filteredProperties.map((p) => (
                  <Marker 
                    key={p.id} 
                    position={getCoords(p)!}
                    icon={createPriceIcon(p.price)}
                    eventHandlers={{ click: () => setSelectedProperty(p) }}
                  >
                    <Popup closeButton={false} offset={[0, -10]}>
                      <div className="w-56 p-0 group">
                        <div className="relative h-32 overflow-hidden mb-0">
                          <Image src={p.cover_image_url || "/images/placeholder.jpg"} alt="Property" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <p className="text-white font-black text-sm flex items-center gap-1" dir="ltr">
                              <CurrencyIconSmall /> {Math.round(convert(p.price || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mb-3">{p.title[locale] || p.title}</h5>
                          <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-slate-500">
                            <span className="flex items-center gap-1"><Bed className="w-3 h-3 text-sky-500" /> {p.bedrooms}</span>
                            <span className="flex items-center gap-1"><Maximize className="w-3 h-3 text-sky-500" /> {p.size}</span>
                          </div>
                          <Link href={`/${locale}/properties/${p.slug}`} className="block text-center py-2.5 rounded-lg bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest hover:bg-sky-600 transition-all">
                            {fa ? "مشاهده جزئیات" : "View Property"}
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
            <Button size="icon" variant="white" className="w-10 h-10 rounded-xl shadow-2xl shadow-black/10 border-slate-100" onClick={() => window.location.reload()}>
              <Home className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
