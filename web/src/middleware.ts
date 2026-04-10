import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access protected routes without token
  const isProtectedRoute = 
    pathname.startsWith('/tour') || 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/owner') ||
    pathname.startsWith('/settings') || 
    pathname.startsWith('/profile') ||
    pathname === '/';
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  const isValidToken = token && token !== 'undefined' && token !== 'null' && token !== '';

  if (!isValidToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in and trying to access login/register
  if (isValidToken && isAuthRoute) {
    // Default redirect based on role
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'OWNER') {
      return NextResponse.redirect(new URL('/owner', request.url));
    } else {
      return NextResponse.redirect(new URL('/tour', request.url));
    }
  }

  // 3. Redirect / to appropriate section based on role if logged in
  if (isValidToken && pathname === '/') {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'OWNER') {
      return NextResponse.redirect(new URL('/owner', request.url));
    } else {
      return NextResponse.redirect(new URL('/tour', request.url));
    }
  }

  // 4. RBAC: Restrict access based on role
  const roleNormalized = role ? (role).toLowerCase() : '';

  if (token) {
    // Prevent owners from accessing admin area (explicit)
    if (role === 'OWNER' && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL(`/${roleNormalized}`, request.url));
    }

    // Prevent admins from accessing owner area (explicit)
    if (role === 'ADMIN' && pathname.startsWith('/owner')) {
      return NextResponse.redirect(new URL(`/${roleNormalized}`, request.url));
    }
    // If a non-OWNER tries to access owner pages -> redirect to /tour
    if (pathname.startsWith('/owner') && role !== 'OWNER') {
      return NextResponse.redirect(new URL('/tour', request.url));
    }

    // If a non-ADMIN tries to access admin pages -> redirect to /tour
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/tour', request.url));
    }

  }


  return NextResponse.next();
}

// Config to match all routes except next internals and static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
