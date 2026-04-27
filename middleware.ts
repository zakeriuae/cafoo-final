import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Skip Next.js internal paths, public files, and unlocalized routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') || // supabase auth callback etc
    pathname.includes('.') // like /favicon.ico, /Logo.svg, etc.
  ) {
    // Inject x-pathname before returning
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Inject x-pathname header for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Redirect to default locale if missing
  const nextUrl = request.nextUrl.clone()
  nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(nextUrl)
}

export const config = {
  matcher: [
    // Match all paths except those starting with /_next
    '/((?!_next).*)',
  ],
}
