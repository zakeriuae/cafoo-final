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

export default function DevelopersSectionClient({ developers }: DevelopersSectionClientProps) {
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

  const getDeveloperLogo = (name: string, logoFromDb?: string) => {
    // Only use local files - no external broken URLs
    const mapping: Record<string, string> = {
      'emaar': '/images/developers/emaar.png',
      'damac': '/images/developers/damac.png',
      'nakheel': '/images/developers/nakheel.png',
      'binghatti': '/images/developers/binghati.png',
      'arada': '/images/developers/arada.png',
      'tiger': '/images/developers/tiger.png',
      'aldar': '/images/developers/aldar.png',
      'danube': '/images/developers/danube.png',
      'dubai properties': '/images/developers/dubai.png',
      'meraas': '/images/developers/meraas.png',
      'alef': '/images/developers/alef.png',
      'imtiaz': '/images/developers/imtiaz.png',
      'nshama': '/images/developers/nshama.png',
      'beyond': '/images/developers/beyond.png',
      'rak': '/images/developers/rak.png',
      'sobhan': '/images/developers/sobhan.png',
      'sobha': '/images/developers/sobhan.png',
    };

    const foundKey = Object.keys(mapping).find(key => name.toLowerCase().includes(key));
    if (foundKey) return mapping[foundKey];

    // Only fall back to DB URL if it's a known working Supabase storage URL
    if (logoFromDb && logoFromDb.includes('navwagghjtiokeatqjdu.supabase.co')) return logoFromDb;

    return null;
  };

  // Keep all developers but filter those that have NO logo even with fallback
  const validDevelopers = developers.filter(d => getDeveloperLogo(d.name, d.logo_url))

  // Quadruple the developers array for an even more seamless loop
  const duplicatedDevelopers = [...validDevelopers, ...validDevelopers, ...validDevelopers, ...validDevelopers]

  if (validDevelopers.length === 0) {
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
              className="flex animate-marquee-continuous hover:[animation-play-state:paused]"
              style={{ width: "fit-content" }}
            >
              {duplicatedDevelopers.map((developer, index) => {
                const logo = getDeveloperLogo(developer.name, developer.logo_url ?? undefined);
                return (
                  <div
                    key={`${developer.id}-${index}`}
                    className="flex-shrink-0 mx-2 md:mx-4 group cursor-pointer"
                  >
                    <div className="relative w-48 h-28 md:w-64 md:h-40 flex items-center justify-center transition-all duration-300 hover:scale-110">
                      {logo ? (
                        <Image
                          src={logo}
                          alt={locale === 'fa' && developer.name_fa ? developer.name_fa : developer.name}
                          fill
                          className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                          unoptimized
                        />
                      ) : (
                        <span className="text-base md:text-lg font-bold tracking-widest text-gray-400 group-hover:text-gray-700 transition-colors duration-300 uppercase text-center px-2">
                          {developer.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
