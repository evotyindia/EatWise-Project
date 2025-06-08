import type { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse | void {
  // This is a basic middleware structure.
  // If you had other middleware logic, it would go here.
  // For now, it does nothing specific to i18n.
  return;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)']
};
