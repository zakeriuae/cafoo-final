"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Shield, Award, Users, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState<{ [key: string]: number }>({})
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl, locale } = useI18n()
  const content = useContent()

  const stats = [
    { icon: Shield, value: "10", label: content.agents.experience, suffix: "+", delay: 0 },
    { icon: Award, value: "500", label: content.about.stats.transactions, suffix: "+", delay: 100 },
    { icon: Users, value: "2000", label: content.hero.stats.clients, suffix: "+", delay: 200 },
    { icon: TrendingUp, value: "5", label: content.about.stats.volume, suffix: "B+", delay: 300 },
  ]

  const features = [
    content.about.features.expertise.description,
    content.about.features.trust.description,
    content.about.features.service.description,
    content.about.features.global.description,
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          stats.forEach((stat) => {
            const numericValue = parseInt(stat.value)
            let current = 0
            const increment = numericValue / 50
            const timer = setInterval(() => {
              current += increment
              if (current >= numericValue) {
                setCounters((prev) => ({ ...prev, [stat.label]: numericValue }))
                clearInterval(timer)
              } else {
                setCounters((prev) => ({ ...prev, [stat.label]: Math.floor(current) }))
              }
            }, 30)
          })
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [stats])

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
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
            {/* Main Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/images/dubai-marina.jpg"
                  alt="Dubai Marina Skyline"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Reduced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <div className={cn(
                "absolute -bottom-8 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl",
                isRtl ? "-right-8" : "-left-8"
              )}>
                <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className={cn(isRtl && "text-right")}>
                    <div className="text-3xl font-bold text-foreground" dir="ltr">
                      {counters[content.agents.experience] || 0}+
                    </div>
                    <div className="text-muted-foreground text-sm">{content.agents.experience}</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className={cn(
                "absolute -top-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-lg",
                isRtl ? "-left-4" : "-right-4"
              )}>
                <span className="text-sm font-semibold">2000+ {content.hero.stats.clients}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "group bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:bg-card hover:border-primary/30 transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${stat.delay + 500}ms` }}
                >
                  <div className={cn(
                    "flex items-center gap-3 mb-2",
                    isRtl && "flex-row-reverse"
                  )}>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground" dir="ltr">
                      {counters[stat.label] || 0}{stat.suffix}
                    </div>
                  </div>
                  <div className={cn("text-muted-foreground text-sm", isRtl && "text-right")}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
