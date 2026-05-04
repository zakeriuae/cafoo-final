"use client"

import { useState } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Building2, Home, MapPin, ArrowRight, TrendingUp, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/ui/property-card"
import { SmartImage } from "@/components/ui/smart-image"
import { Badge } from "@/components/ui/badge"
import { buildSeoUrl } from "@/lib/seo-router"
import { AedSymbol } from "@/components/ui/aed-symbol"
import Image from "next/image"

interface DiscoveryTabsClientProps {
  properties: any[]
  towers: any[]
  propertiesCount: number
  towersCount: number
}

export default function DiscoveryTabsClient({ 
  properties, 
  towers, 
  propertiesCount, 
  towersCount 
}: DiscoveryTabsClientProps) {
  const [activeTab, setActiveTab] = useState<"properties" | "towers">("properties")
  const [propertyFilter, setPropertyFilter] = useState<"all" | "sale" | "rent">("all")
  const [towerFilter, setTowerFilter] = useState<"all" | "Off-Plan" | "Ready">("all")
  const { locale, isRtl } = useI18n()
  const content = useContent()

  const propertyTabs = [
    { key: "all" as const, label: content.projects.filters.all },
    { key: "sale" as const, label: content.properties.tabs.sale },
    { key: "rent" as const, label: content.properties.tabs.rent },
  ]

  const towerFilters = [
    { key: "all", label: content.projects.filters.all },
    { key: "Off-Plan", label: content.projects.filters.offPlan },
    { key: "Ready", label: content.projects.filters.readyToMove },
  ]

  const tabs = [
    {
      id: "properties" as const,
      title: locale === "fa" ? "املاک و واحدها" : "Properties",
      subtitle: locale === "fa" ? "واحد مستقل برای معامله" : "single unit to deal",
      count: propertiesCount,
      icon: Home,
    },
    {
      id: "towers" as const,
      title: locale === "fa" ? "برج‌ها و مناطق" : "Towers & Districts",
      subtitle: locale === "fa" ? "یک مجتمع برای بررسی" : "a complex for evaluation",
      count: towersCount,
      icon: Building2,
    },
  ]

  const getDeveloperLogo = (name: string, logoFromDb?: string) => {
    if (!name) return logoFromDb || null;
    const mapping: Record<string, string> = {
      'emaar': '/images/developers/emaar.png',
      'damac': '/images/developers/damac.png',
      'sobha': '/images/developers/sobhan.png',
      'nakheel': '/images/developers/nakheel.png',
      'binghatti': '/images/developers/binghati.png',
      'danube': '/images/developers/danube.png',
    };
    const foundKey = Object.keys(mapping).find(key => name.toLowerCase().includes(key));
    return foundKey ? mapping[foundKey] : (logoFromDb || null);
  };

  const filteredProperties = propertyFilter === "all" 
    ? properties 
    : properties.filter(p => p.type === propertyFilter || p.type === "both")

  const filteredTowers = towerFilter === "all" 
    ? towers 
    : towers.filter(p => p.status === towerFilter)

  return (
    <section className="py-24 bg-[#F0F7FF] overflow-hidden">
      <div className="container mx-auto">
        {/* Tabs Header */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex p-2 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-primary/10 shadow-2xl shadow-primary/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-4 px-6 py-4 rounded-[1.8rem] transition-all duration-500 min-w-[240px]",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                    : "text-slate-500 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  activeTab === tab.id ? "bg-white/20" : "bg-primary/10 text-primary"
                )}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start text-left rtl:text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black tracking-tight">{tab.title}</span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                      activeTab === tab.id ? "bg-white/20 border-white/20" : "bg-primary/10 border-primary/10"
                    )}>
                      {tab.count}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium opacity-70",
                    activeTab === tab.id ? "text-white/80" : "text-slate-400"
                  )}>
                    {tab.subtitle}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[600px]">
          {/* Properties Tab Content */}
          <div className={cn(
            "transition-all duration-700 absolute inset-0",
            activeTab === "properties" ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-12 z-0 pointer-events-none"
          )}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">
                    {locale === 'fa' ? 'املاک و واحدها' : 'Properties'}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {locale === 'fa' ? 'بهترین واحدهای مسکونی و تجاری در دبی' : 'The finest residential and commercial units in Dubai'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <Link href={`/${locale}/properties`}>
                  <Button variant="outline" className="rounded-full px-6 h-10 border-primary/20 hover:bg-primary hover:text-white transition-all gap-2 group font-bold">
                    {content.properties.viewAll}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                {/* Properties Filter Tabs */}
                <div className="flex p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                  {propertyTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setPropertyFilter(tab.key)}
                      className={cn(
                        "px-5 py-1.5 rounded-full font-bold text-xs transition-all duration-300",
                        propertyFilter === tab.key
                          ? "bg-primary text-white shadow-md"
                          : "text-slate-400 hover:text-primary"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => {
                const propertyUrl = buildSeoUrl({
                  transactionType: property.type === 'rent' ? 'for-rent' : 'for-sale',
                  propertyType: 'property',
                  city: 'dubai',
                  area: property.areaSlug || 'area',
                  project: property.towerSlug || 'project',
                  unit: property.slug
                }, locale);

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    locale={locale}
                    content={content}
                    propertyUrl={propertyUrl}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                    className="animate-fade-in"
                  />
                )
              })}
            </div>
          </div>

          {/* Towers Tab Content */}
          <div className={cn(
            "transition-all duration-700 absolute inset-0",
            activeTab === "towers" ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-12 z-0 pointer-events-none"
          )}>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">
                    {locale === 'fa' ? 'برج‌ها و مناطق' : 'Towers & Districts'}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {locale === 'fa' ? 'مجموعه‌های ساختمانی لوکس و مناطق رو به رشد' : 'Luxury complexes and high-growth investment districts'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <Link href={`/${locale}/towers`}>
                  <Button variant="outline" className="rounded-full px-6 h-10 border-primary/20 hover:bg-primary hover:text-white transition-all gap-2 group font-bold">
                    {content.projects.viewAll}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Towers Filter Tabs */}
                <div className="flex p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                  {towerFilters.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setTowerFilter(tab.key as any)}
                      className={cn(
                        "px-5 py-1.5 rounded-full font-bold text-xs transition-all duration-300",
                        towerFilter === tab.key
                          ? "bg-primary text-white shadow-md"
                          : "text-slate-400 hover:text-primary"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTowers.map((project, index) => {
                const projectUrl = buildSeoUrl({
                  transactionType: project.status === "Off-Plan" ? 'off-plan' : 'for-sale',
                  propertyType: 'apartment',
                  city: 'dubai',
                  area: project.areaSlug || 'area',
                  project: project.slug
                }, locale);

                return (
                  <Link 
                    key={project.id} 
                    href={projectUrl}
                    className="group block animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5">
                      <div className="relative h-72 overflow-hidden">
                        <SmartImage src={project.image} size="card" alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 start-4 flex gap-2">
                          <Badge className={cn("backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-xs font-semibold", project.status === "Off-Plan" ? "bg-secondary/80" : "bg-green-500/80")}>
                            {project.status === "Off-Plan" ? content.projects.filters.offPlan : content.projects.filters.readyToMove}
                          </Badge>
                        </div>
                        <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between">
                          <div>
                            <p className="text-white/70 text-xs font-medium mb-1">{content.projects.startingFrom}</p>
                            <p className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5" dir="ltr">
                              <AedSymbol size={22} className="flex-shrink-0" /> {project.launchPrice}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-semibold" dir="ltr">8.0% ROI</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">{project.name}</h3>
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 text-muted-foreground/60" />
                          <span className="text-sm font-medium">{project.location[locale as 'en' | 'fa']}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 mb-5">
                          <div><p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{content.projects.handover}</p><p className="text-sm font-bold text-foreground leading-none">{project.deliveryTime}</p></div>
                          <div className="border-s border-border/40 ps-4"><p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{content.projects.paymentPlan}</p><p className="text-sm font-bold text-foreground leading-none">{project.paymentPlan}</p></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="relative h-6 w-32">
                            {getDeveloperLogo(project.developer, project.developerLogo) ? (
                              <Image src={getDeveloperLogo(project.developer, project.developerLogo)!} alt={project.developer} fill className="object-contain object-left" />
                            ) : (
                              <div className="flex items-center gap-2 h-full"><Building2 className="h-4 w-4 text-primary/70" /><span className="text-xs font-bold text-foreground/80 uppercase tracking-wide">{project.developer}</span></div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">{content.projects.viewDetails}<ArrowRight className="h-4 w-4" /></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
