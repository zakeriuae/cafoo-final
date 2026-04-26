"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  MessageCircle, 
  Mail,
  Award,
  MapPin,
  Briefcase,
  Languages,
  Star,
  ArrowLeft,
  ArrowRight,
  Bed,
  Bath,
  Maximize,
  Instagram,
  Linkedin,
  Send,
  Facebook
} from "lucide-react"
import { useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { PropertyCard } from "@/components/ui/property-card"

interface Agent {
  id: string
  name: string
  name_fa: string | null
  slug: string
  title: string | null
  title_fa: string | null
  avatar_url: string | null
  cover_image_url: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  bio: string | null
  bio_fa: string | null
  specializations: string[] | null
  languages: string[] | null
  experience_years: number
  total_listings: number
  social_instagram: string | null
  social_linkedin: string | null
  social_telegram: string | null
  social_facebook: string | null
}

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
}

interface Tower {
  id: string
  name: string
  name_fa: string | null
  slug: string
  cover_image_url: string | null
  starting_price: number | null
  handover_date: string | null
  payment_plan: string | null
  is_off_plan: boolean
}

interface AgentDetailClientProps {
  agent: Agent
  properties: Property[]
  towers: Tower[]
  locale: string
}

export function AgentDetailClient({ agent, properties, towers, locale }: AgentDetailClientProps) {
  const content = useContent()
  const isRtl = locale === 'fa'
  
  const agentName = locale === 'fa' && agent.name_fa ? agent.name_fa : agent.name
  const agentTitle = locale === 'fa' && agent.title_fa ? agent.title_fa : agent.title
  const agentBio = locale === 'fa' && agent.bio_fa ? agent.bio_fa : agent.bio

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat('en-US').format(price)
  }

  const listingTypeLabels: Record<string, string> = {
    sale: locale === 'fa' ? 'فروش' : 'For Sale',
    rent: locale === 'fa' ? 'اجاره' : 'For Rent',
    off_plan: locale === 'fa' ? 'پیش‌فروش' : 'Off Plan',
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Hero Section */}
      <div className="relative h-40 md:h-48 bg-gradient-to-r from-primary to-primary/80">
        {agent.cover_image_url && (
          <Image
            src={agent.cover_image_url}
            alt=""
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Link href={`/${locale}/agents`}>
            <Button variant="secondary" className="gap-2">
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {locale === 'fa' ? 'بازگشت' : 'Back'}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Agent Profile Card */}
        <div className="relative -mt-24 mb-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:py-6 md:px-10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={agent.avatar_url || "/images/placeholder-agent.jpg"}
                      alt={agentName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-start">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{agentName}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{agentTitle}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{agent.experience_years}</p>
                        <p className="text-xs text-muted-foreground">{content.agents.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Star className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{agent.total_listings}+</p>
                        <p className="text-xs text-muted-foreground">{content.agents.deals}</p>
                      </div>
                    </div>
                    {agent.languages && agent.languages.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Languages className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{agent.languages.length}</p>
                          <p className="text-xs text-muted-foreground">
                            {locale === 'fa' ? 'زبان' : 'Languages'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social Links Moved here if needed, but I'll put them in the right column too */}
                </div>

                {/* Right Column: Contact Buttons */}
                <div className="flex flex-col gap-3 min-w-[240px] justify-center">
                  {agent.phone && (
                    <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 w-full" asChild>
                      <a href={`tel:${agent.phone}`}>
                        <Phone className="h-6 w-6 mr-3" />
                        {locale === 'fa' ? 'تماس' : 'Call'}
                      </a>
                    </Button>
                  )}
                  {(agent.whatsapp || agent.phone) && (
                    <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg bg-[#25D366] hover:bg-[#20bd5c] shadow-lg shadow-green-100/30 transition-all hover:scale-[1.02] active:scale-95 w-full" asChild>
                      <a href={`https://wa.me/${(agent.whatsapp || agent.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-6 w-6 mr-3" />
                        WhatsApp
                      </a>
                    </Button>
                  )}

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-end gap-4 mt-3">
                    {/* Instagram */}
                    <a 
                      href={agent.social_instagram ? `https://instagram.com/${agent.social_instagram}` : "#"} 
                      target={agent.social_instagram ? "_blank" : "_self"}
                      rel="noopener noreferrer" 
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300",
                        agent.social_instagram 
                          ? "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white" 
                          : "bg-slate-50 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      <Instagram className="h-6 w-6" />
                    </a>

                    {/* LinkedIn */}
                    <a 
                      href={agent.social_linkedin ? `https://linkedin.com/in/${agent.social_linkedin}` : "#"} 
                      target={agent.social_linkedin ? "_blank" : "_self"}
                      rel="noopener noreferrer" 
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300",
                        agent.social_linkedin 
                          ? "bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white" 
                          : "bg-slate-50 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>

                    {/* Telegram */}
                    <a 
                      href={agent.social_telegram ? `https://t.me/${agent.social_telegram}` : "#"} 
                      target={agent.social_telegram ? "_blank" : "_self"}
                      rel="noopener noreferrer" 
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300",
                        agent.social_telegram 
                          ? "bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white" 
                          : "bg-slate-50 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      <Send className="h-6 w-6" />
                    </a>

                    {/* Facebook */}
                    <a 
                      href={agent.social_facebook ? `https://facebook.com/${agent.social_facebook}` : "#"} 
                      target={agent.social_facebook ? "_blank" : "_self"}
                      rel="noopener noreferrer" 
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300",
                        agent.social_facebook 
                          ? "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white" 
                          : "bg-slate-50 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-20 pb-20">
          {/* Bio & Info Row */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Area: Bio */}
            <div className="lg:col-span-2 space-y-12">
              {agentBio && (
                <Card className="border-none shadow-sm bg-white rounded-[2rem]">
                  <CardContent className="p-6 md:py-6 md:px-10">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-primary rounded-full" />
                      {locale === 'fa' ? 'درباره من' : 'About Me'}
                    </h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                      {agentBio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Languages & Specializations Card */}
                {((agent.languages && agent.languages.length > 0) || (agent.specializations && agent.specializations.length > 0)) && (
                  <Card className="border-none shadow-sm bg-white rounded-[2rem]">
                  <CardContent className="p-8 space-y-6">
                    {/* Languages */}
                    {agent.languages && agent.languages.length > 0 && (
                      <div>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                          <div className="h-6 w-1 bg-primary rounded-full" />
                          {locale === 'fa' ? 'زبان‌ها' : 'Languages'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {agent.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="px-4 py-2 text-sm font-bold rounded-xl border-slate-100 text-slate-600 bg-slate-50/50">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specializations */}
                    {agent.specializations && agent.specializations.length > 0 && (
                      <div className={agent.languages && agent.languages.length > 0 ? "pt-6" : ""}>
                          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <div className="h-6 w-1 bg-primary rounded-full" />
                            {locale === 'fa' ? 'تخصص‌ها' : 'Specializations'}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {agent.specializations.map((spec) => (
                              <Badge key={spec} variant="secondary" className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-50 border-slate-100 text-slate-700">
                                <Award className="h-3 w-3 mr-2 text-primary" />
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Towers & Projects Section (Full Width) */}
          {towers.length > 0 && (
            <div className="pt-10">
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
                  {locale === 'fa' ? 'پروژه‌ها و برج‌های من' : 'My Towers & Projects'}
                </h2>
                <div className="h-1.5 w-24 bg-primary rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {towers.map((tower) => {
                  const towerName = locale === 'fa' && tower.name_fa ? tower.name_fa : tower.name
                  return (
                    <Link key={tower.id} href={`/${locale}/towers/${tower.slug}`} className="group block">
                      <div className="relative bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-black/5 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={tower.cover_image_url || "/images/placeholder.jpg"}
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
                              {tower.is_off_plan ? (locale === 'fa' ? 'در حال ساخت' : 'Off Plan') : (locale === 'fa' ? 'آماده تحویل' : 'Ready')}
                            </Badge>
                          </div>

                          {/* Price Overlay */}
                          <div className="absolute bottom-5 inset-x-5 z-10 flex items-end justify-between">
                            <div>
                              <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest mb-1">{locale === 'fa' ? 'شروع قیمت از' : 'Starting From'}</p>
                              <p className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5" dir="ltr">
                                <AedSymbol size={22} className="flex-shrink-0" /> {formatPrice(tower.starting_price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4">
                            {towerName}
                          </h3>
                          
                          {/* Stats Box */}
                          <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 mt-auto">
                            <div>
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                                {locale === 'fa' ? 'تحویل' : 'Handover'}
                              </p>
                              <p className="text-xs font-bold text-foreground leading-none">
                                {tower.handover_date || '2026'}
                              </p>
                            </div>
                            <div className="border-s border-border/40 ps-4">
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                                {locale === 'fa' ? 'پرداخت' : 'Payment'}
                              </p>
                              <p className="text-xs font-bold text-foreground leading-none">
                                {tower.payment_plan || '70/30'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
                {/* Placeholder Cards for Towers */}
                {towers.length % 4 !== 0 && Array.from({ length: 4 - (towers.length % 4) }).map((_, i) => (
                  <div key={`tower-placeholder-${i}`} className="hidden lg:block border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 min-h-[400px] flex flex-col items-center justify-center p-8 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <div className="w-6 h-6 border-2 border-slate-200 rounded-md" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">{locale === 'fa' ? 'بزودی' : 'Coming Soon'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Properties Section (Full Width) */}
          {properties.length > 0 && (
            <div className="pt-10">
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
                  {locale === 'fa' ? 'املاک من' : 'My Properties'}
                </h2>
                <div className="h-1.5 w-24 bg-primary rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id}
                    property={property}
                    locale={locale}
                    content={content}
                    propertyUrl={`/${locale}/properties/${property.slug}`}
                    hideLabels={true}
                  />
                ))}
                {/* Placeholder Cards */}
                {properties.length % 4 !== 0 && Array.from({ length: 4 - (properties.length % 4) }).map((_, i) => (
                  <div key={`property-placeholder-${i}`} className="hidden lg:block border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 min-h-[400px] flex flex-col items-center justify-center p-8 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <div className="w-6 h-6 border-2 border-slate-200 rounded-md" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">{locale === 'fa' ? 'بزودی' : 'Coming Soon'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
