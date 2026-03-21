import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access protected routes without token
  const isProtectedRoute = pathname.startsWith('/tour') || pathname.startsWith('/dashboard') || pathname === '/';
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (!token && isProtectedRoute && pathname !== '/login' && pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in and trying to access login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. RBAC: Regular users trying to access dashboard (admin role required)
  if (token && pathname.startsWith('/dashboard') && role !== 'ADMIN' && role !== 'OWNER') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Config to match all routes except next internals and static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
