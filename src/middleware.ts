import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/jwt';

// Define public routes that unauthenticated users can access
const publicRoutes = ['/login', '/signup', '/'];

// Define prefix for protected dashboard routes
const protectedPrefix = '/dashboard';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = path.startsWith(protectedPrefix);

  // Read the session cookie natively using jose
  const sessionCookie = request.cookies.get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  // 1. If trying to access a protected route without a valid session, evict to login
  if (isProtectedRoute && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';

    // Only append expired if there was a cookie that was explicitly invalidated or tampered with
    if (sessionCookie) {
      url.searchParams.set('error', 'expired');
    }

    return NextResponse.redirect(url);
  }

  // 2. If already logged in, redirect away from public auth routes natively into the app
  if (isPublicRoute && session) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 3. Otherwise, proceed routing normally
  return NextResponse.next();
}

// Ensure the middleware doesn't forcefully trigger on static public files, api routes, or Next.js internals
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)'],
};
