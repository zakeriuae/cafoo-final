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
  const { locale, isRtl } = useI18n()
  const content = useContent()

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
                  "relative flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all duration-500 min-w-[280px]",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                    : "text-slate-500 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl transition-colors",
                  activeTab === tab.id ? "bg-white/20" : "bg-primary/10 text-primary"
                )}>
                  <tab.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start text-left rtl:text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight">{tab.title}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      activeTab === tab.id ? "bg-white/20 border-white/20" : "bg-primary/10 border-primary/10"
                    )}>
                      {tab.count}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs font-medium opacity-70",
                    activeTab === tab.id ? "text-white/80" : "text-slate-400"
                  )}>
                    {tab.subtitle}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                )}
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
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">
                  {locale === 'fa' ? 'پیشنهادات ویژه املاک' : 'Premium Property Listings'}
                </h3>
                <p className="text-slate-500 font-medium">
                  {locale === 'fa' ? 'بهترین واحدهای مسکونی و تجاری در دبی' : 'The finest residential and commercial units in Dubai'}
                </p>
              </div>
              <Link href={`/${locale}/properties`}>
                <Button variant="outline" className="rounded-full px-6 h-12 border-primary/20 hover:bg-primary hover:text-white transition-all gap-2 group font-bold">
                  {content.properties.viewAll}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => {
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
             <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">
                  {locale === 'fa' ? 'پروژه‌های شاخص و برج‌ها' : 'Iconic Projects & Towers'}
                </h3>
                <p className="text-slate-500 font-medium">
                  {locale === 'fa' ? 'مجموعه‌های ساختمانی لوکس و مناطق رو به رشد' : 'Luxury complexes and high-growth investment districts'}
                </p>
              </div>
              <Link href={`/${locale}/towers`}>
                <Button variant="outline" className="rounded-full px-6 h-12 border-primary/20 hover:bg-primary hover:text-white transition-all gap-2 group font-bold">
                  {content.projects.viewAll}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {towers.map((project, index) => {
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
