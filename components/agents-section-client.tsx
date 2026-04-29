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
import { useAuthAction } from "@/hooks/use-auth-action"

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
  const { performAction } = useAuthAction()
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
    <section ref={sectionRef} id="agents" className="py-24 bg-[#F0F7FF] relative overflow-hidden">
      <div className="container mx-auto relative z-10">
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
          
          <Button variant="outline" className="rounded-full px-8 h-12 border-border/60 hover:bg-secondary hover:text-white hover:border-secondary transition-all gap-2 group font-bold">
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
                <div 
                  className="bg-white rounded-[2rem] overflow-hidden border border-border/40 hover:border-secondary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5 flex flex-col h-full group"
                >
                  <Link href={`/${locale}/agents/${agent.slug}`} className="block">
                    {/* Image Container - Square with Overlay */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={agent.avatar_url || "/images/agents/placeholder.jpg"}
                        alt={agentName}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay for Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                      {/* Top Badge - Rating */}
                      <div className={cn(
                        "absolute top-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/90 backdrop-blur-md z-10",
                        isRtl ? "left-4" : "right-4"
                      )}>
                        <Award className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Top Agent</span>
                      </div>

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

                  {/* Content Area - Stats and Actions */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Stats Row */}
                    <div className="flex items-center gap-6 py-4 border-b border-border/40 mb-6">
                      <div className="flex-1">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{content.agents.experience}</p>
                        <p className="text-lg font-bold text-foreground leading-none">{agent.experience_years} <span className="text-[10px] font-medium text-muted-foreground">Years</span></p>
                      </div>
                      <div className="w-px h-8 bg-border/40" />
                      <div className="flex-1">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{content.agents.deals}</p>
                        <p className="text-lg font-bold text-foreground leading-none">{agent.total_listings}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-2">
                        {agent.phone && (
                          <button 
                            onClick={() => performAction(
                              () => {
                                window.location.href = `tel:${agent.phone}`
                              },
                              {
                                source: 'call',
                                agent_id: agent.id,
                                notes: `User clicked call button for agent ${agentName} from home page`
                              }
                            )}
                            disabled={!!pendingSource}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-secondary hover:text-white text-foreground transition-all border border-border/40"
                          >
                            {pendingSource === 'call' ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                          </button>
                        )}
                        {agent.whatsapp && (
                          <button 
                            onClick={() => performAction(
                              () => {
                                window.open(`https://wa.me/${agent.whatsapp.replace(/\+/g, '')}`, '_blank')
                              },
                              {
                                source: 'whatsapp',
                                agent_id: agent.id,
                                notes: `User clicked WhatsApp button for agent ${agentName} from home page`
                              }
                            )}
                            disabled={!!pendingSource}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white transition-all border border-green-500/20"
                          >
                            {pendingSource === 'whatsapp' ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      <Link href={`/${locale}/agents/${agent.slug}`} className="flex items-center gap-1.5 text-secondary font-bold text-sm hover:gap-2.5 transition-all">
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
