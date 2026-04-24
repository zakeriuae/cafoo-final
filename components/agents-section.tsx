"use client"

import Image from "next/image"
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

const agents = [
  {
    id: 1,
    name: { en: "Ahmad Al Rashid", fa: "احمد الراشد" },
    title: { en: "Senior Property Consultant", fa: "مشاور ارشد املاک" },
    image: "/images/agents/agent-1.jpg",
    phone: "+971 50 349 1050",
    email: "ahmad@cafoo.ae",
    specialization: { en: "Luxury Villas & Penthouses", fa: "ویلا و پنت‌هاوس لوکس" },
    area: { en: "Palm Jumeirah, Emirates Hills", fa: "پالم جمیرا، امارات هیلز" },
    experience: "12",
    deals: "150+",
    rating: 4.9,
    languages: { en: ["English", "Arabic"], fa: ["انگلیسی", "عربی"] },
  },
  {
    id: 2,
    name: { en: "Fatima Hassan", fa: "فاطمه حسن" },
    title: { en: "Investment Advisor", fa: "مشاور سرمایه‌گذاری" },
    image: "/images/agents/agent-2.jpg",
    phone: "+971 52 504 1810",
    email: "fatima@cafoo.ae",
    specialization: { en: "Off-Plan & Investment", fa: "پیش‌فروش و سرمایه‌گذاری" },
    area: { en: "Downtown, Business Bay", fa: "داون‌تاون، بیزینس بی" },
    experience: "8",
    deals: "200+",
    rating: 4.8,
    languages: { en: ["English", "Arabic", "French"], fa: ["انگلیسی", "عربی", "فرانسوی"] },
  },
  {
    id: 3,
    name: { en: "Raj Patel", fa: "راج پاتل" },
    title: { en: "Property Consultant", fa: "مشاور املاک" },
    image: "/images/agents/agent-3.jpg",
    phone: "+971 55 123 4567",
    email: "raj@cafoo.ae",
    specialization: { en: "Apartments & Townhouses", fa: "آپارتمان و تاون‌هاوس" },
    area: { en: "Dubai Marina, JBR", fa: "دبی مارینا، JBR" },
    experience: "6",
    deals: "120+",
    rating: 4.9,
    languages: { en: ["English", "Hindi", "Arabic"], fa: ["انگلیسی", "هندی", "عربی"] },
  },
  {
    id: 4,
    name: { en: "Elena Volkov", fa: "النا ولکوف" },
    title: { en: "Senior Sales Manager", fa: "مدیر ارشد فروش" },
    image: "/images/agents/agent-4.jpg",
    phone: "+971 50 987 6543",
    email: "elena@cafoo.ae",
    specialization: { en: "Premium Residences", fa: "اقامتگاه‌های ممتاز" },
    area: { en: "DIFC, City Walk", fa: "DIFC، سیتی واک" },
    experience: "10",
    deals: "180+",
    rating: 5.0,
    languages: { en: ["English", "Russian", "Arabic"], fa: ["انگلیسی", "روسی", "عربی"] },
  },
]

export function AgentsSection() {
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
          {agents.map((agent, index) => (
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
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={agent.image}
                    alt={agent.name[locale as 'en' | 'fa']}
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
                    <span className="text-sm font-bold text-foreground">{agent.rating}</span>
                  </div>

                  {/* Name & Title Overlay */}
                  <div className={cn(
                    "absolute bottom-4 left-4 right-4",
                    isRtl && "text-right"
                  )}>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {agent.name[locale as 'en' | 'fa']}
                    </h3>
                    <p className="text-white/80 text-sm">{agent.title[locale as 'en' | 'fa']}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className={cn(
                    "flex items-center justify-between mb-5 pb-5 border-b border-border/50",
                    isRtl && "flex-row-reverse"
                  )}>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{agent.experience}</p>
                      <p className="text-xs text-muted-foreground">{content.agents.experience}</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{agent.deals}</p>
                      <p className="text-xs text-muted-foreground">{content.agents.deals}</p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="space-y-3 mb-5">
                    <div className={cn(
                      "flex items-center gap-2",
                      isRtl && "flex-row-reverse"
                    )}>
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">
                        {agent.specialization[locale as 'en' | 'fa']}
                      </span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      isRtl && "flex-row-reverse"
                    )}>
                      <div className="p-1.5 rounded-lg bg-secondary/10">
                        <MapPin className="h-4 w-4 text-secondary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {agent.area[locale as 'en' | 'fa']}
                      </span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className={cn(
                    "flex flex-wrap gap-1.5 mb-5",
                    isRtl && "flex-row-reverse"
                  )}>
                    {agent.languages[locale as 'en' | 'fa'].map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        "flex-1 h-10 rounded-xl border-border hover:bg-primary hover:text-white hover:border-primary transition-all",
                        isRtl && "flex-row-reverse"
                      )}
                    >
                      <Phone className={cn("h-4 w-4", isRtl ? "ml-1" : "mr-1")} />
                      {content.agents.contact}
                    </Button>
                    <Button 
                      size="sm"
                      className={cn(
                        "flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white",
                        isRtl && "flex-row-reverse"
                      )}
                    >
                      <MessageCircle className={cn("h-4 w-4", isRtl ? "ml-1" : "mr-1")} />
                      {content.nav.whatsapp}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          className={cn(
            "text-center mt-14 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
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
        </div>
      </div>
    </section>
  )
}
