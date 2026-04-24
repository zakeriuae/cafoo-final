"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Phone, 
  MessageCircle, 
  Star,
  Award,
  MapPin,
  ArrowRight
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
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
}

interface AgentsSectionClientProps {
  agents: Agent[]
}

export function AgentsSectionClient({ agents }: AgentsSectionClientProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (agents.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} id="agents" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-1/2 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2",
          isRtl ? "right-0" : "left-0"
        )} />
        <div className={cn(
          "absolute top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl",
          isRtl ? "left-0" : "right-0"
        )} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4",
            isRtl && "flex-row-reverse"
          )}>
            <Star className="w-4 h-4 fill-current" />
            {content.agents.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.agents.title}{" "}
            <span className="text-secondary">{content.agents.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {content.agents.subtitle}
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent, index) => {
            const agentName = locale === 'fa' && agent.name_fa ? agent.name_fa : agent.name
            const agentTitle = locale === 'fa' && agent.title_fa ? agent.title_fa : agent.title
            
            return (
              <div 
                key={agent.id} 
                className={cn(
                  "group transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-secondary/10">
                  {/* Image */}
                  <Link href={`/${locale}/agents/${agent.slug}`}>
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={agent.avatar_url || "/images/placeholder-agent.jpg"}
                        alt={agentName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Rating Badge */}
                      <div className={cn(
                        "absolute top-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm",
                        isRtl ? "left-4 flex-row-reverse" : "right-4"
                      )}>
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-foreground">5.0</span>
                      </div>

                      {/* Name & Title Overlay */}
                      <div className={cn(
                        "absolute bottom-4 left-4 right-4",
                        isRtl && "text-right"
                      )}>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {agentName}
                        </h3>
                        <p className="text-white/80 text-sm">{agentTitle}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
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
                    <div className="space-y-3 mb-5">
                      {agent.specializations && agent.specializations.length > 0 && (
                        <div className={cn(
                          "flex items-center gap-2",
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
                    </div>

                    {/* Languages */}
                    {agent.languages && agent.languages.length > 0 && (
                      <div className={cn(
                        "flex flex-wrap gap-1.5 mb-5",
                        isRtl && "flex-row-reverse"
                      )}>
                        {agent.languages.map((lang) => (
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
                          className={cn(
                            "flex-1 h-10 rounded-xl border-border hover:bg-primary hover:text-white hover:border-primary transition-all",
                            isRtl && "flex-row-reverse"
                          )}
                          asChild
                        >
                          <a href={`tel:${agent.phone}`}>
                            <Phone className={cn("h-4 w-4", isRtl ? "ml-1" : "mr-1")} />
                            {content.agents.contact}
                          </a>
                        </Button>
                      )}
                      {agent.whatsapp && (
                        <Button 
                          size="sm"
                          className={cn(
                            "flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white",
                            isRtl && "flex-row-reverse"
                          )}
                          asChild
                        >
                          <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className={cn("h-4 w-4", isRtl ? "ml-1" : "mr-1")} />
                            {content.nav.whatsapp}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div 
          className={cn(
            "text-center mt-14 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Link href={`/${locale}/agents`}>
            <Button 
              size="lg" 
              className={cn(
                "h-14 px-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-semibold text-base shadow-lg shadow-secondary/20 transition-all duration-300 hover:scale-105",
                isRtl && "flex-row-reverse"
              )}
            >
              {content.nav.contact}
              <ArrowRight className={cn("h-5 w-5", isRtl ? "mr-2 rotate-180" : "ml-2")} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
