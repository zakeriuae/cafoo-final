"use client"

import Image from "next/image"
import { Award } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const developers = [
  {
    name: "EMAAR",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emaar-kMJ6wvhYpIVfOmVwiKZze39Vo8kpQm.png",
  },
  {
    name: "DAMAC",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/damac-lMXfBEJo7d9d1gfvy5ujgYORKBb41M.png",
  },
  {
    name: "SOBHA Realty",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sobhan-Zlw2e7CtkwQ0w4kHQLAugzYlySR8Ma.png",
  },
  {
    name: "Nakheel",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nakheel-D08jZy7zeDxU7R9cFYP9l3zAUKmV9e.png",
  },
  {
    name: "MERAAS",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meraas-e7rGZiR6vsMh4sGzyUoHCuFBb9Iqb4.png",
  },
  {
    name: "Dubai Properties",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dubai-YFXl9B9poFFqLW7F4I8UEGnCv4xzY2.png",
  },
  {
    name: "Binghatti",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/binghati-gq7dkP5dSvSQLxK6p86ApMO79YT1XZ.png",
  },
  {
    name: "Aldar",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aldar-hj3Fs5q4l0LtT7dXgPGhE4iSs9DuSw.png",
  },
  {
    name: "RAK Properties",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rak-k7bffxCBgBPj7VwJiX1o79nMhZLuPK.png",
  },
  {
    name: "Tiger Group",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tiger-fiSDGfJivack9AGdp3DueGoSLdaTUU.png",
  },
  {
    name: "Alef",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alef-h4qZeK6LMkfgnvdqqpmXKrTBAlQvVo.png",
  },
  {
    name: "Arada",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arada-eG44g8RQwCKwM76H7GcO71Sh8hfAnW.png",
  },
  {
    name: "Imtiaz Developments",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imtiaz-3z3P4DVNOWN1BqtlNikXxChIBIvJ3C.png",
  },
  {
    name: "Nshama",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nshama-o72DY8hc79nO9Xi8mzW37FpP38HlTW.png",
  },
  {
    name: "Wasl",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wasl-lbtkTxgqrFTpnWxUCYDb8v6ypdtCDS.png",
  },
  {
    name: "Beyond",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beyond-qWVgsJIjMEUGAPsac3ixrpkq6agwcw.png",
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
    <section ref={sectionRef} id="developers" className="py-16 bg-muted/30 relative overflow-hidden">
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
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-muted/80 via-muted/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-muted/80 via-muted/50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div 
              className="flex animate-marquee hover:[animation-play-state:paused]"
              style={{ width: "fit-content" }}
            >
              {duplicatedDevelopers.map((developer, index) => (
                <div
                  key={`${developer.name}-${index}`}
                  className="flex-shrink-0 mx-4 md:mx-6 group"
                >
                  <div className="relative w-28 h-16 md:w-36 md:h-20 bg-white rounded-xl flex items-center justify-center p-3 md:p-4 border border-border/30 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:scale-110 cursor-pointer">
                    <Image
                      src={developer.logo}
                      alt={developer.name}
                      fill
                      className="object-contain p-2 md:p-3 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
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
