import { NextResponse } from 'next/server';
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  // If the user has the token, redirect them away from auth pages
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect to the dashboard if the user is authenticated
  }

  // If the user doesn't have the token, redirect them to the sign-in page for protected routes
  if (!token && (
    url.pathname.startsWith('/categories') ||
    url.pathname.startsWith('/orders') || 
    url.pathname.startsWith('/reviews') ||
    url.pathname.startsWith('/products') ||
    url.pathname === '/' // Protect the home route if needed
  )) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Continue with the request if no condition is met
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in', 
    '/sign-up', 
    '/verify', 
    '/dashboard/:path*', 
    '/:path*' // Protect all routes by default if necessary
  ],
};
