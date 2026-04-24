"use client"

import Image from "next/image"
import { Award } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Developer {
  id: string
  name: string
  name_fa: string | null
  slug: string
  logo_url: string | null
}

interface DevelopersSectionClientProps {
  developers: Developer[]
}

export function DevelopersSectionClient({ developers }: DevelopersSectionClientProps) {
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

  // Triple the developers array for seamless loop
  const duplicatedDevelopers = [...developers, ...developers, ...developers]

  if (developers.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} id="developers" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={cn(
            "text-center mb-10 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4",
            isRtl && "flex-row-reverse"
          )}>
            <Award className="w-4 h-4" />
            {content.developers.subtitle}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {content.developers.title}
          </h2>
        </div>

        {/* Auto-scrolling Logos - Single Line */}
        <div 
          className={cn(
            "relative transition-all duration-1000 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div 
              className="flex animate-marquee hover:[animation-play-state:paused]"
              style={{ width: "fit-content" }}
            >
              {duplicatedDevelopers.map((developer, index) => (
                <div
                  key={`${developer.id}-${index}`}
                  className="flex-shrink-0 mx-4 md:mx-6 group cursor-pointer"
                >
                  <div className="relative w-52 h-28 md:w-72 md:h-44 flex items-center justify-center transition-all duration-300 hover:scale-105">
                    {developer.logo_url && (
                      <Image
                        src={developer.logo_url}
                        alt={locale === 'fa' && developer.name_fa ? developer.name_fa : developer.name}
                        fill
                        className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        unoptimized
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
