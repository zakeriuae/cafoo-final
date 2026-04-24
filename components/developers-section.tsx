"use client"

import Image from "next/image"
import { Award } from "lucide-react"
import { useRef, useState, useEffect } from "react"

const developers = [
  {
    name: "EMAAR",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Emaar_Properties_logo.svg/512px-Emaar_Properties_logo.svg.png",
  },
  {
    name: "DAMAC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Damac_Properties_Logo.svg/512px-Damac_Properties_Logo.svg.png",
  },
  {
    name: "SOBHA",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Sobha_Limited_Logo.svg/512px-Sobha_Limited_Logo.svg.png",
  },
  {
    name: "Nakheel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Nakheel_logo.svg/512px-Nakheel_logo.svg.png",
  },
  {
    name: "MERAAS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Meraas_Holding_Logo.svg/512px-Meraas_Holding_Logo.svg.png",
  },
  {
    name: "Dubai Properties",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dubai_Properties_logo.svg/512px-Dubai_Properties_logo.svg.png",
  },
  {
    name: "Azizi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Azizi_Developments_Logo.svg/512px-Azizi_Developments_Logo.svg.png",
  },
  {
    name: "Danube",
    logo: "https://www.danubeproperties.ae/wp-content/uploads/2023/01/danube-logo.png",
  },
]

export function DevelopersSection() {
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

  // Double the developers array for seamless loop
  const duplicatedDevelopers = [...developers, ...developers]

  return (
    <section ref={sectionRef} id="developers" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Trusted Partners
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Premier Developers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We partner with the UAE&apos;s most reputable developers
          </p>
        </div>

        {/* Auto-scrolling Logos */}
        <div 
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {duplicatedDevelopers.map((developer, index) => (
                <div
                  key={`${developer.name}-${index}`}
                  className="flex-shrink-0 mx-8 group"
                >
                  <div className="relative w-40 h-20 bg-white rounded-2xl flex items-center justify-center p-4 border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:scale-105 cursor-pointer">
                    <Image
                      src={developer.logo}
                      alt={developer.name}
                      fill
                      className="object-contain p-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
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
