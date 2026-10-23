import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyAdminToken } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = await verifyAdminToken(token);

  // If user visits /gallery/manage, forward them to the consolidated /admin/gallery route
  if (pathname.startsWith('/gallery/manage')) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/gallery', request.url));
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', '/admin/gallery');
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to access /admin/login, redirect to /admin dashboard
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Password activation and recovery links must remain available without a session.
  if (pathname === '/admin/activate' || pathname === '/admin/forgot-password') {
    return NextResponse.next();
  }

  // All other /admin paths require authentication
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      const destination = pathname + search;
      if (destination !== '/admin') {
        loginUrl.searchParams.set('from', destination);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/gallery/manage/:path*'],
};
