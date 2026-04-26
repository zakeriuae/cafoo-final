"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n, useContent } from "@/lib/i18n"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User as UserIcon, LayoutDashboard, Settings } from "lucide-react"
import { User } from "@supabase/supabase-js"

interface NavigationProps {
  variant?: "transparent" | "light"
}

export function Navigation({ variant: manualVariant }: NavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { locale, isRtl } = useI18n()
  const content = useContent()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    }
    getData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  // Automatically determine variant if not manually provided
  // Home page is transparent, everything else is light
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/"
  const variant = manualVariant || (isHomePage ? "transparent" : "light")
  const isLight = variant === "light"

  const navLinks = [
    { href: `/${locale}#projects`, label: content.nav.projects },
    { href: `/${locale}#properties`, label: content.nav.properties },
    { href: `/${locale}#areas`, label: content.nav.areas },
    { href: `/${locale}#developers`, label: content.nav.developers },
    { href: `/${locale}#agents`, label: content.nav.agents },
    { href: `/${locale}#about`, label: content.nav.about },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sections = navLinks.map(link => link.href.split('#')[1])
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
  }, [navLinks])

  return (
    <>

      {/* Main Navigation */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 py-0" 
          : isLight 
            ? "bg-white border-b border-slate-100 py-2"
            : "bg-transparent py-2"
      )}>
        <div className="container mx-auto">
          <nav className={cn(
            "flex items-center justify-between h-16"
          )}>
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center group">
              <div className="relative overflow-hidden">
                <Image
                  src="/Logo.svg"
                  alt="Cafoo Real Estate"
                  width={140}
                  height={50}
                  className={cn(
                    "h-12 w-auto transition-all",
                    (isScrolled || isLight) ? "brightness-0" : "invert brightness-0"
                  )}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className={cn("hidden lg:flex items-center gap-1", isRtl && "flex-row-reverse")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                    activeSection === link.href.split('#')[1]
                      ? "text-primary font-bold"
                      : (isScrolled || isLight) 
                        ? "text-slate-600 hover:text-primary hover:bg-slate-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                  {activeSection === link.href.split('#')[1] && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={cn("hidden lg:flex items-center gap-3", isRtl && "flex-row-reverse")}>
              <LocaleSwitcher isLight={isScrolled || isLight} />
              <div className={cn(
                "w-px h-6 mx-2",
                (isScrolled || isLight) ? "bg-slate-200" : "bg-white/20"
              )} />
              <Button 
                variant="ghost" 
                className={cn(
                  "transition-colors",
                  (isScrolled || isLight) 
                    ? "text-slate-600 hover:text-primary hover:bg-slate-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Phone className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />
                {content.nav.callUs}
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative group focus:outline-none">
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage src={user.user_metadata.avatar_url || user.user_metadata.picture} alt={user.user_metadata.full_name} />
                        <AvatarFallback className="bg-primary text-white font-bold">
                          {user.user_metadata.full_name?.substring(0, 2).toUpperCase() || "CU"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-56 mt-2 rounded-2xl shadow-2xl border-slate-100 p-2">
                    <DropdownMenuLabel className="font-bold text-slate-900 px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-sm">{user.user_metadata.full_name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 cursor-pointer gap-2 py-2.5">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Profile</span>
                    </DropdownMenuItem>
                    {profile?.role === 'admin' && (
                      <Link href="/admin">
                        <DropdownMenuItem className="rounded-xl focus:bg-primary/5 text-primary cursor-pointer gap-2 py-2.5">
                          <LayoutDashboard className="h-4 w-4" />
                          <span className="text-xs font-bold">Admin Panel</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuItem className="rounded-xl focus:bg-slate-50 cursor-pointer gap-2 py-2.5">
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="rounded-xl focus:bg-red-50 text-red-600 cursor-pointer gap-2 py-2.5 focus:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={`/${locale}/auth/login`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 border-0 px-8 rounded-xl font-bold">
                    {content.nav.login || "Login"}
                  </Button>
                </Link>
              )}
            </div>

            <button
              className={cn(
                "lg:hidden p-2.5 rounded-xl transition-colors",
                (isScrolled || isLight) 
                  ? "text-slate-900 hover:bg-slate-100" 
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={cn(
                  "absolute block w-6 h-0.5 bg-current transition-all duration-200",
                  isRtl ? "right-0" : "left-0",
                  isOpen ? "top-3 rotate-45" : "top-1"
                )} />
                <span className={cn(
                  "absolute top-3 block w-6 h-0.5 bg-current transition-all duration-200",
                  isRtl ? "right-0" : "left-0",
                  isOpen ? "opacity-0" : "opacity-100"
                )} />
                <span className={cn(
                  "absolute block w-6 h-0.5 bg-current transition-all duration-200",
                  isRtl ? "right-0" : "left-0",
                  isOpen ? "top-3 -rotate-45" : "top-5"
                )} />
              </div>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="container mx-auto py-6 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                  activeSection === link.href.substring(1)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground",
                  isRtl && "flex-row-reverse"
                )}
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/30 rounded-xl">
                <span className="text-sm font-medium text-foreground/70">{content.nav.language || "Language"}</span>
                <LocaleSwitcher isLight={true} />
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => setIsOpen(false)}
              >
                <Phone className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />
                {content.nav.callUs}
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                onClick={() => setIsOpen(false)}
              >
                {content.nav.contact}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
