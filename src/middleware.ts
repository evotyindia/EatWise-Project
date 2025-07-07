
import type { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse | void {
  // This is a basic middleware structure.
  // It no longer needs next-intl logic.
  return;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next/static|_next/image|img|images|favicon.ico|sitemap.xml|robots.txt).*)']
};
