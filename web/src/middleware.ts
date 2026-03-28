import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access protected routes without token
  const isProtectedRoute = pathname.startsWith('/tour') || pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname === '/';
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  const isValidToken = token && token !== 'undefined' && token !== 'null' && token !== '';

  if (!isValidToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in and trying to access login/register
  if (isValidToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/tour', request.url));
  }

  // 3. Redirect / to /tour if logged in
  if (isValidToken && pathname === '/') {
    return NextResponse.redirect(new URL('/tour', request.url));
  }

  // 3. RBAC: Regular users trying to access dashboard (admin role required)
  if (token && pathname.startsWith('/dashboard') && role !== 'ADMIN' && role !== 'OWNER') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. Onboarding check: If logged in but not onboarded, redirect to /onboarding
  // Note: We need to be careful not to redirect if already on /onboarding
  // Also, we can't easily check isOnboarded field from store in middleware
  // So we might need to store it in a cookie too, or just let the page handle it.
  // For now, I'll assume the onboarding page is accessible if the user is logged in.

  return NextResponse.next();
}

// Config to match all routes except next internals and static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
