"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Shield, Award, Users, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [counters, setCounters] = useState<{ [key: string]: number }>({})
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()

  const stats = [
    { icon: Shield, value: "12", label: content.agents.experience, suffix: "+", delay: 0 },
    { icon: Award, value: "560", label: content.about.stats.transactions, suffix: "+", delay: 100 },
    { icon: Users, value: "1280", label: content.hero.stats.clients, suffix: "+", delay: 200 },
    { icon: TrendingUp, value: "5", label: content.about.stats.volume, suffix: ".4B+", delay: 300 },
  ]

  const features = [
    content.about.features.expertise.description,
    content.about.features.trust.description,
    content.about.features.service.description,
    content.about.features.global.description,
  ]

  const aboutImages = [
    "/images/about/011.jpg",
    "/images/about/033.jpg",
    "/images/about/044.jpg"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timers: NodeJS.Timeout[] = []
    
    stats.forEach((stat) => {
      const numericValue = parseInt(stat.value)
      if (isNaN(numericValue)) return

      let current = 0
      const duration = 2000 
      const steps = 60
      const increment = numericValue / steps
      const stepTime = duration / steps

      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setCounters((prev) => ({ ...prev, [stat.label]: numericValue }))
          clearInterval(timer)
        } else {
          setCounters((prev) => ({ ...prev, [stat.label]: Math.floor(current) }))
        }
      }, stepTime)
      
      timers.push(timer)
    })

    return () => timers.forEach(clearInterval)
  }, [isVisible])

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-[#F0F7FF] overflow-hidden">
      <div className="container mx-auto">
        <div className={cn(
          "grid lg:grid-cols-2 gap-16 items-center",
          isRtl && "lg:grid-flow-dense"
        )}>
          {/* Left Content */}
          <div
            className={cn(
              "transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
              isRtl && "text-right lg:col-start-2"
            )}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              {content.about.badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {content.about.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {content.about.titleHighlight}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {content.about.description}
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                    isRtl && "flex-row-reverse"
                  )}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className={cn(
                "btn-primary px-8 py-6 text-lg rounded-xl group",
                isRtl && "flex-row-reverse"
              )}
            >
              {content.common.learnMore}
              <ArrowRight className={cn(
                "w-5 h-5 group-hover:translate-x-1 transition-transform",
                isRtl ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
              )} />
            </Button>
          </div>

          {/* Right Content - Image & Stats */}
          <div
            className={cn(
              "relative transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
              isRtl && "lg:col-start-1 lg:row-start-1"
            )}
          >
            {/* Main Image Slideshow */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {aboutImages.map((img, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-1000",
                      currentSlide === index ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Dubai Real Estate View ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {aboutImages.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        currentSlide === index ? "w-8 bg-secondary" : "w-2 bg-white/30"
                      )}
                    />
                  ))}
                </div>
                {/* Brand Gradient Overlay - Bottom half only for a cleaner look */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-secondary/30 via-secondary/10 to-transparent z-10" />
                {/* Dark gradient for text contrast at the very bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent z-10" />
              </div>

              {/* Floating Stats Card */}
              <div className={cn(
                "absolute -bottom-8 bg-white border border-secondary/10 rounded-2xl p-6 shadow-2xl z-30",
                isRtl ? "-right-8" : "-left-8"
              )}>
                <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className={cn(isRtl && "text-right")}>
                    <div className="text-3xl font-bold text-foreground" dir="ltr">
                      {counters[content.agents.experience] || 0}+
                    </div>
                    <div className="text-muted-foreground text-sm font-medium">{content.agents.experience}</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className={cn(
                "absolute -top-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-xl z-30",
                isRtl ? "-left-4" : "-right-4"
              )}>
                <span className="text-sm font-bold">1280+ {content.hero.stats.clients}</span>
              </div>
            </div>

            {/* Stats Grid - Now directly on the section's light blue background */}
            <div className="mt-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {stats.filter(s => s.label === content.hero.stats.sales || s.label === content.hero.stats.volume).map((stat, index) => (
                  <div
                    key={index}
                    className={cn(
                      "group bg-white rounded-[2.5rem] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-700 ease-out",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}
                    style={{ transitionDelay: `${stat.delay + 500}ms` }}
                  >
                    <div className={cn(
                      "flex items-center gap-8",
                      isRtl && "flex-row-reverse"
                    )}>
                      <div className="w-16 h-16 rounded-3xl bg-[#F8FAFC] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <stat.icon className="w-8 h-8" />
                      </div>
                      <div className={cn(isRtl && "text-right")}>
                        <div className="text-4xl font-bold text-[#1E293B] leading-none mb-3 tracking-tight" dir="ltr">
                          {counters[stat.label] || 0}{stat.suffix}
                        </div>
                        <div className="text-slate-400 text-sm font-medium tracking-wide">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
