"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Phone, 
  MessageCircle, 
  Star,
  Award,
  Users,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  name_fa: string | null
  slug: string
  title: string | null
  title_fa: string | null
  avatar_url: string | null
  phone: string | null
  whatsapp: string | null
  bio: string | null
  bio_fa: string | null
  specializations: string[] | null
  languages: string[] | null
  experience_years: number
  total_listings: number
  featured: boolean
}

interface AgentsListClientProps {
  agents: Agent[]
}

export function AgentsListClient({ agents }: AgentsListClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isRtl, locale } = useI18n()
  const content = useContent()

  const filteredAgents = agents.filter(agent => {
    const name = locale === 'fa' && agent.name_fa ? agent.name_fa : agent.name
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4",
          isRtl && "flex-row-reverse"
        )}>
          <Users className="w-4 h-4" />
          {content.agents.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {content.agents.title}{" "}
          <span className="text-secondary">{content.agents.titleHighlight}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
          {content.agents.subtitle}
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={locale === 'fa' ? "جستجوی مشاور..." : "Search agents..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredAgents.map((agent) => {
          const agentName = locale === 'fa' && agent.name_fa ? agent.name_fa : agent.name
          const agentTitle = locale === 'fa' && agent.title_fa ? agent.title_fa : agent.title
          
          return (
            <Card key={agent.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              {/* Image */}
              <Link href={`/${locale}/agents/${agent.slug}`}>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={agent.avatar_url || "/images/placeholder-agent.jpg"}
                    alt={agentName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Featured Badge */}
                  {agent.featured && (
                    <div className={cn(
                      "absolute top-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/90 backdrop-blur-sm",
                      isRtl ? "left-4" : "right-4"
                    )}>
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{locale === 'fa' ? 'ویژه' : 'Featured'}</span>
                    </div>
                  )}

                  {/* Name & Title Overlay */}
                  <div className={cn(
                    "absolute bottom-4 left-4 right-4",
                    isRtl && "text-right"
                  )}>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-secondary transition-colors">
                      {agentName}
                    </h3>
                    <p className="text-white/80 text-sm">{agentTitle}</p>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <CardContent className="p-5">
                {/* Stats */}
                <div className={cn(
                  "flex items-center justify-between mb-5 pb-5 border-b border-border/50",
                  isRtl && "flex-row-reverse"
                )}>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{agent.experience_years}</p>
                    <p className="text-xs text-muted-foreground">{content.agents.experience}</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{agent.total_listings}+</p>
                    <p className="text-xs text-muted-foreground">{content.agents.deals}</p>
                  </div>
                </div>

                {/* Specialization */}
                {agent.specializations && agent.specializations.length > 0 && (
                  <div className={cn(
                    "flex items-center gap-2 mb-4",
                    isRtl && "flex-row-reverse"
                  )}>
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground line-clamp-1">
                      {agent.specializations[0]}
                    </span>
                  </div>
                )}

                {/* Languages */}
                {agent.languages && agent.languages.length > 0 && (
                  <div className={cn(
                    "flex flex-wrap gap-1.5 mb-5",
                    isRtl && "flex-row-reverse"
                  )}>
                    {agent.languages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
                  {agent.phone && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 h-10 rounded-xl"
                      asChild
                    >
                      <a href={`tel:${agent.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        {content.agents.contact}
                      </a>
                    </Button>
                  )}
                  {agent.whatsapp && (
                    <Button 
                      size="sm"
                      className="flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600"
                      asChild
                    >
                      <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-16">
          <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">
            {locale === 'fa' ? "مشاوری یافت نشد" : "No agents found"}
          </p>
        </div>
      )}
    </div>
  )
}
