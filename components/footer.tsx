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
    <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          <div className="lg:col-span-5">
            <Link href={`/${locale}`} className="inline-block mb-8">
              <Image
                src="/Logo.svg"
                alt="Cafoo Real Estate"
                width={160}
                height={60}
                className="h-14 w-auto invert brightness-0"
              />
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-8">
              {content.footer.description}
            </p>
            {/* Social Links - Simplified */}
            <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-12">
            <div className={cn(
              "bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10",
              isRtl && "text-right"
            )}>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                {content.footer.newsletter.title}
              </h3>
              <p className="text-slate-400 mb-8">
                {content.footer.newsletter.description}
              </p>
              <div className={cn(
                "flex flex-col sm:flex-row gap-4",
                isRtl && "sm:flex-row-reverse"
              )}>
                <Input 
                  type="email" 
                  placeholder={content.footer.newsletter.placeholder}
                  className={cn(
                    "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary",
                    isRtl && "text-right"
                  )}
                />
                <Button className="h-14 px-8 btn-primary rounded-xl font-bold whitespace-nowrap">
                  {content.footer.newsletter.button}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16">
          {/* Quick Links */}
          <div className={cn(isRtl && "text-right")}>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              {content.footer.quickLinks}
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className={cn(isRtl && "text-right")}>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              {content.footer.propertyTypes}
            </h4>
            <ul className="space-y-4">
              {propertyTypes.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={cn("md:col-span-2", isRtl && "text-right")}>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              {content.footer.contactInfo}
            </h4>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <a href="tel:+971503491050" className={cn("flex items-center gap-4 group", isRtl && "flex-row-reverse")}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-slate-300 font-bold" dir="ltr">+971 50 349 1050</span>
                </a>
                <a href="mailto:info@cafoo.ae" className={cn("flex items-center gap-4 group", isRtl && "flex-row-reverse")}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-slate-300">info@cafoo.ae</span>
                </a>
              </div>
              <div className={cn("flex items-start gap-4", isRtl && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  3202, Boulevard Plaza Tower 1,<br />Downtown, Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5">
          <div className={cn(
            "flex flex-col md:flex-row items-center justify-between gap-6",
            isRtl && "md:flex-row-reverse"
          )}>
            <p className="text-slate-500 text-xs">
              {content.footer.copyright}
            </p>
            <div className={cn("flex items-center gap-8 text-xs text-slate-500", isRtl && "flex-row-reverse")}>
              <Link href="#" className="hover:text-white transition-colors">
                {content.footer.links.privacy}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {content.footer.links.terms}
              </Link>
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className={cn(
        "fixed bottom-8 z-50 flex flex-col gap-4",
        isRtl ? "left-8" : "right-8"
      )}>
        <button
          onClick={scrollToTop}
          className={cn(
            "w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:bg-primary",
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        <a
          href="https://wa.me/971503491050"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform duration-300 group"
        >
          <MessageCircle className="h-7 w-7 text-white group-hover:animate-bounce" />
        </a>
      </div>
    </footer>
  )
}
