import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenValid } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokenParam = request.nextUrl.searchParams.get('auth');

  // 1. Handshake via query parameter (crucial for iframe cross-origin redirections)
  if (authTokenParam) {
    if (isTokenValid(authTokenParam)) {
      const cleanUrl = new URL(pathname, request.url);
      request.nextUrl.searchParams.forEach((val, key) => {
        if (key !== 'auth') cleanUrl.searchParams.set(key, val);
      });

      const targetUrl = pathname === '/painel/login' ? new URL('/painel/propostas', request.url) : cleanUrl;
      const res = NextResponse.redirect(targetUrl);

      // Set resilient 30-day session cookies (both iframe-compatible and standard Lax)
      res.cookies.set({
        name: 'modkovski_admin_session',
        value: authTokenParam,
        path: '/',
        httpOnly: false,
        sameSite: 'none',
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      res.cookies.set({
        name: 'modkovski_admin_session_lax',
        value: authTokenParam,
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return res;
    } else {
      // Invalid/Expired token in auth param
      const cleanUrl = new URL('/painel/login', request.url);
      cleanUrl.searchParams.set('expired', 'true');
      return NextResponse.redirect(cleanUrl);
    }
  }

  // 2. Discover token from cookies or headers
  const activeToken =
    request.cookies.get('modkovski_admin_session')?.value ||
    request.cookies.get('modkovski_admin_session_lax')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.headers.get('x-admin-token');

  const authenticated = isTokenValid(activeToken);

  // 3. Handle /painel/* routes
  if (pathname.startsWith('/painel')) {
    // Login page handling
    if (pathname === '/painel/login') {
      if (authenticated) {
        // Already authenticated: proceed directly to dashboard
        return NextResponse.redirect(new URL('/painel/propostas', request.url));
      }
      return NextResponse.next();
    }

    // Protected panel routes
    if (!authenticated) {
      const loginUrl = new URL('/painel/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      const response = NextResponse.redirect(loginUrl);
      // Clean up stale cookies if any were invalid
      if (activeToken) {
        response.cookies.delete('modkovski_admin_session');
        response.cookies.delete('modkovski_admin_session_lax');
      }
      return response;
    }

    // User is authenticated: allow request AND refresh sliding-window session cookies
    const response = NextResponse.next();
    if (activeToken) {
      response.cookies.set({
        name: 'modkovski_admin_session',
        value: activeToken,
        path: '/',
        httpOnly: false,
        sameSite: 'none',
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // Extend 30 days on activity
      });
      response.cookies.set({
        name: 'modkovski_admin_session_lax',
        value: activeToken,
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // Extend 30 days on activity
      });
    }
    return response;
  }

  // 4. Handle legacy /admin routes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (authenticated) {
      return NextResponse.redirect(new URL('/painel/propostas', request.url));
    }
    const loginUrl = new URL('/painel/login', request.url);
    loginUrl.searchParams.set('redirect', '/painel/propostas');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/painel/:path*', '/admin/:path*'],
};
