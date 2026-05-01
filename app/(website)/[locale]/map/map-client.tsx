"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
import Image from "next/image"
import Link from "next/link"
import { MapPin, Home, Bed, Bath, Maximize, Search, SlidersHorizontal, ChevronRight, X } from "lucide-react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import 'leaflet/dist/leaflet.css'

// Dynamic imports for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

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
  const [properties, setProperties] = useState(initialProperties)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  // Default center of Dubai
  const center: [number, number] = [25.2048, 55.2708]

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const title = p.title[locale] || p.title || ""
      const address = p.address || ""
      return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             address.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [properties, searchQuery, locale])

  return (
    <div className="flex flex-col h-screen pt-16 bg-white overflow-hidden">
      {/* Top Header Filter */}
      <div className="h-16 border-b border-slate-100 bg-white flex items-center px-4 md:px-6 gap-4 z-20 shrink-0">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder={isRtl ? "جستجوی منطقه یا پروژه..." : "Search areas or projects..."}
            className={cn(
              "pl-10 h-10 bg-slate-50 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-xs font-semibold",
              isRtl && "pr-10 pl-4 text-right"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 gap-2 font-bold text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {isRtl ? "فیلترها" : "Filters"}
          </Button>
          
          <div className="hidden sm:flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'map' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {isRtl ? "نقشه" : "Map"}
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {isRtl ? "لیست" : "List"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Property List */}
        <div className={cn(
          "w-full lg:w-[420px] bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300",
          viewMode === 'map' ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-4 border-b border-slate-50 bg-slate-50/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filteredProperties.length} {isRtl ? "ملک یافت شد" : "Properties Found"}
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
                  
                  <p className="text-sm font-black text-primary" dir="ltr">
                    AED {p.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
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
              
              {filteredProperties.map(p => (
                p.latitude && p.longitude && (
                  <Marker 
                    key={p.id} 
                    position={[p.latitude, p.longitude]}
                    eventHandlers={{
                      click: () => setSelectedProperty(p),
                    }}
                  >
                    <Popup className="property-popup">
                      <div className="w-48 p-0">
                        <div className="relative h-28 rounded-t-xl overflow-hidden mb-2">
                          <Image src={p.cover_image_url || "/images/placeholder.jpg"} alt="Property" fill className="object-cover" />
                          <Badge className="absolute top-2 right-2 bg-primary text-white border-none font-black text-[9px]">
                            AED {p.price?.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="p-2">
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{p.title[locale] || p.title}</h5>
                          <Link href={`/${locale}/properties/${p.slug}`} className="text-[10px] font-black text-primary flex items-center gap-1 hover:gap-2 transition-all">
                            {isRtl ? "مشاهده جزئیات" : "View Details"} <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          )}

          {/* Map Controls */}
          <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
            <Button size="icon" variant="white" className="w-10 h-10 rounded-xl shadow-xl shadow-black/10 border-slate-100">
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
                  {isRtl ? "نمایش لیست" : "Show List"}
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  {isRtl ? "نمایش نقشه" : "Show Map"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
