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
  Linkedin
} from "lucide-react"
import { useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { AedSymbol } from "@/components/ui/aed-symbol"

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

interface AgentDetailClientProps {
  agent: Agent
  properties: Property[]
  locale: string
}

export function AgentDetailClient({ agent, properties, locale }: AgentDetailClientProps) {
  const content = useContent()
  const isRtl = locale === 'fa'
  
  const agentName = locale === 'fa' && agent.name_fa ? agent.name_fa : agent.name
  const agentTitle = locale === 'fa' && agent.title_fa ? agent.title_fa : agent.title
  const agentBio = locale === 'fa' && agent.bio_fa ? agent.bio_fa : agent.bio

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  const listingTypeLabels: Record<string, string> = {
    sale: locale === 'fa' ? 'فروش' : 'For Sale',
    rent: locale === 'fa' ? 'اجاره' : 'For Rent',
    off_plan: locale === 'fa' ? 'پیش‌فروش' : 'Off Plan',
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary to-primary/80">
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

      <div className="container mx-auto">
        {/* Agent Profile Card */}
        <div className="relative -mt-32 mb-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
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

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {agent.phone && (
                      <Button size="lg" variant="outline" asChild>
                        <a href={`tel:${agent.phone}`}>
                          <Phone className="h-5 w-5 mr-2" />
                          {agent.phone}
                        </a>
                      </Button>
                    )}
                    {agent.whatsapp && (
                      <Button size="lg" className="bg-green-500 hover:bg-green-600" asChild>
                        <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    {agent.email && (
                      <Button size="lg" variant="secondary" asChild>
                        <a href={`mailto:${agent.email}`}>
                          <Mail className="h-5 w-5 mr-2" />
                          {locale === 'fa' ? 'ایمیل' : 'Email'}
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Social Links */}
                  {(agent.social_instagram || agent.social_linkedin) && (
                    <div className="flex justify-center md:justify-start gap-3 mt-4">
                      {agent.social_instagram && (
                        <a href={`https://instagram.com/${agent.social_instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {agent.social_linkedin && (
                        <a href={`https://linkedin.com/in/${agent.social_linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {agentBio && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'درباره من' : 'About Me'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {agentBio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Specializations */}
            {agent.specializations && agent.specializations.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {locale === 'fa' ? 'تخصص‌ها' : 'Specializations'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="px-4 py-2 text-sm">
                        <Award className="h-4 w-4 mr-2" />
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Properties */}
            {properties.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {locale === 'fa' ? 'لیست‌های من' : 'My Listings'}
                  </h2>
                  <Link href={`/${locale}/properties?agent=${agent.slug}`}>
                    <Button variant="outline">
                      {content.common.viewAll}
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {properties.map((property) => {
                    const propTitle = locale === 'fa' && property.title_fa ? property.title_fa : property.title
                    return (
                      <Link key={property.id} href={`/${locale}/properties/${property.slug}`}>
                        <Card className="group overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative h-48">
                            <Image
                              src={property.cover_image_url || "/images/placeholder.jpg"}
                              alt={propTitle}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-3 left-3">
                              {listingTypeLabels[property.listing_type]}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                              {propTitle}
                            </h3>
                            <p className="text-lg font-bold text-primary mb-3" dir="ltr">
                              <AedSymbol size={16} /> {formatPrice(property.price)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {property.bedrooms !== null && (
                                <span className="flex items-center gap-1">
                                  <Bed className="h-4 w-4" />
                                  {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                                </span>
                              )}
                              {property.bathrooms && (
                                <span className="flex items-center gap-1">
                                  <Bath className="h-4 w-4" />
                                  {property.bathrooms}
                                </span>
                              )}
                              {property.size && (
                                <span className="flex items-center gap-1">
                                  <Maximize className="h-4 w-4" />
                                  {property.size} sqft
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Languages */}
              {agent.languages && agent.languages.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">
                      {locale === 'fa' ? 'زبان‌ها' : 'Languages'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="px-3 py-1.5">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Contact */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-10 w-10 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">
                    {locale === 'fa' ? 'تماس با من' : 'Get in Touch'}
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    {locale === 'fa' 
                      ? 'سوالی دارید؟ با من تماس بگیرید'
                      : 'Have a question? Feel free to reach out'
                    }
                  </p>
                  {agent.whatsapp && (
                    <Button variant="secondary" className="w-full" asChild>
                      <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
