"use client"

import Image from "next/image"
import Link from "next/link"
import { 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react"

const quickLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#properties", label: "Properties" },
  { href: "#areas", label: "Areas" },
  { href: "#developers", label: "Developers" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact" },
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
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.jpg"
                alt="Cafoo Real Estate"
                width={140}
                height={50}
                className="h-12 w-auto bg-white p-2 rounded"
              />
            </Link>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Cafoo Real Estate Advisors - Your trusted partner for luxury 
              property investment in Dubai. Smart Choice, Pleasant Purchase.
            </p>
            <div className="space-y-3">
              <a href="tel:+971503491050" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Phone className="h-5 w-5" />
                +971 50 349 1050
              </a>
              <a href="mailto:info@cafoo.ae" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Mail className="h-5 w-5" />
                info@cafoo.ae
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>3202, Boulevard Plaza Tower 1, Downtown, Dubai</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Property Types</h3>
            <ul className="space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Popular Areas</h3>
            <ul className="space-y-3">
              {popularAreas.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Cafoo Real Estate. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
