/**
 * Next.js Middleware for Route Protection
 * Protects admin and dashboard routes with authentication
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Get session from Supabase auth cookies
 */
function getSessionFromCookies(request: NextRequest) {
  // Supabase stores session in multiple cookies
  const accessToken =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('supabase-auth-token')?.value;

  const refreshToken = request.cookies.get('sb-refresh-token')?.value;

  return { accessToken, refreshToken };
}

/**
 * Middleware to protect routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = [
    '/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/',
    '/privacy',
    '/terms',
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseAnonKey || process.env.NODE_ENV === 'development') {
    // Supabase not configured or in dev mode - allow all routes
    console.warn('Auth middleware disabled (Dev mode or missing config)');
    return NextResponse.next();
  }

  // Get session from cookies
  const { accessToken } = getSessionFromCookies(request);

  // If no token, redirect to login
  if (!accessToken) {
    console.log('[AUTH MIDDLEWARE] No access token found, redirecting to /login');
    console.log('[AUTH MIDDLEWARE] Requested path:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    console.log('[AUTH MIDDLEWARE] Redirect URL:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Create a Supabase client for the server
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the user using the access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      // Invalid token, redirect to login
      console.log('[AUTH MIDDLEWARE] Invalid or expired token, redirecting to /login');
      console.log('[AUTH MIDDLEWARE] Requested path:', pathname);
      console.log('[AUTH MIDDLEWARE] Auth error:', error?.message || 'No user found');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      console.log('[AUTH MIDDLEWARE] Redirect URL:', loginUrl.toString());
      const response = NextResponse.redirect(loginUrl);

      // Clear invalid cookies
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      response.cookies.delete('supabase-auth-token');

      return response;
    }

    // Check admin routes
    if (pathname.startsWith('/admin')) {
      // Get user profile to check role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Allow both 'admin' and 'super_admin' roles to access admin routes
      if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
        // Not an admin, redirect to user dashboard
        console.log('[AUTH MIDDLEWARE] User is not an admin, redirecting to /painel');
        console.log('[AUTH MIDDLEWARE] User role:', profile?.role || 'no profile');
        return NextResponse.redirect(new URL('/painel', request.url));
      }
      console.log('[AUTH MIDDLEWARE] Admin access granted for:', pathname);
      console.log('[AUTH MIDDLEWARE] User role:', profile.role);
    }

    // User is authenticated and authorized
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
