"use server"
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
// Define public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If it's a public route, allow
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the token (you can use cookies, headers, etc.)
  const token =  (await cookies()).get('email')?.value;

  // If token doesn't exist, redirect to login
  if (!token || token == undefined) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('from', pathname); // Optional: for redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};