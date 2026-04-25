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
            <Card key={agent.id} className="group overflow-hidden rounded-[2rem] border border-border/40 hover:border-secondary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5 flex flex-col h-full">
              {/* Image Container - Square with Overlay */}
              <Link href={`/${locale}/agents/${agent.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={agent.avatar_url || "/images/placeholder-agent.jpg"}
                    alt={agentName}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  
                  {/* Featured Badge */}
                  {agent.featured && (
                    <div className={cn(
                      "absolute top-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/90 backdrop-blur-md z-10",
                      isRtl ? "left-4" : "right-4"
                    )}>
                      <Star className="w-3 h-3 fill-white text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{locale === 'fa' ? 'ویژه' : 'Featured'}</span>
                    </div>
                  )}

                  {/* Name & Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-secondary font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                      {agentTitle}
                    </p>
                    <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors line-clamp-1">
                      {agentName}
                    </h3>
                  </div>
                </div>
              </Link>

              {/* Content Area */}
              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Stats Row */}
                <div className={cn(
                  "flex items-center gap-6 py-4 border-b border-border/40 mb-6",
                  isRtl && "flex-row-reverse"
                )}>
                  <div className="flex-1 text-center">
                    <p className="text-lg font-bold text-foreground leading-none">{agent.experience_years}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{content.agents.experience}</p>
                  </div>
                  <div className="w-px h-8 bg-border/40" />
                  <div className="flex-1 text-center">
                    <p className="text-lg font-bold text-foreground leading-none">{agent.total_listings}+</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{content.agents.deals}</p>
                  </div>
                </div>

                {/* Specialization & Languages */}
                <div className="space-y-3 mb-6">
                  {agent.specializations && agent.specializations.length > 0 && (
                    <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
                      <Award className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {agent.specializations[0]}
                      </span>
                    </div>
                  )}
                  {agent.languages && agent.languages.length > 0 && (
                    <div className={cn("flex flex-wrap gap-1.5", isRtl && "flex-row-reverse")}>
                      {agent.languages.slice(0, 2).map((lang) => (
                        <span key={lang} className="px-2 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-muted/50 hover:bg-secondary hover:text-white text-foreground transition-all border border-border/40 text-xs font-bold">
                      <Phone className="h-3.5 w-3.5" />
                      {content.agents.contact}
                    </a>
                  )}
                  {agent.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white transition-all border border-green-500/20">
                      <MessageCircle className="h-4 w-4" />
                    </a>
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
