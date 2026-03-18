"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Star,
  Award,
  MapPin,
  Building2,
  ArrowRight
} from "lucide-react"
import { useRef, useState, useEffect } from "react"

const agents = [
  {
    id: 1,
    name: "Ahmad Al Rashid",
    title: "Senior Property Consultant",
    image: "/images/agents/agent-1.jpg",
    phone: "+971 50 349 1050",
    email: "ahmad@cafoo.ae",
    specialization: "Luxury Villas & Penthouses",
    area: "Palm Jumeirah, Emirates Hills",
    experience: "12 years",
    deals: "150+",
    rating: 4.9,
    languages: ["English", "Arabic"],
  },
  {
    id: 2,
    name: "Fatima Hassan",
    title: "Investment Advisor",
    image: "/images/agents/agent-2.jpg",
    phone: "+971 52 504 1810",
    email: "fatima@cafoo.ae",
    specialization: "Off-Plan & Investment",
    area: "Downtown, Business Bay",
    experience: "8 years",
    deals: "200+",
    rating: 4.8,
    languages: ["English", "Arabic", "French"],
  },
  {
    id: 3,
    name: "Raj Patel",
    title: "Property Consultant",
    image: "/images/agents/agent-3.jpg",
    phone: "+971 55 123 4567",
    email: "raj@cafoo.ae",
    specialization: "Apartments & Townhouses",
    area: "Dubai Marina, JBR",
    experience: "6 years",
    deals: "120+",
    rating: 4.9,
    languages: ["English", "Hindi", "Arabic"],
  },
  {
    id: 4,
    name: "Elena Volkov",
    title: "Senior Sales Manager",
    image: "/images/agents/agent-4.jpg",
    phone: "+971 50 987 6543",
    email: "elena@cafoo.ae",
    specialization: "Premium Residences",
    area: "DIFC, City Walk",
    experience: "10 years",
    deals: "180+",
    rating: 5.0,
    languages: ["English", "Russian", "Arabic"],
  },
]

export function AgentsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
    <section ref={sectionRef} id="agents" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Expert Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet Our Agents
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our experienced team of real estate professionals is dedicated to 
            helping you find the perfect property in Dubai.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent, index) => (
            <div 
              key={agent.id} 
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-secondary/10">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-foreground">{agent.rating}</span>
                  </div>

                  {/* Name & Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                    <p className="text-white/80 text-sm">{agent.title}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-5 pb-5 border-b border-border/50">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{agent.experience}</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{agent.deals}</p>
                      <p className="text-xs text-muted-foreground">Deals Closed</p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{agent.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-secondary/10">
                        <MapPin className="h-4 w-4 text-secondary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{agent.area}</span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {agent.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 h-10 rounded-xl border-border hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          className={`text-center mt-14 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-muted-foreground mb-6">
            Looking for personalized assistance? Our team is ready to help.
          </p>
          <Button 
            size="lg" 
            className="h-14 px-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-semibold text-base shadow-lg shadow-secondary/20 transition-all duration-300 hover:scale-105"
          >
            Schedule a Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
