import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side gate: require an auth session cookie for /dashboard and /admin.
 * Comma-separated names in AUTH_SESSION_COOKIE_NAMES (default: access_token).
 * Set AUTH_ENABLE_ROUTE_GUARD=0 to disable (e.g. Bearer-only backends in dev).
 * Admin role is still enforced client-side via RequireAdmin + API.
 */
/** Prod: on unless AUTH_ENABLE_ROUTE_GUARD=0. Dev: off unless AUTH_ENABLE_ROUTE_GUARD=1. */
const GUARD_ENABLED =
  process.env.NODE_ENV === 'production'
    ? process.env.AUTH_ENABLE_ROUTE_GUARD !== '0'
    : process.env.AUTH_ENABLE_ROUTE_GUARD === '1';
const SESSION_COOKIE_NAMES = (
  process.env.AUTH_SESSION_COOKIE_NAMES ?? 'access_token'
)
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => Boolean(request.cookies.get(name)?.value));
}

export function middleware(request: NextRequest) {
  if (!GUARD_ENABLED) {
    return NextResponse.next();
  }
  const { pathname } = request.nextUrl;
  const hasSession = hasSessionCookie(request);

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
