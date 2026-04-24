"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Phone, 
  MessageCircle, 
  Award,
  MapPin,
  ArrowRight
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  name_fa: string | null
  slug: string
  title: string
  title_fa: string | null
  avatar_url: string | null
  phone: string | null
  whatsapp: string | null
  experience_years: number
  total_listings: number
  rating?: number
}

interface AgentsSectionClientProps {
  agents: Agent[]
}

export default function AgentsSectionClient({ agents }: AgentsSectionClientProps) {
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

  return (
    <section ref={sectionRef} id="agents" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="max-w-2xl">
            <p className="text-secondary font-medium mb-3 text-sm tracking-wide">
              {content.agents.badge}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {content.agents.title} {content.agents.titleHighlight}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.agents.subtitle}
            </p>
          </div>
          
          <Button variant="outline" className="rounded-full px-8 h-12 border-border/60 hover:bg-muted/50 transition-all gap-2 group">
            {content.agents.allTeam}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
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
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-border/40 hover:border-secondary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 h-[500px]">
                  {/* Image */}
                  <Image
                    src={agent.avatar_url || "/images/agents/placeholder.jpg"}
                    alt={agentName}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Overlay - Stronger at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                  
                  {/* Top Badge - Rating */}
                  <div className={cn(
                    "absolute top-6 flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/10 backdrop-blur-md border border-secondary/20 z-20",
                    isRtl ? "left-6" : "right-6"
                  )}>
                    <Award className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Top Agent</span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <p className="text-secondary font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                      {agentTitle}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">
                      {agentName}
                    </h3>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-8 pb-4 border-b border-white/10 mb-4">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{content.agents.experience}</p>
                        <p className="text-xl font-bold text-white leading-none">{agent.experience_years}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{content.agents.deals}</p>
                        <p className="text-xl font-bold text-white leading-none">{agent.total_listings}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        {agent.phone && (
                          <a href={`tel:${agent.phone}`} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10">
                            <Phone className="h-4.5 w-4.5" />
                          </a>
                        )}
                        {agent.whatsapp && (
                          <a href={`https://wa.me/${agent.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all border border-green-500/20">
                            <MessageCircle className="h-4.5 w-4.5" />
                          </a>
                        )}
                      </div>
                      <Link href={`/${locale}/agents/${agent.slug}`} className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all cursor-pointer">
                        {content.agents.contact}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
