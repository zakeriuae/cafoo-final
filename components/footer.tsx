"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  ArrowUp,
  MessageCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useI18n, useContent } from "@/lib/i18n"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { cn } from "@/lib/utils"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
]

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { isRtl, locale } = useI18n()
  const content = useContent()

  const quickLinks = [
    { href: "#projects", label: content.nav.projects },
    { href: "#properties", label: content.nav.properties },
    { href: "#areas", label: content.nav.areas },
    { href: "#developers", label: content.nav.developers },
    { href: "#agents", label: content.nav.agents },
    { href: "#about", label: content.nav.about },
  ]

  const propertyTypes = [
    { href: "#", label: content.footer.propertyTypesList.apartments },
    { href: "#", label: content.footer.propertyTypesList.villas },
    { href: "#", label: content.footer.propertyTypesList.townhouses },
    { href: "#", label: content.footer.propertyTypesList.penthouses },
    { href: "#", label: content.footer.propertyTypesList.offPlan },
    { href: "#", label: content.footer.propertyTypesList.commercial },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative overflow-hidden">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 py-16 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            "absolute top-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2",
            isRtl ? "left-0 -translate-x-1/2" : "right-0"
          )} />
          <div className={cn(
            "absolute bottom-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2",
            isRtl ? "right-0 translate-x-1/2" : "left-0"
          )} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={cn(
            "flex flex-col lg:flex-row items-center justify-between gap-8",
            isRtl && "lg:flex-row-reverse"
          )}>
            <div className={cn("text-center", isRtl ? "lg:text-right" : "lg:text-left")}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {content.footer.newsletter.title}
              </h3>
              <p className="text-white/70 max-w-lg">
                {content.footer.newsletter.description}
              </p>
            </div>
            <div className={cn(
              "flex flex-col sm:flex-row gap-3 w-full lg:w-auto",
              isRtl && "sm:flex-row-reverse"
            )}>
              <div className="relative">
                <Mail className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground",
                  isRtl ? "right-4" : "left-4"
                )} />
                <Input 
                  type="email" 
                  placeholder={content.footer.newsletter.placeholder}
                  className={cn(
                    "w-full sm:w-80 h-14 pr-4 rounded-xl bg-white/95 border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-secondary",
                    isRtl ? "pr-12 pl-4" : "pl-12"
                  )}
                />
              </div>
              <Button className={cn(
                "h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-semibold shadow-lg shadow-secondary/30",
                isRtl && "flex-row-reverse"
              )}>
                <Send className={cn("h-5 w-5", isRtl ? "ml-2" : "mr-2")} />
                {content.footer.newsletter.button}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10",
            isRtl && "lg:grid-flow-dense"
          )}>
            {/* Company Info */}
            <div className={cn("lg:col-span-1", isRtl && "text-right lg:col-start-4")}>
              <Link href={`/${locale}`} className="inline-block mb-6">
                <div className="inline-block">
                  <Image
                    src="/Logo.svg"
                    alt="Cafoo Real Estate"
                    width={140}
                    height={50}
                    className="h-10 w-auto invert brightness-0"
                  />
                </div>
              </Link>
              <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
                {content.footer.description}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <a href="tel:+971503491050" className={cn(
                  "flex items-center gap-3 text-slate-300 hover:text-secondary transition-colors group",
                  isRtl && "flex-row-reverse"
                )}>
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span dir="ltr">+971 50 349 1050</span>
                </a>
                <a href="mailto:info@cafoo.ae" className={cn(
                  "flex items-center gap-3 text-slate-300 hover:text-secondary transition-colors group",
                  isRtl && "flex-row-reverse"
                )}>
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span>info@cafoo.ae</span>
                </a>
                <div className={cn(
                  "flex items-start gap-3 text-slate-300",
                  isRtl && "flex-row-reverse"
                )}>
                  <div className="p-2 rounded-lg bg-white/5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="leading-relaxed">
                    3202, Boulevard Plaza Tower 1,<br />Downtown, Dubai, UAE
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className={cn(
                "flex items-center gap-3 mt-8",
                isRtl && "flex-row-reverse"
              )}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={cn(
                      "w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110",
                      social.color
                    )}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className={cn(isRtl && "text-right lg:col-start-3")}>
              <h3 className={cn(
                "text-lg font-semibold mb-6 flex items-center gap-2",
                isRtl && "flex-row-reverse"
              )}>
                <div className="w-1 h-6 bg-secondary rounded-full" />
                {content.footer.quickLinks}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className={cn(
                        "text-slate-400 hover:text-secondary transition-all duration-300 inline-block",
                        isRtl ? "hover:pr-2" : "hover:pl-2"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Property Types */}
            <div className={cn(isRtl && "text-right lg:col-start-2")}>
              <h3 className={cn(
                "text-lg font-semibold mb-6 flex items-center gap-2",
                isRtl && "flex-row-reverse"
              )}>
                <div className="w-1 h-6 bg-secondary rounded-full" />
                {content.footer.propertyTypes}
              </h3>
              <ul className="space-y-3">
                {propertyTypes.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className={cn(
                        "text-slate-400 hover:text-secondary transition-all duration-300 inline-block",
                        isRtl ? "hover:pr-2" : "hover:pl-2"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className={cn(isRtl && "text-right lg:col-start-1")}>
              <h3 className={cn(
                "text-lg font-semibold mb-6 flex items-center gap-2",
                isRtl && "flex-row-reverse"
              )}>
                <div className="w-1 h-6 bg-secondary rounded-full" />
                {content.footer.contactInfo}
              </h3>
              <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed">
                  {locale === 'fa' ? (
                    <>
                      ما در خدمت شما هستیم.<br />
                      با ما تماس بگیرید یا از واتساپ استفاده کنید.
                    </>
                  ) : (
                    <>
                      We are here to help you.<br />
                      Call us or reach out via WhatsApp.
                    </>
                  )}
                </p>
                <Button 
                  className={cn(
                    "bg-green-500 hover:bg-green-600 text-white rounded-xl",
                    isRtl && "flex-row-reverse"
                  )}
                  asChild
                >
                  <a href="https://wa.me/971503491050" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className={cn("h-5 w-5", isRtl ? "ml-2" : "mr-2")} />
                    {content.nav.whatsapp}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-6">
        <div className="container mx-auto px-4">
          <div className={cn(
            "flex flex-col md:flex-row items-center justify-between gap-4",
            isRtl && "md:flex-row-reverse"
          )}>
            <p className={cn(
              "text-slate-500 text-sm text-center",
              isRtl ? "md:text-right" : "md:text-left"
            )}>
              {content.footer.copyright}
            </p>
            
            <div className={cn(
              "flex items-center gap-6 text-sm text-slate-500",
              isRtl && "flex-row-reverse"
            )}>
              <Link href="#" className="hover:text-secondary transition-colors">
                {content.footer.links.privacy}
              </Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link href="#" className="hover:text-secondary transition-colors">
                {content.footer.links.terms}
              </Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/971503491050"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-300 animate-pulse hover:animate-none",
          isRtl ? "left-6" : "right-6"
        )}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 z-50 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          isRtl ? "left-24" : "right-24"
        )}
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </button>
    </footer>
  )
}
