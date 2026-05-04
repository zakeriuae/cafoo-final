import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n/config'
import { updateSession } from '@/lib/supabase/middleware'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')

  // 0. Redirect non-www to www on production
  if (host === 'cafoo.ae') {
    return NextResponse.redirect(`https://www.cafoo.ae${pathname}`, 301)
  }

  // 1. Update Supabase session (refreshes auth token)
  const supabaseResponse = await updateSession(request)

  // 2. Internationalization (i18n) logic

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If locale exists or it's a skipped path, return the supabaseResponse (with updated cookies)
  if (
    pathnameHasLocale ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return supabaseResponse
  }

  // 3. Redirect to default locale if missing
  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  
  // Create a new redirect response but copy the cookies from supabaseResponse
  const redirectResponse = NextResponse.redirect(url)
  
  // Copy all cookies from supabaseResponse to the new redirect (preserving options)
  redirectResponse.cookies.setAll(supabaseResponse.cookies.getAll())

  return redirectResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
