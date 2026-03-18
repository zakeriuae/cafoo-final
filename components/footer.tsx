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
  Globe
} from "lucide-react"
import { useState, useEffect } from "react"

const quickLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#properties", label: "Properties" },
  { href: "#areas", label: "Areas" },
  { href: "#developers", label: "Developers" },
  { href: "#agents", label: "Our Agents" },
  { href: "#about", label: "About Us" },
]

const propertyTypes = [
  { href: "#", label: "Apartments" },
  { href: "#", label: "Villas" },
  { href: "#", label: "Townhouses" },
  { href: "#", label: "Penthouses" },
  { href: "#", label: "Offices" },
  { href: "#", label: "Off-Plan" },
]

const popularAreas = [
  { href: "#", label: "Downtown Dubai" },
  { href: "#", label: "Dubai Marina" },
  { href: "#", label: "Palm Jumeirah" },
  { href: "#", label: "Business Bay" },
  { href: "#", label: "JBR" },
  { href: "#", label: "Emirates Hills" },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
]

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

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
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Stay Updated with Dubai Real Estate
              </h3>
              <p className="text-white/70 max-w-lg">
                Subscribe to receive the latest property listings, market insights, and exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full sm:w-80 h-14 pl-12 pr-4 rounded-xl bg-white/95 border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-secondary"
                />
              </div>
              <Button className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-semibold shadow-lg shadow-secondary/30">
                <Send className="mr-2 h-5 w-5" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <div className="bg-white p-3 rounded-xl inline-block">
                  <Image
                    src="/logo.jpg"
                    alt="Cafoo Real Estate"
                    width={140}
                    height={50}
                    className="h-10 w-auto"
                  />
                </div>
              </Link>
              <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
                Cafoo Real Estate Advisors - Your trusted partner for luxury 
                property investment in Dubai. Smart Choice, Pleasant Purchase.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <a href="tel:+971503491050" className="flex items-center gap-3 text-slate-300 hover:text-secondary transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>+971 50 349 1050</span>
                </a>
                <a href="mailto:info@cafoo.ae" className="flex items-center gap-3 text-slate-300 hover:text-secondary transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span>info@cafoo.ae</span>
                </a>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="leading-relaxed">3202, Boulevard Plaza Tower 1,<br />Downtown, Dubai, UAE</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-secondary hover:pl-2 transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Property Types */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Property Types
              </h3>
              <ul className="space-y-3">
                {propertyTypes.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-secondary hover:pl-2 transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Areas */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-secondary rounded-full" />
                Popular Areas
              </h3>
              <ul className="space-y-3">
                {popularAreas.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-secondary hover:pl-2 transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Cafoo Real Estate. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link href="#" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Globe className="h-4 w-4" />
                English
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/971503491050"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-300 animate-pulse hover:animate-none"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-24 z-50 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </button>
    </footer>
  )
}
