"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Phone, Mail, Globe, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#properties", label: "Properties" },
  { href: "#areas", label: "Areas" },
  { href: "#developers", label: "Developers" },
  { href: "#agents", label: "Our Team" },
  { href: "#about", label: "About" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Detect active section
      const sections = navLinks.map(link => link.href.substring(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className={cn(
        "bg-gradient-to-r from-primary via-primary to-accent text-white py-2.5 transition-all duration-300",
        isScrolled && "py-1.5"
      )}>
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a 
              href="tel:+971525041810" 
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline font-medium">+971 52 504 1810</span>
            </a>
            <a 
              href="mailto:info@cafoo.ae" 
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline font-medium">info@cafoo.ae</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/971525041810" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <div className="h-4 w-px bg-white/30" />
            <button className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <Globe className="h-4 w-4" />
              <span>EN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-card/98 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/50" 
          : "bg-card/95 backdrop-blur-md border-b border-border"
      )}>
        <div className="container mx-auto px-4">
          <nav className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-16" : "h-20"
          )}>
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="Cafoo Real Estate"
                  width={140}
                  height={50}
                  className={cn(
                    "w-auto transition-all duration-300",
                    isScrolled ? "h-10" : "h-12"
                  )}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                    activeSection === link.href.substring(1)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                  {activeSection === link.href.substring(1) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-foreground/70 hover:text-foreground hover:bg-muted/50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg shadow-primary/25 px-6">
                Book Consultation
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 text-foreground rounded-xl hover:bg-muted/50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={cn(
                  "absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300",
                  isOpen ? "top-3 rotate-45" : "top-1"
                )} />
                <span className={cn(
                  "absolute left-0 top-3 block w-6 h-0.5 bg-current transition-all duration-300",
                  isOpen ? "opacity-0" : "opacity-100"
                )} />
                <span className={cn(
                  "absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300",
                  isOpen ? "top-3 -rotate-45" : "top-5"
                )} />
              </div>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 bg-card/98 backdrop-blur-xl border-b border-border shadow-xl transition-all duration-500 overflow-hidden",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                  activeSection === link.href.substring(1)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                onClick={() => setIsOpen(false)}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
