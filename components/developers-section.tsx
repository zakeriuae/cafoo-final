"use client"

import Image from "next/image"
import { Award } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const developers = [
  {
    name: "EMAAR",
    logo: "/images/developers/emaar.png",
  },
  {
    name: "DAMAC",
    logo: "/images/developers/damac.png",
  },
  {
    name: "SOBHA Realty",
    logo: "/images/developers/sobhan.png",
  },
  {
    name: "Nakheel",
    logo: "/images/developers/nakheel.png",
  },
  {
    name: "MERAAS",
    logo: "/images/developers/meraas.png",
  },
  {
    name: "Dubai Properties",
    logo: "/images/developers/dubai.png",
  },
  {
    name: "Binghatti",
    logo: "/images/developers/binghati.png",
  },
  {
    name: "Aldar",
    logo: "/images/developers/aldar.png",
  },
  {
    name: "RAK Properties",
    logo: "/images/developers/rak.png",
  },
  {
    name: "Tiger Group",
    logo: "/images/developers/tiger.png",
  },
  {
    name: "Alef",
    logo: "/images/developers/alef.png",
  },
  {
    name: "Arada",
    logo: "/images/developers/arada.png",
  },
  {
    name: "Imtiaz Developments",
    logo: "/images/developers/imtiaz.png",
  },
  {
    name: "Nshama",
    logo: "/images/developers/nshama.png",
  },
  {
    name: "Wasl",
    logo: "/images/developers/wasl.png",
  },
  {
    name: "Beyond",
    logo: "/images/developers/beyond.png",
  },
]

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { isRtl } = useI18n()
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
                  key={`${developer.name}-${index}`}
                  className="flex-shrink-0 mx-2 md:mx-3 group cursor-pointer"
                >
                  <div className="relative w-64 h-36 md:w-80 md:h-52 flex items-center justify-center transition-all duration-300 hover:scale-105">
                    <Image
                      src={developer.logo}
                      alt={developer.name}
                      fill
                      className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      unoptimized
                    />
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
