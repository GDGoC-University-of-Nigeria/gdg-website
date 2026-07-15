import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side route guard for /dashboard and /admin.
 *
 * IMPORTANT:
 * For cross-origin OAuth setups (API on different domain), frontend middleware
 * cannot reliably read API cookies. Keep this OFF unless you explicitly use
 * same-domain auth cookies available to the Next app domain.
 */
const GUARD_ENABLED = process.env.AUTH_ENABLE_ROUTE_GUARD === '1';
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
