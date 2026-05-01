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
  { icon: Facebook, href: "https://www.facebook.com/share/18MzCmsyU8/?mibextid=wwXIfr", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Instagram, href: "https://www.instagram.com/isa_ghavasi?igsh=enluaDU5dzB3bWg4&utm_source=qr", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/isa-ghavasi-a67530272?utm_source=share_via&utm_content=profile&utm_medium=member_ios", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: Youtube, href: "https://youtube.com/@isaghavasi?si=Tl-eqxqPG11bA1Fz", label: "YouTube", color: "hover:bg-red-600" },
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
    <footer className="bg-slate-900 text-white pt-10 pb-0 overflow-hidden">
      <div className="container mx-auto">
        {/* Main Links Grid - Custom Column Spans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-6">
          {/* Brand & Social - Wider Column (span 4) */}
          <div className={cn("lg:col-span-4", isRtl && "text-right")}>
            <Link href={`/${locale}`} className="inline-block mb-4">
              <Image
                src="/Logo.svg"
                alt="Cafoo Real Estate"
                width={180}
                height={70}
                className="h-14 w-auto invert brightness-0"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-sm">
              {content.footer.description}
            </p>
            <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Narrower Column (span 2) */}
          <div className={cn("lg:col-span-2 lg:ml-auto", isRtl && "text-right lg:ml-0 lg:mr-auto")}>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">
              {content.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types - Narrower Column (span 2) */}
          <div className={cn("lg:col-span-2", isRtl && "text-right")}>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">
              {content.footer.propertyTypes}
            </h4>
            <ul className="space-y-2">
              {propertyTypes.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Standard Column (span 4) */}
          <div className={cn("lg:col-span-4 lg:pl-10", isRtl && "text-right lg:pl-0 lg:pr-10")}>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">
              {content.footer.contactInfo}
            </h4>
            <div className="space-y-3">
              <a href="tel:+971503491050" className={cn("flex items-center gap-4 group", isRtl && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-slate-300 font-bold" dir="ltr">+971 50 349 1050</span>
              </a>
              <a href="mailto:info@cafoo.ae" className={cn("flex items-center gap-4 group", isRtl && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-slate-300">info@cafoo.ae</span>
              </a>
              <div className={cn("flex items-start gap-4", isRtl && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  3202, Boulevard Plaza Tower 1,<br />Downtown, Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Literal end of footer with dark navy background */}
      <div className="bg-slate-950 py-4">
        <div className="container mx-auto">
          <div className={cn(
            "flex flex-col lg:flex-row items-center justify-between gap-8",
            isRtl && "lg:flex-row-reverse"
          )}>
            <p className="text-slate-500 text-xs">
              {content.footer.copyright}
            </p>
            <div className={cn("flex items-center gap-6 text-xs text-slate-500", isRtl && "flex-row-reverse")}>
              <Link href={`/${locale}/privacy-policy`} className="hover:text-white transition-colors">
                {content.footer.links.privacy}
              </Link>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <Link href={`/${locale}/terms-of-service`} className="hover:text-white transition-colors">
                {content.footer.links.terms}
              </Link>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <LocaleSwitcher isLight={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <a
        href="https://wa.me/971503491050"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-8 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-300 animate-pulse hover:animate-none",
          isRtl ? "left-12" : "right-12"
        )}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 z-50 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          isRtl ? "left-32" : "right-32"
        )}
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </button>
    </footer>
  )
}
