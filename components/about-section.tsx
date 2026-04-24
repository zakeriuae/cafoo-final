"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Shield, Award, Users, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { icon: Shield, value: "10+", label: "Years Experience", delay: 0 },
  { icon: Award, value: "500+", label: "Projects Delivered", delay: 100 },
  { icon: Users, value: "2000+", label: "Happy Clients", delay: 200 },
  { icon: TrendingUp, value: "5", label: "Billion AED Value", suffix: "B+", delay: 300 },
]

const features = [
  "Expert knowledge of Dubai real estate market",
  "Exclusive access to off-plan projects",
  "Personalized property matching service",
  "Complete support from search to handover",
  "Transparent pricing with no hidden fees",
  "Multilingual team (English, Arabic, Persian)",
]

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState<{ [key: string]: number }>({})
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          stats.forEach((stat) => {
            const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ""))
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
  }, [])

  const formatValue = (label: string, originalValue: string, suffix?: string) => {
    const numericValue = counters[label] || 0
    if (suffix) {
      return `${numericValue}${suffix}`
    }
    return `${numericValue}${originalValue.includes("+") ? "+" : ""}`
  }

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              About Cafoo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your Trusted Partner in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Dubai Real Estate
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Cafoo is a premier real estate consultancy based in Dubai, UAE. We specialize in connecting discerning
              buyers and investors with exceptional properties across Dubai&apos;s most prestigious locations. Our team
              of expert consultants brings unparalleled market knowledge and personalized service to every client.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl group"
            >
              Learn More About Us
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Image & Stats */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* Main Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/dubai-marina.jpg"
                  alt="Dubai Marina Skyline"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {counters["Years Experience"] || 0}+
                    </div>
                    <div className="text-muted-foreground text-sm">Years of Excellence</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-sm font-semibold">Trusted by 2000+ Clients</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:bg-card hover:border-primary/30 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${stat.delay + 500}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatValue(stat.label, stat.value, stat.suffix)}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
