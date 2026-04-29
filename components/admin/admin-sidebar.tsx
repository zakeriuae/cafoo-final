'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Home,
  MapPin,
  Users,
  Landmark,
  MessageSquare,
  Settings,
  Star,
  HelpCircle,
  FileText,
  TrendingUp,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Home },
  { name: 'Towers', href: '/admin/towers', icon: Building2 },
  { name: 'Areas', href: '/admin/areas', icon: MapPin },
  { name: 'Developers', href: '/admin/developers', icon: Landmark },
  { name: 'Agents', href: '/admin/agents', icon: Users },
  { name: 'Actions', href: '/admin/actions', icon: TrendingUp },
  { name: 'Leads (CRM)', href: '/admin/leads', icon: MessageSquare },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Amenities', href: '/admin/amenities', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

const adminOnlyNav = ['Developers', 'Agents', 'Users', 'Testimonials', 'FAQs', 'Amenities', 'Settings']

interface AdminSidebarProps {
  role?: 'admin' | 'agent' | string
}

export function AdminSidebar({ role = 'admin' }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-full bg-background border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <span className="font-semibold text-lg">{role === 'agent' ? 'Agent Panel' : 'Admin Panel'}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.filter(item => role === 'admin' || !adminOnlyNav.includes(item.name)).map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/en"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>View Website</span>
          <span className="text-xs">→</span>
        </Link>
      </div>
    </aside>
  )
}
