import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/admin', '/api/admin'];
  const authRoutes = ['/login', '/verify'];
  
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get token from cookie or Authorization header
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If accessing auth routes with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    const user = verifyTokenEdge(token);
    if (user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }
  
  // For API routes, check token and add user to headers
  if (pathname.startsWith('/api/') && token) {
    const user = verifyTokenEdge(token);
    if (user) {
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-email', user.email);
      response.headers.set('x-user-role', user.role);
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/login',
    '/verify',
    '/api/auth/:path*'
  ]
};
