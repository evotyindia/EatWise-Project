
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames, localePrefix } from './i18n';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: localePrefix,
  pathnames: pathnames,
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)']
};
