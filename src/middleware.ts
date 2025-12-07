import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/submit',
  '/obrigado',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
]

// Routes that start with these prefixes are public
const PUBLIC_PREFIXES = [
  '/report/',  // Public report viewing via access code
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isPublicPrefix = PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))

  if (isPublicRoute || isPublicPrefix) {
    return NextResponse.next()
  }

  // Check for auth token in cookies (set during login)
  const token = request.cookies.get('sb-access-token')?.value

  if (!token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\..*).*)' ,
  ],
}
