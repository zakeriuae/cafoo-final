"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  User,
  Share2,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface DashboardSidebarProps {
  user: SupabaseUser
  profile: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
    role: string
  } | null
}



export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale } = useI18n()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigation = [
    { name: "Overview", href: `/${locale}/dashboard`, icon: Home },
    { name: "Saved Properties", href: `/${locale}/dashboard/saved`, icon: Heart },
    { name: "My Inquiries", href: `/${locale}/dashboard/inquiries`, icon: MessageSquare },
    { name: "Referrals", href: `/${locale}/dashboard/referrals`, icon: Share2 },
    { name: "Profile", href: `/${locale}/dashboard/profile`, icon: User },
    { name: "Settings", href: `/${locale}/dashboard/settings`, icon: Settings },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || (user?.email ? user.email[0].toUpperCase() : "U")

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-background border-r transition-transform lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-lg">Cafoo</span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm truncate">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== `/${locale}/dashboard` && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Back to home */}
          <div className="p-4 border-t">
            <Button variant="outline" asChild className="w-full">
              <Link href={`/${locale}`}>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
